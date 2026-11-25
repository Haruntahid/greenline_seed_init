/**
 * Image upload utility.
 * Uploads images directly using the configured API key and returns the hosted direct image URL.
 */

const API_KEY = 'e306d1cdfe9d953605cdba61902be024'
const UPLOAD_ENDPOINT = `https://api.imgbb.com/1/upload?key=${API_KEY}`

export interface UploadResult {
  url: string
  displayUrl?: string
  deleteUrl?: string
}

/**
 * Upload an image File or Blob to the hosting service and return the direct URL.
 */
export async function uploadImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPEG, PNG, WEBP, GIF, etc.).')
  }

  // Max 32MB allowed by service
  if (file.size > 32 * 1024 * 1024) {
    throw new Error('Image size exceeds 32MB limit.')
  }

  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`Upload failed (${response.status}): ${errorText || 'Server error'}`)
  }

  const json = await response.json()

  if (!json.success || !json.data?.url) {
    throw new Error(json.error?.message || 'Failed to get image URL from upload.')
  }

  return json.data.url
}
