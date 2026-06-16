import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import {
  dashboardKPIs, productionTrend, utilizationByType, dashboardAlerts, fleetMap,
} from '../data/dummy';

const YELLOW = '#FFB800';
const GREEN  = '#22C55E';
const RED    = '#EF4444';

function KPICard({ label, value, unit, sub, color = YELLOW }) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: '#161B22', border: '1px solid #21262D' }}>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B949E' }}>{label}</span>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-3xl font-black" style={{ color }}>{value}</span>
        {unit && <span className="text-sm pb-1" style={{ color: '#8B949E' }}>{unit}</span>}
      </div>
      {sub && <span className="text-xs" style={{ color: '#484F58' }}>{sub}</span>}
    </div>
  );
}

const severityBadge = { Critical: 'bg-red-900/60 text-red-300 border-red-700', Warning: 'bg-yellow-900/60 text-yellow-300 border-yellow-700', Info: 'bg-blue-900/60 text-blue-300 border-blue-700' };
const statusDot = { Aktif: GREEN, Idle: YELLOW, Breakdown: RED };

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Remote Operation Center</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8B949E' }}>
            Minggu, 14 Juni 2026 · Shift 1 · 10:00 WIB — Data real-time (dummy)
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: GREEN }}></div>
          <span className="text-xs font-medium" style={{ color: GREEN }}>LIVE</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <KPICard label="Production Achievement"  value={`${dashboardKPIs.productionAchievement}%`} sub="Target: 150.000 BCM" color={GREEN} />
        <KPICard label="BCM Produced"            value={(dashboardKPIs.bcmProduced / 1000).toFixed(0) + 'K'} unit="BCM" sub="Hari ini" />
        <KPICard label="Fleet Utilization"       value={`${dashboardKPIs.fleetUtilization}%`} sub="Target ≥ 85%" color={YELLOW} />
        <KPICard label="Idle Time"               value={`${dashboardKPIs.idleTime}%`} sub="Target ≤ 10%" color={RED} />
        <KPICard label="Fuel per BCM"            value={dashboardKPIs.fuelPerBCM} unit="L/BCM" sub="Target ≤ 0.45 L" color={YELLOW} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Production Trend */}
        <div className="rounded-xl p-5" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Tren Produksi Harian vs Target (7 Hari)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={productionTrend}>
              <CartesianGrid stroke="#21262D" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
              <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 8 }} formatter={(v) => [`${v.toLocaleString()} BCM`]} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8B949E' }} />
              <Line type="monotone" dataKey="actual" name="Aktual" stroke={YELLOW} strokeWidth={2.5} dot={{ fill: YELLOW, r: 4 }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#4B5563" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization by Area */}
        <div className="rounded-xl p-5" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Utilization per Area & Jenis Alat</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={utilizationByType}>
              <CartesianGrid stroke="#21262D" strokeDasharray="3 3" />
              <XAxis dataKey="area" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 8 }} formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="excavator" name="Excavator" fill={YELLOW} radius={[3,3,0,0]} />
              <Bar dataKey="dumpTruck"  name="Dump Truck" fill="#60A5FA" radius={[3,3,0,0]} />
              <Bar dataKey="dozer"      name="Dozer"      fill="#A78BFA" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts + Fleet Map */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active Alerts */}
        <div className="rounded-xl p-5" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Alert Aktif</h3>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#7F1D1D', color: '#FCA5A5' }}>
              {dashboardAlerts.filter(a => a.severity === 'Critical').length} Critical
            </span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {dashboardAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#0D1117' }}>
                <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${severityBadge[alert.severity]}`}>
                  {alert.severity}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{alert.unit}</span>
                    <span className="text-xs" style={{ color: '#8B949E' }}>·</span>
                    <span className="text-xs" style={{ color: '#8B949E' }}>{alert.type}</span>
                    <span className="text-xs ml-auto" style={{ color: '#484F58' }}>{alert.time}</span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#8B949E' }}>{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Map */}
        <div className="rounded-xl p-5" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Posisi Fleet per Area</h3>
            <div className="flex items-center gap-3 text-xs" style={{ color: '#8B949E' }}>
              {[['Aktif', GREEN], ['Idle', YELLOW], ['Breakdown', RED]].map(([label, color]) => (
                <span key={label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }}></span>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {fleetMap.map((zone) => (
              <div key={zone.area}>
                <div className="text-xs font-semibold mb-1.5" style={{ color: '#8B949E' }}>
                  {zone.area}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {zone.units.map((u) => (
                    <div
                      key={u.id}
                      title={`${u.id} · ${u.status}`}
                      className="text-xs font-mono px-2 py-0.5 rounded font-semibold"
                      style={{
                        background: u.status === 'Aktif' ? 'rgba(34,197,94,0.15)' : u.status === 'Idle' ? 'rgba(255,184,0,0.15)' : 'rgba(239,68,68,0.15)',
                        color: statusDot[u.status],
                        border: `1px solid ${statusDot[u.status]}40`,
                      }}
                    >
                      {u.id}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
