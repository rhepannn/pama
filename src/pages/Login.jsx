import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email });
    }, 900);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0D1117 0%, #161B22 60%, #1F2937 100%)' }}
    >
      {/* Background grid decoration */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#FFB800 1px, transparent 1px), linear-gradient(90deg, #FFB800 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Accent blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFB800 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)', transform: 'translate(50%, 50%)' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-2xl"
            style={{ background: '#FFB800' }}>
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
              <path d="M6 34L14 10L20 26L26 16L34 34H6Z" fill="#1A1A2E" strokeWidth="0" />
              <circle cx="20" cy="10" r="3" fill="#1A1A2E" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">PAMA Smart Mining</h1>
          <p className="text-sm mt-1" style={{ color: '#8B949E' }}>
            Digital Platform · PT Pamapersada Nusantara
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <h2 className="text-lg font-semibold text-white mb-6">Masuk ke Sistem</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm text-red-300 bg-red-900/30 border border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8B949E' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@pamapersada.co.id"
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all"
                style={{
                  background: '#0D1117',
                  border: '1px solid #30363D',
                  caretColor: '#FFB800',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                onBlur={(e) => (e.target.style.borderColor = '#30363D')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8B949E' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all"
                style={{
                  background: '#0D1117',
                  border: '1px solid #30363D',
                  caretColor: '#FFB800',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#FFB800')}
                onBlur={(e) => (e.target.style.borderColor = '#30363D')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 mt-2"
              style={{
                background: loading ? '#9a7000' : '#FFB800',
                color: '#0D1117',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: '#484F58' }}>
            Remote Operation Center · Balikpapan Site
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#484F58' }}>
          © 2026 PT Pamapersada Nusantara. All rights reserved.
        </p>
      </div>
    </div>
  );
}
