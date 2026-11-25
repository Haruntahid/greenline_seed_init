import {
  deleteMediaByKey,
  getMediaBlobByKey,
  saveMediaFileByKey,
} from './media-key.service'

const ABOUT_IMAGE_KEY = 'about-image'

export async function saveAboutImage(file: File): Promise<void> {
  await saveMediaFileByKey(ABOUT_IMAGE_KEY, file)
}

export async function getAboutImage(): Promise<Blob | null> {
  return getMediaBlobByKey(ABOUT_IMAGE_KEY)
}

export async function deleteAboutImage(): Promise<void> {
  await deleteMediaByKey(ABOUT_IMAGE_KEY)
}
