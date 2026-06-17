'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import LoginForm from '@/components/LoginForm'
import './globals.css'

function AppContent({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#060D1A' }} />
  }

  if (!user) {
    return <LoginForm onLogin={(u) => setUser(u)} />
  }

  const handleLogout = () => { setUser(null); router.push('/') }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060D1A' }}>
      <Sidebar onLogout={handleLogout} user={user} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0 }}>
        <AppContent>{children}</AppContent>
      </body>
    </html>
  )
}
