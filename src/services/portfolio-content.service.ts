import type { PortfolioContent } from '../types/site.types'
import { api } from './api'

const EMPTY_PORTFOLIO: PortfolioContent = {
  eyebrow: '',
  title: '',
  description: '',
  features: [],
  projects: [],
  closingCTA: {
    eyebrow: '',
    title: '',
    description: '',
    buttonLabel: '',
    buttonLink: '/#contact',
  },
}

let cachedPortfolio: PortfolioContent | null = null

export const getPortfolioContent = (): PortfolioContent => {
  return cachedPortfolio ?? EMPTY_PORTFOLIO
}

export const fetchPortfolioContent = async (): Promise<PortfolioContent> => {
  try {
    const [metaRes, projectsRes] = await Promise.all([
      api.projects.getMeta(),
      api.projects.list(),
    ])

    cachedPortfolio = {
      eyebrow: metaRes?.data?.eyebrow ?? '',
      title: metaRes?.data?.title ?? '',
      description: metaRes?.data?.description ?? '',
      features: Array.isArray(metaRes?.data?.features) ? metaRes.data.features : [],
      closingCTA: metaRes?.data?.closingCTA ?? EMPTY_PORTFOLIO.closingCTA,
      projects: Array.isArray(projectsRes?.data)
        ? projectsRes.data.map(({ _id, ...project }) => {
            void _id
            return project
          })
        : [],
    }
    return cachedPortfolio
  } catch (error) {
    console.error('Failed to fetch Portfolio content from database:', error)
  }
  return getPortfolioContent()
}

export const savePortfolioContent = async (content: PortfolioContent): Promise<void> => {
  await api.projects.updateContent(content)
  cachedPortfolio = content
}

export const resetPortfolioContent = async (): Promise<PortfolioContent> => {
  await api.projects.reset()
  return fetchPortfolioContent()
}
