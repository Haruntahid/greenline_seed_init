import type { ServicesContent } from '../types/site.types'
import { api } from './api'

const EMPTY_SERVICES: ServicesContent = {
  eyebrow: '',
  title: '',
  description: '',
  services: [],
}

let cachedServices: ServicesContent | null = null

export function getServicesContent(): ServicesContent {
  return cachedServices ?? EMPTY_SERVICES
}

export async function fetchServicesContent(): Promise<ServicesContent> {
  try {
    const [metaRes, itemsRes] = await Promise.all([
      api.services.getMeta(),
      api.services.list(),
    ])

    cachedServices = {
      eyebrow: metaRes?.data?.eyebrow ?? '',
      title: metaRes?.data?.title ?? '',
      description: metaRes?.data?.description ?? '',
      services: Array.isArray(itemsRes?.data)
        ? itemsRes.data.map(({ _id, ...item }) => {
            void _id
            return item
          })
        : [],
    }
    return cachedServices
  } catch (error) {
    console.error('Failed to fetch Services content from database:', error)
  }
  return getServicesContent()
}

export async function saveServicesContent(content: ServicesContent): Promise<void> {
  await api.services.updateContent(content)
  cachedServices = content
}

export async function resetServicesContent(): Promise<ServicesContent> {
  await api.services.reset()
  return fetchServicesContent()
}
