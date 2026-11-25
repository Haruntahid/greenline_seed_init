import type {
  ProductCategory,
  ProductItem,
  ProductsContent,
} from '../types/site.types'
import { api } from './api'

const EMPTY_PRODUCTS: ProductsContent = {
  eyebrow: '',
  title: '',
  description: '',
  categories: [],
  products: [],
}

let cachedProducts: ProductsContent | null = null

function isValidCategory(value: unknown): value is ProductCategory {
  if (!value || typeof value !== 'object') return false
  const category = value as Partial<ProductCategory>
  return (
    typeof category.id === 'string' &&
    typeof category.name === 'string' &&
    (category.description === undefined || typeof category.description === 'string') &&
    typeof category.enabled === 'boolean' &&
    typeof category.order === 'number'
  )
}

function isValidProduct(value: unknown): value is ProductItem {
  if (!value || typeof value !== 'object') return false
  const product = value as Partial<ProductItem>
  return (
    typeof product.id === 'string' &&
    typeof product.sku === 'string' &&
    typeof product.slug === 'string' &&
    typeof product.name === 'string' &&
    typeof product.shortDescription === 'string' &&
    typeof product.description === 'string' &&
    typeof product.categoryId === 'string' &&
    typeof product.image === 'string' &&
    (product.gallery === undefined ||
      (Array.isArray(product.gallery) &&
        product.gallery.every((item) => typeof item === 'string'))) &&
    (product.specifications === undefined ||
      (Array.isArray(product.specifications) &&
        product.specifications.every(
          (item) =>
            !!item &&
            typeof item.label === 'string' &&
            typeof item.value === 'string',
        ))) &&
    typeof product.price === 'number' &&
    (product.discountPrice === undefined || typeof product.discountPrice === 'number') &&
    (product.unit === undefined || typeof product.unit === 'string') &&
    (product.stockStatus === 'in_stock' || product.stockStatus === 'out_of_stock') &&
    typeof product.featured === 'boolean' &&
    typeof product.enabled === 'boolean' &&
    typeof product.order === 'number'
  )
}

function isValidProductsContent(value: unknown): value is ProductsContent {
  if (!value || typeof value !== 'object') return false
  const content = value as Partial<ProductsContent>
  return (
    typeof content.eyebrow === 'string' &&
    typeof content.title === 'string' &&
    typeof content.description === 'string' &&
    Array.isArray(content.categories) &&
    content.categories.every(isValidCategory) &&
    Array.isArray(content.products) &&
    content.products.every(isValidProduct)
  )
}

function stripMongoId<T extends Record<string, unknown>>(item: T): T {
  const { _id, ...rest } = item
  void _id
  return rest as T
}

export function getProductsContent(): ProductsContent {
  return cachedProducts ?? EMPTY_PRODUCTS
}

export async function fetchProductsContent(): Promise<ProductsContent> {
  try {
    const [metaRes, categoriesRes, productsRes] = await Promise.all([
      api.products.getMeta(),
      api.products.getCategories(),
      api.products.list(),
    ])

    const categories = Array.isArray(categoriesRes?.data)
      ? categoriesRes.data.map((cat) => stripMongoId(cat))
      : []

    const products = Array.isArray(productsRes?.data)
      ? productsRes.data.map((prod) => stripMongoId(prod))
      : []

    cachedProducts = {
      eyebrow: metaRes?.data?.eyebrow ?? '',
      title: metaRes?.data?.title ?? '',
      description: metaRes?.data?.description ?? '',
      categories,
      products,
    }
    return cachedProducts
  } catch (error) {
    console.error('Failed to fetch Products content from database:', error)
  }

  return getProductsContent()
}

export async function saveProductsContent(content: ProductsContent): Promise<void> {
  if (!isValidProductsContent(content)) {
    throw new Error('Invalid product content. Unable to save.')
  }

  await api.products.updateContent(content)
  cachedProducts = content
}

export async function resetProductsContent(): Promise<ProductsContent> {
  await api.products.reset()
  return fetchProductsContent()
}
