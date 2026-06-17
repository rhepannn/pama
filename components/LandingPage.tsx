'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const GOLD = '#F5A623'
const BLUE = '#1A3470'

const VALID_ACCOUNTS: Record<string, string> = {
  'admin@pama.co.id': 'pama2026',
  'foreman@pama.co.id': 'pama2026',
  'operator@pama.co.id': 'pama2026',
}

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    ),
    title: 'Remote Operation Center',
    desc: 'Dashboard real-time seluruh operasi tambang — produksi, utilisasi fleet, KPI operasional dalam satu layar.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
    ),
    title: 'Fleet Management',
    desc: 'Monitoring status & utilisasi seluruh unit alat berat — excavator, dump truck, dozer, grader, drill.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M3 22V10l9-8 9 8v12H3z"/><path d="M9 22V12h6v10"/><circle cx="19" cy="5" r="2"/></svg>
    ),
    title: 'Fuel & Cost Monitor',
    desc: 'Pantau konsumsi BBM per unit, hitung biaya operasional, identifikasi unit boros secara otomatis.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: 'Operator Performance',
    desc: 'Ranking & evaluasi performa operator — produktivitas, efisiensi BBM, safety score, riwayat pelanggaran.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
    title: 'Safety & Alert',
    desc: 'Sistem peringatan dini — fatigue detection, unsafe act, near miss, breakdown risk. K3LH prioritas utama.',
  },
]

export default function LandingPage({ onLogin }: { onLogin: (u: { email: string; role: string }) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const [title, setTitle] = useState('PAMA Smart Mining')
  const [subtitle, setSubtitle] = useState('Digital Platform · Remote Operation Center')
  const [loginHeading, setLoginHeading] = useState('Masuk ke Sistem')
  const [footer, setFooter] = useState('PT Pamapersada Nusantara · Balikpapan Site')
  const [copyright, setCopyright] = useState('© 2026 PT Pamapersada Nusantara')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    try {
      supabase.from('site_settings').select('*').then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {}
          data.forEach((row: any) => { map[row.key] = row.value })
          if (map.site_title) setTitle(map.site_title)
          if (map.site_subtitle) setSubtitle(map.site_subtitle)
          if (map.login_heading) setLoginHeading(map.login_heading)
          if (map.site_footer) setFooter(map.site_footer)
          if (map.copyright) setCopyright(map.copyright)
          if (map.logo_url) setLogoUrl(map.logo_url)
        }
      }).catch(() => {})
    } catch {}
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email wajib diisi'); return }
    if (!password.trim()) { setError('Password wajib diisi'); return }
    const validPw = VALID_ACCOUNTS[email.toLowerCase().trim()]
    if (!validPw) { setError('Akun tidak ditemukan'); return }
    if (password !== validPw) { setError('Password salah'); return }
    setLoading(true)
    const role = email.includes('admin') ? 'Admin' : email.includes('foreman') ? 'Foreman' : 'Operator'
    setTimeout(() => { setLoading(false); onLogin({ email: email.trim(), role }) }, 600)
  }

  return (
    <div className="min-h-screen" style={{ background: '#060D1A' }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(6,13,26,0.95)', borderColor: '#152244', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 34, height: 34, background: logoUrl ? 'transparent' : GOLD }}>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
              ) : (
                <svg viewBox="0 0 40 40" fill="none" className="w-5 h-5">
                  <path d="M5 32L13 10L20 24L27 14L37 32H5Z" fill="#060D1A" />
                </svg>
              )}
            </div>
            <span className="font-bold text-white text-sm">{title}</span>
          </div>
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: showLogin ? '#152244' : GOLD, color: showLogin ? '#D4DCE8' : '#060D1A' }}
          >
            {showLogin ? 'Tutup' : 'Login'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #060D1A 0%, #0A1A35 50%, #0F1F3D 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(#F5A623 1px, transparent 1px), linear-gradient(90deg, #F5A623 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F5A623 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1A3470 0%, transparent 70%)', transform: 'translate(50%, 50%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(245,166,35,0.12)', color: GOLD, border: '1px solid rgba(245,166,35,0.3)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />
              Remote Operation Center — Live Production Monitoring
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Kendali Penuh Operasi Tambang dalam{' '}
              <span style={{ color: GOLD }}>Satu Platform</span>
            </h1>
            <p className="text-lg mt-6 leading-relaxed max-w-2xl" style={{ color: '#7B8BA3' }}>
              {subtitle}. Platform digital terintegrasi untuk monitoring produksi, utilisasi fleet, konsumsi BBM, performa operator, dan keselamatan kerja secara real-time.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setShowLogin(true)}
                className="px-8 py-3.5 rounded-xl text-base font-bold transition-all hover:scale-105"
                style={{ background: GOLD, color: '#060D1A' }}
              >
                Masuk ke Dashboard
              </button>
              <span className="text-sm" style={{ color: '#4A5C75' }}>
                admin@pama.co.id / pama2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Login Form (slide-in) */}
      {showLogin && (
        <section className="border-b" style={{ background: '#0B1A33', borderColor: '#152244' }}>
          <div className="max-w-md mx-auto px-6 py-10">
            <h2 className="text-xl font-bold text-white text-center mb-6">{loginHeading}</h2>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2" style={{ background: 'rgba(231,76,60,0.2)', color: '#E74C3C', border: '1px solid #E74C3C40' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7B8BA3' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@pama.co.id"
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none placeholder-gray-600"
                  style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = error ? '#E74C3C' : '#1A3470'}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7B8BA3' }}>Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none pr-10"
                    style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}
                    onFocus={e => e.target.style.borderColor = GOLD}
                    onBlur={e => e.target.style.borderColor = error ? '#E74C3C' : '#1A3470'}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPw ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-sm transition-all"
                style={{ background: loading ? '#c47e1a' : GOLD, color: '#060D1A' }}>
                {loading ? 'Memverifikasi...' : 'Masuk'}
              </button>
            </form>
            <p className="text-xs text-center mt-4" style={{ color: '#4A5C75' }}>{footer}</p>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 px-6" style={{ background: '#060D1A' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">Fitur Platform</h2>
            <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: '#7B8BA3' }}>
              Lima modul terintegrasi untuk mengelola seluruh aspek operasi pertambangan — dari pit hingga port.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="rounded-xl p-6 transition-all hover:scale-[1.02] group" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
                <div className="mb-4 text-gray-400 group-hover:text-[#F5A623] transition-colors">{f.icon}</div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7B8BA3' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Purpose */}
      <section className="py-16 px-6 border-y" style={{ background: '#0A1A35', borderColor: '#152244' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '120.000', unit: 'BCM/hari', label: 'Target Produksi Harian' },
            { value: '30+', unit: 'Unit', label: 'Fleet Alat Berat' },
            { value: '3', unit: 'Shift', label: 'Operasi 24/7' },
            { value: '100%', unit: 'Real-time', label: 'Monitoring Digital' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-black" style={{ color: GOLD }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: '#7B8BA3' }}>{s.unit}</div>
              <div className="text-xs mt-2" style={{ color: '#4A5C75' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Purpose */}
      <section className="py-20 px-6" style={{ background: '#060D1A' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white">Tujuan Platform</h2>
          <div className="mt-8 space-y-6 text-left">
            {[
              { icon: '📊', text: 'Meningkatkan transparansi dan akurasi data produksi tambang secara real-time.' },
              { icon: '⛽', text: 'Mengoptimalkan konsumsi BBM dan menekan biaya operasional yang tidak perlu.' },
              { icon: '🔧', text: 'Meminimalkan downtime alat berat melalui monitoring utilisasi dan maintenance.' },
              { icon: '👷', text: 'Mendorong budaya keselamatan kerja melalui sistem alert dan inspeksi K3LH digital.' },
              { icon: '📈', text: 'Memberikan insight berbasis data untuk pengambilan keputusan operasional yang lebih cepat dan tepat.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <p className="text-sm leading-relaxed" style={{ color: '#D4DCE8' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t" style={{ background: '#060D1A', borderColor: '#152244' }}>
        <p className="text-xs" style={{ color: '#4A5C75' }}>{copyright}</p>
        <p className="text-xs mt-1" style={{ color: '#30363D' }}>{footer}</p>
      </footer>
    </div>
  )
}
