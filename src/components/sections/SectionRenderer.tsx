import { useEffect, useState } from 'react'
import { sectionsConfig } from '../../config/sections.config'
import { api } from '../../services/api'
import type { SectionConfig } from '../../types/site.types'
import { sectionRegistry } from './section-registry'

function SectionRenderer() {
  const [sections, setSections] = useState<SectionConfig[]>(sectionsConfig)

  useEffect(() => {
    let active = true
    void api.settings
      .getSections()
      .then((res) => {
        if (active && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSections(res.data)
        }
      })
      .catch((error) => {
        console.error('Failed to load sections configuration from database:', error)
      })
    return () => {
      active = false
    }
  }, [])

  const enabledSections = sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      {enabledSections.map((section) => {
        const SectionComponent = sectionRegistry[section.id]

        if (!SectionComponent) return null

        return <SectionComponent key={section.id} />
      })}
    </>
  )
}

export default SectionRenderer
