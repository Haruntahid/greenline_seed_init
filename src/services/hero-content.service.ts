import type { HeroContent } from '../types/site.types'
import { api } from './api'

const EMPTY_HERO: HeroContent = {
  eyebrow: '',
  title: '',
  highlightedTitle: '',
  description: '',
  imageUrl: '',
  imageAlt: '',
  primaryButton: { label: '', link: '/products' },
  secondaryButton: { label: '', link: '/about' },
}

let cachedHero: HeroContent | null = null

export function getHeroContent(): HeroContent {
  return cachedHero ?? EMPTY_HERO
}

export async function fetchHeroContent(): Promise<HeroContent> {
  try {
    const res = await api.hero.get()
    if (res.success && res.data) {
      const { _id, ...clean } = res.data
      void _id
      cachedHero = { ...EMPTY_HERO, ...clean } as HeroContent
      return cachedHero
    }
  } catch (error) {
    console.error('Failed to fetch Hero content from database:', error)
  }
  return getHeroContent()
}

export async function saveHeroContent(content: HeroContent): Promise<void> {
  const res = await api.hero.update(content)
  if (res.success && res.data) {
    const { _id, ...clean } = res.data
    void _id
    cachedHero = { ...EMPTY_HERO, ...clean } as HeroContent
  } else {
    cachedHero = content
  }
}

export async function resetHeroContent(): Promise<HeroContent> {
  const res = await api.hero.reset()
  if (res.success && res.data) {
    const { _id, ...clean } = res.data
    void _id
    cachedHero = { ...EMPTY_HERO, ...clean } as HeroContent
    return cachedHero
  }
  return fetchHeroContent()
}
