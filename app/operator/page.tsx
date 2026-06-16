'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD   = '#F5A623'
const GREEN  = '#2ECC71'
const RED    = '#E74C3C'

function scoreColor(s: number) { if (s >= 80) return GREEN; if (s >= 60) return GOLD; return RED }

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: '#7B8BA3' }}>{label}</span>
        <span style={{ color: scoreColor(value), fontWeight: 700 }}>{value}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#152244' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: scoreColor(value) }} />
      </div>
    </div>
  )
}

function DetailModal({ op, onClose }: { op: any; onClose: () => void }) {
  if (!op) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{ background: '#0B1A33', border: '1px solid #1A3470' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#152244' }}>
          <div>
            <h3 className="font-bold text-white text-lg">{op.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#7B8BA3' }}>{op.employee_id} · {op.position} · {op.certification || '—'}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="flex items-center justify-center py-5 border-b" style={{ borderColor: '#152244' }}>
          <div className="text-center">
            <div className="text-6xl font-black" style={{ color: scoreColor(op.overall) }}>{op.overall.toFixed(1)}</div>
            <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: '#7B8BA3' }}>Overall Score</div>
            <div className="text-xs mt-2" style={{ color: '#4A5C75' }}>Shift {op.shift} · Unit {op.mining_units?.unit_id || '—'}</div>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7B8BA3' }}>Score Breakdown</p>
          <ScoreBar label="Productivity Score" value={op.productivity_score} />
          <ScoreBar label="Fuel Efficiency Score" value={op.fuel_efficiency_score} />
          <ScoreBar label="Safety Score" value={op.safety_score} />
        </div>

        <div className="px-5 pb-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#7B8BA3' }}>Violation Count</p>
          <div className="text-center p-4 rounded-lg" style={{ background: '#0F1F3D', border: '1px solid #152244' }}>
            <span className="text-3xl font-black" style={{ color: op.violation_count > 0 ? RED : GREEN }}>{op.violation_count}</span>
            <p className="text-xs mt-1" style={{ color: '#4A5C75' }}>{op.violation_count === 0 ? 'Clean record — tidak ada pelanggaran' : `${op.violation_count} pelanggaran tercatat`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OperatorPerformance() {
  const [operators, setOperators] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [shiftFilter, setShiftFilter] = useState('Semua')
  const [selectedOp, setSelectedOp] = useState<any>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ employee_id: '', name: '', shift: '1', unit_id: '', position: 'Operator', productivity_score: '0', fuel_efficiency_score: '0', safety_score: '0', violation_count: '0', certification: '' })

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateForm, setUpdateForm] = useState({ id: '', productivity_score: '0', fuel_efficiency_score: '0', safety_score: '0', violation_count: '0' })

  const shifts = ['Semua', 'Shift 1', 'Shift 2', 'Shift 3']

  const fetchOperators = async () => {
    const { data } = await supabase.from('operators').select('*, mining_units(unit_id)').order('productivity_score', { ascending: false })
    setOperators(data || [])
    const { data: u } = await supabase.from('mining_units').select('*').order('unit_id')
    setUnits(u || [])
    setLoading(false)
  }
  useEffect(() => { fetchOperators() }, [])

  const filtered = operators
    .filter(op => shiftFilter === 'Semua' || op.shift === Number(shiftFilter.replace('Shift ', '')))
    .map(op => ({ ...op, overall: (op.productivity_score + op.fuel_efficiency_score + op.safety_score) / 3 }))
    .sort((a: any, b: any) => b.overall - a.overall)

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault()
    const unit = units.find(u => u.unit_id === addForm.unit_id)
    const { error } = await supabase.from('operators').insert({
      employee_id: addForm.employee_id, name: addForm.name, shift: Number(addForm.shift),
      unit_id: unit?.id || null, position: addForm.position,
      productivity_score: Number(addForm.productivity_score),
      fuel_efficiency_score: Number(addForm.fuel_efficiency_score),
      safety_score: Number(addForm.safety_score),
      violation_count: Number(addForm.violation_count),
      certification: addForm.certification,
    })
    if (error) { alert('Gagal tambah operator: ' + error.message); return }
    setShowAddModal(false)
    setAddForm({ employee_id: '', name: '', shift: '1', unit_id: '', position: 'Operator', productivity_score: '0', fuel_efficiency_score: '0', safety_score: '0', violation_count: '0', certification: '' })
    fetchOperators()
  }

  const openUpdate = (op: any) => {
    setUpdateForm({ id: op.id, productivity_score: String(op.productivity_score), fuel_efficiency_score: String(op.fuel_efficiency_score), safety_score: String(op.safety_score), violation_count: String(op.violation_count) })
    setShowUpdateModal(true)
  }

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('operators').update({
      productivity_score: Number(updateForm.productivity_score),
      fuel_efficiency_score: Number(updateForm.fuel_efficiency_score),
      safety_score: Number(updateForm.safety_score),
      violation_count: Number(updateForm.violation_count),
    }).eq('id', updateForm.id)
    if (error) { alert('Gagal update score: ' + error.message); return }
    setShowUpdateModal(false)
    fetchOperators()
  }

  if (loading) return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-gray-700 rounded-full animate-spin" style={{ borderTopColor: GOLD }} /></div>

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Operator Performance</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7B8BA3' }}>Ranking dan evaluasi performa operator tambang</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: GOLD, color: '#060D1A' }}>+ Tambah Operator</button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold" style={{ color: '#7B8BA3' }}>Filter Shift:</span>
        {shifts.map(s => (
          <button key={s} onClick={() => setShiftFilter(s)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: shiftFilter === s ? GOLD : '#0F1F3D', color: shiftFilter === s ? '#060D1A' : '#7B8BA3', border: `1px solid ${shiftFilter === s ? GOLD : '#1A3470'}` }}>
            {s}
          </button>
        ))}
        <span className="ml-auto text-xs" style={{ color: '#4A5C75' }}>{filtered.length} operator</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #152244' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#060D1A', borderBottom: '1px solid #152244' }}>
              {['#', 'NIK', 'Nama', 'Shift', 'Unit', 'Prod', 'Fuel', 'Safety', 'Overall', 'Aksi'].map(h => (
                <th key={h} className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#7B8BA3' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((op: any, i: number) => {
              const rc = op.overall >= 80 ? 'rgba(46,204,113,0.05)' : op.overall >= 60 ? 'rgba(245,166,35,0.05)' : 'rgba(231,76,60,0.05)'
              return (
                <tr key={op.id} style={{ borderBottom: '1px solid #152244', background: rc }} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-3 text-xs font-bold" style={{ color: i === 0 ? GOLD : '#7B8BA3' }}>{i + 1}</td>
                  <td className="px-3 py-3 font-mono text-xs text-white">{op.employee_id}</td>
                  <td className="px-3 py-3 font-medium text-white text-xs">{op.name}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: '#7B8BA3' }}>S{op.shift}</td>
                  <td className="px-3 py-3 font-mono text-xs text-white">{op.mining_units?.unit_id || '—'}</td>
                  <td className="px-3 py-3"><span className="text-xs font-bold" style={{ color: scoreColor(op.productivity_score) }}>{op.productivity_score}</span></td>
                  <td className="px-3 py-3"><span className="text-xs font-bold" style={{ color: scoreColor(op.fuel_efficiency_score) }}>{op.fuel_efficiency_score}</span></td>
                  <td className="px-3 py-3"><span className="text-xs font-bold" style={{ color: scoreColor(op.safety_score) }}>{op.safety_score}</span></td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ background: `${scoreColor(op.overall)}15`, color: scoreColor(op.overall), border: `1px solid ${scoreColor(op.overall)}40` }}>{op.overall.toFixed(1)}</span>
                  </td>
                  <td className="px-3 py-3 flex gap-1.5">
                    <button onClick={() => setSelectedOp(op)} className="text-xs px-2 py-1 rounded font-medium" style={{ background: '#0F1F3D', color: GOLD, border: '1px solid #1A3470' }}>Detail</button>
                    <button onClick={() => openUpdate(op)} className="text-xs px-2 py-1 rounded font-medium" style={{ background: '#0F1F3D', color: '#60A5FA', border: '1px solid #1A3470' }}>Update</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-6 text-xs" style={{ color: '#4A5C75' }}>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: GREEN }} /> ≥ 80 (Baik)</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: GOLD }} /> 60–79 (Cukup)</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: RED }} /> &lt; 60 (Perlu Pembinaan)</span>
      </div>

      <DetailModal op={selectedOp} onClose={() => setSelectedOp(null)} />

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="rounded-2xl w-full max-w-lg shadow-2xl" style={{ background: '#0B1A33', border: '1px solid #1A3470' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#152244' }}><h3 className="font-bold text-white">Tambah Operator Baru</h3><button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white p-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></div>
            <form onSubmit={handleAddOperator} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>NIK / Employee ID</label><input type="text" value={addForm.employee_id} onChange={e => setAddForm(f => ({ ...f, employee_id: e.target.value }))} required className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }} /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Nama Lengkap</label><input type="text" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Shift</label><select value={addForm.shift} onChange={e => setAddForm(f => ({ ...f, shift: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}><option value="1">Shift 1</option><option value="2">Shift 2</option><option value="3">Shift 3</option></select></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Unit</label><select value={addForm.unit_id} onChange={e => setAddForm(f => ({ ...f, unit_id: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}><option value="">Pilih</option>{units.map(u => <option key={u.id} value={u.unit_id}>{u.unit_id}</option>)}</select></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Posisi</label><select value={addForm.position} onChange={e => setAddForm(f => ({ ...f, position: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}><option>Operator</option><option>Jr. Operator</option><option>Sr. Operator</option><option>Lead Operator</option></select></div>
              </div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>Sertifikasi</label><input type="text" value={addForm.certification} onChange={e => setAddForm(f => ({ ...f, certification: e.target.value }))} placeholder="Contoh: POP, SIO Excavator" className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }} /></div>
              <div className="grid grid-cols-4 gap-3">
                {['Productivity', 'Fuel Eff', 'Safety', 'Violations'].map((l, i) => {
                  const k = ['productivity_score', 'fuel_efficiency_score', 'safety_score', 'violation_count'][i]
                  return <div key={k}><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>{l}</label><input type="number" min="0" max={k === 'violation_count' ? 999 : 100} value={(addForm as any)[k]} onChange={e => setAddForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }} /></div>
                })}
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: GOLD, color: '#060D1A' }}>Simpan Operator</button>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{ background: '#0B1A33', border: '1px solid #1A3470' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#152244' }}><h3 className="font-bold text-white">Update Score Operator</h3><button onClick={() => setShowUpdateModal(false)} className="text-gray-500 hover:text-white p-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button></div>
            <form onSubmit={handleUpdateScore} className="p-5 space-y-4">
              {[['Productivity Score', 'productivity_score'], ['Fuel Efficiency Score', 'fuel_efficiency_score'], ['Safety Score', 'safety_score'], ['Violation Count', 'violation_count']].map(([l, k]) => (
                <div key={k}><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>{l}</label><input type="number" min="0" max={k === 'violation_count' ? 999 : 100} value={(updateForm as any)[k]} onChange={e => setUpdateForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#0F1F3D', border: '1px solid #1A3470' }} /></div>
              ))}
              <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: GOLD, color: '#060D1A' }}>Update Score</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
