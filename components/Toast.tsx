'use client'

import { useEffect, useState } from 'react'

export default function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)'
  const border = type === 'success' ? '#2ECC71' : '#E74C3C'
  const color = type === 'success' ? '#2ECC71' : '#E74C3C'

  return (
    <div className="fixed top-4 right-4 z-[100] animate-[slideIn_0.3s_ease-out] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl" style={{ background: '#0B1A33', border: `1px solid ${border}` }}>
      {type === 'success' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-5 h-5 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-5 h-5 flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      )}
      <span className="text-sm font-medium" style={{ color: '#D4DCE8' }}>{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-500 hover:text-white flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity:0 } to { transform:translateX(0); opacity:1 } }`}</style>
    </div>
  )
}
