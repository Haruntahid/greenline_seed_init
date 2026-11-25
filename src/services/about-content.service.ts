import type { AboutContent } from '../types/site.types'
import { api } from './api'

const EMPTY_ABOUT: AboutContent = {
  eyebrow: '',
  title: '',
  description: '',
  image: '',
  highlights: [],
  owner: {
    eyebrow: '',
    title: '',
    name: '',
    designation: '',
    image: '',
    quote: '',
    message: '',
    signature: '',
  },
}

let cachedAbout: AboutContent | null = null

export function getAboutContent(): AboutContent {
  return cachedAbout ?? EMPTY_ABOUT
}

export async function fetchAboutContent(): Promise<AboutContent> {
  try {
    const res = await api.about.get()
    if (res.success && res.data) {
      const { _id, ...cleanData } = res.data
      void _id
      cachedAbout = {
        ...EMPTY_ABOUT,
        ...cleanData,
        highlights: Array.isArray(cleanData.highlights) ? cleanData.highlights : [],
      } as AboutContent
      return cachedAbout
    }
  } catch (error) {
    console.error('Failed to fetch About content from database:', error)
  }
  return getAboutContent()
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
  const res = await api.about.update(content)
  if (res.success && res.data) {
    const { _id, ...cleanData } = res.data
    void _id
    cachedAbout = { ...EMPTY_ABOUT, ...cleanData } as AboutContent
  } else {
    cachedAbout = content
  }
}

export async function resetAboutContent(): Promise<AboutContent> {
  const res = await api.about.reset()
  if (res.success && res.data) {
    const { _id, ...cleanData } = res.data
    void _id
    cachedAbout = {
      ...EMPTY_ABOUT,
      ...cleanData,
      highlights: Array.isArray(cleanData.highlights) ? cleanData.highlights : [],
    } as AboutContent
    return cachedAbout
  }
  return fetchAboutContent()
}
