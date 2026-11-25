
import { useEffect, useState } from 'react'

import {
  Package,
  Plus,
  Search,
  Pencil,
  Eye,
  EyeOff,
  X,
  Trash2,
} from 'lucide-react'
import {
  getProductsContent,
  fetchProductsContent,
  saveProductsContent,
} from '../../services/products-content.service'
import type {
  ProductItem,
  ProductSpecification,
  ProductsContent,
} from '../../types/site.types'
import './ProductManagementPage.css'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import {
  saveProductImage,
  deleteProductImage,
} from '../../services/product-image.service'
type ProductFormData = {
  name: string
  sku: string
  slug: string
  categoryId: string
  shortDescription: string
  description: string
  price: string
  discountPrice: string
  unit: string
  stockStatus: ProductItem['stockStatus']
  featured: boolean
  enabled: boolean
  specifications: ProductSpecification[]
}

const emptyForm: ProductFormData = {
  name: '',
  sku: '',
  slug: '',
  categoryId: '',
  shortDescription: '',
  description: '',
  price: '',
  discountPrice: '',
  unit: '',
  stockStatus: 'in_stock',
  featured: false,
  enabled: true,
  specifications: [],
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function ProductManagementPage() {
  const [productsContent, setProductsContent] =
    useState<ProductsContent>(() => getProductsContent())
const [imageFile, setImageFile] = useState<File | null>(null)
const [imageUrl, setImageUrl] = useState('')
const [searchTerm, setSearchTerm] = useState('')
const [isModalOpen, setIsModalOpen] = useState(false)
const [editingProductId, setEditingProductId] = useState<string | null>(null)
const [formData, setFormData] = useState<ProductFormData>(emptyForm)
const [formError, setFormError] = useState('')
const [newCategoryName, setNewCategoryName] = useState('')
const [categoryError, setCategoryError] = useState('')

useEffect(() => {
  let isActive = true
  void fetchProductsContent().then((data) => {
    if (isActive) {
      setProductsContent(data)
    }
  })
  return () => {
    isActive = false
  }
}, [])

async function handleAddCategory() {
  const name = newCategoryName.trim()

  if (!name) {
    setCategoryError('Please enter a category name.')
    return
  }

  const duplicateCategory = productsContent.categories.some(
    (category) => category.name.toLowerCase() === name.toLowerCase(),
  )

  if (duplicateCategory) {
    setCategoryError('This category already exists.')
    return
  }

  const newCategory = {
    id: crypto.randomUUID(),
    name,
    enabled: true,
    order:
      Math.max(0, ...productsContent.categories.map((category) => category.order)) + 1,
  }

  const updatedContent = {
    ...productsContent,
    categories: [...productsContent.categories, newCategory],
  }

  try {
    await saveProductsContent(updatedContent)
    setProductsContent(updatedContent)
    setNewCategoryName('')
    setCategoryError('')
  } catch (error) {
    console.error('Unable to add category:', error)
    setCategoryError('Unable to save the category. Please try again.')
  }
}
  async function handleRenameCategory(categoryId: string) {
  const category = productsContent.categories.find(
    (item) => item.id === categoryId,
  )

  if (!category) return

  const newName = window.prompt('Enter the new category name:', category.name)

  if (newName === null) return

  const trimmedName = newName.trim()

  if (!trimmedName) {
    window.alert('Category name cannot be empty.')
    return
  }

  const duplicate = productsContent.categories.some(
    (item) =>
      item.id !== categoryId &&
      item.name.toLowerCase() === trimmedName.toLowerCase(),
  )

  if (duplicate) {
    window.alert('This category already exists.')
    return
  }

  const updatedContent = {
    ...productsContent,
    categories: productsContent.categories.map((item) =>
      item.id === categoryId
        ? { ...item, name: trimmedName }
        : item,
    ),
  }

  try {
    await saveProductsContent(updatedContent)
    setProductsContent(updatedContent)
  } catch (error) {
    console.error('Unable to rename category:', error)
    window.alert('Unable to rename category.')
  }
}
  const handleDeleteCategory = async (categoryId: string) => {
    const category = productsContent.categories.find((c) => c.id === categoryId)
    if (!category) return

    const productCount = productsContent.products.filter(
      (product) => product.categoryId === categoryId,
    ).length

    if (productCount > 0) {
      window.alert(
        `Cannot delete "${category.name}" because it still has ${productCount} product(s) assigned to it. Please reassign or delete those products first.`,
      )
      return
    }

    if (!window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      return
    }

    const updatedContent = {
      ...productsContent,
      categories: productsContent.categories.filter((c) => c.id !== categoryId),
    }

    try {
      await saveProductsContent(updatedContent)
      setProductsContent(updatedContent)
    } catch (error) {
      console.error('Unable to delete category:', error)
      window.alert('Unable to delete category.')
    }
  }

  const filteredProducts = productsContent.products.filter((product) => {
    const search = searchTerm.toLowerCase()

    return (
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search)
    )
  })

  function openAddModal() {
    setEditingProductId(null)
    setFormData({
      ...emptyForm,
      categoryId: productsContent.categories[0]?.id ?? '',
    })
    setFormError('')
    setIsModalOpen(true)
    setImageFile(null)
    setImageUrl('')
  }

  function openEditModal(product: ProductItem) {
    setEditingProductId(product.id)

    setFormData({
      name: product.name,
      sku: product.sku,
      slug: product.slug,
      categoryId: product.categoryId,
      shortDescription: product.shortDescription,
      description: product.description,
      price: String(product.price),
      discountPrice:
        product.discountPrice !== undefined
          ? String(product.discountPrice)
          : '',
      unit: product.unit ?? '',
      stockStatus: product.stockStatus,
      featured: product.featured,
      enabled: product.enabled,
      specifications: product.specifications
        ? product.specifications.map((item) => ({ ...item }))
        : [],
    })

    setFormError('')
    setIsModalOpen(true)
    setImageFile(null)
    setImageUrl(product.image || '')
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingProductId(null)
    setFormError('')
    setImageFile(null)
    setImageUrl('')
  }
function convertGoogleDriveUrl(url: string): string {
  const trimmedUrl = url.trim()

  const driveFileMatch = trimmedUrl.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
  )

  const driveOpenMatch = trimmedUrl.match(
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
  )

  const fileId = driveFileMatch?.[1] || driveOpenMatch?.[1]

  if (!fileId) {
    return trimmedUrl
  }

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`
}
  function updateField<K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateSpecification(
    index: number,
    field: keyof ProductSpecification,
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      specifications: current.specifications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  function addSpecification() {
    setFormData((current) => ({
      ...current,
      specifications: [
        ...current.specifications,
        { label: '', value: '' },
      ],
    }))
  }

  function removeSpecification(index: number) {
    setFormData((current) => ({
      ...current,
      specifications: current.specifications.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }))
  }

async function handleSaveProduct(event: React.FormEvent<HTMLFormElement>) {    event.preventDefault()
    setFormError('')
    const trimmedImageUrl = imageUrl.trim()

if (trimmedImageUrl) {
  try {
    const parsedUrl = new URL(trimmedImageUrl)

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol')
    }
  } catch {
    setFormError('Please enter a valid image URL starting with https:// or http://.')
    return
  }
}
    const name = formData.name.trim()
    const sku = formData.sku.trim()
    const slug = createSlug(formData.slug || name)
    const price = Number(formData.price)
    const discountPrice =
      formData.discountPrice.trim() === ''
        ? undefined
        : Number(formData.discountPrice)

    if (!name || !sku || !slug || !formData.categoryId) {
      setFormError('Please complete the product name, SKU, slug and category.')
      return
    }

    if (formData.price.trim() === '' || !Number.isFinite(price) || price < 0) {
      setFormError('Please enter a valid product price.')
      return
    }

    if (
      discountPrice !== undefined &&
      (!Number.isFinite(discountPrice) ||
        discountPrice < 0 ||
        discountPrice >= price)
    ) {
      setFormError('Discount price must be valid and lower than the regular price.')
      return
    }

    const duplicateSku = productsContent.products.some(
      (product) =>
        product.sku.toLowerCase() === sku.toLowerCase() &&
        product.id !== editingProductId,
    )

    if (duplicateSku) {
      setFormError('This SKU is already being used by another product.')
      return
    }

    const duplicateSlug = productsContent.products.some(
      (product) =>
        product.slug.toLowerCase() === slug.toLowerCase() &&
        product.id !== editingProductId,
    )

    if (duplicateSlug) {
      setFormError('This product URL slug is already being used.')
      return
    }

    const existingProduct = productsContent.products.find(
      (product) => product.id === editingProductId,
    )

    const product: ProductItem = {
      id: existingProduct?.id ?? crypto.randomUUID(),
      sku,
      slug,
      name,
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      categoryId: formData.categoryId,
      image: convertGoogleDriveUrl(trimmedImageUrl) || existingProduct?.image || '',
      gallery: existingProduct?.gallery,
      specifications: formData.specifications.filter(
        (item) => item.label.trim() && item.value.trim(),
      ),
      price,
      ...(discountPrice !== undefined ? { discountPrice } : {}),
      ...(formData.unit.trim() ? { unit: formData.unit.trim() } : {}),
      stockStatus: formData.stockStatus,
      featured: formData.featured,
      enabled: formData.enabled,
      order: existingProduct?.order ?? productsContent.products.length + 1,
      createdAt: existingProduct?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedContent: ProductsContent = {
      ...productsContent,
      products: existingProduct
        ? productsContent.products.map((item) =>
            item.id === existingProduct.id ? product : item,
          )
        : [...productsContent.products, product],
    }

try {
  if (imageFile) {
    await saveProductImage(product.id, imageFile)
  } else if (trimmedImageUrl) {
    await deleteProductImage(product.id)
  }

  await saveProductsContent(updatedContent)
  setProductsContent(updatedContent)
  closeModal()
} catch (error) {
  console.error('Unable to save product:', error)
  setFormError('Unable to save the product or its image. Please try again.')
}
  }

  return (
    <div className="product-management-page">
      <div className="product-management-heading">
        <div>
          <span className="product-management-eyebrow">
            CATALOG MANAGEMENT
          </span>

          <h1>Product Management</h1>

          <p>
            Add, edit, organize, and manage your website products, pricing,
            categories, and availability.
          </p>
        </div>

        <button
          type="button"
          className="product-add-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add New Product
        </button>
      </div>
      <div className="product-category-management">
  <h2>Category Management</h2>

  <div className="product-category-add">
    <input
      type="text"
      value={newCategoryName}
      onChange={(event) => {
        setNewCategoryName(event.target.value)
        setCategoryError('')
      }}
      placeholder="Enter a category name"
    />

    <button type="button" onClick={handleAddCategory}>
      <Plus size={16} />
      Add Category
    </button>
  </div>

  {categoryError && (
    <p className="product-form-error" role="alert">
      {categoryError}
    </p>
  )}
</div>

<div className="product-category-list">
  {productsContent.categories
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((category) => (
      <div className="product-category-item" key={category.id}>
        <div>
          <strong>{category.name}</strong>
          <small>
            {productsContent.products.filter(
              (product) => product.categoryId === category.id,
            ).length}{' '}
            products
          </small>
        </div>

        <div className="product-category-actions">
          <button
            type="button"
            className="product-category-btn"
            onClick={() => handleRenameCategory(category.id)}
            title="Rename category"
            aria-label={`Rename ${category.name}`}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className="product-category-btn delete"
            onClick={() => handleDeleteCategory(category.id)}
            title="Delete category"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    ))}
</div>

      <div className="product-management-toolbar">
        <div className="product-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search products by name or SKU..."
            aria-label="Search products"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <span className="product-count">
          {filteredProducts.length} products
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((product) => {
                  const category = productsContent.categories.find(
                    (item) => item.id === product.categoryId,
                  )

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-table-info">
                          <img
                            src={product.image || '/images/placeholder.png'}
                            alt={product.name}
                            className="product-table-image"
                          />

                          <div>
                            <strong>{product.name}</strong>

                            {product.featured && (
                              <span className="product-featured-label">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>{product.sku}</td>

                      <td>{category?.name ?? 'Uncategorized'}</td>

                      <td>
                        {product.discountPrice !== undefined ? (
                          <div className="product-price">
                            <strong>
                              ৳{product.discountPrice.toLocaleString()}
                            </strong>
                            <del>৳{product.price.toLocaleString()}</del>
                          </div>
                        ) : (
                          <strong>৳{product.price.toLocaleString()}</strong>
                        )}
                      </td>

                      <td>
                        <span
                          className={`product-stock ${
                            product.stockStatus === 'in_stock'
                              ? 'is-in-stock'
                              : 'is-out-of-stock'
                          }`}
                        >
                          {product.stockStatus === 'in_stock'
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`product-status ${
                            product.enabled ? 'is-enabled' : 'is-disabled'
                          }`}
                        >
                          {product.enabled ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}

                          {product.enabled ? 'Published' : 'Disabled'}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="product-action-button"
                          aria-label={`Edit ${product.name}`}
                          title="Edit product"
                          onClick={() => openEditModal(product)}
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="product-management-empty">
          <Package size={36} />

          <h2>No products found</h2>

          <p>
            {searchTerm
              ? 'Try another product name or SKU.'
              : 'Your product catalog is currently empty.'}
          </p>
        </div>
      )}

      {isModalOpen && (
        <div
          className="product-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <div className="product-modal-header">
              <div>
                <span className="product-management-eyebrow">
                  CATALOG MANAGEMENT
                </span>
                <h2 id="product-modal-title">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>

              <button
                type="button"
                className="product-modal-close"
                onClick={closeModal}
                aria-label="Close product form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="product-modal-body">
                <div className="product-form-section">
                  <h3>Basic Information</h3>

                  <div className="product-form-grid">
                    <label className="product-form-field">
                      Product Name *
                      <input
                        required
                        value={formData.name}
                        onChange={(event) => {
                          const name = event.target.value
                          setFormData((current) => ({
                            ...current,
                            name,
                            slug: editingProductId
                              ? current.slug
                              : createSlug(name),
                          }))
                        }}
                        placeholder="Enter product name"
                      />
                    </label>

                    <label className="product-form-field">
                      SKU *
                      <input
                        required
                        value={formData.sku}
                        onChange={(event) =>
                          updateField('sku', event.target.value)
                        }
                        placeholder="e.g. GLS-005"
                      />
                    </label>

                    <label className="product-form-field">
                      URL Slug *
                      <input
                        required
                        value={formData.slug}
                        onChange={(event) =>
                          updateField('slug', createSlug(event.target.value))
                        }
                        placeholder="product-name"
                      />
                    </label>

                    <label className="product-form-field">
                      Category *
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(event) =>
                          updateField('categoryId', event.target.value)
                        }
                      >
                        <option value="">Select category</option>
                        {productsContent.categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="product-form-section">
                  <h3>Product Image</h3>

                  <ImageUploadField
                    label="Image URL or Upload File"
                    value={imageUrl}
                    onChange={(newUrl) => {
                      setImageUrl(newUrl)
                      setImageFile(null)
                      setFormError('')
                    }}
                    placeholder="https://drive.google.com/file/d/... or upload image"
                    helpText="Upload a file from your computer or paste an external image / Google Drive link."
                  />
                </div>

                <div className="product-form-section">
                  <h3>Product Description</h3>

                  <label className="product-form-field">
                    Short Description
                    <textarea
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(event) =>
                        updateField('shortDescription', event.target.value)
                      }
                      placeholder="A short summary for product cards"
                    />
                  </label>

                  <label className="product-form-field">
                    Full Description
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(event) =>
                        updateField('description', event.target.value)
                      }
                      placeholder="Describe the product in detail"
                    />
                  </label>
                </div>

                <div className="product-form-section">
                  <h3>Pricing and Availability</h3>

                  <div className="product-form-grid">
                    <label className="product-form-field">
                      Regular Price (BDT) *
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(event) =>
                          updateField('price', event.target.value)
                        }
                        placeholder="0"
                      />
                    </label>

                    <label className="product-form-field">
                      Discount Price (BDT)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.discountPrice}
                        onChange={(event) =>
                          updateField('discountPrice', event.target.value)
                        }
                        placeholder="Optional"
                      />
                    </label>

                    <label className="product-form-field">
                      Unit
                      <input
                        value={formData.unit}
                        onChange={(event) =>
                          updateField('unit', event.target.value)
                        }
                        placeholder="e.g. 1 kg, 500 g, packet"
                      />
                    </label>

                    <label className="product-form-field">
                      Stock Status
                      <select
                        value={formData.stockStatus}
                        onChange={(event) =>
                          updateField(
                            'stockStatus',
                            event.target.value as ProductItem['stockStatus'],
                          )
                        }
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="product-form-section">
                  <div className="product-specifications-heading">
                    <h3>Specifications</h3>
                    <button
                      type="button"
                      className="product-secondary-button"
                      onClick={addSpecification}
                    >
                      <Plus size={15} />
                      Add Specification
                    </button>
                  </div>

                  {formData.specifications.map((specification, index) => (
                    <div className="product-specification-row" key={index}>
                      <input
                        aria-label={`Specification ${index + 1} name`}
                        value={specification.label}
                        onChange={(event) =>
                          updateSpecification(index, 'label', event.target.value)
                        }
                        placeholder="Label"
                      />

                      <input
                        aria-label={`Specification ${index + 1} value`}
                        value={specification.value}
                        onChange={(event) =>
                          updateSpecification(index, 'value', event.target.value)
                        }
                        placeholder="Value"
                      />

                      <button
                        type="button"
                        className="product-remove-button"
                        onClick={() => removeSpecification(index)}
                        aria-label="Remove specification"
                        title="Remove specification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="product-form-section">
                  <h3>Product Visibility</h3>

                  <label className="product-toggle-field">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(event) =>
                        updateField('featured', event.target.checked)
                      }
                    />
                    <span>
                      <strong>Featured Product</strong>
                      <small>Show this product in featured sections.</small>
                    </span>
                  </label>

                  <label className="product-toggle-field">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(event) =>
                        updateField('enabled', event.target.checked)
                      }
                    />
                    <span>
                      <strong>Published</strong>
                      <small>Allow visitors to view this product.</small>
                    </span>
                  </label>
                </div>

                {formError && (
                  <p className="product-form-error" role="alert">
                    {formError}
                  </p>
                )}
              </div>

              <div className="product-modal-footer">
                <button
                  type="button"
                  className="product-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="product-save-button">
                  {editingProductId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default ProductManagementPage
