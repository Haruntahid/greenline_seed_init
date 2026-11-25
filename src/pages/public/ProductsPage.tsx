import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, X, Loader2 } from 'lucide-react'
import type { ProductCategory, ProductItem } from '../../types/site.types'
import { api } from '../../services/api'
import { getProductImage } from '../../services/product-image.service'
import { getGoogleDriveImageUrl } from '../../utils/google-drive-image'
import './ProductsPage.css'

function ProductsPage() {
  const [meta, setMeta] = useState<{ eyebrow: string; title: string; description: string }>({
    eyebrow: 'OUR PRODUCTS',
    title: 'Explore Our Products',
    description: 'Discover our collection of products, thoughtfully developed to meet different needs.',
  })
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [products, setProducts] = useState<ProductItem[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [featuredFilter, setFeaturedFilter] = useState(false)
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest'>('default')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [productImages, setProductImages] = useState<Record<string, string>>({})
  const initialLoadDone = useRef(false)

  // Load Meta and Categories on Mount
  useEffect(() => {
    let isActive = true
    async function loadMetaAndCategories() {
      try {
        const [metaRes, catRes, featRes] = await Promise.all([
          api.products.getMeta().catch(() => null),
          api.products.getCategories().catch(() => null),
          api.products.list({ featured: true, enabled: true, limit: 3 }).catch(() => null),
        ])
        if (!isActive) return
        if (metaRes?.data) {
          setMeta({
            eyebrow: metaRes.data.eyebrow || 'OUR PRODUCTS',
            title: metaRes.data.title || 'Explore Our Products',
            description: metaRes.data.description || 'Discover our collection of products, thoughtfully developed to meet different needs.',
          })
        }
        if (catRes?.data && Array.isArray(catRes.data)) {
          setCategories(catRes.data.filter((c: any) => c.enabled !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)))
        }
        if (featRes?.data && Array.isArray(featRes.data)) {
          setFeaturedProducts(featRes.data)
        }
      } catch (err) {
        console.error('Failed to load products metadata:', err)
      }
    }
    void loadMetaAndCategories()
    return () => {
      isActive = false
    }
  }, [])

  // Fetch Products via Backend API on filter/sort/page change
  useEffect(() => {
    let isActive = true
    setIsLoading(true)

    const timer = setTimeout(() => {
      api.products
        .list({
          page: currentPage,
          limit: itemsPerPage,
          categoryId: activeCategory === 'all' ? undefined : activeCategory,
          search: searchQuery.trim() || undefined,
          stockStatus: stockFilter === 'all' ? undefined : stockFilter,
          featured: featuredFilter ? true : undefined,
          sortBy: sortBy === 'default' ? undefined : sortBy,
          enabled: true,
        })
        .then((res) => {
          if (!isActive) return
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
        })
        .catch((err) => {
          if (!isActive) return
          console.error('Failed to fetch filtered products from API:', err)
        })
        .finally(() => {
          if (isActive) setIsLoading(false)
        })
    }, initialLoadDone.current ? 250 : 0)

    initialLoadDone.current = true

    return () => {
      isActive = false
      clearTimeout(timer)
    }
  }, [activeCategory, searchQuery, stockFilter, featuredFilter, sortBy, currentPage])

  // Resolve Blob images if stored in indexedDB / media key
  useEffect(() => {
    let isActive = true
    const imageUrls: string[] = []

    async function loadProductImages() {
      const allLoaded = [...products, ...featuredProducts]
      const imageEntries = await Promise.all(
        allLoaded.map(async (product) => {
          try {
            const imageBlob = await getProductImage(product.id)
            if (!imageBlob) return null
            const imageUrl = URL.createObjectURL(imageBlob)
            imageUrls.push(imageUrl)
            return [product.id, imageUrl] as const
          } catch {
            return null
          }
        }),
      )

      if (isActive) {
        const images = Object.fromEntries(
          imageEntries.filter(
            (entry): entry is readonly [string, string] => entry !== null,
          ),
        )
        setProductImages((prev) => ({ ...prev, ...images }))
      } else {
        imageUrls.forEach((url) => URL.revokeObjectURL(url))
      }
    }

    void loadProductImages()

    return () => {
      isActive = false
      imageUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [products, featuredProducts])

  return (
    <main className="products-page">
      {/* EDITORIAL HERO */}
      <section className="products-hero">
        <div className="products-hero-inner">
          <div className="products-hero-content">
            <span className="products-eyebrow">
              <span />
              {meta.eyebrow}
            </span>

            <h1>{meta.title}</h1>

            <p>{meta.description}</p>

            <a href="#product-collection" className="products-explore-link">
              Explore collection
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="products-hero-side">
            <span>OUR COLLECTION</span>
            <div className="products-hero-decoration">
              <span>QUALITY.</span>
              <span>PURPOSE.</span>
              <span>EXCELLENCE.</span>
            </div>
            <small>DISCOVER WHAT WE OFFER</small>
          </div>
        </div>

        <div className="products-hero-bottom">
          <span>CURATED COLLECTION / PRODUCT SHOWCASE</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* PRODUCT COLLECTION */}
      <section
        className="products-collection"
        id="product-collection"
      >
        <div className="products-collection-heading">
          <div>
            <span className="products-eyebrow">
              DISCOVER OUR COLLECTION
            </span>
            <h2>Products with <span>purpose.</span></h2>
          </div>

          <p>
            Explore our carefully presented collection
            and discover the details behind each product.
          </p>
        </div>

        {/* SEARCH & CATEGORY BAR */}
        <div className="products-toolbar">
          <div className="products-category-list">
            <button
              className={activeCategory === 'all' ? 'active' : ''}
              onClick={() => {
                setActiveCategory('all')
                setCurrentPage(1)
              }}
            >
              All Products
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={
                  activeCategory === category.id ? 'active' : ''
                }
                onClick={() => {
                  setActiveCategory(category.id)
                  setCurrentPage(1)
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="products-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setCurrentPage(1)
              }}
              aria-label="Search products"
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* FILTERS & SORTING BAR */}
        <div className="products-filter-bar">
          <div className="products-filter-group">
            <label htmlFor="stock-filter">Availability:</label>
            <select
              id="stock-filter"
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="products-filter-select"
            >
              <option value="all">All Items</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div className="products-filter-group">
            <label htmlFor="sort-filter">Sort by:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any)
                setCurrentPage(1)
              }}
              className="products-filter-select"
            >
              <option value="default">Default Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <label className="products-featured-toggle">
            <input
              type="checkbox"
              checked={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.checked)
                setCurrentPage(1)
              }}
            />
            <span>Featured Only</span>
          </label>

          {(searchQuery || activeCategory !== 'all' || stockFilter !== 'all' || featuredFilter || sortBy !== 'default') && (
            <button
              type="button"
              className="products-reset-filters-btn"
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
                setStockFilter('all')
                setFeaturedFilter(false)
                setSortBy('default')
                setCurrentPage(1)
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* FEATURED PRODUCTS BANNER */}
        {activeCategory === 'all' &&
          searchQuery.trim() === '' &&
          !featuredFilter &&
          stockFilter === 'all' &&
          featuredProducts.length > 0 && (
            <div className="products-featured">
              <span className="products-featured-label">
                FEATURED COLLECTION
              </span>

              <div className="products-featured-grid">
                {featuredProducts.slice(0, 3).map((product) => (
                  <Link
                    to={`/products/${product.slug}`}
                    className="products-featured-card"
                    key={product.id}
                  >
                    <div className="products-featured-image">
                      <img
                        src={productImages[product.id] || getGoogleDriveImageUrl(product.image)}
                        alt={product.name}
                      />
                      <span>FEATURED</span>
                      <ArrowUpRight size={22} />
                    </div>

                    <div className="products-featured-info">
                      <span>0{product.order}</span>
                      <h3>{product.name}</h3>
                      <p>{product.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* ALL PRODUCTS HEADING */}
        <div className="products-grid-heading">
          <h3>
            {activeCategory === 'all'
              ? 'Explore all products'
              : categories.find((c) => c.id === activeCategory)?.name || 'Products'}
          </h3>

          <span>
            {totalProducts > 0
              ? `SHOWING ${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, totalProducts)} OF ${totalProducts} PRODUCTS`
              : '0 PRODUCTS'}
          </span>
        </div>

        {isLoading ? (
          <div className="products-empty" style={{ padding: '60px 0' }}>
            <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '12px' }}>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="products-grid">
              {products.map((product, index) => (
                <Link
                  to={`/products/${product.slug}`}
                  className="products-card"
                  key={product.id}
                >
                  <div className="products-card-image">
                    <img
                      src={productImages[product.id] || getGoogleDriveImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                    />

                    <span>
                      {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                    </span>

                    <div className="products-card-action">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <div className="products-card-info">
                    <span>
                      {categories.find(
                        (category) =>
                          category.id === product.categoryId,
                      )?.name || 'Collection'}
                    </span>

                    <h3>{product.name}</h3>
                    <p>{product.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="products-pagination">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                    document.getElementById('product-collection')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Previous
                </button>

                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`pagination-page-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPage(page)
                        document.getElementById('product-collection')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    document.getElementById('product-collection')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="products-empty">
            <Search size={28} />
            <h3>No products found</h3>
            <p>Try another search term or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
                setStockFilter('all')
                setFeaturedFilter(false)
                setSortBy('default')
                setCurrentPage(1)
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default ProductsPage
