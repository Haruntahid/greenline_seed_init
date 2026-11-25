import type { GalleryContent } from '../types/site.types'
import { api } from './api'

const EMPTY_GALLERY: GalleryContent = {
  eyebrow: '',
  title: '',
  description: '',
  items: [],
}

let cachedGallery: GalleryContent | null = null

export const getGalleryContent = (): GalleryContent => {
  return cachedGallery ?? EMPTY_GALLERY
}

export const fetchGalleryContent = async (): Promise<GalleryContent> => {
  try {
    const res = await api.gallery.get()
    if (res.success && res.data) {
      const { _id, ...cleanData } = res.data
      void _id
      cachedGallery = {
        eyebrow: cleanData.eyebrow ?? '',
        title: cleanData.title ?? '',
        description: cleanData.description ?? '',
        items: Array.isArray(cleanData.items) ? cleanData.items : [],
      }
      return cachedGallery
    }
  } catch (error) {
    console.error('Failed to fetch Gallery content from database:', error)
  }
  return getGalleryContent()
}

export const saveGalleryContent = async (
  content: GalleryContent,
): Promise<void> => {
  const res = await api.gallery.update(content)
  if (res.success && res.data) {
    const { _id, ...cleanData } = res.data
    void _id
    cachedGallery = {
      eyebrow: cleanData.eyebrow ?? content.eyebrow,
      title: cleanData.title ?? content.title,
      description: cleanData.description ?? content.description,
      items: Array.isArray(cleanData.items) ? cleanData.items : content.items,
    }
  } else {
    cachedGallery = content
  }
}

export const resetGalleryContent = async (): Promise<GalleryContent> => {
  const res = await api.gallery.reset()
  if (res.success && res.data) {
    const { _id, ...cleanData } = res.data
    void _id
    cachedGallery = {
      eyebrow: cleanData.eyebrow ?? '',
      title: cleanData.title ?? '',
      description: cleanData.description ?? '',
      items: Array.isArray(cleanData.items) ? cleanData.items : [],
    }
    return cachedGallery
  }
  return fetchGalleryContent()
}
