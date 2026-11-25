import type { AboutPageContent } from '../types/site.types'
import { api } from './api'

const EMPTY_ABOUT_PAGE: AboutPageContent = {
  eyebrow: '',
  title: '',
  description: '',
  image: '',
  story: {
    eyebrow: '',
    title: '',
    description: [],
    image: '',
    secondaryImage: '',
    imageCaption: '',
  },
  journey: [],
  highlights: [],
  values: [],
  achievements: [],
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
  closing: {
    eyebrow: '',
    title: '',
    description: '',
    buttonLabel: '',
    buttonLink: '#contact',
  },
  sectionVisibility: {
    hero: true,
    story: true,
    owner: true,
    journey: true,
    missionVision: false,
    values: false,
    achievements: false,
    closing: false,
  },
  missionVision: {
    mission: { title: '', description: '' },
    vision: { title: '', description: '' },
  },
}

let cachedAboutPage: AboutPageContent | null = null

function normalizeAboutPage(raw: Partial<AboutPageContent>): AboutPageContent {
  return {
    ...EMPTY_ABOUT_PAGE,
    ...raw,
    story: {
      ...EMPTY_ABOUT_PAGE.story,
      ...(raw.story ?? {}),
      description: Array.isArray(raw.story?.description) ? raw.story.description : [],
    },
    owner: {
      ...EMPTY_ABOUT_PAGE.owner,
      ...(raw.owner ?? {}),
    },
    closing: {
      ...EMPTY_ABOUT_PAGE.closing,
      ...(raw.closing ?? {}),
    },
    missionVision: {
      mission: {
        ...EMPTY_ABOUT_PAGE.missionVision.mission,
        ...(raw.missionVision?.mission ?? {}),
      },
      vision: {
        ...EMPTY_ABOUT_PAGE.missionVision.vision,
        ...(raw.missionVision?.vision ?? {}),
      },
    },
    sectionVisibility: {
      ...EMPTY_ABOUT_PAGE.sectionVisibility,
      ...(raw.sectionVisibility ?? {}),
    },
    journey: Array.isArray(raw.journey) ? raw.journey : [],
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
    values: Array.isArray(raw.values) ? raw.values : [],
    achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
  }
}

export function getAboutPageContent(): AboutPageContent {
  return cachedAboutPage ?? EMPTY_ABOUT_PAGE
}

export async function fetchAboutPageContent(): Promise<AboutPageContent> {
  try {
    const res = await api.aboutPage.get()
    if (res.success && res.data) {
      const { _id, ...cleanData } = res.data
      void _id
      cachedAboutPage = normalizeAboutPage(cleanData)
      return cachedAboutPage
    }
  } catch (error) {
    console.error('Failed to fetch About Us page content from database:', error)
  }
  return getAboutPageContent()
}

export async function saveAboutPageContent(
  content: AboutPageContent,
): Promise<void> {
  const res = await api.aboutPage.update(content)
  if (res.success && res.data) {
    const { _id, ...cleanData } = res.data
    void _id
    cachedAboutPage = normalizeAboutPage(cleanData)
  } else {
    cachedAboutPage = normalizeAboutPage(content)
  }
}

export async function resetAboutPageContent(): Promise<AboutPageContent> {
  const res = await api.aboutPage.reset()
  if (res.success && res.data) {
    const { _id, ...cleanData } = res.data
    void _id
    cachedAboutPage = normalizeAboutPage(cleanData)
    return cachedAboutPage
  }
  return fetchAboutPageContent()
}
