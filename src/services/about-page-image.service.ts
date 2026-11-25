import {
  deleteMediaByKey,
  getMediaBlobByKey,
  saveMediaFileByKey,
} from './media-key.service'

export type AboutPageImageKey =
  | 'hero'
  | 'story'
  | 'story-secondary'
  | 'owner'
  | `journey:${string}`

function getStorageKey(key: AboutPageImageKey): string {
  return `about-page:${key}`
}

export async function saveAboutPageImage(
  key: AboutPageImageKey,
  file: File,
): Promise<void> {
  await saveMediaFileByKey(getStorageKey(key), file)
}

export async function getAboutPageImage(
  key: AboutPageImageKey,
): Promise<Blob | null> {
  return getMediaBlobByKey(getStorageKey(key))
}

export async function deleteAboutPageImage(
  key: AboutPageImageKey,
): Promise<void> {
  await deleteMediaByKey(getStorageKey(key))
}
