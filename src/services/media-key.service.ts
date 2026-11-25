import { API_BASE_URL, api } from './api'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Unable to read image file.'))
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read image file.'))
    reader.readAsDataURL(file)
  })
}

export async function saveMediaFileByKey(key: string, file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Please select a JPG, PNG, or WebP image.')
  }

  const dataUrl = await readFileAsDataUrl(file)
  const response = await api.media.saveByKey(key, file.name, file.type, dataUrl)
  return response.url
}

export async function getMediaBlobByKey(key: string): Promise<Blob | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/media/key/${encodeURIComponent(key)}`,
      { credentials: 'include' },
    )
    if (response.status === 204 || !response.ok) {
      return null
    }
    return await response.blob()
  } catch (error) {
    console.error(`Failed to load media "${key}" from server:`, error)
    return null
  }
}

export async function deleteMediaByKey(key: string): Promise<void> {
  await api.media.deleteByKey(key)
}
