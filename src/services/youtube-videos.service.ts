import type {
  YouTubeVideo,
  YouTubeVideosContent,
} from '../types/site.types'
import { api } from './api'

const EMPTY_YOUTUBE: YouTubeVideosContent = {
  eyebrow: '',
  title: '',
  description: '',
  videos: [],
  settings: {
    autoplay: true,
    interval: 6000,
    showArrows: true,
    showIndicators: true,
  },
}

let cachedYouTube: YouTubeVideosContent | null = null

function isValidVideo(value: unknown): value is YouTubeVideo {
  if (!value || typeof value !== 'object') return false
  const video = value as Partial<YouTubeVideo>
  return (
    typeof video.id === 'string' &&
    typeof video.videoId === 'string' &&
    typeof video.title === 'string' &&
    typeof video.description === 'string' &&
    typeof video.category === 'string' &&
    typeof video.featured === 'boolean' &&
    typeof video.enabled === 'boolean' &&
    typeof video.order === 'number'
  )
}

function isValidYouTubeVideosContent(
  value: unknown,
): value is YouTubeVideosContent {
  if (!value || typeof value !== 'object') return false
  const content = value as Partial<YouTubeVideosContent>
  const settings = content.settings
  return (
    typeof content.eyebrow === 'string' &&
    typeof content.title === 'string' &&
    typeof content.description === 'string' &&
    Array.isArray(content.videos) &&
    content.videos.every(isValidVideo) &&
    !!settings &&
    typeof settings.autoplay === 'boolean' &&
    typeof settings.interval === 'number' &&
    typeof settings.showArrows === 'boolean' &&
    typeof settings.showIndicators === 'boolean'
  )
}

function normalizeYouTubeContent(parsed: YouTubeVideosContent): YouTubeVideosContent {
  return {
    eyebrow: parsed.eyebrow,
    title: parsed.title,
    description: parsed.description,
    videos: parsed.videos,
    settings: {
      ...EMPTY_YOUTUBE.settings,
      ...parsed.settings,
    },
  }
}

export function getYouTubeVideosContent(): YouTubeVideosContent {
  return cachedYouTube ?? EMPTY_YOUTUBE
}

export async function fetchYouTubeVideosContent(): Promise<YouTubeVideosContent> {
  try {
    const res = await api.youtubeVideos.get()
    if (res.success && isValidYouTubeVideosContent(res.data)) {
      cachedYouTube = normalizeYouTubeContent(res.data)
      return cachedYouTube
    }
  } catch (error) {
    console.error('Failed to fetch YouTube Videos from database:', error)
  }
  return getYouTubeVideosContent()
}

export async function saveYouTubeVideosContent(
  content: YouTubeVideosContent,
): Promise<void> {
  const res = await api.youtubeVideos.update(content)
  cachedYouTube =
    res.success && isValidYouTubeVideosContent(res.data)
      ? normalizeYouTubeContent(res.data)
      : normalizeYouTubeContent(content)
}

export async function resetYouTubeVideosContent(): Promise<YouTubeVideosContent> {
  const res = await api.youtubeVideos.reset()
  if (res.success && isValidYouTubeVideosContent(res.data)) {
    cachedYouTube = normalizeYouTubeContent(res.data)
    return cachedYouTube
  }
  return fetchYouTubeVideosContent()
}
