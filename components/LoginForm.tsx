'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const VALID_ACCOUNTS: Record<string, string> = {
  'admin@pama.co.id': 'pama2026',
  'foreman@pama.co.id': 'pama2026',
  'operator@pama.co.id': 'pama2026',
}

export default function LoginForm({ onLogin }: { onLogin: (u: { email: string; role: string }) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const [title, setTitle] = useState('PAMA Smart Mining')
  const [subtitle, setSubtitle] = useState('Digital Platform · PT Pamapersada Nusantara')
  const [loginHeading, setLoginHeading] = useState('Masuk ke Sistem')
  const [footer, setFooter] = useState('Remote Operation Center · Balikpapan Site')
  const [copyright, setCopyright] = useState('© 2026 PT Pamapersada Nusantara. All rights reserved.')
  const [demoText, setDemoText] = useState('Akun Demo')
  const [demoAccount, setDemoAccount] = useState('admin@pama.co.id / pama2026')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((row: any) => { map[row.key] = row.value })
        if (map.site_title) setTitle(map.site_title)
        if (map.site_subtitle) setSubtitle(map.site_subtitle)
        if (map.login_heading) setLoginHeading(map.login_heading)
        if (map.site_footer) setFooter(map.site_footer)
        if (map.copyright) setCopyright(map.copyright)
        if (map.demo_text) setDemoText(map.demo_text)
        if (map.demo_account) setDemoAccount(map.demo_account)
        if (map.logo_url) setLogoUrl(map.logo_url)
      }
    }).catch(() => {})
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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060D1A 0%, #0A1A35 50%, #0F1F3D 100%)' }}
    >
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: 'linear-gradient(#F5A623 1px, transparent 1px), linear-gradient(90deg, #F5A623 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          <path d="M0,300 Q100,250 200,280 Q300,310 400,260 Q500,210 600,270 Q700,330 800,290" fill="none" stroke="#F5A623" strokeWidth="1" />
          <path d="M0,350 Q150,300 250,320 Q350,340 450,300 Q550,260 650,310 Q750,360 800,330" fill="none" stroke="#F5A623" strokeWidth="0.5" opacity="0.5" />
          <path d="M0,250 Q200,200 300,230 Q400,260 500,210 Q600,160 700,220 Q750,250 800,240" fill="none" stroke="#F5A623" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F5A623 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1A3470 0%, transparent 70%)', transform: 'translate(50%, 50%)' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-2xl"
            style={{ background: logoUrl ? 'transparent' : 'linear-gradient(135deg, #F5A623, #E8950C)' }}>
            {logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logoUrl} alt="Logo" className="w-14 h-14 object-contain" />
            ) : (
              <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                <circle cx="20" cy="20" r="17" fill="none" stroke="#060D1A" strokeWidth="2" />
                <path d="M5 32L13 10L20 24L27 14L37 32H5Z" fill="#060D1A" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
          <p className="text-sm mt-1" style={{ color: '#7B8BA3' }}>
            {subtitle}
          </p>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: '#0B1A33', border: '1px solid #1A3470' }}>
          <h2 className="text-lg font-semibold text-white mb-6">{loginHeading}</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2" style={{ background: 'rgba(231,76,60,0.2)', color: '#E74C3C', border: '1px solid #E74C3C40' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7B8BA3' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pama.co.id"
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all placeholder-gray-600"
                style={{ background: '#0F1F3D', border: '1px solid #1A3470', caretColor: '#F5A623' }}
                onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
                onBlur={(e) => (e.target.style.borderColor = error ? '#E74C3C' : '#1A3470')}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7B8BA3' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all pr-10"
                  style={{ background: '#0F1F3D', border: '1px solid #1A3470', caretColor: '#F5A623' }}
                  onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
                  onBlur={(e) => (e.target.style.borderColor = error ? '#E74C3C' : '#1A3470')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPw ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 mt-2"
              style={{ background: loading ? '#c47e1a' : '#F5A623', color: '#060D1A', opacity: loading ? 0.8 : 1 }}>
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: '#4A5C75' }}>
            {footer}
          </p>
        </div>

        <div className="mt-4 p-3 rounded-lg text-center" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
          <p className="text-xs font-semibold" style={{ color: '#F5A623' }}>{demoText}</p>
          <p className="text-xs mt-1" style={{ color: '#7B8BA3' }}>{demoAccount}</p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#4A5C75' }}>
          {copyright}
        </p>
      </div>
    </div>
  )
}
