'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Toast from '@/components/Toast'

const DEFAULT_SETTINGS: Record<string, string> = {
  site_title: 'PAMA Smart Mining',
  site_subtitle: 'Digital Platform · PT Pamapersada Nusantara',
  login_heading: 'Masuk ke Sistem',
  site_footer: 'Remote Operation Center · Balikpapan Site',
  copyright: '© 2026 PT Pamapersada Nusantara. All rights reserved.',
  demo_text: 'Akun Demo',
  demo_account: 'admin@pama.co.id / pama2026',
  logo_url: '',
}

const FIELD_LABELS: Record<string, string> = {
  site_title: 'Judul Situs',
  site_subtitle: 'Subtitle',
  login_heading: 'Heading Form Login',
  site_footer: 'Footer Teks',
  copyright: 'Copyright',
  demo_text: 'Label Akun Demo',
  demo_account: 'Info Akun Demo',
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({ ...DEFAULT_SETTINGS })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
    const { data } = await supabase.from('site_settings').select('*')
    if (data && data.length > 0) {
      const map: Record<string, string> = { ...DEFAULT_SETTINGS }
      data.forEach((row: any) => { map[row.key] = row.value })
      setSettings(map)
    }
    } catch (err) { console.error('Admin fetch error:', err) }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const entries = Object.entries(settings).map(([key, value]) => ({ key, value }))
      const { error } = await supabase.from('site_settings').upsert(entries, { onConflict: 'key' })
      if (error) {
        setToast({ message: 'Gagal menyimpan: ' + error.message, type: 'error' })
      } else {
        setToast({ message: 'Pengaturan berhasil disimpan!', type: 'success' })
      }
    } catch {
      setToast({ message: 'Gagal menyimpan', type: 'error' })
    }
    setSaving(false)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: 'Ukuran file maksimal 2MB', type: 'error' })
      return
    }
    if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) {
      setToast({ message: 'Format harus PNG, JPG, SVG, atau WebP', type: 'error' })
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `logo-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('pama-assets')
      .upload(fileName, file, { upsert: true, contentType: file.type })

    if (error) {
      setToast({ message: 'Upload gagal: ' + error.message, type: 'error' })
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('pama-assets').getPublicUrl(fileName)
    if (urlData?.publicUrl) {
      setSettings(prev => ({ ...prev, logo_url: urlData.publicUrl }))
      setToast({ message: 'Logo berhasil diupload!', type: 'success' })
    }
    setUploading(false)
  }

  const handleRemoveLogo = () => {
    setSettings(prev => ({ ...prev, logo_url: '' }))
    setToast({ message: 'Logo direset ke default', type: 'success' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderTopColor: '#F5A623', borderColor: '#152244' }} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-black text-white">Pengaturan Situs</h1>
        <p className="text-sm mt-0.5" style={{ color: '#7B8BA3' }}>Edit landing page, logo, dan branding</p>
      </div>

      {/* Logo Section */}
      <div className="rounded-xl p-5 space-y-4" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
        <h2 className="text-sm font-semibold text-white">Logo</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-xl border" style={{ width: 80, height: 80, background: '#060D1A', borderColor: '#152244' }}>
            {settings.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={settings.logo_url} alt="Logo" className="w-14 h-14 object-contain" />
            ) : (
              <div className="flex items-center justify-center rounded-lg" style={{ width: 48, height: 48, background: '#F5A623' }}>
                <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                  <path d="M5 32L13 10L20 24L27 14L37 32H5Z" fill="#060D1A" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ background: uploading ? '#7B8BA3' : '#F5A623', color: '#060D1A' }}
              >
                {uploading ? 'Uploading...' : settings.logo_url ? 'Ganti Logo' : 'Upload Logo'}
              </button>
              {settings.logo_url && (
                <button
                  onClick={handleRemoveLogo}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(231,76,60,0.15)', color: '#E74C3C', border: '1px solid #E74C3C40' }}
                >
                  Reset Default
                </button>
              )}
            </div>
            <span className="text-xs" style={{ color: '#4A5C75' }}>PNG / JPG / SVG / WebP, max 2MB</span>
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleLogoUpload} className="hidden" />
        </div>

        {/* Preview */}
        <div className="rounded-lg p-4 flex items-center gap-3" style={{ background: '#060D1A', border: '1px solid #152244' }}>
          <span className="text-xs font-semibold uppercase" style={{ color: '#4A5C75' }}>Preview:</span>
          <div className="flex items-center gap-2">
            {settings.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={settings.logo_url} alt="Logo preview" className="h-5 w-auto object-contain" />
            ) : (
              <div className="flex items-center justify-center rounded" style={{ width: 20, height: 20, background: '#F5A623' }}>
                <svg viewBox="0 0 40 40" fill="none" className="w-3 h-3">
                  <path d="M5 32L13 10L20 24L27 14L37 32H5Z" fill="#060D1A" />
                </svg>
              </div>
            )}
            <span className="text-xs font-bold text-white">{settings.site_title || 'PAMA Smart Mining'}</span>
          </div>
        </div>
      </div>

      {/* Text Settings */}
      <div className="rounded-xl p-5 space-y-4" style={{ background: '#0B1A33', border: '1px solid #152244' }}>
        <h2 className="text-sm font-semibold text-white">Konten Landing Page</h2>
        {Object.keys(FIELD_LABELS).map(key => (
          <div key={key}>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7B8BA3' }}>
              {FIELD_LABELS[key]}
            </label>
            {key === 'demo_account' ? (
              <textarea
                value={settings[key]}
                onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}
              />
            ) : (
              <input
                type="text"
                value={settings[key]}
                onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white"
                style={{ background: '#0F1F3D', border: '1px solid #1A3470' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 rounded-lg text-sm font-bold"
        style={{ background: saving ? '#7B8BA3' : '#F5A623', color: '#060D1A' }}
      >
        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </div>
  )
}
