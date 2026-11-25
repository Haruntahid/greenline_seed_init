import { useEffect, useState, useCallback, useRef } from 'react'
import {
  Package,
  Plus,
  Search,
  Pencil,
  Eye,
  EyeOff,
  X,
  Trash2,
  Loader2,
} from 'lucide-react'
import { api } from '../../services/api'
import type {
  ProductCategory,
  ProductItem,
  ProductSpecification,
} from '../../types/site.types'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import { convertGoogleDriveUrl } from '../../utils/google-drive-image'
import { toast } from '../../components/ui/Toast'
import './ProductManagementPage.css'

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
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [products, setProducts] = useState<ProductItem[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Filters & Sorting state (driven from backend)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest'>('default')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [formData, setFormData] = useState<ProductFormData>(emptyForm)
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Category Management State
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const initialLoadDone = useRef(false)

  // Load Categories
  const loadCategories = useCallback(async () => {
    try {
      const res = await api.products.getCategories()
      if (res?.data && Array.isArray(res.data)) {
        setCategories(res.data.sort((a, b) => (a.order || 0) - (b.order || 0)))
      }
    } catch (err) {
      console.error('Failed to load categories:', err)
      toast.error('Failed to load product categories.')
    }
  }, [])

  // Load Products via Backend API
  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await api.products.list({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm.trim() || undefined,
        categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
        stockStatus: stockFilter !== 'all' ? stockFilter : undefined,
        sortBy: sortBy !== 'default' ? sortBy : undefined,
      })
      if (res?.data) {
        setProducts(res.data)
        if (res.pagination) {
          setTotalProducts(res.pagination.total)
          setTotalPages(res.pagination.totalPages)
        } else {
          setTotalProducts(res.data.length)
          setTotalPages(Math.max(1, Math.ceil(res.data.length / itemsPerPage)))
        }
      }
    } catch (err) {
      console.error('Failed to load products from API:', err)
      toast.error('Failed to fetch products from database.')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, itemsPerPage, searchTerm, categoryFilter, stockFilter, sortBy])

  // Initial Load
  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  // Fetch when filters or page change (with debounce on search)
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts()
    }, initialLoadDone.current ? 250 : 0)

    initialLoadDone.current = true
    return () => clearTimeout(timer)
  }, [loadProducts])

  // Category Actions
  async function handleAddCategory() {
    const name = newCategoryName.trim()
    if (!name) {
      setCategoryError('Please enter a category name.')
      toast.error('Category name cannot be empty.')
      return
    }

    const duplicateCategory = categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    )

    if (duplicateCategory) {
      setCategoryError('This category already exists.')
      toast.error('This category already exists.')
      return
    }

    try {
      const newCat = {
        id: crypto.randomUUID(),
        name,
        enabled: true,
        order: Math.max(0, ...categories.map((c) => c.order || 0)) + 1,
      }
      await api.products.createCategory(newCat)
      setNewCategoryName('')
      setCategoryError('')
      toast.success(`Category "${name}" created!`)
      await loadCategories()
    } catch (error) {
      console.error('Unable to add category:', error)
      toast.error('Unable to create category.')
    }
  }

  async function handleRenameCategory(categoryId: string) {
    const category = categories.find((item) => item.id === categoryId)
    if (!category) return

    const newName = window.prompt(`Rename "${category.name}" to:`, category.name)
    if (newName === null) return

    const trimmedName = newName.trim()
    if (!trimmedName) {
      toast.error('Category name cannot be empty.')
      return
    }

    const duplicate = categories.some(
      (item) => item.id !== categoryId && item.name.toLowerCase() === trimmedName.toLowerCase(),
    )
    if (duplicate) {
      toast.error('This category name already exists.')
      return
    }

    try {
      await api.products.updateCategory(categoryId, { ...category, name: trimmedName })
      toast.success(`Renamed category to "${trimmedName}"`)
      await loadCategories()
      await loadProducts()
    } catch (error) {
      console.error('Unable to rename category:', error)
      toast.error('Unable to rename category.')
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    // Check count in current list or ask confirmation
    if (!window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      return
    }

    try {
      await api.products.deleteCategory(categoryId)
      toast.success(`Category "${category.name}" deleted.`)
      await loadCategories()
      await loadProducts()
    } catch (error) {
      console.error('Unable to delete category:', error)
      toast.error('Unable to delete category.')
    }
  }

  // Modal open/close
  function openAddModal() {
    setEditingProductId(null)
    setFormData({
      ...emptyForm,
      categoryId: categories[0]?.id ?? '',
    })
    setFormError('')
    setImageUrl('')
    setIsModalOpen(true)
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
      discountPrice: product.discountPrice !== undefined ? String(product.discountPrice) : '',
      unit: product.unit ?? '',
      stockStatus: product.stockStatus,
      featured: product.featured,
      enabled: product.enabled,
      specifications: product.specifications ? product.specifications.map((item) => ({ ...item })) : [],
    })
    setImageUrl(product.image || '')
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingProductId(null)
    setFormError('')
    setImageUrl('')
  }

  function updateField<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setFormData((previous) => ({
      ...previous,
      [key]: value,
      ...(key === 'name' && !editingProductId && !previous.slug
        ? { slug: createSlug(String(value)) }
        : {}),
    }))
  }

  function addSpecification() {
    setFormData((previous) => ({
      ...previous,
      specifications: [...previous.specifications, { label: '', value: '' }],
    }))
  }

  function updateSpecification(index: number, field: 'label' | 'value', value: string) {
    setFormData((previous) => ({
      ...previous,
      specifications: previous.specifications.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  function removeSpecification(index: number) {
    setFormData((previous) => ({
      ...previous,
      specifications: previous.specifications.filter((_, i) => i !== index),
    }))
  }

  // Delete product action
  async function handleDeleteProduct(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      return
    }

    try {
      await api.products.delete(id)
      toast.success(`Product "${name}" deleted successfully.`)
      await loadProducts()
    } catch (err: any) {
      console.error('Failed to delete product:', err)
      toast.error(err.message || 'Failed to delete product.')
    }
  }

  // Save product action
  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    const name = formData.name.trim()
    const sku = formData.sku.trim()
    const slug = createSlug(formData.slug || name)
    const price = Number(formData.price)
    const discountPrice =
      formData.discountPrice.trim() === '' ? undefined : Number(formData.discountPrice)

    if (!name || !sku || !slug || !formData.categoryId) {
      setFormError('Please complete product name, SKU, slug, and category.')
      return
    }

    if (formData.price.trim() === '' || !Number.isFinite(price) || price < 0) {
      setFormError('Please enter a valid regular price.')
      return
    }

    if (
      discountPrice !== undefined &&
      (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= price)
    ) {
      setFormError('Discount price must be valid and less than regular price.')
      return
    }

    setIsSaving(true)
    try {
      const productPayload = {
        name,
        sku,
        slug,
        categoryId: formData.categoryId,
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        image: convertGoogleDriveUrl(imageUrl.trim()),
        specifications: formData.specifications.filter((item) => item.label.trim() && item.value.trim()),
        price,
        ...(discountPrice !== undefined ? { discountPrice } : {}),
        ...(formData.unit.trim() ? { unit: formData.unit.trim() } : {}),
        stockStatus: formData.stockStatus,
        featured: formData.featured,
        enabled: formData.enabled,
      }

      if (editingProductId) {
        await api.products.update(editingProductId, productPayload)
        toast.success(`Product "${name}" updated successfully!`)
      } else {
        await api.products.create(productPayload)
        toast.success(`Product "${name}" created successfully!`)
      }

      closeModal()
      await loadProducts()
    } catch (err: any) {
      console.error('Failed to save product:', err)
      setFormError(err.message || 'Unable to save product.')
      toast.error('Failed to save product.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="product-management-page">
      <div className="product-management-heading">
        <div>
          <span className="product-management-eyebrow">CATALOG MANAGEMENT</span>
          <h1>Product Management</h1>
          <p>
            Add, edit, organize, and manage your website products, pricing, categories, and availability.
          </p>
        </div>

        <button type="button" className="product-add-button" onClick={openAddModal}>
          <Plus size={17} />
          Add New Product
        </button>
      </div>

      {/* CATEGORY MANAGEMENT */}
      <div className="product-category-management">
        <h2>Category Management</h2>
        <div className="product-category-form">
          <input
            type="text"
            placeholder="Enter a category name"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value)
              if (categoryError) setCategoryError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void handleAddCategory()
              }
            }}
          />
          <button type="button" onClick={() => void handleAddCategory()}>
            <Plus size={16} />
            Add Category
          </button>
        </div>

        {categoryError && <p className="product-category-error">{categoryError}</p>}

        <div className="product-category-list">
          {categories.map((category) => (
            <div key={category.id} className="product-category-item">
              <div className="product-category-info">
                <strong>{category.name}</strong>
              </div>
              <div className="product-category-actions">
                <button
                  type="button"
                  onClick={() => void handleRenameCategory(category.id)}
                  title="Rename Category"
                  aria-label="Rename Category"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteCategory(category.id)}
                  title="Delete Category"
                  aria-label="Delete Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER & SEARCH ROW */}
      <div className="product-management-toolbar">
        <div className="product-search">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search products by name or SKU..."
            aria-label="Search products"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setCurrentPage(1)
            }}
          />
        </div>

        <span className="product-count">
          {totalProducts} products
        </span>
      </div>

      <div className="product-filters-row">
        <select
          className="product-filter-select"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Filter by Category"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="product-filter-select"
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value as any)
            setCurrentPage(1)
          }}
          aria-label="Filter by Stock"
        >
          <option value="all">All Stock Status</option>
          <option value="in_stock">In Stock Only</option>
          <option value="out_of_stock">Out of Stock Only</option>
        </select>

        <select
          className="product-filter-select"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as any)
            setCurrentPage(1)
          }}
          aria-label="Sort products"
        >
          <option value="default">Default Order</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* PRODUCT TABLE */}
      {isLoading ? (
        <div className="product-management-empty" style={{ padding: '60px 0' }}>
          <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px' }}>Loading products from database...</p>
        </div>
      ) : products.length > 0 ? (
        <>
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
                {products.map((product) => {
                  const category = categories.find((item) => item.id === product.categoryId)

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
                              <span className="product-featured-label">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>{product.sku}</td>
                      <td>{category?.name ?? 'Uncategorized'}</td>

                      <td>
                        {product.discountPrice !== undefined ? (
                          <div className="product-price">
                            <strong>৳{product.discountPrice.toLocaleString()}</strong>
                            <del>৳{product.price.toLocaleString()}</del>
                          </div>
                        ) : (
                          <strong>৳{product.price.toLocaleString()}</strong>
                        )}
                      </td>

                      <td>
                        <span
                          className={`product-stock ${
                            product.stockStatus === 'in_stock' ? 'is-in-stock' : 'is-out-of-stock'
                          }`}
                        >
                          {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`product-status ${
                            product.enabled ? 'is-enabled' : 'is-disabled'
                          }`}
                        >
                          {product.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                          {product.enabled ? 'Published' : 'Disabled'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="product-action-button"
                            aria-label={`Edit ${product.name}`}
                            title="Edit product"
                            onClick={() => openEditModal(product)}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            className="product-action-button"
                            style={{ color: '#f87171' }}
                            aria-label={`Delete ${product.name}`}
                            title="Delete product"
                            onClick={() => void handleDeleteProduct(product.id, product.name)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* BACKEND PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="product-admin-pagination">
              <span className="product-pagination-info">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
              </span>

              <div className="product-pagination-buttons">
                <button
                  type="button"
                  className="product-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`product-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="product-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
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

      {/* PRODUCT ADD / EDIT MODAL */}
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
              <h2 id="product-modal-title">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                className="product-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => void handleSaveProduct(e)} className="product-modal-form">
              <div className="product-modal-body">
                <div className="product-form-section">
                  <h3>Basic Information</h3>

                  <div className="product-form-grid">
                    <label className="product-form-field">
                      Product Name *
                      <input
                        required
                        value={formData.name}
                        onChange={(event) => updateField('name', event.target.value)}
                        placeholder="e.g. Hybrid Tomato Seed"
                      />
                    </label>

                    <label className="product-form-field">
                      SKU *
                      <input
                        required
                        value={formData.sku}
                        onChange={(event) => updateField('sku', event.target.value)}
                        placeholder="e.g. GLS-001"
                      />
                    </label>

                    <label className="product-form-field">
                      URL Slug *
                      <input
                        required
                        value={formData.slug}
                        onChange={(event) => updateField('slug', event.target.value)}
                        placeholder="e.g. hybrid-tomato-seed"
                      />
                    </label>

                    <label className="product-form-field">
                      Category *
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(event) => updateField('categoryId', event.target.value)}
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {categories.map((category) => (
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
                      setFormError('')
                    }}
                    placeholder="Paste image link or upload image"
                    helpText="Upload an image file from your device or paste a direct image URL."
                  />
                </div>

                <div className="product-form-section">
                  <h3>Product Description</h3>
                  <label className="product-form-field">
                    Short Description
                    <textarea
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(event) => updateField('shortDescription', event.target.value)}
                      placeholder="A short summary for product cards"
                    />
                  </label>

                  <label className="product-form-field">
                    Full Description
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(event) => updateField('description', event.target.value)}
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
                        onChange={(event) => updateField('price', event.target.value)}
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
                        onChange={(event) => updateField('discountPrice', event.target.value)}
                        placeholder="Optional"
                      />
                    </label>

                    <label className="product-form-field">
                      Unit
                      <input
                        value={formData.unit}
                        onChange={(event) => updateField('unit', event.target.value)}
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
                        onChange={(event) => updateSpecification(index, 'label', event.target.value)}
                        placeholder="Label"
                      />
                      <input
                        aria-label={`Specification ${index + 1} value`}
                        value={specification.value}
                        onChange={(event) => updateSpecification(index, 'value', event.target.value)}
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
                      onChange={(event) => updateField('featured', event.target.checked)}
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
                      onChange={(event) => updateField('enabled', event.target.checked)}
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
                <button type="button" className="product-cancel-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="product-save-button" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingProductId ? 'Save Changes' : 'Create Product'}
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
