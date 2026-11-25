import {
  deleteMediaByKey,
  getMediaBlobByKey,
  saveMediaFileByKey,
} from './media-key.service'

const getGalleryImageKey = (imageId: string): string =>
  `gallery-image:${imageId}`

export async function saveGalleryImage(
  imageId: string,
  file: File,
): Promise<void> {
  await saveMediaFileByKey(getGalleryImageKey(imageId), file)
}

export async function getGalleryImage(
  imageId: string,
): Promise<Blob | null> {
  return getMediaBlobByKey(getGalleryImageKey(imageId))
}

export async function deleteGalleryImage(
  imageId: string,
): Promise<void> {
  await deleteMediaByKey(getGalleryImageKey(imageId))
}
