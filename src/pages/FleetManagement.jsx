import { useState, useMemo } from 'react';
import { fleetUnits } from '../data/dummy';

const YELLOW = '#FFB800';
const GREEN  = '#22C55E';
const RED    = '#EF4444';

function KPICard({ label, value, color = '#E6EDF3', sub }) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: '#161B22', border: '1px solid #21262D' }}>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B949E' }}>{label}</span>
      <span className="text-3xl font-black mt-1" style={{ color }}>{value}</span>
      {sub && <span className="text-xs" style={{ color: '#484F58' }}>{sub}</span>}
    </div>
  );
}

const areaOptions = ['Semua Area', 'Pit North', 'Pit South', 'Hauling Road A', 'Hauling Road B'];
const typeOptions = ['Semua Jenis', 'Excavator', 'Dump Truck', 'Dozer'];

export default function FleetManagement() {
  const [filterType, setFilterType] = useState('Semua Jenis');
  const [filterArea, setFilterArea] = useState('Semua Area');

  const filtered = useMemo(() => {
    return fleetUnits.filter((u) => {
      const matchType = filterType === 'Semua Jenis' || u.type === filterType;
      const matchArea = filterArea === 'Semua Area' || u.area === filterArea;
      return matchType && matchArea;
    });
  }, [filterType, filterArea]);

  const aktif     = fleetUnits.filter(u => u.status === 'Aktif').length;
  const idle      = fleetUnits.filter(u => u.status === 'Idle').length;
  const breakdown = fleetUnits.filter(u => u.status === 'Breakdown').length;
  const avgCycle  = '34 min';

  const rowBg = (unit) => {
    if (unit.status === 'Breakdown') return 'rgba(239,68,68,0.08)';
    if (unit.status === 'Idle')      return 'rgba(255,184,0,0.06)';
    return 'transparent';
  };

  const statusPill = (status) => {
    if (status === 'Aktif')     return { bg: 'rgba(34,197,94,0.15)',   color: GREEN,  border: `${GREEN}40`  };
    if (status === 'Idle')      return { bg: 'rgba(255,184,0,0.15)',   color: YELLOW, border: `${YELLOW}40` };
    return                             { bg: 'rgba(239,68,68,0.15)',   color: RED,    border: `${RED}40`    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Fleet Management</h1>
        <p className="text-sm mt-0.5" style={{ color: '#8B949E' }}>
          Status dan performa seluruh unit alat berat · 14 Jun 2026
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Total Unit Aktif"    value={aktif}     color={GREEN}  sub={`dari ${fleetUnits.length} total unit`} />
        <KPICard label="Total Idle"          value={idle}      color={YELLOW} sub="Termasuk idle > 30 menit" />
        <KPICard label="Total Breakdown"     value={breakdown} color={RED}    sub="Memerlukan tindakan segera" />
        <KPICard label="Rata-rata Cycle Time" value={avgCycle} sub="Excavator & Dump Truck" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold" style={{ color: '#8B949E' }}>Filter:</span>
        <div className="flex gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterType(opt)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterType === opt ? '#FFB800' : '#21262D',
                color:      filterType === opt ? '#0D1117' : '#8B949E',
                border:     filterType === opt ? '1px solid #FFB800' : '1px solid #30363D',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-gray-700 mx-1" />
        <div className="flex gap-2">
          {areaOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterArea(opt)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterArea === opt ? '#FFB800' : '#21262D',
                color:      filterArea === opt ? '#0D1117' : '#8B949E',
                border:     filterArea === opt ? '1px solid #FFB800' : '1px solid #30363D',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs" style={{ color: '#484F58' }}>
          {filtered.length} unit ditampilkan
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #21262D' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0D1117', borderBottom: '1px solid #21262D' }}>
              {['Unit ID', 'Jenis', 'Lokasi / Area', 'Status', 'Utilization', 'Cycle Time', 'Engine Hour'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((unit, i) => {
              const pill = statusPill(unit.status);
              return (
                <tr
                  key={unit.id}
                  style={{
                    background: rowBg(unit),
                    borderBottom: '1px solid #21262D',
                  }}
                >
                  <td className="px-4 py-3 font-mono font-bold text-white">{unit.id}</td>
                  <td className="px-4 py-3" style={{ color: '#8B949E' }}>{unit.type}</td>
                  <td className="px-4 py-3" style={{ color: '#8B949E' }}>{unit.area}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: pill.bg, color: pill.color, border: `1px solid ${pill.border}` }}
                    >
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: '#21262D' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${unit.utilization}%`,
                            background: unit.utilization >= 80 ? GREEN : unit.utilization >= 50 ? YELLOW : RED,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: unit.utilization >= 80 ? GREEN : unit.utilization >= 50 ? YELLOW : RED }}>
                        {unit.utilization}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8B949E' }}>{unit.cycleTime}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8B949E' }}>{unit.engineHour} h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
