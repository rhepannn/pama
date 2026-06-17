'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Toast from '@/components/Toast'

const GOLD  = '#F5A623'
const GREEN = '#2ECC71'
const RED   = '#E74C3C'

function KPICard({ label, value, color = '#D4DCE8', sub }: {
  label: string; value: string | number; color?: string; sub?: string
}) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-1" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#7B8BA3' }}>{label}</span>
      <span className="text-2xl font-black mt-1" style={{ color }}>{value}</span>
      {sub && <span className="text-xs" style={{ color: '#4A5C75' }}>{sub}</span>}
    </div>
  )
}

const typeMap: Record<string, string> = { excavator: 'Excavator', dump_truck: 'Dump Truck', dozer: 'Dozer', grader: 'Grader', drill: 'Drill' }
const statusLbl: Record<string, string> = { active: 'Active', idle: 'Idle', breakdown: 'Breakdown' }

function formatDate(date: Date) {
  const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function FleetManagement() {
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('Semua')
  const [filterArea, setFilterArea] = useState('Semua')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [showProdModal, setShowProdModal] = useState(false)
  const [prodForm, setProdForm] = useState({ unit_id: '', log_date: formatDate(new Date()), shift: 1, bcm_produced: '', cycle_time_minutes: '', idle_time_minutes: '', material_type: 'overburden' })
  const [prodError, setProdError] = useState('')

  const fetchUnits = async () => {
    try {
    const { data } = await supabase.from('mining_units').select('*').order('unit_id')
    setUnits(data || [])
    } catch (err) { console.error('Fleet fetch error:', err) }
    setLoading(false)
  }
  useEffect(() => { fetchUnits() }, [])

  const typeOptions = ['Semua', ...new Set(units.map(u => typeMap[u.unit_type]).filter(Boolean))]
  const areaOptions = ['Semua', ...new Set(units.map(u => u.area))]
  const statusOptions = ['Semua', 'active', 'idle', 'breakdown']

  const filtered = useMemo(() => {
    return units.filter(u => {
      if (filterType !== 'Semua' && typeMap[u.unit_type] !== filterType) return false
      if (filterArea !== 'Semua' && u.area !== filterArea) return false
      if (filterStatus !== 'Semua' && u.status !== filterStatus) return false
      return true
    })
  }, [units, filterType, filterArea, filterStatus])

  const aktif = units.filter(u => u.status === 'active').length
  const idle = units.filter(u => u.status === 'idle').length
  const breakdown = units.filter(u => u.status === 'breakdown').length

  const statusPill = (s: string) => {
    const c = s === 'active' ? GREEN : s === 'idle' ? GOLD : RED
    return { bg: `${c}20`, color: c, border: `${c}40`, label: statusLbl[s] || s }
  }

  const handleUpdateStatus = async (unit: any, newStatus: string) => {
    const { error } = await supabase.from('mining_units').update({ status: newStatus }).eq('id', unit.id)
    if (error) setToast({ message: 'Gagal: ' + error.message, type: 'error' })
    else { setToast({ message: `Status ${unit.unit_id} → ${statusLbl[newStatus]}`, type: 'success' }); fetchUnits() }
  }

  const handleProdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProdError('')

    if (!prodForm.unit_id) { setProdError('Pilih unit terlebih dahulu'); return }
    if (!prodForm.log_date) { setProdError('Tanggal wajib diisi'); return }
    if (!prodForm.bcm_produced || Number(prodForm.bcm_produced) <= 0) { setProdError('BCM harus lebih dari 0'); return }

    const unit = units.find(u => u.unit_id === prodForm.unit_id)
    if (!unit) { setProdError('Unit tidak ditemukan'); return }

    const { error } = await supabase.from('production_logs').insert({
      unit_id: unit.id, log_date: prodForm.log_date, shift: Number(prodForm.shift),
      bcm_produced: Number(prodForm.bcm_produced) || 0,
      cycle_time_minutes: Number(prodForm.cycle_time_minutes) || null,
      idle_time_minutes: Number(prodForm.idle_time_minutes) || 0,
      material_type: prodForm.material_type,
    })
    if (error) { setProdError('Gagal: ' + error.message); return }
    setShowProdModal(false)
    setProdForm({ unit_id: '', log_date: formatDate(new Date()), shift: 1, bcm_produced: '', cycle_time_minutes: '', idle_time_minutes: '', material_type: 'overburden' })
    setToast({ message: `Produksi ${unit.unit_id} berhasil disimpan`, type: 'success' })
  }

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-gray-700 rounded-full animate-spin" style={{ borderTopColor: GOLD }} /></div>

  return (
    <div className="p-6 space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Fleet Management</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7B8BA3' }}>Monitoring dan pengelolaan unit alat berat</p>
        </div>
        <button onClick={() => setShowProdModal(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: GOLD, color: '#060D1A' }}>
          + Input Produksi
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <KPICard label="Active" value={aktif} color={GREEN} sub={`${units.length > 0 ? Math.round((aktif / units.length) * 100) : 0}% fleet`} />
        <KPICard label="Idle" value={idle} color={GOLD} sub="Standby / antrian" />
        <KPICard label="Breakdown" value={breakdown} color={RED} sub="Dalam perbaikan" />
        <KPICard label="Total Unit" value={units.length} sub="Seluruh fleet" />
        <KPICard label="PA Rate" value={`${units.length > 0 ? Math.round(((units.length - breakdown) / units.length) * 100) : 0}%`} color={GREEN} sub="Physical Availability" />
      </div>

      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-semibold" style={{ color: '#7B8BA3' }}>Filter:</span>
        {[{ opts: typeOptions, val: filterType, set: setFilterType }, { opts: statusOptions, val: filterStatus, set: setFilterStatus }, { opts: areaOptions, val: filterArea, set: setFilterArea }].map((f, i) => (
          <div key={i} className="flex gap-1.5 items-center">
            {i > 0 && <span className="text-gray-600 mx-0.5">|</span>}
            {f.opts.map(o => (
              <button key={o} onClick={() => f.set(o)}
                className="px-2.5 py-1 rounded-lg font-medium transition-all"
                style={{ background: f.val === o ? GOLD : '#0F1F3D', color: f.val === o ? '#060D1A' : '#7B8BA3', border: `1px solid ${f.val === o ? GOLD : '#1A3470'}` }}>
                {o}
              </button>
            ))}
          </div>
        ))}
        <span className="ml-auto" style={{ color: '#4A5C75' }}>{filtered.length} unit</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #152244' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#060D1A', borderBottom: '1px solid #152244' }}>
              {['Unit ID', 'Tipe / Model', 'Area', 'Status', 'Utilisasi', 'Engine Hours', 'Last Maintenance', 'Update'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#7B8BA3' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(unit => {
              const p = statusPill(unit.status)
              const rowBg = unit.status === 'breakdown' ? 'rgba(231,76,60,0.05)' : unit.status === 'idle' ? 'rgba(245,166,35,0.04)' : 'transparent'
              return (
                <tr key={unit.id} style={{ background: rowBg, borderBottom: '1px solid #152244' }}>
                  <td className="px-4 py-3 font-mono font-bold text-white">{unit.unit_id}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-white font-medium">{typeMap[unit.unit_type] || unit.unit_type}</div>
                    {unit.make_model && <div className="text-xs mt-0.5" style={{ color: '#4A5C75' }}>{unit.make_model}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#7B8BA3' }}>{unit.area}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>{p.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: '#152244' }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(unit.utilization, 100)}%`, background: unit.utilization >= 80 ? GREEN : unit.utilization >= 50 ? GOLD : RED }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: unit.utilization >= 80 ? GREEN : unit.utilization >= 50 ? GOLD : RED }}>{unit.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: '#D4DCE8' }}>
                    {Number(unit.engine_hours).toLocaleString()} h
                    {unit.next_maintenance_hours && <div className="text-xs mt-0.5" style={{ color: '#4A5C75' }}>Next: {Number(unit.next_maintenance_hours).toLocaleString()} h</div>}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#4A5C75' }}>
                    {unit.last_maintenance_date ? new Date(unit.last_maintenance_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select value={unit.status} onChange={(e) => handleUpdateStatus(unit, e.target.value)}
                      className="text-xs px-2 py-1 rounded border" style={{ background: '#060D1A', color: '#D4DCE8', borderColor: '#1A3470' }}>
                      <option value="active">Active</option><option value="idle">Idle</option><option value="breakdown">Breakdown</option>
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showProdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{ background: '#0B1A33', border: '1px solid #1A3470' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#152244' }}>
              <h3 className="font-bold text-white">Input Data Produksi</h3>
              <button onClick={() => setShowProdModal(false)} className="text-gray-500 hover:text-white p-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <form onSubmit={handleProdSubmit} className="p-5 space-y-4">
              {prodError && <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(231,76,60,0.15)', color: RED, border: '1px solid #E74C3C40' }}>{prodError}</div>}
              <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Unit *</label>
                <select value={prodForm.unit_id} onChange={e => setProdForm(f => ({ ...f, unit_id: e.target.value }))} required className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: `1px solid ${!prodForm.unit_id && prodError ? RED : '#1A3470'}` }}>
                  <option value="">Pilih Unit</option>{units.map(u => <option key={u.id} value={u.unit_id}>{u.unit_id} ({typeMap[u.unit_type]})</option>)}
                </select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Tanggal *</label>
                  <input type="date" value={prodForm.log_date} onChange={e => setProdForm(f => ({ ...f, log_date: e.target.value }))} required className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }} /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Shift</label>
                  <select value={prodForm.shift} onChange={e => setProdForm(f => ({ ...f, shift: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}>
                    <option value={1}>Shift 1 (06-14)</option><option value={2}>Shift 2 (14-22)</option><option value={3}>Shift 3 (22-06)</option>
                  </select></div>
              </div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Material</label>
                <select value={prodForm.material_type} onChange={e => setProdForm(f => ({ ...f, material_type: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}>
                  <option value="overburden">Overburden (OB)</option><option value="coal">Batubara (Coal)</option><option value="mud">Mud</option>
                </select></div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>BCM Produksi *</label>
                <input type="number" step="0.01" min="0" value={prodForm.bcm_produced} onChange={e => setProdForm(f => ({ ...f, bcm_produced: e.target.value }))} required className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: `1px solid ${!prodForm.bcm_produced && prodError ? RED : '#1A3470'}` }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Cycle Time (min)</label>
                  <input type="number" step="0.1" min="0" value={prodForm.cycle_time_minutes} onChange={e => setProdForm(f => ({ ...f, cycle_time_minutes: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }} /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Idle Time (min)</label>
                  <input type="number" step="0.1" min="0" value={prodForm.idle_time_minutes} onChange={e => setProdForm(f => ({ ...f, idle_time_minutes: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }} /></div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: GOLD, color: '#060D1A' }}>Simpan Data Produksi</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
