// ─── Fleet Units ────────────────────────────────────────────────────────────
export const fleetUnits = [
  // Excavators
  { id: 'EX-001', type: 'Excavator', area: 'Pit North', status: 'Aktif',    utilization: 88, cycleTime: '24 min', engineHour: 7.2 },
  { id: 'EX-002', type: 'Excavator', area: 'Pit North', status: 'Aktif',    utilization: 91, cycleTime: '22 min', engineHour: 7.8 },
  { id: 'EX-003', type: 'Excavator', area: 'Pit South', status: 'Idle',     utilization: 45, cycleTime: '—',      engineHour: 3.1 },
  { id: 'EX-004', type: 'Excavator', area: 'Pit South', status: 'Aktif',    utilization: 84, cycleTime: '26 min', engineHour: 6.9 },
  { id: 'EX-005', type: 'Excavator', area: 'Pit North', status: 'Breakdown', utilization: 0,  cycleTime: '—',     engineHour: 1.2 },
  { id: 'EX-006', type: 'Excavator', area: 'Pit South', status: 'Aktif',    utilization: 79, cycleTime: '28 min', engineHour: 6.5 },
  { id: 'EX-007', type: 'Excavator', area: 'Pit North', status: 'Idle',     utilization: 52, cycleTime: '—',     engineHour: 4.4 },
  { id: 'EX-008', type: 'Excavator', area: 'Pit South', status: 'Aktif',    utilization: 86, cycleTime: '25 min', engineHour: 7.1 },
  { id: 'EX-009', type: 'Excavator', area: 'Pit North', status: 'Aktif',    utilization: 93, cycleTime: '21 min', engineHour: 7.9 },
  { id: 'EX-010', type: 'Excavator', area: 'Pit South', status: 'Breakdown', utilization: 0, cycleTime: '—',     engineHour: 0.5 },

  // Dump Trucks
  { id: 'DT-001', type: 'Dump Truck', area: 'Hauling Road A', status: 'Aktif',    utilization: 87, cycleTime: '35 min', engineHour: 7.4 },
  { id: 'DT-002', type: 'Dump Truck', area: 'Hauling Road A', status: 'Aktif',    utilization: 82, cycleTime: '37 min', engineHour: 7.0 },
  { id: 'DT-003', type: 'Dump Truck', area: 'Hauling Road B', status: 'Idle',     utilization: 38, cycleTime: '—',     engineHour: 2.8 },
  { id: 'DT-004', type: 'Dump Truck', area: 'Hauling Road A', status: 'Aktif',    utilization: 90, cycleTime: '33 min', engineHour: 7.6 },
  { id: 'DT-005', type: 'Dump Truck', area: 'Hauling Road B', status: 'Aktif',    utilization: 75, cycleTime: '40 min', engineHour: 6.3 },
  { id: 'DT-006', type: 'Dump Truck', area: 'Hauling Road A', status: 'Breakdown', utilization: 0, cycleTime: '—',     engineHour: 1.0 },
  { id: 'DT-007', type: 'Dump Truck', area: 'Hauling Road B', status: 'Aktif',    utilization: 85, cycleTime: '36 min', engineHour: 7.2 },
  { id: 'DT-008', type: 'Dump Truck', area: 'Hauling Road A', status: 'Aktif',    utilization: 88, cycleTime: '34 min', engineHour: 7.5 },
  { id: 'DT-009', type: 'Dump Truck', area: 'Hauling Road B', status: 'Idle',     utilization: 41, cycleTime: '—',     engineHour: 3.2 },
  { id: 'DT-010', type: 'Dump Truck', area: 'Hauling Road A', status: 'Aktif',    utilization: 92, cycleTime: '32 min', engineHour: 7.8 },
  { id: 'DT-011', type: 'Dump Truck', area: 'Hauling Road B', status: 'Aktif',    utilization: 78, cycleTime: '39 min', engineHour: 6.6 },
  { id: 'DT-012', type: 'Dump Truck', area: 'Hauling Road A', status: 'Aktif',    utilization: 83, cycleTime: '36 min', engineHour: 7.1 },
  { id: 'DT-013', type: 'Dump Truck', area: 'Hauling Road B', status: 'Breakdown', utilization: 0, cycleTime: '—',     engineHour: 0.8 },
  { id: 'DT-014', type: 'Dump Truck', area: 'Pit North',      status: 'Aktif',    utilization: 86, cycleTime: '35 min', engineHour: 7.3 },
  { id: 'DT-015', type: 'Dump Truck', area: 'Pit South',      status: 'Idle',     utilization: 35, cycleTime: '—',     engineHour: 2.5 },
  { id: 'DT-016', type: 'Dump Truck', area: 'Hauling Road A', status: 'Aktif',    utilization: 89, cycleTime: '33 min', engineHour: 7.6 },
  { id: 'DT-017', type: 'Dump Truck', area: 'Hauling Road B', status: 'Aktif',    utilization: 81, cycleTime: '38 min', engineHour: 6.9 },
  { id: 'DT-018', type: 'Dump Truck', area: 'Hauling Road A', status: 'Aktif',    utilization: 94, cycleTime: '31 min', engineHour: 8.0 },
  { id: 'DT-019', type: 'Dump Truck', area: 'Pit North',      status: 'Idle',     utilization: 44, cycleTime: '—',     engineHour: 3.6 },
  { id: 'DT-020', type: 'Dump Truck', area: 'Hauling Road B', status: 'Aktif',    utilization: 87, cycleTime: '35 min', engineHour: 7.4 },

  // Dozers
  { id: 'DZ-001', type: 'Dozer', area: 'Pit North',      status: 'Aktif',    utilization: 80, cycleTime: '—', engineHour: 6.8 },
  { id: 'DZ-002', type: 'Dozer', area: 'Pit South',      status: 'Aktif',    utilization: 76, cycleTime: '—', engineHour: 6.4 },
  { id: 'DZ-003', type: 'Dozer', area: 'Hauling Road A', status: 'Idle',     utilization: 40, cycleTime: '—', engineHour: 3.0 },
  { id: 'DZ-004', type: 'Dozer', area: 'Pit South',      status: 'Breakdown', utilization: 0, cycleTime: '—', engineHour: 0.6 },
  { id: 'DZ-005', type: 'Dozer', area: 'Pit North',      status: 'Aktif',    utilization: 82, cycleTime: '—', engineHour: 7.0 },
];

// ─── Production Trend (7 days) ───────────────────────────────────────────────
export const productionTrend = [
  { date: '08 Jun', actual: 142000, target: 150000 },
  { date: '09 Jun', actual: 158000, target: 150000 },
  { date: '10 Jun', actual: 135000, target: 150000 },
  { date: '11 Jun', actual: 163000, target: 150000 },
  { date: '12 Jun', actual: 149000, target: 150000 },
  { date: '13 Jun', actual: 155000, target: 150000 },
  { date: '14 Jun', actual: 147000, target: 150000 },
];

// ─── Utilization by Unit Type ────────────────────────────────────────────────
export const utilizationByType = [
  { area: 'Pit North',      excavator: 87, dumpTruck: 89, dozer: 81 },
  { area: 'Pit South',      excavator: 74, dumpTruck: 78, dozer: 76 },
  { area: 'Hauling Road A', excavator: 0,  dumpTruck: 88, dozer: 40 },
  { area: 'Hauling Road B', excavator: 0,  dumpTruck: 80, dozer: 0  },
];

// ─── Dashboard KPIs ──────────────────────────────────────────────────────────
export const dashboardKPIs = {
  productionAchievement: 98.0,
  bcmProduced: 147000,
  fleetUtilization: 82.4,
  idleTime: 12.6,
  fuelPerBCM: 0.48,
};

// ─── Active Alerts (Dashboard) ───────────────────────────────────────────────
export const dashboardAlerts = [
  { id: 1, type: 'Breakdown',   unit: 'EX-005', message: 'Engine temperature overheat – mesin mati',          severity: 'Critical', time: '06:14' },
  { id: 2, type: 'Breakdown',   unit: 'DT-006', message: 'Hydraulic failure – unit tidak dapat bergerak',     severity: 'Critical', time: '07:02' },
  { id: 3, type: 'Unsafe Act',  unit: 'DT-013', message: 'Overspeed 72 km/h di zona 40 km/h',                severity: 'Warning',  time: '07:45' },
  { id: 4, type: 'Idle Berlebih', unit: 'DT-003', message: 'Idle > 45 menit tanpa aktivitas produksi',       severity: 'Warning',  time: '08:10' },
  { id: 5, type: 'Idle Berlebih', unit: 'EX-003', message: 'Idle > 52 menit – koordinasi dengan foreman',    severity: 'Warning',  time: '08:33' },
  { id: 6, type: 'Unsafe Act',  unit: 'EX-007', message: 'Operator memasuki exclusion zone tanpa izin',      severity: 'Warning',  time: '09:00' },
  { id: 7, type: 'Breakdown',   unit: 'DZ-004', message: 'Track putus – unit perlu evakuasi',                severity: 'Critical', time: '09:15' },
  { id: 8, type: 'Idle Berlebih', unit: 'DT-015', message: 'Idle > 38 menit – pengecekan operator',         severity: 'Info',     time: '09:40' },
];

// ─── Fleet Map (per area) ────────────────────────────────────────────────────
export const fleetMap = [
  {
    area: 'Pit North',
    units: [
      { id: 'EX-001', type: 'EX', status: 'Aktif' },
      { id: 'EX-002', type: 'EX', status: 'Aktif' },
      { id: 'EX-005', type: 'EX', status: 'Breakdown' },
      { id: 'EX-007', type: 'EX', status: 'Idle' },
      { id: 'EX-009', type: 'EX', status: 'Aktif' },
      { id: 'DT-014', type: 'DT', status: 'Aktif' },
      { id: 'DT-019', type: 'DT', status: 'Idle' },
      { id: 'DZ-001', type: 'DZ', status: 'Aktif' },
      { id: 'DZ-005', type: 'DZ', status: 'Aktif' },
    ],
  },
  {
    area: 'Pit South',
    units: [
      { id: 'EX-003', type: 'EX', status: 'Idle' },
      { id: 'EX-004', type: 'EX', status: 'Aktif' },
      { id: 'EX-006', type: 'EX', status: 'Aktif' },
      { id: 'EX-008', type: 'EX', status: 'Aktif' },
      { id: 'EX-010', type: 'EX', status: 'Breakdown' },
      { id: 'DT-015', type: 'DT', status: 'Idle' },
      { id: 'DZ-002', type: 'DZ', status: 'Aktif' },
      { id: 'DZ-004', type: 'DZ', status: 'Breakdown' },
    ],
  },
  {
    area: 'Hauling Road A',
    units: [
      { id: 'DT-001', type: 'DT', status: 'Aktif' },
      { id: 'DT-002', type: 'DT', status: 'Aktif' },
      { id: 'DT-004', type: 'DT', status: 'Aktif' },
      { id: 'DT-006', type: 'DT', status: 'Breakdown' },
      { id: 'DT-008', type: 'DT', status: 'Aktif' },
      { id: 'DT-010', type: 'DT', status: 'Aktif' },
      { id: 'DT-012', type: 'DT', status: 'Aktif' },
      { id: 'DT-016', type: 'DT', status: 'Aktif' },
      { id: 'DT-018', type: 'DT', status: 'Aktif' },
      { id: 'DZ-003', type: 'DZ', status: 'Idle' },
    ],
  },
  {
    area: 'Hauling Road B',
    units: [
      { id: 'DT-003', type: 'DT', status: 'Idle' },
      { id: 'DT-005', type: 'DT', status: 'Aktif' },
      { id: 'DT-007', type: 'DT', status: 'Aktif' },
      { id: 'DT-009', type: 'DT', status: 'Idle' },
      { id: 'DT-011', type: 'DT', status: 'Aktif' },
      { id: 'DT-013', type: 'DT', status: 'Breakdown' },
      { id: 'DT-017', type: 'DT', status: 'Aktif' },
      { id: 'DT-020', type: 'DT', status: 'Aktif' },
    ],
  },
];

// ─── Fuel Data ───────────────────────────────────────────────────────────────
export const fuelData = [
  { unitId: 'EX-001', activity: 'Loading',  konsumsi: 185, fuelPerBCM: 0.42, status: 'Normal' },
  { unitId: 'EX-002', activity: 'Loading',  konsumsi: 178, fuelPerBCM: 0.40, status: 'Normal' },
  { unitId: 'EX-003', activity: 'Idle',     konsumsi: 95,  fuelPerBCM: 0.82, status: 'Boros'  },
  { unitId: 'EX-004', activity: 'Loading',  konsumsi: 172, fuelPerBCM: 0.44, status: 'Normal' },
  { unitId: 'EX-006', activity: 'Loading',  konsumsi: 181, fuelPerBCM: 0.46, status: 'Normal' },
  { unitId: 'EX-007', activity: 'Idle',     konsumsi: 88,  fuelPerBCM: 0.77, status: 'Boros'  },
  { unitId: 'EX-008', activity: 'Loading',  konsumsi: 176, fuelPerBCM: 0.43, status: 'Normal' },
  { unitId: 'EX-009', activity: 'Loading',  konsumsi: 169, fuelPerBCM: 0.39, status: 'Normal' },
  { unitId: 'DT-001', activity: 'Hauling',  konsumsi: 210, fuelPerBCM: 0.48, status: 'Normal' },
  { unitId: 'DT-002', activity: 'Hauling',  konsumsi: 225, fuelPerBCM: 0.51, status: 'Boros'  },
  { unitId: 'DT-003', activity: 'Idle',     konsumsi: 102, fuelPerBCM: 0.89, status: 'Boros'  },
  { unitId: 'DT-004', activity: 'Hauling',  konsumsi: 198, fuelPerBCM: 0.45, status: 'Normal' },
  { unitId: 'DT-005', activity: 'Hauling',  konsumsi: 215, fuelPerBCM: 0.49, status: 'Normal' },
  { unitId: 'DT-007', activity: 'Hauling',  konsumsi: 205, fuelPerBCM: 0.47, status: 'Normal' },
  { unitId: 'DT-008', activity: 'Dumping',  konsumsi: 195, fuelPerBCM: 0.44, status: 'Normal' },
  { unitId: 'DT-009', activity: 'Idle',     konsumsi: 98,  fuelPerBCM: 0.85, status: 'Boros'  },
  { unitId: 'DT-010', activity: 'Hauling',  konsumsi: 189, fuelPerBCM: 0.43, status: 'Normal' },
  { unitId: 'DT-011', activity: 'Hauling',  konsumsi: 218, fuelPerBCM: 0.50, status: 'Boros'  },
  { unitId: 'DT-012', activity: 'Dumping',  konsumsi: 200, fuelPerBCM: 0.46, status: 'Normal' },
  { unitId: 'DT-013', activity: 'Idle',     konsumsi: 0,   fuelPerBCM: 0.00, status: 'Normal' },
  { unitId: 'DT-014', activity: 'Hauling',  konsumsi: 208, fuelPerBCM: 0.47, status: 'Normal' },
  { unitId: 'DT-016', activity: 'Hauling',  konsumsi: 202, fuelPerBCM: 0.46, status: 'Normal' },
  { unitId: 'DT-017', activity: 'Hauling',  konsumsi: 220, fuelPerBCM: 0.50, status: 'Boros'  },
  { unitId: 'DT-018', activity: 'Hauling',  konsumsi: 185, fuelPerBCM: 0.42, status: 'Normal' },
  { unitId: 'DT-020', activity: 'Dumping',  konsumsi: 196, fuelPerBCM: 0.45, status: 'Normal' },
  { unitId: 'DZ-001', activity: 'Dozing',   konsumsi: 155, fuelPerBCM: 0.53, status: 'Boros'  },
  { unitId: 'DZ-002', activity: 'Dozing',   konsumsi: 148, fuelPerBCM: 0.51, status: 'Boros'  },
  { unitId: 'DZ-003', activity: 'Idle',     konsumsi: 72,  fuelPerBCM: 0.78, status: 'Boros'  },
  { unitId: 'DZ-005', activity: 'Dozing',   konsumsi: 150, fuelPerBCM: 0.52, status: 'Boros'  },
];

// ─── Fuel Trend (7 days) ─────────────────────────────────────────────────────
export const fuelTrend = [
  { date: '08 Jun', total: 4820, target: 4500 },
  { date: '09 Jun', total: 4650, target: 4500 },
  { date: '10 Jun', total: 5100, target: 4500 },
  { date: '11 Jun', total: 4720, target: 4500 },
  { date: '12 Jun', total: 4590, target: 4500 },
  { date: '13 Jun', total: 4880, target: 4500 },
  { date: '14 Jun', total: 4734, target: 4500 },
];

// ─── Top 10 Paling Boros ─────────────────────────────────────────────────────
export const topBorosUnits = [
  { unitId: 'DT-003', fuelPerBCM: 0.89 },
  { unitId: 'DT-009', fuelPerBCM: 0.85 },
  { unitId: 'EX-003', fuelPerBCM: 0.82 },
  { unitId: 'DZ-003', fuelPerBCM: 0.78 },
  { unitId: 'EX-007', fuelPerBCM: 0.77 },
  { unitId: 'DT-011', fuelPerBCM: 0.50 },
  { unitId: 'DT-002', fuelPerBCM: 0.51 },
  { unitId: 'DT-017', fuelPerBCM: 0.50 },
  { unitId: 'DZ-002', fuelPerBCM: 0.51 },
  { unitId: 'DZ-001', fuelPerBCM: 0.53 },
];

// ─── Operators ───────────────────────────────────────────────────────────────
export const operators = [
  {
    id: 1, name: 'Budi Santoso',   shift: 'Shift 1', unit: 'EX-001',
    productivityScore: 92, fuelEfficiencyScore: 88, safetyScore: 95, overallScore: 91.7,
    violations: [],
  },
  {
    id: 2, name: 'Agus Prasetyo',  shift: 'Shift 1', unit: 'DT-001',
    productivityScore: 85, fuelEfficiencyScore: 80, safetyScore: 90, overallScore: 85.0,
    violations: [{ type: 'Harsh Braking', time: '08:22', location: 'Hauling Road A' }],
  },
  {
    id: 3, name: 'Eko Wahyudi',    shift: 'Shift 1', unit: 'EX-009',
    productivityScore: 94, fuelEfficiencyScore: 91, safetyScore: 97, overallScore: 94.0,
    violations: [],
  },
  {
    id: 4, name: 'Dedi Firmansyah',shift: 'Shift 1', unit: 'DT-010',
    productivityScore: 88, fuelEfficiencyScore: 85, safetyScore: 88, overallScore: 87.0,
    violations: [],
  },
  {
    id: 5, name: 'Rudi Hermawan',  shift: 'Shift 1', unit: 'DT-013',
    productivityScore: 55, fuelEfficiencyScore: 60, safetyScore: 45, overallScore: 53.3,
    violations: [
      { type: 'Overspeed', time: '07:45', location: 'Hauling Road B' },
      { type: 'Overspeed', time: '06:30', location: 'Hauling Road A' },
    ],
  },
  {
    id: 6, name: 'Hendra Gunawan', shift: 'Shift 1', unit: 'EX-007',
    productivityScore: 62, fuelEfficiencyScore: 58, safetyScore: 50, overallScore: 56.7,
    violations: [{ type: 'Unsafe Act', time: '09:00', location: 'Pit North' }],
  },
  {
    id: 7, name: 'Sandi Wijaya',   shift: 'Shift 2', unit: 'DT-004',
    productivityScore: 90, fuelEfficiencyScore: 87, safetyScore: 93, overallScore: 90.0,
    violations: [],
  },
  {
    id: 8, name: 'Toni Kusuma',    shift: 'Shift 2', unit: 'EX-004',
    productivityScore: 83, fuelEfficiencyScore: 79, safetyScore: 85, overallScore: 82.3,
    violations: [],
  },
  {
    id: 9, name: 'Wahyu Setiawan', shift: 'Shift 2', unit: 'DT-018',
    productivityScore: 96, fuelEfficiencyScore: 93, safetyScore: 98, overallScore: 95.7,
    violations: [],
  },
  {
    id: 10, name: 'Feri Nugraha',  shift: 'Shift 2', unit: 'DT-008',
    productivityScore: 78, fuelEfficiencyScore: 75, safetyScore: 80, overallScore: 77.7,
    violations: [{ type: 'Harsh Braking', time: '14:10', location: 'Pit North' }],
  },
  {
    id: 11, name: 'Yudha Pratama', shift: 'Shift 2', unit: 'EX-006',
    productivityScore: 71, fuelEfficiencyScore: 68, safetyScore: 74, overallScore: 71.0,
    violations: [],
  },
  {
    id: 12, name: 'Irwan Susanto', shift: 'Shift 3', unit: 'DT-003',
    productivityScore: 48, fuelEfficiencyScore: 45, safetyScore: 52, overallScore: 48.3,
    violations: [
      { type: 'Overspeed', time: '22:15', location: 'Hauling Road B' },
      { type: 'Harsh Braking', time: '23:40', location: 'Hauling Road A' },
    ],
  },
  {
    id: 13, name: 'Bayu Kurniawan',shift: 'Shift 3', unit: 'EX-002',
    productivityScore: 89, fuelEfficiencyScore: 86, safetyScore: 91, overallScore: 88.7,
    violations: [],
  },
  {
    id: 14, name: 'Andi Saputra',  shift: 'Shift 3', unit: 'DT-016',
    productivityScore: 84, fuelEfficiencyScore: 81, safetyScore: 87, overallScore: 84.0,
    violations: [],
  },
  {
    id: 15, name: 'Rizki Fadillah',shift: 'Shift 3', unit: 'DT-020',
    productivityScore: 77, fuelEfficiencyScore: 74, safetyScore: 79, overallScore: 76.7,
    violations: [],
  },
];

// ─── Safety Alerts ────────────────────────────────────────────────────────────
export const safetyAlerts = [
  { id: 1,  category: 'Fatigue Detection', unit: 'DT-003', operator: 'Irwan Susanto',   time: '02:14', location: 'Hauling Road B', risk: 'Critical', status: 'Open'        },
  { id: 2,  category: 'Unsafe Act',        unit: 'DT-013', operator: 'Rudi Hermawan',   time: '07:45', location: 'Hauling Road B', risk: 'High',     status: 'In Progress' },
  { id: 3,  category: 'Unsafe Act',        unit: 'EX-007', operator: 'Hendra Gunawan',  time: '09:00', location: 'Pit North',      risk: 'High',     status: 'Open'        },
  { id: 4,  category: 'Breakdown Risk',    unit: 'EX-005', operator: '—',               time: '06:14', location: 'Pit North',      risk: 'Critical', status: 'In Progress' },
  { id: 5,  category: 'Breakdown Risk',    unit: 'DT-006', operator: '—',               time: '07:02', location: 'Hauling Road A', risk: 'Critical', status: 'Open'        },
  { id: 6,  category: 'Near Miss',         unit: 'DT-009', operator: 'Unknown',         time: '08:55', location: 'Pit South',      risk: 'High',     status: 'Open'        },
  { id: 7,  category: 'Fatigue Detection', unit: 'DT-015', operator: 'Unknown',         time: '03:30', location: 'Pit South',      risk: 'Medium',   status: 'Resolved'    },
  { id: 8,  category: 'Breakdown Risk',    unit: 'DZ-004', operator: '—',               time: '09:15', location: 'Pit South',      risk: 'Critical', status: 'Open'        },
  { id: 9,  category: 'Near Miss',         unit: 'EX-003', operator: 'Unknown',         time: '10:05', location: 'Pit South',      risk: 'Medium',   status: 'Open'        },
  { id: 10, category: 'Unsafe Act',        unit: 'DT-011', operator: 'Unknown',         time: '11:20', location: 'Hauling Road B', risk: 'Medium',   status: 'In Progress' },
];

// ─── Safety Incident Trend (30 days) ─────────────────────────────────────────
export const safetyTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date('2026-05-15');
  d.setDate(d.getDate() + i);
  const label = `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })}`;
  return {
    date: label,
    fatigue: Math.floor(Math.random() * 4),
    unsafeAct: Math.floor(Math.random() * 5),
    nearMiss: Math.floor(Math.random() * 3),
    breakdown: Math.floor(Math.random() * 4),
  };
});

// ─── Top 5 Risk Areas ────────────────────────────────────────────────────────
export const riskAreas = [
  { area: 'Hauling Road B', incidents: 12, risk: 'Critical', trend: 'Naik' },
  { area: 'Pit North',      incidents: 9,  risk: 'High',     trend: 'Stabil' },
  { area: 'Hauling Road A', incidents: 7,  risk: 'High',     trend: 'Turun' },
  { area: 'Pit South',      incidents: 6,  risk: 'Medium',   trend: 'Naik' },
  { area: 'Workshop Area',  incidents: 3,  risk: 'Medium',   trend: 'Stabil' },
];
