'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import LoginForm from '@/components/LoginForm'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <html lang="id">
        <body style={{ margin: 0, background: '#060D1A' }}>
          <div style={{ minHeight: '100vh', background: '#060D1A' }} />
        </body>
      </html>
    )
  }

  if (!user) {
    return (
      <html lang="id">
        <body style={{ margin: 0 }}>
          <LoginForm onLogin={(u) => setUser(u)} />
        </body>
      </html>
    )
  }

  const handleLogout = () => { setUser(null); router.push('/') }

  return (
    <html lang="id">
      <body style={{ margin: 0 }}>
        <div className="flex h-screen overflow-hidden" style={{ background: '#060D1A' }}>
          <Sidebar onLogout={handleLogout} user={user} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
