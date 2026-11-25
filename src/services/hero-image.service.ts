import { api } from './api'
import {
  deleteMediaByKey,
  getMediaBlobByKey,
  saveMediaFileByKey,
} from './media-key.service'

const HERO_IMAGE_KEY = 'hero-image'
const getHeroSlideImageKey = (
  slideId: string,
  device: 'desktop' | 'mobile',
): string => `hero-slide:${slideId}:${device}`

export async function saveHeroImage(file: File): Promise<void> {
  await saveMediaFileByKey(HERO_IMAGE_KEY, file)
}

export async function getHeroImage(): Promise<Blob | null> {
  return getMediaBlobByKey(HERO_IMAGE_KEY)
}

export async function deleteHeroImage(): Promise<void> {
  await deleteMediaByKey(HERO_IMAGE_KEY)
}

export async function saveHeroSlideImage(
  slideId: string,
  file: File,
  device: 'desktop' | 'mobile' = 'desktop',
): Promise<void> {
  await saveMediaFileByKey(getHeroSlideImageKey(slideId, device), file)
}

export async function getHeroSlideImage(
  slideId: string,
  device: 'desktop' | 'mobile' = 'desktop',
): Promise<Blob | null> {
  return getMediaBlobByKey(getHeroSlideImageKey(slideId, device))
}

export async function deleteHeroSlideImage(
  slideId: string,
  device?: 'desktop' | 'mobile',
): Promise<void> {
  if (device) {
    await deleteMediaByKey(getHeroSlideImageKey(slideId, device))
    return
  }

  await Promise.all([
    deleteMediaByKey(getHeroSlideImageKey(slideId, 'desktop')),
    deleteMediaByKey(getHeroSlideImageKey(slideId, 'mobile')),
  ])
}

export async function uploadHeroImageToServer(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string
        const data = await api.media.upload(file.name, file.type, base64Data)
        resolve(data.url)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
