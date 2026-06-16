import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { safetyAlerts as initialAlerts, safetyTrend, riskAreas } from '../data/dummy';

const riskStyle = {
  Critical: { bg: 'rgba(239,68,68,0.15)',   color: '#EF4444', border: '#EF444440' },
  High:     { bg: 'rgba(249,115,22,0.15)',  color: '#F97316', border: '#F9731640' },
  Medium:   { bg: 'rgba(234,179,8,0.15)',   color: '#EAB308', border: '#EAB30840' },
};
const statusStyle = {
  Open:        { bg: 'rgba(239,68,68,0.12)',  color: '#EF4444' },
  'In Progress':{ bg: 'rgba(255,184,0,0.12)', color: '#FFB800' },
  Resolved:    { bg: 'rgba(34,197,94,0.12)',  color: '#22C55E' },
};
const categoryIcon = {
  'Fatigue Detection': '😴',
  'Unsafe Act':        '⚠️',
  'Near Miss':         '⚡',
  'Breakdown Risk':    '🔧',
};

export default function SafetyAlert() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filterRisk, setFilterRisk] = useState('Semua');
  const [filterCat,  setFilterCat]  = useState('Semua');

  const risks = ['Semua', 'Critical', 'High', 'Medium'];
  const cats  = ['Semua', 'Fatigue Detection', 'Unsafe Act', 'Near Miss', 'Breakdown Risk'];

  const handleTangani = (id) => {
    setAlerts(prev => prev.map(a => {
      if (a.id !== id) return a;
      const next = a.status === 'Open' ? 'In Progress' : a.status === 'In Progress' ? 'Resolved' : 'Resolved';
      return { ...a, status: next };
    }));
  };

  const filtered = alerts.filter(a => {
    const matchRisk = filterRisk === 'Semua' || a.risk === filterRisk;
    const matchCat  = filterCat  === 'Semua' || a.category === filterCat;
    return matchRisk && matchCat;
  });

  const openCount     = alerts.filter(a => a.status === 'Open').length;
  const criticalCount = alerts.filter(a => a.risk === 'Critical').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Safety & Alert</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8B949E' }}>Monitoring keselamatan dan insiden · 14 Jun 2026</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #EF444440' }}>
            <div className="text-2xl font-black text-red-400">{criticalCount}</div>
            <div className="text-xs text-red-400">Critical</div>
          </div>
          <div className="px-4 py-2 rounded-lg text-center" style={{ background: 'rgba(255,184,0,0.15)', border: '1px solid #FFB80040' }}>
            <div className="text-2xl font-black" style={{ color: '#FFB800' }}>{openCount}</div>
            <div className="text-xs" style={{ color: '#FFB800' }}>Open</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold" style={{ color: '#8B949E' }}>Risiko:</span>
        {risks.map(r => (
          <button key={r} onClick={() => setFilterRisk(r)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: filterRisk === r ? '#FFB800' : '#21262D', color: filterRisk === r ? '#0D1117' : '#8B949E', border: filterRisk === r ? '1px solid #FFB800' : '1px solid #30363D' }}>
            {r}
          </button>
        ))}
        <div className="w-px h-4 bg-gray-700 mx-1" />
        <span className="text-xs font-semibold" style={{ color: '#8B949E' }}>Kategori:</span>
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: filterCat === c ? '#FFB800' : '#21262D', color: filterCat === c ? '#0D1117' : '#8B949E', border: filterCat === c ? '1px solid #FFB800' : '1px solid #30363D' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #21262D' }}>
        <div className="px-5 py-3" style={{ background: '#0D1117', borderBottom: '1px solid #21262D' }}>
          <h3 className="text-sm font-semibold text-white">{filtered.length} Alert Hari Ini</h3>
        </div>
        <div className="divide-y" style={{ borderColor: '#21262D' }}>
          {filtered.map((alert) => {
            const rs = riskStyle[alert.risk] || riskStyle.Medium;
            const ss = statusStyle[alert.status] || statusStyle.Open;
            return (
              <div key={alert.id} className="flex items-center gap-4 px-5 py-4" style={{ background: '#161B22' }}>
                <span className="text-xl flex-shrink-0">{categoryIcon[alert.category] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="text-xs font-bold" style={{ color: rs.color }}>{alert.category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}>
                      {alert.risk}
                    </span>
                    <span className="text-xs" style={{ color: '#484F58' }}>·</span>
                    <span className="text-xs font-mono font-bold text-white">{alert.unit}</span>
                    {alert.operator !== '—' && (
                      <span className="text-xs" style={{ color: '#8B949E' }}>({alert.operator})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#8B949E' }}>
                    <span>📍 {alert.location}</span>
                    <span>🕐 {alert.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ background: ss.bg, color: ss.color }}>
                    {alert.status}
                  </span>
                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleTangani(alert.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                      style={{ background: '#FFB800', color: '#0D1117' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      Tangani
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm" style={{ color: '#484F58', background: '#161B22' }}>
              Tidak ada alert sesuai filter
            </div>
          )}
        </div>
      </div>

      {/* Charts + Risk Areas */}
      <div className="grid grid-cols-2 gap-4">
        {/* Safety Trend */}
        <div className="rounded-xl p-5" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Tren Safety Incident 30 Hari Terakhir</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={safetyTrend}>
              <CartesianGrid stroke="#21262D" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#8B949E', fontSize: 9 }} axisLine={false} tickLine={false}
                interval={4} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="fatigue"   name="Fatigue"    stroke="#60A5FA" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="unsafeAct" name="Unsafe Act" stroke="#EF4444" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="nearMiss"  name="Near Miss"  stroke="#FFB800" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="breakdown" name="Breakdown"  stroke="#A78BFA" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Risk Areas */}
        <div className="rounded-xl p-5" style={{ background: '#161B22', border: '1px solid #21262D' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Top 5 Area Paling Berisiko</h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #21262D' }}>
                {['Area', 'Insiden', 'Risk Level', 'Trend'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskAreas.map((area, i) => {
                const rs = riskStyle[area.risk] || riskStyle.Medium;
                return (
                  <tr key={area.area} style={{ borderBottom: '1px solid #21262D' }}>
                    <td className="py-3 px-3 text-sm text-white font-medium">{area.area}</td>
                    <td className="py-3 px-3 text-xl font-black" style={{ color: rs.color }}>{area.incidents}</td>
                    <td className="py-3 px-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}>
                        {area.risk}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs font-semibold"
                      style={{ color: area.trend === 'Naik' ? '#EF4444' : area.trend === 'Turun' ? '#22C55E' : '#8B949E' }}>
                      {area.trend === 'Naik' ? '↑ Naik' : area.trend === 'Turun' ? '↓ Turun' : '→ Stabil'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
