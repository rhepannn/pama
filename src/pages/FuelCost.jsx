import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { fuelData, fuelTrend, topBorosUnits } from '../data/dummy';

const YELLOW = '#FFB800';
const RED    = '#EF4444';
const GREEN  = '#22C55E';

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

const totalFuel = fuelData.reduce((s, d) => s + d.konsumsi, 0);
const fuelCost  = Math.round(totalFuel * 12500); // Rp 12.500/liter
const avgFuelBCM = (fuelData.filter(d => d.fuelPerBCM > 0).reduce((s, d) => s + d.fuelPerBCM, 0) / fuelData.filter(d => d.fuelPerBCM > 0).length).toFixed(2);

export default function FuelCost() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Fuel & Cost Monitoring</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8B949E' }}>Konsumsi BBM dan biaya operasional · 14 Jun 2026</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard label="Total Fuel Hari Ini" value={totalFuel.toLocaleString()} unit="Liter" sub="Seluruh unit aktif" />
        <KPICard label="Fuel Cost Total" value={`Rp ${(fuelCost / 1000000).toFixed(1)}M`} sub="@ Rp 12.500/liter" color={RED} />
        <KPICard label="Rata-rata Fuel/BCM" value={avgFuelBCM} unit="L/BCM" sub="Target ≤ 0.45 L/BCM" color={parseFloat(avgFuelBCM) > 0.45 ? RED : GREEN} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Fuel Trend Line */}
        <div className="rounded-xl p-5" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Tren Konsumsi BBM 7 Hari (Liter)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={fuelTrend}>
              <CartesianGrid stroke="#21262D" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} domain={[4000, 5500]} />
              <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 8 }}
                formatter={(v) => [`${v.toLocaleString()} L`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={4500} stroke="#4B5563" strokeDasharray="5 5" label={{ value: 'Target', fill: '#8B949E', fontSize: 10 }} />
              <Line type="monotone" dataKey="total" name="Aktual" stroke={YELLOW} strokeWidth={2.5} dot={{ fill: YELLOW, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Boros */}
        <div className="rounded-xl p-5" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Ranking 10 Unit Paling Boros (L/BCM)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topBorosUnits} layout="vertical">
              <CartesianGrid stroke="#21262D" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 1]} />
              <YAxis type="category" dataKey="unitId" tick={{ fill: '#8B949E', fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
              <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 8 }}
                formatter={(v) => [`${v} L/BCM`]} />
              <ReferenceLine x={0.45} stroke="#4B5563" strokeDasharray="4 4" />
              <Bar dataKey="fuelPerBCM" name="L/BCM" fill={RED} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fuel Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #21262D' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ background: '#0D1117', borderBottom: '1px solid #21262D' }}>
          <h3 className="text-sm font-semibold text-white">Detail Konsumsi BBM per Unit</h3>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#7F1D1D', color: '#FCA5A5' }}>
            {fuelData.filter(d => d.status === 'Boros').length} unit boros
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0D1117', borderBottom: '1px solid #21262D' }}>
              {['Unit ID', 'Aktivitas', 'Konsumsi (L)', 'Fuel/BCM', 'Status'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fuelData.map((row, i) => (
              <tr key={row.unitId} style={{ borderBottom: '1px solid #21262D', background: row.status === 'Boros' ? 'rgba(239,68,68,0.06)' : 'transparent' }}>
                <td className="px-4 py-2.5 font-mono font-bold text-white">{row.unitId}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: '#8B949E' }}>{row.activity}</td>
                <td className="px-4 py-2.5 text-xs text-white">{row.konsumsi.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: row.fuelPerBCM > 0.45 ? RED : GREEN }}>
                  {row.fuelPerBCM > 0 ? row.fuelPerBCM.toFixed(2) : '—'}
                </td>
                <td className="px-4 py-2.5">
                  {row.status === 'Boros' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: RED, border: `1px solid ${RED}40` }}>
                      Boros
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: GREEN, border: `1px solid ${GREEN}40` }}>
                      Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
