'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function LoginForm({ onLogin }: { onLogin: (u: { email: string }) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email dan password wajib diisi.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin({ email })
    }, 900)
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
            style={{ background: 'linear-gradient(135deg, #F5A623, #E8950C)' }}>
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
              <circle cx="20" cy="20" r="17" fill="none" stroke="#060D1A" strokeWidth="2" />
              <path d="M5 32L13 10L20 24L27 14L37 32H5Z" fill="#060D1A" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">PAMA Smart Mining</h1>
          <p className="text-sm mt-1" style={{ color: '#7B8BA3' }}>
            Digital Platform · PT Pamapersada Nusantara
          </p>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: '#0B1A33', border: '1px solid #1A3470' }}>
          <h2 className="text-lg font-semibold text-white mb-6">Masuk ke Sistem</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(231,76,60,0.2)', color: '#E74C3C', border: '1px solid #E74C3C40' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7B8BA3' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@pamapersada.co.id"
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all placeholder-gray-600"
                style={{ background: '#0F1F3D', border: '1px solid #1A3470', caretColor: '#F5A623' }}
                onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
                onBlur={(e) => (e.target.style.borderColor = '#1A3470')}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7B8BA3' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all"
                style={{ background: '#0F1F3D', border: '1px solid #1A3470', caretColor: '#F5A623' }}
                onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
                onBlur={(e) => (e.target.style.borderColor = '#1A3470')}
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 mt-2"
              style={{ background: loading ? '#c47e1a' : '#F5A623', color: '#060D1A', opacity: loading ? 0.8 : 1 }}>
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: '#4A5C75' }}>
            Remote Operation Center · Balikpapan Site
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#4A5C75' }}>
          © 2026 PT Pamapersada Nusantara. All rights reserved.
        </p>
      </div>
    </div>
  )
}
