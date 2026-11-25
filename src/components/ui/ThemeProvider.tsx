
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { themeConfig as defaultThemeConfig } from '../../config'
import { api } from '../../services/api'
import type { ThemeConfig } from '../../types/site.types'

interface ThemeProviderProps {
  children: ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeConfig>(defaultThemeConfig)

  useEffect(() => {
    let active = true
    api.settings.getTheme()
      .then((res) => {
        if (active && res?.success && res?.data) {
          setTheme((prev) => ({
            ...prev,
            ...res.data,
            colors: { ...prev.colors, ...(res.data.colors || {}) },
            typography: { ...prev.typography, ...(res.data.typography || {}) },
            appearance: { ...prev.appearance, ...(res.data.appearance || {}) },
            sections: { ...prev.sections, ...(res.data.sections || {}) },
          }))
        }
      })
      .catch((err) => {
        console.error('Failed to load theme settings from database:', err)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const { colors, typography, appearance, sections } = theme

    if (colors) {
      if (colors.primary) root.style.setProperty('--color-primary', colors.primary)
      if (colors.secondary) root.style.setProperty('--color-secondary', colors.secondary)
      if (colors.background) root.style.setProperty('--color-background', colors.background)
      if (colors.surface) root.style.setProperty('--color-surface', colors.surface)
      if (colors.text) root.style.setProperty('--color-text', colors.text)
      if (colors.muted) root.style.setProperty('--color-muted', colors.muted)
    }

    if (typography) {
      if (typography.headingFont) root.style.setProperty('--font-heading', typography.headingFont)
      if (typography.bodyFont) root.style.setProperty('--font-body', typography.bodyFont)
    }

    if (appearance) {
      if (appearance.preset) root.dataset.theme = appearance.preset
      if (appearance.headerStyle) root.dataset.headerStyle = appearance.headerStyle
      if (appearance.cardStyle) root.dataset.cardStyle = appearance.cardStyle
    }

    if (sections) {
      Object.entries(sections).forEach(([sectionName, sectionTheme]) => {
        if (sectionTheme && typeof sectionTheme === 'object') {
          Object.entries(sectionTheme).forEach(([property, value]) => {
            root.style.setProperty(`--${sectionName}-${property}`, String(value))
          })
        }
      })
    }
  }, [theme])

  return <>{children}</>
}

export default ThemeProvider
