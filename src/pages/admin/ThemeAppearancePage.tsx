import { useEffect, useState } from 'react'
import {
  Palette,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Type,
} from 'lucide-react'
import { api } from '../../services/api'
import type { ThemeConfig } from '../../types/site.types'
import { themeConfig as defaultTheme } from '../../config'
import { toast } from '../../components/ui/Toast'
import './ThemeAppearancePage.css'

function ThemeAppearancePage() {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    api.settings
      .getTheme()
      .then((res) => {
        if (active && res?.success && res?.data) {
          setTheme((prev) => ({
            ...prev,
            ...res.data,
            colors: { ...prev.colors, ...(res.data.colors || {}) },
            typography: { ...prev.typography, ...(res.data.typography || {}) },
            appearance: { ...prev.appearance, ...(res.data.appearance || {}) },
          }))
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load theme')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
    setTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }))
  }

  const handleAppearanceChange = (key: keyof ThemeConfig['appearance'], value: string) => {
    setTheme((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }))
  }

  const handleTypographyChange = (key: keyof ThemeConfig['typography'], value: string) => {
    setTheme((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
      },
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    try {
      const res = await api.settings.updateTheme(theme)
      setFeedback({ type: 'success', message: (res as any).message || 'Theme updated successfully!' })

      // Real-time apply to CSS root
      const root = document.documentElement
      if (theme.colors) {
        root.style.setProperty('--color-primary', theme.colors.primary)
        root.style.setProperty('--color-secondary', theme.colors.secondary)
        root.style.setProperty('--color-background', theme.colors.background)
        root.style.setProperty('--color-surface', theme.colors.surface)
        root.style.setProperty('--color-text', theme.colors.text)
        root.style.setProperty('--color-muted', theme.colors.muted)
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save theme' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset theme colors and typography to defaults?')) return
    setTheme(defaultTheme)
    setIsSaving(true)
    try {
      await api.settings.updateTheme(defaultTheme)
      setFeedback({ type: 'success', message: 'Theme reset to defaults and saved!' })

      const root = document.documentElement
      if (defaultTheme.colors) {
        root.style.setProperty('--color-primary', defaultTheme.colors.primary)
        root.style.setProperty('--color-secondary', defaultTheme.colors.secondary)
        root.style.setProperty('--color-background', defaultTheme.colors.background)
        root.style.setProperty('--color-surface', defaultTheme.colors.surface)
        root.style.setProperty('--color-text', defaultTheme.colors.text)
        root.style.setProperty('--color-muted', defaultTheme.colors.muted)
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save default theme' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="theme-page">
      <div className="theme-heading">
        <div>
          <span className="theme-eyebrow">CUSTOMIZATION & STYLING</span>
          <h1>Theme & Appearance</h1>
          <p>Control website brand colors, typography, and preset appearance dynamically in MongoDB.</p>
        </div>
      </div>

      {feedback && (
        <div className={`theme-alert ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {isLoading ? (
        <p className="theme-loading">Loading theme settings...</p>
      ) : (
        <form onSubmit={handleSave} className="theme-form-layout">
          {/* COLOR PALETTE */}
          <div className="theme-card">
            <div className="theme-card-header">
              <Palette size={20} className="theme-card-icon" />
              <div>
                <h2>Brand Color Palette</h2>
                <p>Primary, secondary, and accent colors reflected across the public website</p>
              </div>
            </div>

            <div className="theme-colors-grid">
              <div className="theme-color-item">
                <label>Primary Brand Color</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    value={theme.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                  />
                </div>
              </div>

              <div className="theme-color-item">
                <label>Secondary / Accent Dark</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    value={theme.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                  />
                </div>
              </div>

              <div className="theme-color-item">
                <label>Background Color</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    value={theme.colors.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.colors.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                  />
                </div>
              </div>

              <div className="theme-color-item">
                <label>Surface / Card Background</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    value={theme.colors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.colors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                  />
                </div>
              </div>

              <div className="theme-color-item">
                <label>Primary Text Color</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    value={theme.colors.text}
                    onChange={(e) => handleColorChange('text', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.colors.text}
                    onChange={(e) => handleColorChange('text', e.target.value)}
                  />
                </div>
              </div>

              <div className="theme-color-item">
                <label>Muted Text Color</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    value={theme.colors.muted}
                    onChange={(e) => handleColorChange('muted', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.colors.muted}
                    onChange={(e) => handleColorChange('muted', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TYPOGRAPHY & APPEARANCE */}
          <div className="theme-card">
            <div className="theme-card-header">
              <Type size={20} className="theme-card-icon" />
              <div>
                <h2>Typography & Appearance</h2>
                <p>Header styles, fonts, and card presets</p>
              </div>
            </div>

            <div className="theme-appearance-grid">
              <div className="theme-field">
                <label>Heading Font</label>
                <select
                  value={theme.typography.headingFont}
                  onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                >
                  <option value="Arial">Arial (Clean Sans)</option>
                  <option value="'Noto Sans Bengali', sans-serif">Noto Sans Bengali</option>
                  <option value="'Teko', sans-serif">Teko (Tall Display)</option>
                  <option value="'Black Ops One', cursive">Black Ops One (Bold)</option>
                  <option value="Georgia, serif">Georgia (Editorial Serif)</option>
                </select>
              </div>

              <div className="theme-field">
                <label>Body Font</label>
                <select
                  value={theme.typography.bodyFont}
                  onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
                >
                  <option value="Arial">Arial (Standard)</option>
                  <option value="'Noto Sans Bengali', sans-serif">Noto Sans Bengali</option>
                  <option value="system-ui, sans-serif">System UI</option>
                  <option value="'Segoe UI', Roboto, sans-serif">Segoe UI / Roboto</option>
                </select>
              </div>

              <div className="theme-field">
                <label>Header Style Preset</label>
                <select
                  value={theme.appearance.headerStyle}
                  onChange={(e) => handleAppearanceChange('headerStyle', e.target.value)}
                >
                  <option value="transparent">Transparent / Floating</option>
                  <option value="solid">Solid Background</option>
                  <option value="blur">Glassmorphic Blur</option>
                </select>
              </div>

              <div className="theme-field">
                <label>Card Style Preset</label>
                <select
                  value={theme.appearance.cardStyle}
                  onChange={(e) => handleAppearanceChange('cardStyle', e.target.value)}
                >
                  <option value="transparent">Minimal Border</option>
                  <option value="elevated">Soft Elevation Shadow</option>
                  <option value="solid">Filled Solid Surface</option>
                </select>
              </div>
            </div>

            {/* LIVE PREVIEW BOX */}
            <div className="theme-preview-box">
              <span className="preview-label">Live Preview Preview</span>
              <div
                className="preview-content-card"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.muted,
                  color: theme.colors.text,
                }}
              >
                <h3
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.typography.headingFont,
                  }}
                >
                  Green Line Seed Store
                </h3>
                <p style={{ color: theme.colors.muted, fontFamily: theme.typography.bodyFont }}>
                  High quality agricultural seeds and modern farming solutions.
                </p>
                <button
                  type="button"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Explore Seeds
                </button>
              </div>
            </div>

            <div className="theme-footer-actions">
              <button
                type="button"
                className="theme-reset-btn"
                onClick={handleReset}
              >
                <RotateCcw size={16} /> Reset Defaults
              </button>

              <button
                type="submit"
                className="theme-save-btn"
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Theme Appearance'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default ThemeAppearancePage
