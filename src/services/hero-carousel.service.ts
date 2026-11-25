import type {
  HeroCarouselContent,
  HeroSlide,
} from '../types/site.types'
import { api } from './api'

const EMPTY_HERO_CAROUSEL: HeroCarouselContent = {
  slides: [],
  settings: {
    autoplay: true,
    interval: 6000,
    transition: 'fade',
    showArrows: true,
    showIndicators: true,
  },
}

let cachedCarousel: HeroCarouselContent | null = null

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string'
}

function isValidButton(value: unknown): boolean {
  if (!isRecord(value)) return false
  return typeof value.label === 'string' && typeof value.link === 'string'
}

function isValidHeroSlide(value: unknown): value is HeroSlide {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    typeof value.enabled === 'boolean' &&
    typeof value.eyebrow === 'string' &&
    typeof value.title === 'string' &&
    typeof value.highlightedTitle === 'string' &&
    typeof value.description === 'string' &&
    isOptionalString(value.imageUrl) &&
    isOptionalString(value.imageAlt) &&
    isOptionalString(value.mobileImageUrl) &&
    isValidButton(value.primaryButton) &&
    isValidButton(value.secondaryButton) &&
    (value.tertiaryButton === undefined || isValidButton(value.tertiaryButton))
  )
}

function isValidCarouselContent(value: unknown): value is HeroCarouselContent {
  if (!isRecord(value) || !isRecord(value.settings)) return false
  const { settings, slides } = value
  return (
    Array.isArray(slides) &&
    slides.every(isValidHeroSlide) &&
    typeof settings.autoplay === 'boolean' &&
    typeof settings.interval === 'number' &&
    Number.isFinite(settings.interval) &&
    settings.interval > 0 &&
    settings.transition === 'fade' &&
    typeof settings.showArrows === 'boolean' &&
    typeof settings.showIndicators === 'boolean'
  )
}

function normalizeCarousel(parsed: HeroCarouselContent): HeroCarouselContent {
  return {
    slides: parsed.slides,
    settings: {
      ...EMPTY_HERO_CAROUSEL.settings,
      ...parsed.settings,
    },
  }
}

export function getHeroCarouselContent(): HeroCarouselContent {
  return cachedCarousel ?? EMPTY_HERO_CAROUSEL
}

export async function fetchHeroCarouselContent(): Promise<HeroCarouselContent> {
  try {
    const res = await api.heroCarousel.get()
    if (res.success && isValidCarouselContent(res.data)) {
      cachedCarousel = normalizeCarousel(res.data)
      return cachedCarousel
    }
  } catch (error) {
    console.error('Failed to fetch Hero Carousel from database:', error)
  }
  return getHeroCarouselContent()
}

export async function saveHeroCarouselContent(
  content: HeroCarouselContent,
): Promise<void> {
  const res = await api.heroCarousel.update(content)
  cachedCarousel =
    res.success && isValidCarouselContent(res.data)
      ? normalizeCarousel(res.data)
      : normalizeCarousel(content)
}

export async function resetHeroCarouselContent(): Promise<HeroCarouselContent> {
  const res = await api.heroCarousel.reset()
  if (res.success && isValidCarouselContent(res.data)) {
    cachedCarousel = normalizeCarousel(res.data)
    return cachedCarousel
  }
  return fetchHeroCarouselContent()
}
