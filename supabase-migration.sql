-- =============================================================================
-- PAMA Smart Mining Platform - Database Migration
-- PT Pamapersada Nusantara | Remote Operation Center
-- Run this in Supabase SQL Editor
-- =============================================================================

-- ─── MINING UNITS (Heavy Equipment Fleet) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS mining_units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id VARCHAR(20) NOT NULL UNIQUE,
  unit_type VARCHAR(50) NOT NULL,
  make_model VARCHAR(100),
  area VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  utilization DECIMAL(5,2) DEFAULT 0,
  engine_hours DECIMAL(10,2) DEFAULT 0,
  last_maintenance_date DATE,
  next_maintenance_hours DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── PRODUCTION LOGS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS production_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES mining_units(id),
  log_date DATE NOT NULL,
  shift INTEGER NOT NULL,
  bcm_produced DECIMAL(10,2) DEFAULT 0,
  cycle_time_minutes DECIMAL(6,2),
  idle_time_minutes DECIMAL(6,2) DEFAULT 0,
  material_type VARCHAR(30) DEFAULT 'overburden',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── FUEL LOGS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fuel_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES mining_units(id),
  log_date DATE NOT NULL,
  shift INTEGER DEFAULT 1,
  activity VARCHAR(50) NOT NULL,
  fuel_consumed DECIMAL(8,2) NOT NULL,
  bcm_activity DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── OPERATORS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS operators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  shift INTEGER NOT NULL,
  unit_id UUID REFERENCES mining_units(id),
  position VARCHAR(50) DEFAULT 'Operator',
  productivity_score INTEGER DEFAULT 0,
  fuel_efficiency_score INTEGER DEFAULT 0,
  safety_score INTEGER DEFAULT 0,
  violation_count INTEGER DEFAULT 0,
  certification VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─── SAFETY ALERTS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS safety_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES mining_units(id),
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  location VARCHAR(100),
  description TEXT,
  status VARCHAR(20) DEFAULT 'open',
  reported_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- SEED DATA - Realistic Mining Operation
-- Site: Balikpapan Coal Mine | Target: 120,000 BCM/day | 3 Shifts
-- =============================================================================

-- ─── MINING UNITS ────────────────────────────────────────────────────────────
INSERT INTO mining_units (unit_id, unit_type, make_model, area, status, utilization, engine_hours, last_maintenance_date, next_maintenance_hours) VALUES
-- Excavators (Backhoe)
('EX-001', 'excavator', 'Komatsu PC2000-8',  'Pit 1A',    'active',    88.5, 4520.3, '2026-05-20', 5000),
('EX-002', 'excavator', 'Hitachi EX2500-6',  'Pit 1B',    'active',    91.2, 3891.0, '2026-05-28', 4500),
('EX-003', 'excavator', 'Komatsu PC2000-8',  'Pit 2A',    'idle',      62.1, 5102.7, '2026-04-15', 5500),
('EX-004', 'excavator', 'Komatsu PC3000-6',  'Pit 2B',    'active',    86.7, 6240.1, '2026-06-01', 7000),
('EX-005', 'excavator', 'Hitachi EX3600-6',  'Pit 3A',    'breakdown', 0.0,  7800.5, '2026-03-10', 8000),
('EX-006', 'excavator', 'Komatsu PC2000-8',  'Pit 3B',    'active',    79.4, 3950.8, '2026-05-22', 4500),

-- Dump Trucks
('DT-001', 'dump_truck', 'Komatsu HD785-7',    'Hauling Road A', 'active',    90.1, 15420.5, '2026-05-18', 16000),
('DT-002', 'dump_truck', 'Komatsu HD785-7',    'Hauling Road A', 'active',    87.6, 14230.0, '2026-06-02', 15000),
('DT-003', 'dump_truck', 'Caterpillar 777E',   'Hauling Road B', 'idle',      55.2, 13100.8, '2026-04-20', 14000),
('DT-004', 'dump_truck', 'Komatsu HD1500-7',   'Hauling Road B', 'active',    92.8, 18250.3, '2026-05-25', 19000),
('DT-005', 'dump_truck', 'Komatsu HD785-7',    'Hauling Road A', 'breakdown', 0.0,  16800.7, '2026-04-05', 17000),
('DT-006', 'dump_truck', 'Caterpillar 785D',   'Hauling Road B', 'active',    85.3, 12500.5, '2026-05-30', 13500),
('DT-007', 'dump_truck', 'Komatsu HD785-7',    'Pit 1A',        'active',    88.9, 14100.2, '2026-06-05', 14800),
('DT-008', 'dump_truck', 'Komatsu HD1500-7',   'Pit 1B',        'active',    93.4, 19100.6, '2026-05-15', 20000),
('DT-009', 'dump_truck', 'Caterpillar 777E',   'Pit 2A',        'idle',      48.3, 11900.4, '2026-03-28', 12500),
('DT-010', 'dump_truck', 'Komatsu HD785-7',    'Pit 2B',        'active',    84.1, 13500.9, '2026-06-03', 14200),
('DT-011', 'dump_truck', 'Volvo A40F',         'Pit 3A',        'active',    81.7, 10800.3, '2026-05-10', 11500),
('DT-012', 'dump_truck', 'Komatsu HD1500-7',   'Pit 3B',        'active',    90.5, 17650.8, '2026-05-28', 18500),
('DT-013', 'dump_truck', 'Caterpillar 777E',   'Hauling Road A', 'idle',    60.8, 12800.5, '2026-04-12', 13500),
('DT-014', 'dump_truck', 'Komatsu HD785-7',    'Hauling Road B', 'active',   89.2, 14650.1, '2026-06-01', 15200),
('DT-015', 'dump_truck', 'Komatsu HD785-7',    'Pit 2A',        'breakdown', 0.0,  15500.4, '2026-03-22', 16000),

-- Dozers
('DOZ-001', 'dozer', 'Komatsu D375A-6',   'Pit 1A Disposal',  'active',    82.3, 6200.8,  '2026-05-15', 6800),
('DOZ-002', 'dozer', 'Komatsu D475A-5',   'Pit 2 Disposal',   'active',    78.9, 7500.3,  '2026-06-04', 8000),
('DOZ-003', 'dozer', 'Caterpillar D9T',   'Pit 3 Disposal',   'idle',      55.4, 5800.6,  '2026-04-18', 6200),
('DOZ-004', 'dozer', 'Komatsu D155A-6',   'Pit 1B',           'active',    85.1, 4100.2,  '2026-05-30', 4600),
('DOZ-005', 'dozer', 'Komatsu D375A-6',   'Stockpile A',      'breakdown', 0.0,  8900.5,  '2026-03-05', 9200),

-- Graders & Drills
('GR-001', 'grader', 'Caterpillar 16M',   'Hauling Road A', 'active',    72.5, 4800.3, '2026-05-20', 5200),
('GR-002', 'grader', 'Komatsu GD825A-2',  'Hauling Road B', 'active',    68.9, 3900.7, '2026-06-02', 4300),
('DR-001', 'drill',  'Sandvik DR412i',    'Pit 1A',         'active',    76.4, 3200.8, '2026-05-25', 3700),
('DR-002', 'drill',  'Atlas Copco DML',   'Pit 3A',         'idle',      42.1, 5100.2, '2026-04-10', 5500);

-- ─── PRODUCTION LOGS (Last 7 Days) ──────────────────────────────────────────
-- Shift 1: 06:00-14:00 | Shift 2: 14:00-22:00 | Shift 3: 22:00-06:00

-- Day 1: 2026-06-10
INSERT INTO production_logs (unit_id, log_date, shift, bcm_produced, cycle_time_minutes, idle_time_minutes, material_type)
SELECT id, '2026-06-10'::date, 1, 2850, 3.2, 45, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-10'::date, 2, 3100, 2.9, 30, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-10'::date, 1, 2600, 3.5, 55, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-10'::date, 1, 3200, 2.8, 25, 'overburden' FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-10'::date, 2, 2900, 3.0, 40, 'overburden' FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-10'::date, 1, 1800, 4.2, 80, 'overburden' FROM mining_units WHERE unit_id = 'EX-006';

-- Day 2: 2026-06-11
INSERT INTO production_logs (unit_id, log_date, shift, bcm_produced, cycle_time_minutes, idle_time_minutes, material_type)
SELECT id, '2026-06-11'::date, 1, 3050, 3.0, 35, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-11'::date, 1, 2750, 3.3, 48, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-11'::date, 2, 2950, 3.1, 32, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-11'::date, 1, 3350, 2.7, 20, 'overburden' FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-11'::date, 1, 1900, 4.0, 70, 'overburden' FROM mining_units WHERE unit_id = 'EX-006' UNION ALL
SELECT id, '2026-06-11'::date, 2, 2100, 3.8, 55, 'overburden' FROM mining_units WHERE unit_id = 'EX-006';

-- Day 3: 2026-06-12
INSERT INTO production_logs (unit_id, log_date, shift, bcm_produced, cycle_time_minutes, idle_time_minutes, material_type)
SELECT id, '2026-06-12'::date, 1, 2900, 3.1, 40, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-12'::date, 2, 3150, 2.8, 28, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-12'::date, 1, 2550, 3.6, 60, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-12'::date, 1, 3100, 2.9, 30, 'overburden' FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-12'::date, 2, 2850, 3.2, 42, 'overburden' FROM mining_units WHERE unit_id = 'EX-004';

-- Day 4: 2026-06-13
INSERT INTO production_logs (unit_id, log_date, shift, bcm_produced, cycle_time_minutes, idle_time_minutes, material_type)
SELECT id, '2026-06-13'::date, 1, 3200, 2.8, 22, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-13'::date, 2, 3000, 3.0, 35, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-13'::date, 1, 2700, 3.4, 50, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-13'::date, 1, 3300, 2.6, 18, 'overburden' FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-13'::date, 2, 3050, 2.9, 28, 'overburden' FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-13'::date, 1, 2000, 3.9, 65, 'overburden' FROM mining_units WHERE unit_id = 'EX-006';

-- Day 5: 2026-06-14
INSERT INTO production_logs (unit_id, log_date, shift, bcm_produced, cycle_time_minutes, idle_time_minutes, material_type)
SELECT id, '2026-06-14'::date, 1, 2950, 3.1, 38, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-14'::date, 2, 3250, 2.7, 20, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-14'::date, 1, 2650, 3.3, 52, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-14'::date, 1, 3400, 2.5, 15, 'overburden' FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-14'::date, 1, 1850, 4.1, 75, 'overburden' FROM mining_units WHERE unit_id = 'EX-006';

-- Day 6: 2026-06-15
INSERT INTO production_logs (unit_id, log_date, shift, bcm_produced, cycle_time_minutes, idle_time_minutes, material_type)
SELECT id, '2026-06-15'::date, 1, 3080, 2.9, 30, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-15'::date, 1, 2800, 3.2, 45, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-15'::date, 2, 2900, 3.0, 38, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-15'::date, 1, 3450, 2.4, 12, 'overburden' FROM mining_units WHERE unit_id = 'EX-004';

-- Today: 2026-06-16 (Shift 1 sedang berjalan)
INSERT INTO production_logs (unit_id, log_date, shift, bcm_produced, cycle_time_minutes, idle_time_minutes, material_type)
SELECT id, '2026-06-16'::date, 1, 980, 3.2, 42, 'overburden' FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-16'::date, 1, 750, 3.5, 58, 'coal' FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-16'::date, 1, 1120, 2.8, 28, 'overburden' FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-16'::date, 1, 520, 4.3, 80, 'overburden' FROM mining_units WHERE unit_id = 'EX-006';

-- ─── FUEL LOGS (Today) ──────────────────────────────────────────────────────
INSERT INTO fuel_logs (unit_id, log_date, shift, activity, fuel_consumed, bcm_activity)
SELECT id, '2026-06-16'::date, 1, 'loading',  285, 980  FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'loading',  245, 750  FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'idle',     95,  NULL FROM mining_units WHERE unit_id = 'EX-003' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'loading',  320, 1120 FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'loading',  195, 520  FROM mining_units WHERE unit_id = 'EX-006' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  380, 980  FROM mining_units WHERE unit_id = 'DT-001' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  355, 920  FROM mining_units WHERE unit_id = 'DT-002' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  410, 1120 FROM mining_units WHERE unit_id = 'DT-004' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  340, 880  FROM mining_units WHERE unit_id = 'DT-006' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  370, 950  FROM mining_units WHERE unit_id = 'DT-007' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  425, 1120 FROM mining_units WHERE unit_id = 'DT-008' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'idle',     88,  NULL FROM mining_units WHERE unit_id = 'DT-009' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  325, 840  FROM mining_units WHERE unit_id = 'DT-010' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  310, 810  FROM mining_units WHERE unit_id = 'DT-011' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  415, 1080 FROM mining_units WHERE unit_id = 'DT-012' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'idle',     75,  NULL FROM mining_units WHERE unit_id = 'DT-013' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'hauling',  360, 930  FROM mining_units WHERE unit_id = 'DT-014' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'dozing',   260, 580  FROM mining_units WHERE unit_id = 'DOZ-001' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'dozing',   285, 650  FROM mining_units WHERE unit_id = 'DOZ-002' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'idle',     65,  NULL FROM mining_units WHERE unit_id = 'DOZ-003' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'dozing',   245, 490  FROM mining_units WHERE unit_id = 'DOZ-004' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'grading',  175, NULL  FROM mining_units WHERE unit_id = 'GR-001' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'grading',  160, NULL  FROM mining_units WHERE unit_id = 'GR-002' UNION ALL
SELECT id, '2026-06-16'::date, 1, 'drilling', 210, NULL  FROM mining_units WHERE unit_id = 'DR-001';

-- ─── OPERATORS ───────────────────────────────────────────────────────────────
INSERT INTO operators (employee_id, name, shift, unit_id, position, productivity_score, fuel_efficiency_score, safety_score, violation_count, certification)
SELECT 'PAMA-0142', 'Budi Santoso',      1, id, 'Sr. Operator',   92, 88, 95, 0, 'POP, SIO Excavator'   FROM mining_units WHERE unit_id = 'EX-001' UNION ALL
SELECT 'PAMA-0287', 'Agus Prasetyo',     1, id, 'Operator',       85, 80, 90, 1, 'POP, SIO Dump Truck'  FROM mining_units WHERE unit_id = 'DT-001' UNION ALL
SELECT 'PAMA-0034', 'Eko Wahyudi',       1, id, 'Sr. Operator',   94, 91, 97, 0, 'POP, POM, SIO'        FROM mining_units WHERE unit_id = 'EX-004' UNION ALL
SELECT 'PAMA-0512', 'Dedi Firmansyah',   1, id, 'Operator',       88, 85, 88, 0, 'POP, SIO Dump Truck'  FROM mining_units WHERE unit_id = 'DT-004' UNION ALL
SELECT 'PAMA-0198', 'Rudi Hermawan',     1, id, 'Operator',       55, 60, 45, 3, 'POP (Expired)'        FROM mining_units WHERE unit_id = 'DT-007' UNION ALL
SELECT 'PAMA-0376', 'Hendra Gunawan',    1, id, 'Jr. Operator',   62, 58, 50, 2, 'POP, SIO Excavator'   FROM mining_units WHERE unit_id = 'EX-006' UNION ALL
SELECT 'PAMA-0224', 'Sandi Wijaya',      2, id, 'Sr. Operator',   90, 87, 93, 0, 'POP, POM, SIO Dozer'   FROM mining_units WHERE unit_id = 'DOZ-001' UNION ALL
SELECT 'PAMA-0455', 'Toni Kusuma',       2, id, 'Operator',       83, 79, 85, 0, 'POP, SIO Excavator'   FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT 'PAMA-0067', 'Wahyu Setiawan',    2, id, 'Sr. Operator',   96, 93, 98, 0, 'POP, POM, SIO'        FROM mining_units WHERE unit_id = 'DT-008' UNION ALL
SELECT 'PAMA-0339', 'Feri Nugraha',      2, id, 'Operator',       78, 75, 80, 1, 'POP, SIO Dump Truck'  FROM mining_units WHERE unit_id = 'DT-006' UNION ALL
SELECT 'PAMA-0180', 'Yudha Pratama',     2, id, 'Jr. Operator',   71, 68, 74, 0, 'POP, SIO Dump Truck'  FROM mining_units WHERE unit_id = 'DT-010' UNION ALL
SELECT 'PAMA-0411', 'Irwan Susanto',     3, id, 'Operator',       48, 45, 52, 4, 'POP (Suspended)'      FROM mining_units WHERE unit_id = 'DT-003' UNION ALL
SELECT 'PAMA-0092', 'Bayu Kurniawan',    3, id, 'Sr. Operator',   89, 86, 91, 0, 'POP, POM, SIO'        FROM mining_units WHERE unit_id = 'DT-012' UNION ALL
SELECT 'PAMA-0265', 'Andi Saputra',      3, id, 'Operator',       84, 81, 87, 0, 'POP, SIO Dump Truck'  FROM mining_units WHERE unit_id = 'DT-014' UNION ALL
SELECT 'PAMA-0350', 'Rizki Fadillah',    3, id, 'Jr. Operator',   77, 74, 79, 0, 'POP, SIO Dozer'       FROM mining_units WHERE unit_id = 'DOZ-004';

-- ─── SAFETY ALERTS ───────────────────────────────────────────────────────────
INSERT INTO safety_alerts (unit_id, alert_type, severity, location, description, status, reported_by)
SELECT id, 'fatigue_detection', 'critical', 'Hauling Road B KM 3',   'Operator DT-003 terdeteksi microsleep 3x dalam 15 menit. Speed 65 km/h di zona 40 km/h.', 'open',     'Sistem Fatigue Detection' FROM mining_units WHERE unit_id = 'DT-003' UNION ALL
SELECT id, 'unsafe_act',        'high',     'Pit 2A Loading Point',  'Excavator EX-003 loading ke DT tanpa sinyal flagman. Near miss dengan LV.',               'open',     'Pengawas Shift 1'         FROM mining_units WHERE unit_id = 'EX-003' UNION ALL
SELECT id, 'breakdown_risk',    'critical', 'Pit 3A',                'EX-005 track frame retak 15 cm. Risiko track putus saat swing. Unit harus segera dievakuasi.', 'open', 'Mekanik Workshop'         FROM mining_units WHERE unit_id = 'EX-005' UNION ALL
SELECT id, 'breakdown_risk',    'critical', 'Hauling Road A KM 1',   'DT-005 engine overheating berulang. Temperatur 105°C melebihi batas 95°C. Mesin mati total.',  'open', 'Mekanik Lapangan'        FROM mining_units WHERE unit_id = 'DT-005' UNION ALL
SELECT id, 'near_miss',         'high',     'Pit 1B',                'Rockfall dari highwall 15m dekat area loading EX-002. Radius 5m dari unit.',                'open',     'Geotech Engineer'        FROM mining_units WHERE unit_id = 'EX-002' UNION ALL
SELECT id, 'unsafe_act',        'medium',   'Stockpile A',           'Operator DOZ-005 dozing terlalu dekat edge stockpile (1.5m). Risiko unit longsor.',         'open',     'Pengawas Shift 2'         FROM mining_units WHERE unit_id = 'DOZ-005' UNION ALL
SELECT id, 'fatigue_detection', 'high',     'Hauling Road B KM 5',   'DT-009 terdeteksi harsh braking 4x dalam 30 menit. Indikasi kelelahan operator.',          'open',     'Sistem Fatigue Detection' FROM mining_units WHERE unit_id = 'DT-009' UNION ALL
SELECT id, 'breakdown_risk',    'medium',   'Hauling Road A',        'GR-001 blade hydraulic leak minor. Potensi major failure jika tidak diperbaiki.',           'open',     'Mekanik Workshop'         FROM mining_units WHERE unit_id = 'GR-001' UNION ALL
SELECT id, 'near_miss',         'medium',   'Disposal Pit 1A',       'Light vehicle masuk blind spot DT-001 saat manuver mundur di disposal. Jarak 3m.',          'open',     'Pengawas Shift 1'         FROM mining_units WHERE unit_id = 'DT-001' UNION ALL
SELECT id, 'unsafe_act',        'high',     'Workshop Area',         'Pekerja tidak memakai full body harness saat bekerja di ketinggian 3m pada DT-015.',       'resolved', 'HSE Officer'              FROM mining_units WHERE unit_id = 'DT-015' UNION ALL
SELECT id, 'fatigue_detection', 'medium',   'Hauling Road A KM 2',   'DT-013 terdeteksi lane departure warning 2x. Operator mengantuk.',                          'resolved', 'Sistem Fatigue Detection' FROM mining_units WHERE unit_id = 'DT-013' UNION ALL
SELECT id, 'breakdown_risk',    'critical', 'Pit 1A Disposal',      'DOZ-001 final drive noise abnormal. Risiko final drive failure.',                          'resolved', 'Mekanik Lapangan'        FROM mining_units WHERE unit_id = 'DOZ-001';

-- =============================================================================
-- INDEXES & PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_production_logs_date ON production_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_production_logs_unit ON production_logs(unit_id);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_date ON fuel_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_unit ON fuel_logs(unit_id);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_status ON safety_alerts(status);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_severity ON safety_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_operators_shift ON operators(shift);
CREATE INDEX IF NOT EXISTS idx_operators_unit ON operators(unit_id);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
