'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const navItems = [
  {
    id: 'dashboard', path: '/', label: 'Remote Operation Center',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>),
  },
  {
    id: 'fleet', path: '/fleet', label: 'Fleet Management',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>),
  },
  {
    id: 'fuel', path: '/fuel', label: 'Fuel & Cost Monitor',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 22V10l9-8 9 8v12H3z" /><path d="M9 22V12h6v10" /><path d="M19 5v2" /><circle cx="19" cy="9" r="2" /></svg>),
  },
  {
    id: 'operator', path: '/operator', label: 'Operator Performance',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
  },
  {
    id: 'safety', path: '/safety', label: 'Safety & Alert',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
  },
]

export default function Sidebar({ onLogout, user }: { onLogout: () => void; user?: { email: string; role: string } }) {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [siteTitle, setSiteTitle] = useState('PAMA Smart')
  const [siteSub, setSiteSub] = useState('Mining Platform')

  useEffect(() => {
    try {
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((row: any) => { map[row.key] = row.value })
        if (map.logo_url) setLogoUrl(map.logo_url)
        if (map.site_title) { const parts = map.site_title.split(' '); setSiteTitle(parts.slice(0, 2).join(' ')); setSiteSub(parts.slice(2).join(' ') || 'Mining Platform') }
      }
    }).catch(() => {})
    } catch {}
  }, [])

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-40"
      style={{
        width: collapsed ? '64px' : '240px',
        background: 'linear-gradient(180deg, #060D1A 0%, #0A1A35 100%)',
        borderRight: '1px solid #152244',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: '#152244' }}>
        <div className="flex items-center justify-center rounded-lg font-black text-xs flex-shrink-0" style={{ width: 36, height: 36, background: logoUrl ? 'transparent' : '#F5A623' }}>
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt="Logo" className="w-7 h-7 object-contain" />
          ) : (
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
              <circle cx="16" cy="16" r="14" fill="none" stroke="#060D1A" strokeWidth="2" />
              <path d="M8 22L14 8L18 18L24 10L30 22H8Z" fill="#060D1A" />
            </svg>
          )}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-sm leading-tight">{siteTitle}</div>
            <div className="text-xs leading-tight" style={{ color: '#F5A623' }}>{siteSub}</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
          </svg>
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              title={collapsed ? item.label : undefined}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
              style={{
                background: active ? 'rgba(245,166,35,0.12)' : 'transparent',
                borderLeft: active ? '3px solid #F5A623' : '3px solid transparent',
                color: active ? '#F5A623' : '#7B8BA3',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium leading-tight">{item.label}</span>}
            </button>
          )
        })}

        {/* Admin link - only for admin role */}
        {user?.role === 'Admin' && (
          <button
            onClick={() => router.push('/admin')}
            title={collapsed ? 'Pengaturan' : undefined}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
            style={{
              background: pathname === '/admin' ? 'rgba(245,166,35,0.12)' : 'transparent',
              borderLeft: pathname === '/admin' ? '3px solid #F5A623' : '3px solid transparent',
              color: pathname === '/admin' ? '#F5A623' : '#7B8BA3',
            }}
            onMouseEnter={(e) => { if (pathname !== '/admin') e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={(e) => { if (pathname !== '/admin') e.currentTarget.style.background = 'transparent' }}
          >
            <span className="flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </span>
            {!collapsed && <span className="text-sm font-medium leading-tight">Pengaturan</span>}
          </button>
        )}
      </nav>

      <div className="border-t p-3" style={{ borderColor: '#152244' }}>
        {!collapsed && (
          <div className="text-xs mb-3 px-1" style={{ color: '#4A5C75' }}>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: '#2ECC71' }} /><span>System Online</span></div>
            {user && <div className="mt-1">{user.email}</div>}
            {user && <div className="text-xs mt-0.5" style={{ color: '#F5A623' }}>{user.role}</div>}
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          style={{ color: '#4A5C75' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#E74C3C'; e.currentTarget.style.background = 'rgba(231,76,60,0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#4A5C75'; e.currentTarget.style.background = 'transparent' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
