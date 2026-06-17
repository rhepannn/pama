'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import { supabase } from '@/lib/supabase'

const GOLD  = '#F5A623'
const GREEN = '#2ECC71'
const RED   = '#E74C3C'
const BLUE  = '#3498DB'

function KPICard({ label, value, unit, sub, color = GOLD }: {
  label: string; value: string | number; unit?: string; sub?: string; color?: string
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7B8BA3' }}>{label}</span>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-3xl font-black" style={{ color }}>{value}</span>
        {unit && <span className="text-sm pb-1" style={{ color: '#7B8BA3' }}>{unit}</span>}
      </div>
      {sub && <span className="text-xs" style={{ color: '#4A5C75' }}>{sub}</span>}
    </div>
  )
}

const statusColor: Record<string, string> = { active: GREEN, idle: GOLD, breakdown: RED }
const statusLabel: Record<string, string> = { active: 'Active', idle: 'Idle', breakdown: 'Breakdown' }
const typeLabel: Record<string, string> = { excavator: 'Excavator', dump_truck: 'Dump Truck', dozer: 'Dozer', grader: 'Grader', drill: 'Drill' }

function formatDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getCurrentShift() {
  const h = new Date().getHours()
  if (h >= 6 && h < 14) return 1
  if (h >= 14 && h < 22) return 2
  return 3
}

function getShiftLabel(shift: number) {
  return `Shift ${shift} (${shift === 1 ? '06:00–14:00' : shift === 2 ? '14:00–22:00' : '22:00–06:00'})`
}

export default function Dashboard() {
  const [clock, setClock] = useState('')
  const [todayDate, setTodayDate] = useState('')
  const [currentShift, setCurrentShift] = useState(getCurrentShift())
  const [loading, setLoading] = useState(true)

  const [bcmToday, setBcmToday] = useState(0)
  const [coalBcm, setCoalBcm] = useState(0)
  const [obBcm, setObBcm] = useState(0)
  const [fleetActive, setFleetActive] = useState(0)
  const [fleetIdle, setFleetIdle] = useState(0)
  const [fleetBreakdown, setFleetBreakdown] = useState(0)
  const [avgUtilization, setAvgUtilization] = useState('0')
  const [paRate, setPaRate] = useState(0)
  const [prodAchievement, setProdAchievement] = useState(0)

  const [prodTrend, setProdTrend] = useState<any[]>([])
  const [fleetUnits, setFleetUnits] = useState<any[]>([])
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([])

  useEffect(() => {
    function tick() {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      setClock(`${h}:${m}:${s}`)
      setCurrentShift(getCurrentShift())

      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      setTodayDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
      const todayStr = formatDate(new Date())
      const DAILY_TARGET = 120000

      const { data: prodToday } = await supabase
        .from('production_logs')
        .select('bcm_produced, material_type')
        .eq('log_date', todayStr)

      if (prodToday) {
        const total = prodToday.reduce((s: number, r: any) => s + Number(r.bcm_produced), 0)
        setBcmToday(Math.round(total))
        setCoalBcm(Math.round(prodToday.filter((r: any) => r.material_type === 'coal').reduce((s: number, r: any) => s + Number(r.bcm_produced), 0)))
        setObBcm(Math.round(prodToday.filter((r: any) => r.material_type === 'overburden').reduce((s: number, r: any) => s + Number(r.bcm_produced), 0)))
        setProdAchievement(Math.round((total / DAILY_TARGET) * 100))
      }

      const { data: units } = await supabase.from('mining_units').select('*')

      if (units) {
        setFleetActive(units.filter((u: any) => u.status === 'active').length)
        setFleetIdle(units.filter((u: any) => u.status === 'idle').length)
        setFleetBreakdown(units.filter((u: any) => u.status === 'breakdown').length)
        const avg = units.reduce((s: number, u: any) => s + Number(u.utilization), 0) / units.length
        setAvgUtilization(avg.toFixed(1))
        const activeCount = units.filter((u: any) => u.status !== 'breakdown').length
        setPaRate(units.length > 0 ? Math.round((activeCount / units.length) * 100) : 0)
      }

      const { data: allUnits } = await supabase.from('mining_units').select('*').order('unit_id')
      setFleetUnits(allUnits || [])

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      const startStr = formatDate(sevenDaysAgo)

      const { data: prodLogs } = await supabase
        .from('production_logs')
        .select('log_date, bcm_produced')
        .gte('log_date', startStr)
        .lte('log_date', todayStr)
        .order('log_date')

      const trendMap: Record<string, number> = {}
      if (prodLogs) {
        prodLogs.forEach((log: any) => {
          const d = log.log_date
          if (!trendMap[d]) trendMap[d] = 0
          trendMap[d] += Number(log.bcm_produced)
        })
      }

      const trend: { date: string; actual: number; target: number }[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = formatDate(d)
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        trend.push({
          date: `${dd}/${mm}`,
          actual: Math.round(trendMap[key] || 0),
          target: DAILY_TARGET,
        })
      }
      setProdTrend(trend)

      const { data: alerts } = await supabase
        .from('safety_alerts')
        .select('*, mining_units(unit_id)')
        .eq('status', 'open')
        .eq('severity', 'critical')
      setCriticalAlerts(alerts || [])

      } catch (err) {
        console.error('Dashboard fetch error:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: '#060D1A' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderTopColor: GOLD, borderColor: '#152244' }} />
          <p className="text-sm" style={{ color: '#7B8BA3' }}>Memuat data operasional...</p>
        </div>
      </div>
    )
  }

  const shiftName = getShiftLabel(currentShift)

  return (
    <div className="p-6 space-y-6">
      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(231,76,60,0.15)', border: '1px solid #E74C3C40' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" className="w-6 h-6 flex-shrink-0 animate-pulse">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="flex-1">
            <span className="text-sm font-bold" style={{ color: '#E74C3C' }}>
              {criticalAlerts.length} Critical Alert Aktif
            </span>
            <span className="text-xs ml-3" style={{ color: '#F1948A' }}>
              {criticalAlerts.map((a: any) => `${a.mining_units?.unit_id || '—'}: ${a.alert_type}`).join(' | ')}
            </span>
          </div>
          <span className="text-xs px-2 py-1 rounded font-bold" style={{ background: RED, color: '#fff' }}>SEGERA TANGANI</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Remote Operation Center</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-sm" style={{ color: '#7B8BA3' }}>{todayDate} · {clock} WITA</p>
            <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(245,166,35,0.15)', color: GOLD, border: '1px solid #F5A62340' }}>
              {shiftName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider" style={{ color: '#4A5C75' }}>Target Harian</div>
            <div className="text-lg font-bold text-white">120.000 BCM</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: GREEN }} />
            <span className="text-xs font-medium" style={{ color: GREEN }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 1 — Production */}
      <div className="grid grid-cols-5 gap-4">
        <KPICard label="BCM Hari Ini" value={bcmToday.toLocaleString()} unit="BCM" sub={`Coal: ${coalBcm.toLocaleString()} | OB: ${obBcm.toLocaleString()}`} color={GREEN} />
        <KPICard label="Pencapaian Target" value={`${prodAchievement}%`} unit="" sub={`Dari target 120.000 BCM/hari`} color={prodAchievement >= 90 ? GREEN : GOLD} />
        <KPICard label="Fleet Aktif" value={fleetActive} unit="Unit" sub="Status operating" color={GREEN} />
        <KPICard label="Physical Availability" value={`${paRate}%`} unit="" sub={`Target PA ≥ 85%`} color={paRate >= 85 ? GREEN : paRate >= 70 ? GOLD : RED} />
        <KPICard label="Utilisasi Rata-rata" value={`${avgUtilization}%`} unit="" sub="Seluruh unit fleet" color={BLUE} />
      </div>

      {/* KPI Cards Row 2 — Status */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Unit Idle" value={fleetIdle} unit="Unit" sub="Menunggu antrian / standby" color={GOLD} />
        <KPICard label="Unit Breakdown" value={fleetBreakdown} unit="Unit" sub="Dalam perbaikan workshop" color={RED} />
        <KPICard label="Safety Alert Aktif" value={criticalAlerts.length} unit="Alert" sub="Critical severity" color={RED} />
        <KPICard label="Total Fleet" value={fleetUnits.length} unit="Unit" sub={`EX: ${fleetUnits.filter((u: any) => u.unit_type === 'excavator').length} | DT: ${fleetUnits.filter((u: any) => u.unit_type === 'dump_truck').length} | DZ: ${fleetUnits.filter((u: any) => u.unit_type === 'dozer').length}`} />
      </div>

      {/* Production Trend Chart */}
      <div className="rounded-xl p-5" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
        <h3 className="text-sm font-semibold text-white mb-4">Tren Produksi BCM 7 Hari vs Target 120.000 BCM</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={prodTrend}>
            <CartesianGrid stroke="#152244" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#7B8BA3', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#7B8BA3', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: '#060D1A', border: '1px solid #1A3470', borderRadius: 8 }} formatter={(v: number) => [`${v.toLocaleString()} BCM`]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="actual" name="Aktual" stroke={GOLD} strokeWidth={3} dot={{ fill: GOLD, r: 5 }} />
            <Line type="monotone" dataKey="target" name="Target 120K" stroke="#3B5998" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Fleet Status Grid */}
      <div className="rounded-xl p-5" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Status Fleet — Semua Unit</h3>
          <div className="flex items-center gap-4 text-xs" style={{ color: '#7B8BA3' }}>
            {[['Active', GREEN], ['Idle', GOLD], ['Breakdown', RED]].map(([label, color]) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />{label}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          {fleetUnits.map((unit: any) => {
            const color = statusColor[unit.status] || '#7B8BA3'
            const lbl = statusLabel[unit.status] || unit.status
            const bg = unit.status === 'active' ? 'rgba(46,204,113,0.08)' : unit.status === 'idle' ? 'rgba(245,166,35,0.08)' : 'rgba(231,76,60,0.08)'
            const bc = unit.status === 'active' ? '#2ECC7130' : unit.status === 'idle' ? '#F5A62330' : '#E74C3C30'
            return (
              <div key={unit.id} className="rounded-lg p-3 flex flex-col gap-0.5" style={{ background: bg, border: `1px solid ${bc}` }}>
                <span className="text-sm font-mono font-bold" style={{ color }}>{unit.unit_id}</span>
                <span className="text-xs" style={{ color: '#7B8BA3' }}>{unit.make_model || typeLabel[unit.unit_type] || unit.unit_type}</span>
                <span className="text-xs" style={{ color: '#4A5C75' }}>{unit.area}</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: `${color}18`, color, border: `1px solid ${bc}` }}>{lbl}</span>
                  <span className="text-xs" style={{ color: '#4A5C75' }}>{unit.utilization}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
