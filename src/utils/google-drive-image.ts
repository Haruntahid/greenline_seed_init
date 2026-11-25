/**
 * Converts Google Drive sharing/view/open links into direct thumbnail/image links.
 * Works with:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 * - Plain direct URLs or local /images/... paths (returned as-is)
 */
export function getGoogleDriveImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) return ''
  const trimmed = imageUrl.trim()
  if (!trimmed) return ''

  // Fast check: is this a Google Drive link?
  if (!trimmed.includes('drive.google.com') && !trimmed.includes('googleusercontent.com')) {
    return trimmed
  }

  try {
    // 1. Matches drive.google.com/file/d/FILE_ID
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (fileDMatch && fileDMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${fileDMatch[1]}&sz=w1200`
    }

    // 2. Matches lh3.googleusercontent.com/d/FILE_ID
    const lh3Match = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)
    if (lh3Match && lh3Match[1]) {
      return `https://drive.google.com/thumbnail?id=${lh3Match[1]}&sz=w1200`
    }

    // 3. Search query params (?id=... or &id=...)
    const url = new URL(trimmed)
    const idParam = url.searchParams.get('id')
    if (idParam) {
      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(idParam)}&sz=w1200`
    }

    return trimmed
  } catch {
    // Fallback regex matching in case URL parsing fails
    const match = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`
    }
    return trimmed
  }
}

// Alias for backwards compatibility where convertGoogleDriveUrl is used
export const convertGoogleDriveUrl = getGoogleDriveImageUrl
