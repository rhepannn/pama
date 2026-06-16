# PROMPT LANJUTAN — SEMUA PROJECT ASTRA GROUP
## Kondisi saat ini: Login + Sidebar sudah jalan
## Tinggal tambah halaman konten

> ⚠️ PENTING: Kirim prompt per halaman satu-satu ke AI.
> Jangan kirim semua sekaligus. Tunggu satu halaman selesai baru lanjut ke berikutnya.

---

# 1. AHM SMART FACTORY PLATFORM

---

## PROMPT AHM-1 — Setup Supabase & Database

> Project Next.js "AHM Smart Factory Platform" sudah berjalan dengan login dan sidebar.
> Sekarang tambahkan koneksi Supabase.
>
> **Langkah 1 — Install Supabase:**
> ```bash
> npm install @supabase/supabase-js
> ```
>
> **Langkah 2 — Buat file lib/supabase.ts:**
> ```typescript
> import { createClient } from '@supabase/supabase-js'
> export const supabase = createClient(
>   process.env.NEXT_PUBLIC_SUPABASE_URL!,
>   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
> )
> ```
>
> **Langkah 3 — Tambahkan di .env.local:**
> ```
> NEXT_PUBLIC_SUPABASE_URL=isi_dari_supabase_dashboard
> NEXT_PUBLIC_SUPABASE_ANON_KEY=isi_dari_supabase_dashboard
> ```
>
> **Langkah 4 — Jalankan SQL ini di Supabase SQL Editor:**
> ```sql
> CREATE TABLE machines (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   machine_id VARCHAR(20) NOT NULL,
>   name VARCHAR(100) NOT NULL,
>   line VARCHAR(50) NOT NULL,
>   target_energy_per_unit DECIMAL(5,3) NOT NULL DEFAULT 0.6,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE energy_logs (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   machine_id UUID REFERENCES machines(id),
>   log_date DATE NOT NULL,
>   kwh_consumed DECIMAL(10,2) NOT NULL,
>   units_produced INTEGER NOT NULL,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE quality_logs (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   machine_id UUID REFERENCES machines(id),
>   log_date DATE NOT NULL,
>   shift INTEGER NOT NULL CHECK (shift IN (1,2,3)),
>   operator_name VARCHAR(100),
>   units_produced INTEGER NOT NULL,
>   defect_count INTEGER NOT NULL DEFAULT 0,
>   defect_type VARCHAR(100),
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE alerts (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   machine_id UUID REFERENCES machines(id),
>   alert_type VARCHAR(50) NOT NULL,
>   severity VARCHAR(20) NOT NULL,
>   message TEXT NOT NULL,
>   status VARCHAR(20) DEFAULT 'open',
>   created_at TIMESTAMP DEFAULT NOW(),
>   resolved_at TIMESTAMP
> );
>
> INSERT INTO machines (machine_id, name, line, target_energy_per_unit) VALUES
> ('CNC-01', 'CNC Machine 01', 'Line A', 0.5),
> ('CNC-02', 'CNC Machine 02', 'Line A', 0.5),
> ('CAST-01', 'Casting Machine 01', 'Line B', 0.8),
> ('CAST-02', 'Casting Machine 02', 'Line B', 0.8),
> ('ASSY-01', 'Assembly Line 01', 'Line C', 0.3),
> ('ASSY-02', 'Assembly Line 02', 'Line C', 0.3);
> ```

---

## PROMPT AHM-2 — Dashboard Executive

> Project Next.js "AHM Smart Factory" sudah ada login, sidebar, dan Supabase sudah terkoneksi.
> Lanjutkan dengan membuat halaman **app/dashboard/page.tsx**.
> Jangan ubah file lain yang sudah ada.
>
> Halaman ini menampilkan:
>
> 1. **Header** — Tulisan "Dashboard Executive", tanggal hari ini, nama user yang sedang login (ambil dari Supabase auth session). Tambahkan proteksi: kalau belum login redirect ke /login.
>
> 2. **4 KPI Cards** — Data dari Supabase:
>    - Total Produksi Hari Ini → SUM(units_produced) dari quality_logs WHERE log_date = today
>    - Total Defect Hari Ini → SUM(defect_count) dari quality_logs WHERE log_date = today
>    - Rata-rata Energy/Unit → AVG dari (kwh_consumed/units_produced) energy_logs WHERE log_date = today
>    - OEE → tampilkan angka dummy 87.3% dulu
>
> 3. **Line Chart (Recharts)** — Tren produksi 7 hari terakhir vs target harian 8000 unit. Data dari SUM(units_produced) GROUP BY log_date dari quality_logs.
>
> 4. **Bar Chart (Recharts)** — Top 5 mesin paling boros energi hari ini (kwh_consumed/units_produced tertinggi). JOIN energy_logs + machines.
>
> 5. **Donut Chart (Recharts)** — Defect rate per Line Produksi (Line A, B, C). GROUP BY machines.line JOIN quality_logs + machines.
>
> 6. **Alert Banner** — Ambil dari tabel alerts WHERE status='open' AND severity='critical'. Kalau ada tampilkan banner merah di atas semua konten.
>
> Install Recharts dulu jika belum: npm install recharts

---

## PROMPT AHM-3 — Energy Monitoring

> Project Next.js "AHM Smart Factory" sudah ada login, sidebar, Supabase, dan dashboard.
> Lanjutkan dengan membuat halaman **app/energy/page.tsx**.
> Jangan ubah file lain yang sudah ada.
>
> Konten halaman:
>
> 1. **Filter dropdown** — Filter per Line Produksi (Semua / Line A / Line B / Line C). Gunakan useState, saat filter berubah data tabel dan chart ikut update.
>
> 2. **Tabel mesin** — JOIN machines + energy_logs (log_date = today):
>    - Kolom: Nama Mesin, Line, kWh, Produksi, Energy/Unit, Status
>    - Hitung energy_per_unit = kwh_consumed / units_produced di frontend
>    - Badge hijau "Efisien" kalau energy_per_unit ≤ target_energy_per_unit mesin
>    - Badge merah "Boros" kalau melebihi target, baris di-highlight merah muda
>
> 3. **Line Chart** — Tren total konsumsi energi 7 hari terakhir (SUM kwh_consumed GROUP BY log_date)
>
> 4. **Bar Chart** — Ranking energy/unit semua mesin hari ini, urutkan dari terkecil. Tambahkan garis reference horizontal di angka target (0.6).
>
> 5. **Tombol "+ Input Data Energi"** — Buka modal form dengan field:
>    - Dropdown pilih mesin (dari tabel machines)
>    - Date picker tanggal
>    - Input kWh consumed (number)
>    - Input units produced (number)
>    - Tombol Simpan → INSERT ke energy_logs di Supabase
>    - Setelah simpan: tutup modal, refresh data tabel dan chart otomatis

---

## PROMPT AHM-4 — Quality Monitoring

> Project Next.js "AHM Smart Factory" sudah ada login, sidebar, Supabase, dashboard, energy monitoring.
> Lanjutkan dengan membuat halaman **app/quality/page.tsx**.
> Jangan ubah file lain yang sudah ada.
>
> Konten halaman:
>
> 1. **Filter** — Dropdown per Shift (Semua/1/2/3) dan per Mesin. Keduanya bisa dikombinasikan.
>
> 2. **Tabel defect** — JOIN quality_logs + machines, filter sesuai pilihan:
>    - Kolom: Mesin, Line, Shift, Operator, Produksi, Defect, Defect Rate %, Jenis Defect
>    - Hitung defect_rate = (defect_count / units_produced * 100) di frontend
>    - Highlight baris merah kalau defect_rate > 3%
>
> 3. **Bar Chart** — Top 5 jenis defect berdasarkan total count (GROUP BY defect_type)
>
> 4. **Line Chart** — Tren defect rate rata-rata harian 7 hari (AVG defect_rate GROUP BY log_date). Tambahkan garis merah putus-putus di 3% sebagai batas toleransi.
>
> 5. **Tombol "+ Input Data Quality"** — Modal form:
>    - Dropdown mesin
>    - Dropdown shift (1/2/3)
>    - Input nama operator
>    - Date picker
>    - Input jumlah produksi
>    - Input jumlah defect
>    - Input jenis defect (text)
>    - Simpan → INSERT ke quality_logs → refresh data

---

## PROMPT AHM-5 — Alert & Notifikasi

> Project Next.js "AHM Smart Factory" sudah ada login, sidebar, Supabase, dashboard, energy, quality.
> Lanjutkan dengan membuat halaman **app/alert/page.tsx**.
> Jangan ubah file lain yang sudah ada.
>
> Konten halaman:
>
> 1. **3 Summary Cards** — Total Alert Aktif, Jumlah Critical, Jumlah Warning. Data dari tabel alerts WHERE status='open'.
>
> 2. **List Alert Aktif** — Ambil dari alerts WHERE status='open', JOIN machines, urutkan severity (critical dulu):
>    - Tiap item: badge severity (merah=Critical, kuning=Warning, biru=Info), nama mesin, tipe alert, pesan, waktu
>    - Tombol "Tandai Selesai" → UPDATE alerts SET status='resolved', resolved_at=NOW() WHERE id=...
>    - Setelah klik tombol, item langsung hilang dari list (refresh state)
>
> 3. **Tombol "+ Buat Alert"** — Modal form:
>    - Dropdown pilih mesin
>    - Dropdown tipe (energy / quality / maintenance)
>    - Dropdown severity (critical / warning / info)
>    - Textarea pesan
>    - Simpan → INSERT ke alerts → refresh list
>
> 4. **Tabel Riwayat** — Alert yang sudah resolved (status='resolved'): nama mesin, pesan, waktu dibuat, waktu diselesaikan

---
---

# 2. FINATRA UMKM GROWTH ECOSYSTEM

---

## PROMPT FIN-1 — Setup Supabase & Database

> Project Next.js "FINATRA UMKM Growth Ecosystem" sudah berjalan dengan login dan sidebar.
> Tambahkan koneksi Supabase (lib/supabase.ts dan .env.local sama seperti project AHM).
>
> Jalankan SQL ini di Supabase SQL Editor:
> ```sql
> CREATE TABLE umkm_leads (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   business_name VARCHAR(200) NOT NULL,
>   owner_name VARCHAR(100) NOT NULL,
>   sector VARCHAR(100) NOT NULL,
>   location VARCHAR(200) NOT NULL,
>   monthly_revenue BIGINT NOT NULL,
>   years_in_business INTEGER NOT NULL,
>   property_value BIGINT,
>   credit_history VARCHAR(50),
>   status VARCHAR(50) DEFAULT 'prospect',
>   assigned_to VARCHAR(100),
>   channel VARCHAR(100),
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE credit_scores (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   lead_id UUID REFERENCES umkm_leads(id),
>   business_score INTEGER NOT NULL,
>   collateral_score INTEGER NOT NULL,
>   character_score INTEGER NOT NULL,
>   capacity_score INTEGER NOT NULL,
>   risk_category VARCHAR(20),
>   recommendation VARCHAR(20),
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE partners (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   name VARCHAR(200) NOT NULL,
>   type VARCHAR(100) NOT NULL,
>   region VARCHAR(100) NOT NULL,
>   contact_person VARCHAR(100),
>   leads_sent INTEGER DEFAULT 0,
>   leads_approved INTEGER DEFAULT 0,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE branches (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   name VARCHAR(200) NOT NULL,
>   region VARCHAR(100) NOT NULL,
>   target_disbursement BIGINT NOT NULL,
>   actual_disbursement BIGINT DEFAULT 0,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> INSERT INTO partners (name, type, region, contact_person, leads_sent, leads_approved) VALUES
> ('Koperasi Maju Bersama', 'Koperasi', 'Jawa Barat', 'Pak Hendra', 42, 28),
> ('Asosiasi UMKM Jakarta', 'Asosiasi UMKM', 'DKI Jakarta', 'Bu Ratna', 67, 41),
> ('BUMDes Makmur Jaya', 'BUMDes', 'Jawa Tengah', 'Pak Slamet', 23, 14),
> ('Inkubator Bisnis UGM', 'Inkubator', 'Yogyakarta', 'Bu Dewi', 18, 9);
>
> INSERT INTO branches (name, region, target_disbursement, actual_disbursement) VALUES
> ('Cabang Jakarta Pusat', 'DKI Jakarta', 5000000000, 3800000000),
> ('Cabang Bandung', 'Jawa Barat', 3000000000, 2100000000),
> ('Cabang Surabaya', 'Jawa Timur', 4000000000, 3500000000),
> ('Cabang Semarang', 'Jawa Tengah', 2500000000, 1800000000),
> ('Cabang Medan', 'Sumatera Utara', 2000000000, 900000000);
> ```

---

## PROMPT FIN-2 — Dashboard Executive FINATRA

> Project Next.js "FINATRA" sudah ada login, sidebar, dan Supabase terkoneksi.
> Lanjutkan dengan membuat halaman **app/dashboard/page.tsx**.
> Jangan ubah file lain yang sudah ada.
>
> Konten:
> 1. **5 KPI Cards** — Total Prospek UMKM (COUNT umkm_leads), Total Approved (COUNT WHERE status='approved'), Approval Rate % (approved/total*100), Total Mitra Aktif (COUNT partners), Total Cabang (COUNT branches)
> 2. **Bar Chart** — Performa top 5 cabang: target vs actual_disbursement (dalam juta Rp). Data dari tabel branches.
> 3. **Donut Chart** — Distribusi lead per sektor usaha (GROUP BY sector dari umkm_leads)
> 4. **Line Chart** — Tren lead masuk per bulan (GROUP BY DATE_TRUNC('month', created_at) dari umkm_leads) — 6 bulan terakhir
> 5. **Tabel Ringkasan Pipeline** — Jumlah lead per status: Prospect, Qualified, Survey, Credit Analysis, Approved, Disbursed

---

## PROMPT FIN-3 — Lead Management FINATRA

> Project Next.js "FINATRA" sudah ada login, sidebar, Supabase, dashboard.
> Lanjutkan dengan membuat halaman **app/leads/page.tsx**.
> Jangan ubah file lain yang sudah ada.
>
> Konten:
> 1. **Pipeline Bar** — Row horizontal menampilkan COUNT per status dengan warna berbeda. Klik status → filter tabel di bawahnya.
> 2. **Filter tambahan** — Dropdown per Sektor dan per Channel di samping pipeline bar.
> 3. **Tabel lead** — Data dari umkm_leads sesuai filter aktif:
>    - Kolom: Nama Usaha, Pemilik, Sektor, Lokasi, Omzet/Bulan (format Rp), Status badge, Sales
>    - Badge warna per status (abu/biru/kuning/oranye/hijau/ungu)
>    - Tombol "Detail" di tiap baris
> 4. **Modal Detail** — Klik "Detail" tampilkan:
>    - Info lengkap UMKM
>    - Kalau ada credit score di tabel credit_scores: tampilkan 4 progress bar (Business/Collateral/Character/Capacity Score) + total score + badge risk category
>    - Dropdown update status → UPDATE umkm_leads.status di Supabase → refresh tabel
> 5. **Tombol "+ Tambah Prospek"** — Modal form input data UMKM baru → INSERT ke umkm_leads

---

## PROMPT FIN-4 — Credit Scoring FINATRA

> Project Next.js "FINATRA" sudah ada login, sidebar, Supabase, dashboard, lead management.
> Lanjutkan dengan membuat halaman **app/scoring/page.tsx**.
> Jangan ubah file lain yang sudah ada.
>
> Konten:
> 1. **Form Scoring** — Di sisi kiri halaman:
>    - Dropdown pilih UMKM dari umkm_leads yang sudah ada
>    - 4 input slider (range 0–100) untuk: Business Score, Collateral Score, Character Score, Capacity Score
>    - Tiap slider ada label dan angka yang update real-time saat digeser
>    - Tombol "Hitung Skor"
> 2. **Hasil Scoring** — Di sisi kanan, muncul setelah klik "Hitung Skor":
>    - Angka total score besar di tengah (rata-rata 4 komponen)
>    - Badge Risk Category: hijau (Low Risk ≥ 70), kuning (Medium Risk 50–69), merah (High Risk < 50)
>    - Teks Rekomendasi: "Approved" / "Conditional" / "Rejected"
>    - Bar chart 4 komponen skor
>    - Tombol "Simpan Hasil" → INSERT ke credit_scores di Supabase
> 3. **Riwayat Scoring** — Tabel di bawah form: semua hasil scoring JOIN credit_scores + umkm_leads, tampilkan nama usaha, total score, risk category, rekomendasi, tanggal

---

## PROMPT FIN-5 — Partnership & Cabang FINATRA

> Project Next.js "FINATRA" sudah ada login, sidebar, Supabase, dashboard, leads, scoring.
> Lanjutkan dengan membuat halaman **app/partnership/page.tsx**.
> Jangan ubah file lain yang sudah ada.
>
> Konten:
> 1. **Tab navigasi** — 2 tab: "Mitra Strategis" dan "Performa Cabang"
> 2. **Tab Mitra** — Tabel dari partners:
>    - Kolom: Nama Mitra, Jenis, Wilayah, Contact Person, Lead Dikirim, Lead Approved, Conversion Rate %
>    - Conversion Rate = leads_approved/leads_sent*100, hitung di frontend
>    - Tombol "+ Tambah Mitra" → modal form → INSERT ke partners
>    - Tombol "Edit" tiap baris → modal edit → UPDATE partners
> 3. **Tab Cabang** — Tabel dari branches:
>    - Kolom: Nama Cabang, Wilayah, Target (Rp), Realisasi (Rp), Achievement %
>    - Achievement = actual_disbursement/target_disbursement*100
>    - Progress bar di kolom Achievement, hijau kalau ≥ 80%, kuning 60–79%, merah < 60%
>    - Tombol "Update Realisasi" → modal input angka → UPDATE branches.actual_disbursement

---
---

# 3. UD SMART FLEET ECOSYSTEM PLATFORM

---

## PROMPT UD-1 — Setup Supabase & Database

> Project Next.js "UD Smart Fleet Ecosystem" sudah berjalan dengan login dan sidebar.
> Tambahkan koneksi Supabase (lib/supabase.ts dan .env.local).
>
> Jalankan SQL ini di Supabase SQL Editor:
> ```sql
> CREATE TABLE sales_leads (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   company_name VARCHAR(200) NOT NULL,
>   industry VARCHAR(100) NOT NULL,
>   contact_person VARCHAR(100),
>   phone VARCHAR(20),
>   units_interested INTEGER NOT NULL DEFAULT 1,
>   truck_model VARCHAR(100),
>   status VARCHAR(50) DEFAULT 'new_lead',
>   assigned_sales VARCHAR(100),
>   region VARCHAR(100),
>   estimated_value BIGINT,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE fleet_units (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   plate_number VARCHAR(20) NOT NULL UNIQUE,
>   model VARCHAR(100) NOT NULL,
>   customer_company VARCHAR(200) NOT NULL,
>   region VARCHAR(100),
>   last_location VARCHAR(200),
>   speed DECIMAL(5,1) DEFAULT 0,
>   fuel_consumption DECIMAL(5,2),
>   engine_hours INTEGER DEFAULT 0,
>   status VARCHAR(20) DEFAULT 'normal',
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE service_bookings (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   customer_name VARCHAR(200) NOT NULL,
>   plate_number VARCHAR(20),
>   service_type VARCHAR(100) NOT NULL,
>   location VARCHAR(200),
>   scheduled_date DATE NOT NULL,
>   status VARCHAR(50) DEFAULT 'pending',
>   notes TEXT,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE spareparts (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   part_number VARCHAR(50) NOT NULL,
>   name VARCHAR(200) NOT NULL,
>   category VARCHAR(100),
>   price BIGINT NOT NULL,
>   stock INTEGER NOT NULL DEFAULT 0,
>   warehouse VARCHAR(100),
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> INSERT INTO fleet_units (plate_number, model, customer_company, region, last_location, speed, fuel_consumption, status) VALUES
> ('B 1234 ABC', 'Quester CWE', 'PT Logistics Nusantara', 'Jawa Barat', 'Tol Cipularang KM 72', 82.5, 28.3, 'warning'),
> ('B 5678 DEF', 'Quon GW', 'CV Tambang Makmur', 'Kalimantan Timur', 'Pit Area B', 45.2, 32.1, 'normal'),
> ('D 9012 GHI', 'Condor MK', 'PT Konstruksi Jaya', 'Jawa Tengah', 'Proyek Semarang', 0.0, 0.0, 'critical');
>
> INSERT INTO spareparts (part_number, name, category, price, stock, warehouse) VALUES
> ('SP-001', 'Filter Oli Quester', 'Filter', 185000, 45, 'Gudang Jakarta'),
> ('SP-002', 'Kampas Rem Belakang Quon', 'Rem', 520000, 12, 'Gudang Surabaya'),
> ('SP-003', 'Fan Belt Condor', 'Engine', 275000, 8, 'Gudang Medan');
> ```

---

## PROMPT UD-2 — Dashboard Executive UD Fleet

> Project Next.js "UD Smart Fleet" sudah ada login, sidebar, Supabase terkoneksi.
> Lanjutkan dengan membuat halaman **app/dashboard/page.tsx**.
> Jangan ubah file lain.
>
> Konten:
> 1. **5 KPI Cards** — Total Lead Aktif (COUNT sales_leads WHERE status != 'won' AND status != 'lost'), Unit Terjual Bulan Ini (COUNT WHERE status='won' AND bulan ini), Total Armada Aktif (COUNT fleet_units), Booking Servis Pending (COUNT service_bookings WHERE status='pending'), Total Stok Sparepart (SUM stock dari spareparts)
> 2. **Line Chart** — Tren lead masuk per minggu 4 minggu terakhir (COUNT GROUP BY week dari sales_leads)
> 3. **Bar Chart** — Distribusi lead per industri (GROUP BY industry dari sales_leads)
> 4. **Donut Chart** — Status armada fleet (normal/warning/critical dari fleet_units)
> 5. **Alert Section** — List armada dengan status critical atau warning dari fleet_units, tampilkan nopol + lokasi + masalah

---

## PROMPT UD-3 — Sales & Lead Management UD Fleet

> Project Next.js "UD Smart Fleet" sudah ada login, sidebar, Supabase, dashboard.
> Lanjutkan dengan membuat halaman **app/sales/page.tsx**.
> Jangan ubah file lain.
>
> Konten:
> 1. **Pipeline Visual** — 7 kolom status (new_lead/contacted/qualified/proposal/negotiation/won/lost). Tiap kolom tampilkan COUNT dan total estimated_value. Klik kolom → filter tabel.
> 2. **Filter** — Dropdown per industri dan per sales di atas tabel
> 3. **Tabel lead** — Data dari sales_leads sesuai filter:
>    - Kolom: Perusahaan, Industri, Unit, Model Truk, Sales, Wilayah, Nilai (Rp), Status badge
>    - Tombol "Detail"
> 4. **Modal Detail** — Info lengkap lead + simulasi kredit sederhana:
>    - Input: Harga Unit (Rp), Uang Muka (%), Tenor (bulan)
>    - Output kalkulasi: Pokok Pinjaman, Cicilan/Bulan (asumsi bunga 8%/tahun flat)
>    - Dropdown update status → UPDATE sales_leads.status
> 5. **Tombol "+ Tambah Lead"** → modal form → INSERT ke sales_leads

---

## PROMPT UD-4 — Telematics & Service UD Fleet

> Project Next.js "UD Smart Fleet" sudah ada login, sidebar, Supabase, dashboard, sales.
> Lanjutkan dengan membuat halaman **app/telematics/page.tsx** dan **app/service/page.tsx**.
> Jangan ubah file lain.
>
> **Telematics (app/telematics/page.tsx):**
> 1. KPI Cards: Total Armada, Status Normal, Warning, Critical
> 2. Tabel fleet_units: Nopol, Model, Perusahaan, Wilayah, Lokasi Terakhir, Kecepatan (km/h), BBM/100km, Engine Hour, Status badge
>    - Merah untuk Critical, kuning untuk Warning
>    - Overspeed alert: kecepatan > 80 km/h
>    - BBM abnormal: > 35 L/100km
> 3. Section "Perlu Perhatian" — filter otomatis armada yang overspeed atau BBM abnormal atau status critical
> 4. Form "+ Tambah Armada" → INSERT ke fleet_units
> 5. Tombol "Update Status" tiap baris → UPDATE fleet_units.status
>
> **Service (app/service/page.tsx):**
> 1. Tab: "Booking Servis" dan "Katalog Sparepart"
> 2. Tab Booking:
>    - KPI Cards: Total Pending, Confirmed, In Progress, Selesai
>    - Tabel service_bookings: Customer, Nopol, Jenis Servis, Lokasi, Jadwal, Status badge
>    - Tombol update status (Pending→Confirmed→In Progress→Selesai)
>    - Form "+ Booking Baru" → INSERT ke service_bookings
> 3. Tab Sparepart:
>    - Filter per kategori
>    - Card grid sparepart: nama, nomor part, harga (Rp), stok, gudang
>    - Badge merah "Stok Habis" kalau stock = 0, kuning "Stok Tipis" kalau stock < 5
>    - Form "+ Tambah Sparepart" → INSERT ke spareparts

---
---

# 4. PAMA SMART MINING DIGITAL PLATFORM

---

## PROMPT PAMA-1 — Setup Supabase & Database

> Project Next.js "PAMA Smart Mining" sudah berjalan dengan login dan sidebar.
> Tambahkan koneksi Supabase (lib/supabase.ts dan .env.local).
>
> Jalankan SQL ini di Supabase SQL Editor:
> ```sql
> CREATE TABLE mining_units (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   unit_id VARCHAR(20) NOT NULL UNIQUE,
>   unit_type VARCHAR(50) NOT NULL,
>   area VARCHAR(100) NOT NULL,
>   status VARCHAR(20) DEFAULT 'active',
>   utilization DECIMAL(5,2) DEFAULT 0,
>   engine_hours DECIMAL(8,2) DEFAULT 0,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE production_logs (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   unit_id UUID REFERENCES mining_units(id),
>   log_date DATE NOT NULL,
>   shift INTEGER NOT NULL,
>   bcm_produced DECIMAL(10,2) DEFAULT 0,
>   cycle_time_minutes DECIMAL(6,2),
>   idle_time_minutes DECIMAL(6,2) DEFAULT 0,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE fuel_logs (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   unit_id UUID REFERENCES mining_units(id),
>   log_date DATE NOT NULL,
>   activity VARCHAR(50) NOT NULL,
>   fuel_consumed DECIMAL(8,2) NOT NULL,
>   bcm_activity DECIMAL(8,2),
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE operators (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   name VARCHAR(100) NOT NULL,
>   shift INTEGER NOT NULL,
>   unit_id UUID REFERENCES mining_units(id),
>   productivity_score INTEGER DEFAULT 0,
>   fuel_efficiency_score INTEGER DEFAULT 0,
>   safety_score INTEGER DEFAULT 0,
>   violation_count INTEGER DEFAULT 0,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE safety_alerts (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   unit_id UUID REFERENCES mining_units(id),
>   alert_type VARCHAR(50) NOT NULL,
>   severity VARCHAR(20) NOT NULL,
>   location VARCHAR(100),
>   description TEXT,
>   status VARCHAR(20) DEFAULT 'open',
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> INSERT INTO mining_units (unit_id, unit_type, area, status, utilization, engine_hours) VALUES
> ('EX-001', 'excavator', 'Pit North', 'active', 88.5, 4520.3),
> ('EX-002', 'excavator', 'Pit South', 'idle', 62.1, 3891.0),
> ('DT-001', 'dump_truck', 'Hauling Road A', 'active', 91.2, 5102.7),
> ('DT-002', 'dump_truck', 'Hauling Road B', 'breakdown', 0.0, 4203.5),
> ('DT-003', 'dump_truck', 'Pit North', 'active', 85.3, 3750.2),
> ('DOZ-001', 'dozer', 'Pit North', 'active', 79.8, 2980.1);
> ```

---

## PROMPT PAMA-2 — Dashboard Remote Operation Center

> Project Next.js "PAMA Smart Mining" sudah ada login, sidebar, Supabase terkoneksi.
> Lanjutkan dengan membuat halaman **app/dashboard/page.tsx**.
> Jangan ubah file lain.
>
> Konten:
> 1. **Header** — "Remote Operation Center" + jam real-time (useEffect + setInterval tiap detik) + tanggal
> 2. **5 KPI Cards** — BCM Produksi Hari Ini (SUM bcm_produced dari production_logs hari ini), Fleet Aktif (COUNT WHERE status='active'), Fleet Idle (COUNT WHERE status='idle'), Fleet Breakdown (COUNT WHERE status='breakdown'), Rata-rata Utilisasi % (AVG utilization)
> 3. **Line Chart** — Tren BCM produksi 7 hari vs target harian (10.000 BCM). Data SUM(bcm_produced) GROUP BY log_date.
> 4. **Grid Status Fleet** — Tampilkan semua unit dari mining_units sebagai card kecil: unit_id, tipe, area, status. Warna card: hijau=active, kuning=idle, merah=breakdown.
> 5. **Alert Banner Critical** — Ambil safety_alerts WHERE status='open' AND severity='critical'. Kalau ada tampilkan banner merah di paling atas.

---

## PROMPT PAMA-3 — Fleet, Fuel & Operator PAMA

> Project Next.js "PAMA Smart Mining" sudah ada login, sidebar, Supabase, dashboard.
> Lanjutkan dengan membuat **app/fleet/page.tsx**, **app/fuel/page.tsx**, dan **app/operator/page.tsx**.
> Jangan ubah file lain.
>
> **Fleet (app/fleet/page.tsx):**
> 1. Filter per jenis unit dan per area
> 2. Tabel mining_units: Unit ID, Tipe, Area, Status badge, Utilisasi %, Engine Hours
>    - Merah untuk breakdown, kuning untuk idle
> 3. Form "+ Input Produksi" → modal: dropdown unit, tanggal, shift, BCM, cycle time, idle time → INSERT production_logs
> 4. Tombol "Update Status" tiap baris → UPDATE mining_units.status
>
> **Fuel (app/fuel/page.tsx):**
> 1. KPI Cards: Total BBM Hari Ini (SUM fuel_consumed), Rata-rata Fuel/BCM, Unit Paling Boros
> 2. Tabel dari fuel_logs JOIN mining_units: Unit, Aktivitas, BBM (L), BCM, Fuel/BCM, Status (Normal/Boros)
>    - Badge merah "Boros" kalau fuel/bcm > 4.5
> 3. Bar Chart — ranking 10 unit paling boros (fuel_consumed/bcm_activity tertinggi)
> 4. Form "+ Input BBM" → INSERT fuel_logs
>
> **Operator (app/operator/page.tsx):**
> 1. Filter per shift
> 2. Tabel ranking operator dari tabel operators: Nama, Shift, Unit, Productivity Score, Fuel Score, Safety Score, Overall (rata-rata 3 score)
>    - Warna row: hijau overall ≥ 80, kuning 60–79, merah < 60
> 3. Klik operator → modal detail: 3 progress bar score + jumlah violation
> 4. Form "+ Tambah Operator" → INSERT operators
> 5. Tombol "Update Score" → UPDATE operators

---

## PROMPT PAMA-4 — Safety & Alert PAMA

> Project Next.js "PAMA Smart Mining" sudah ada login, sidebar, Supabase, dashboard, fleet, fuel, operator.
> Lanjutkan dengan membuat halaman **app/safety/page.tsx**.
> Jangan ubah file lain.
>
> Konten:
> 1. **Summary Cards** — Total Alert Aktif, Critical, High, Medium
> 2. **List Alert Aktif** — safety_alerts WHERE status='open' JOIN mining_units, urutkan severity:
>    - Badge severity, tipe alert, unit terkait, lokasi, deskripsi, waktu
>    - Tombol "Tangani" → UPDATE status='resolved' → refresh list
> 3. **Tombol "+ Laporkan Kejadian"** → modal:
>    - Dropdown unit
>    - Dropdown tipe (fatigue/unsafe_act/near_miss/breakdown_risk)
>    - Dropdown severity (critical/high/medium)
>    - Input lokasi + deskripsi
>    - INSERT ke safety_alerts
> 4. **Chart Trend** — Line chart incident per hari 30 hari terakhir (COUNT GROUP BY DATE)
> 5. **Tabel Riwayat** — Alert yang sudah resolved

---
---

# 5. KPP SMART HAULING COMMAND CENTER

---

## PROMPT KPP-1 — Setup Supabase & Database

> Project Next.js "KPP Smart Hauling Command Center" sudah berjalan dengan login dan sidebar.
> Tambahkan koneksi Supabase (lib/supabase.ts dan .env.local).
>
> Jalankan SQL ini di Supabase SQL Editor:
> ```sql
> CREATE TABLE hd785_units (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   unit_id VARCHAR(20) NOT NULL UNIQUE,
>   status VARCHAR(20) DEFAULT 'active',
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE tyre_monitoring (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   unit_id UUID REFERENCES hd785_units(id),
>   tyre_position VARCHAR(10) NOT NULL,
>   pressure DECIMAL(5,1) NOT NULL,
>   temperature DECIMAL(5,1) NOT NULL,
>   tread_depth DECIMAL(4,1) NOT NULL,
>   running_hours DECIMAL(8,2) NOT NULL,
>   health_score INTEGER NOT NULL,
>   predicted_days_remaining INTEGER,
>   recorded_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE payload_logs (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   unit_id UUID REFERENCES hd785_units(id),
>   operator_name VARCHAR(100) NOT NULL,
>   ritase_number INTEGER NOT NULL,
>   loading_area VARCHAR(100),
>   payload_actual DECIMAL(8,2) NOT NULL,
>   payload_target DECIMAL(8,2) NOT NULL DEFAULT 90.0,
>   material_type VARCHAR(100),
>   log_date DATE NOT NULL,
>   shift INTEGER NOT NULL,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE hauling_operators (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   name VARCHAR(100) NOT NULL,
>   shift INTEGER NOT NULL,
>   unit_id UUID REFERENCES hd785_units(id),
>   safety_score INTEGER DEFAULT 0,
>   efficiency_score INTEGER DEFAULT 0,
>   tyre_care_score INTEGER DEFAULT 0,
>   hard_braking_count INTEGER DEFAULT 0,
>   overspeed_count INTEGER DEFAULT 0,
>   sharp_corner_count INTEGER DEFAULT 0,
>   created_at TIMESTAMP DEFAULT NOW()
> );
>
> CREATE TABLE road_segments (
>   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
>   segment_name VARCHAR(100) NOT NULL,
>   road_condition_index INTEGER NOT NULL,
>   avg_speed DECIMAL(5,1),
>   tyre_wear_contribution DECIMAL(5,2),
>   status VARCHAR(20) DEFAULT 'baik',
>   last_updated TIMESTAMP DEFAULT NOW()
> );
>
> INSERT INTO hd785_units (unit_id) VALUES
> ('HD785-001'),('HD785-002'),('HD785-003'),
> ('HD785-004'),('HD785-005'),('HD785-006');
>
> INSERT INTO road_segments (segment_name, road_condition_index, avg_speed, tyre_wear_contribution, status) VALUES
> ('KM 33-34', 85, 42.3, 8.2, 'baik'),
> ('KM 34-35', 62, 35.1, 14.5, 'perlu_grading'),
> ('KM 35-36', 45, 28.7, 24.1, 'kritis'),
> ('KM 36-37', 78, 40.2, 10.3, 'baik'),
> ('KM 37-Port', 91, 48.5, 6.8, 'baik');
> ```

---

## PROMPT KPP-2 — Dashboard Direksi KPP

> Project Next.js "KPP Smart Hauling" sudah ada login, sidebar, Supabase terkoneksi.
> Lanjutkan dengan membuat halaman **app/dashboard/page.tsx**.
> Jangan ubah file lain.
>
> Konten:
> 1. **5 KPI Cards** — Total Ritase Hari Ini (COUNT payload_logs WHERE log_date=today), Total Payload Hari Ini (SUM payload_actual dalam ton), Payload Accuracy % (COUNT optimal / COUNT total * 100, optimal = payload_actual antara 85.5–94.5 ton), Ban Status Kritis (COUNT tyre_monitoring WHERE health_score < 40), Segmen Jalan Kritis (COUNT road_segments WHERE status='kritis')
> 2. **Bar Chart** — Payload accuracy per unit hari ini (stacked bar: overload/optimal/underload per unit)
> 3. **Line Chart** — Tren total ritase per hari 7 hari terakhir
> 4. **Donut Chart** — Distribusi status ban (sehat/warning/kritis dari tyre_monitoring)
> 5. **Alert Section** — Ban dengan health_score < 40 dan segmen jalan status 'kritis'

---

## PROMPT KPP-3 — Tyre Management KPP

> Project Next.js "KPP Smart Hauling" sudah ada login, sidebar, Supabase, dashboard.
> Lanjutkan dengan membuat halaman **app/tyre/page.tsx**.
> Jangan ubah file lain.
>
> Konten:
> 1. **KPI Cards** — Total Ban Terpantau, Ban Kritis (health<40), Ban Warning (health 40–60), Rata-rata Health Score
> 2. **Tabel** — tyre_monitoring JOIN hd785_units, sort health_score ASC:
>    - Kolom: Unit, Posisi Ban, Pressure (PSI), Suhu (°C), Tread Depth (mm), Running Hours, Health Score, Sisa Umur (hari)
>    - Badge merah "Kritis" kalau health_score < 40, kuning "Warning" kalau < 60
> 3. **Klik baris unit** → Modal dengan layout visual 4 roda (grid 2x2 card):
>    - Tiap card: posisi ban (FL/FR/RL/RR), health score, warna background (hijau/kuning/merah)
>    - Rekomendasi AI teks otomatis: kalau ada ban health < 40 tampilkan "Ban [posisi] Unit [id] diprediksi gagal dalam [predicted_days] hari. Rekomendasi: segera lakukan rotasi atau penggantian."
> 4. **Form "+ Input Monitoring Ban"** → modal: dropdown unit, dropdown posisi (FL/FR/RL/RR), input pressure/temperature/tread depth/running hours/health score/predicted days → INSERT tyre_monitoring

---

## PROMPT KPP-4 — Payload, Operator & Road KPP

> Project Next.js "KPP Smart Hauling" sudah ada login, sidebar, Supabase, dashboard, tyre.
> Lanjutkan dengan membuat **app/payload/page.tsx**, **app/operator/page.tsx**, dan **app/road/page.tsx**.
> Jangan ubah file lain.
>
> **Payload (app/payload/page.tsx):**
> 1. KPI Cards: Payload Accuracy %, Total Overload, Total Underload, Rata-rata Payload Aktual
> 2. Tabel payload_logs JOIN hd785_units: Unit, Ritase ke-, Area Loading, Payload Aktual (ton), Target (ton), Selisih, Status
>    - Overload (actual > target+5%): merah. Optimal: hijau. Underload (actual < target-5%): kuning
> 3. Bar chart stacked payload accuracy semua unit
> 4. Rekomendasi AI otomatis: GROUP BY loading_area, hitung rata-rata (actual-target), tampilkan area dengan overload tertinggi + rekomendasi teks
> 5. Form "+ Input Ritase" → INSERT payload_logs
>
> **Operator (app/operator/page.tsx):**
> 1. Filter per shift
> 2. Tabel hauling_operators JOIN hd785_units: Nama, Shift, Unit, Safety Score, Efficiency Score, Tyre Care Score, Overall Score (rata-rata 3)
>    - Warna row: hijau ≥ 80, kuning 60–79, merah < 60
> 3. Klik operator → modal: grafik radar 3 skor + tabel pelanggaran (hard braking, overspeed, sharp corner count)
> 4. Form "+ Tambah Operator" → INSERT hauling_operators
> 5. Tombol "Update Score & Violation" → UPDATE hauling_operators
>
> **Road (app/road/page.tsx):**
> 1. Visualisasi jalur hauling — tampilkan road_segments sebagai diagram horizontal dari kiri (KM 33) ke kanan (Port). Tiap segmen punya warna sesuai status: hijau=baik, kuning=perlu_grading, merah=kritis.
> 2. Tabel road_segments: Segmen, Road Condition Index, Avg Speed (km/h), Kontribusi Keausan Ban %, Status badge
>    - Sort dari tyre_wear_contribution tertinggi
> 3. KPI Cards: Segmen Baik, Perlu Grading, Kritis
> 4. Form "Update Kondisi Jalan" → UPDATE road_segments (pilih segmen, update road_condition_index dan status)

---

## CATATAN PENTING

1. **Setiap prompt kirim satu-satu** — tunggu selesai baru lanjut ke prompt berikutnya
2. **Bilang ke AI**: "Jangan ubah file lain yang sudah ada, hanya buat/edit file yang disebutkan"
3. **Kalau AI error** karena context panjang, bisa bilang: "Lanjutkan dari bagian [nama section] saja"
4. **Setelah semua halaman jadi**, push ke GitHub dan Vercel akan auto-deploy

