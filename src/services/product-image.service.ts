import {
  deleteMediaByKey,
  getMediaBlobByKey,
  saveMediaFileByKey,
} from './media-key.service'

const getProductImageKey = (productId: string) =>
  `product:${productId}:main`

const getProductGalleryImageKey = (
  productId: string,
  index: number,
) => `product:${productId}:gallery:${index}`

export async function saveProductImage(
  productId: string,
  file: File,
): Promise<void> {
  await saveMediaFileByKey(getProductImageKey(productId), file)
}

export async function getProductImage(
  productId: string,
): Promise<Blob | null> {
  return getMediaBlobByKey(getProductImageKey(productId))
}

export async function deleteProductImage(
  productId: string,
): Promise<void> {
  await deleteMediaByKey(getProductImageKey(productId))
}

export async function saveProductGalleryImage(
  productId: string,
  index: number,
  file: File,
): Promise<void> {
  await saveMediaFileByKey(getProductGalleryImageKey(productId, index), file)
}

export async function getProductGalleryImage(
  productId: string,
  index: number,
): Promise<Blob | null> {
  return getMediaBlobByKey(getProductGalleryImageKey(productId, index))
}

export async function deleteProductGalleryImages(
  productId: string,
  imageCount: number,
): Promise<void> {
  const deletions: Promise<void>[] = []
  for (let index = 0; index < imageCount; index += 1) {
    deletions.push(deleteMediaByKey(getProductGalleryImageKey(productId, index)))
  }
  await Promise.all(deletions)
}
