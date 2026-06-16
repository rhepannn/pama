import { useState } from 'react';
import { operators } from '../data/dummy';

const GREEN  = '#22C55E';
const YELLOW = '#FFB800';
const RED    = '#EF4444';

function scoreColor(score) {
  if (score > 80) return GREEN;
  if (score >= 60) return YELLOW;
  return RED;
}

function ScoreBar({ label, value }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: '#8B949E' }}>{label}</span>
        <span style={{ color: scoreColor(value), fontWeight: 700 }}>{value}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#21262D' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: scoreColor(value) }}
        />
      </div>
    </div>
  );
}

function Modal({ operator, onClose }) {
  if (!operator) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#21262D' }}>
          <div>
            <h3 className="font-bold text-white">{operator.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
              {operator.shift} · Unit {operator.unit}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Overall Score */}
        <div className="flex items-center justify-center py-5">
          <div className="text-center">
            <div className="text-5xl font-black" style={{ color: scoreColor(operator.overallScore) }}>
              {operator.overallScore.toFixed(1)}
            </div>
            <div className="text-xs mt-1" style={{ color: '#8B949E' }}>Overall Score</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="px-5 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B949E' }}>
            Score Breakdown
          </p>
          <ScoreBar label="Productivity Score"     value={operator.productivityScore} />
          <ScoreBar label="Fuel Efficiency Score"  value={operator.fuelEfficiencyScore} />
          <ScoreBar label="Safety Score"           value={operator.safetyScore} />
        </div>

        {/* Violations */}
        <div className="px-5 pb-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B949E' }}>
            Riwayat Pelanggaran
          </p>
          {operator.violations.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: '#484F58' }}>Tidak ada pelanggaran tercatat</p>
          ) : (
            <div className="space-y-2">
              {operator.violations.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg text-xs" style={{ background: '#0D1117', border: '1px solid #21262D' }}>
                  <div>
                    <span className="font-bold text-red-400">{v.type}</span>
                    <span className="ml-2" style={{ color: '#8B949E' }}>{v.location}</span>
                  </div>
                  <span style={{ color: '#484F58' }}>{v.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OperatorPerformance() {
  const [shiftFilter, setShiftFilter] = useState('Semua');
  const [selectedOp, setSelectedOp] = useState(null);

  const shifts = ['Semua', 'Shift 1', 'Shift 2', 'Shift 3'];
  const filtered = operators
    .filter(op => shiftFilter === 'Semua' || op.shift === shiftFilter)
    .sort((a, b) => b.overallScore - a.overallScore);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Operator Performance</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8B949E' }}>Ranking dan evaluasi performa operator · 14 Jun 2026</p>
      </div>

      {/* Shift Filter */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold" style={{ color: '#8B949E' }}>Filter Shift:</span>
        <div className="flex gap-2">
          {shifts.map(s => (
            <button
              key={s}
              onClick={() => setShiftFilter(s)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: shiftFilter === s ? '#FFB800' : '#21262D',
                color:      shiftFilter === s ? '#0D1117'  : '#8B949E',
                border:     shiftFilter === s ? '1px solid #FFB800' : '1px solid #30363D',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs" style={{ color: '#484F58' }}>{filtered.length} operator</span>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #21262D' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0D1117', borderBottom: '1px solid #21262D' }}>
              {['#', 'Nama Operator', 'Shift', 'Unit', 'Produktivitas', 'Fuel Efficiency', 'Safety', 'Overall', 'Detail'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((op, i) => (
              <tr key={op.id} style={{ borderBottom: '1px solid #21262D', background: 'transparent' }}
                className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-xs font-bold" style={{ color: i === 0 ? '#FFB800' : '#8B949E' }}>
                  {i + 1}
                </td>
                <td className="px-4 py-3 font-medium text-white">{op.name}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#8B949E' }}>{op.shift}</td>
                <td className="px-4 py-3 font-mono text-xs text-white">{op.unit}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold" style={{ color: scoreColor(op.productivityScore) }}>{op.productivityScore}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold" style={{ color: scoreColor(op.fuelEfficiencyScore) }}>{op.fuelEfficiencyScore}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold" style={{ color: scoreColor(op.safetyScore) }}>{op.safetyScore}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-sm font-black px-2 py-0.5 rounded-lg"
                    style={{
                      background: `${scoreColor(op.overallScore)}15`,
                      color: scoreColor(op.overallScore),
                      border: `1px solid ${scoreColor(op.overallScore)}40`,
                    }}
                  >
                    {op.overallScore.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedOp(op)}
                    className="text-xs px-3 py-1 rounded-lg transition-all font-medium"
                    style={{ background: '#21262D', color: '#FFB800', border: '1px solid #30363D' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFB800'; e.currentTarget.style.color = '#0D1117'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#21262D'; e.currentTarget.style.color = '#FFB800'; }}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs" style={{ color: '#484F58' }}>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: GREEN }} /> Score &gt; 80</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: YELLOW }} /> Score 60–80</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: RED }} /> Score &lt; 60</span>
      </div>

      <Modal operator={selectedOp} onClose={() => setSelectedOp(null)} />
    </div>
  );
}
