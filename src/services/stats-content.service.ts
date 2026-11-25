import type { StatItem } from '../config/stats.config'
import { api } from './api'

export interface StatsContent {
  eyebrow: string
  title: string
  description: string
  featuredStatId: string
  stats: StatItem[]
}

const EMPTY_STATS: StatsContent = {
  eyebrow: '',
  title: '',
  description: '',
  featuredStatId: '',
  stats: [],
}

let cachedStats: StatsContent | null = null

export const getStatsContent = (): StatsContent => {
  return cachedStats ?? EMPTY_STATS
}

export const fetchStatsContent = async (): Promise<StatsContent> => {
  try {
    const [metaRes, itemsRes] = await Promise.all([
      api.stats.getMeta(),
      api.stats.list(),
    ])

    cachedStats = {
      eyebrow: metaRes?.data?.eyebrow ?? '',
      title: metaRes?.data?.title ?? '',
      description: metaRes?.data?.description ?? '',
      featuredStatId: metaRes?.data?.featuredStatId ?? '',
      stats: Array.isArray(itemsRes?.data)
        ? itemsRes.data.map(({ _id, ...item }) => {
            void _id
            return item
          })
        : [],
    }
    return cachedStats
  } catch (error) {
    console.error('Failed to fetch Stats content from database:', error)
  }
  return getStatsContent()
}

export const saveStatsContent = async (content: StatsContent): Promise<void> => {
  await api.stats.updateContent(content)
  cachedStats = content
}

export const resetStatsContent = async (): Promise<StatsContent> => {
  await api.stats.reset()
  return fetchStatsContent()
}
