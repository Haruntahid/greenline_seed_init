
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
} from 'lucide-react'
import {
  getProductsContent,
  fetchProductsContent,
} from '../../services/products-content.service'
import { getGoogleDriveImageUrl } from '../../utils/google-drive-image'
import type { ProductsContent } from '../../types/site.types'
import './ProductDetailsPage.css'

function ProductDetailsPage() {
  const { slug } = useParams()
  const [productsContent, setProductsContent] = useState<ProductsContent>(
    getProductsContent,
  )
  const [isLoading, setIsLoading] = useState(
    () => getProductsContent().products.length === 0,
  )

  useEffect(() => {
    let isActive = true
    void fetchProductsContent().then((data) => {
      if (isActive) {
        setProductsContent(data)
        setIsLoading(false)
      }
    })
    return () => {
      isActive = false
    }
  }, [])

  const product = productsContent.products.find(
    (item) => item.slug === slug && item.enabled,
  )

  const [activeImage, setActiveImage] = useState(0)

  if (isLoading) {
    return (
      <main className="product-details-not-found">
        <span>LOADING PRODUCT</span>
        <h1>Loading product details...</h1>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="product-details-not-found">
        <span>404 — PRODUCT NOT FOUND</span>
        <h1>This product doesn't exist.</h1>
        <p>
          The product you're looking for may be unavailable
          or the address may be incorrect.
        </p>
        <Link to="/products">
          <ArrowLeft size={17} />
          Explore our products
        </Link>
      </main>
    )
  }

  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery.map(img => getGoogleDriveImageUrl(img))
      : [getGoogleDriveImageUrl(product.image)]
  const category = productsContent.categories.find(

    (item) => item.id === product.categoryId,
  )

  return (
    <main className="product-details-page">
      {/* BREADCRUMB */}
      <div className="product-details-breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products">Products</Link>
        <ChevronRight size={14} />
        <span>{product.name}</span>
      </div>

      {/* PRODUCT INFORMATION */}
      <section className="product-details-main">
        {/* PRODUCT GALLERY */}
        <div className="product-details-gallery">
          <div className="product-details-main-image">
            <img
              src={images[activeImage]}
              alt={product.name}
            />

            {product.featured && (
              <span className="product-details-featured-label">
                FEATURED PRODUCT
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="product-details-thumbnails">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={
                    activeImage === index ? 'active' : ''
                  }
                  onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={activeImage === index}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT CONTENT */}
        <div className="product-details-content">
          <span className="product-details-eyebrow">
            <span />
            {category?.name || 'OUR COLLECTION'}
          </span>

          <span className="product-details-index">
            PRODUCT / {String(product.order).padStart(2, '0')}
          </span>

          <h1>{product.name}</h1>

          <p className="product-details-short-description">
            {product.shortDescription}
          </p>

          <div className="product-details-divider" />

          <div className="product-details-description">
            <h2>About this product</h2>
            <p>{product.description}</p>
          </div>

          {product.specifications &&
            product.specifications.length > 0 && (
              <div className="product-details-specifications">
                <h2>Product specifications</h2>

                <div className="product-specifications-list">
                  {product.specifications.map((specification) => (
                    <div
                      className="product-specification-item"
                      key={specification.label}
                    >
                      <span>{specification.label}</span>
                      <strong>{specification.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="product-details-actions">
            <Link to="/contact" className="product-inquiry-button">
              Request Information
              <ArrowUpRight size={19} />
            </Link>

            <Link to="/products" className="product-back-link">
              <ArrowLeft size={16} />
              Back to products
            </Link>
          </div>

          <div className="product-details-note">
            <Check size={17} />
            <span>
              Interested in this product? Contact our team
              for more information.
            </span>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {productsContent.products.filter(
        (item) =>
          item.enabled &&
          item.id !== product.id &&
          item.categoryId === product.categoryId,
      ).length > 0 && (
          <section className="product-related-section">
            <div className="product-related-heading">
              <div>
                <span className="product-details-eyebrow">
                  EXPLORE MORE
                </span>
                <h2>Related <span>products.</span></h2>
              </div>

              <Link to="/products">
                View all products
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="product-related-grid">
              {productsContent.products
                .filter(
                  (item) =>
                    item.enabled &&
                    item.id !== product.id &&
                    item.categoryId === product.categoryId,
                )
                .sort((a, b) => a.order - b.order)
                .slice(0, 3)
                .map((item) => (
                  <Link
                    to={`/products/${item.slug}`}
                    className="product-related-card"
                    key={item.id}
                  >
                    <div className="product-related-image">
                      <img src={getGoogleDriveImageUrl(item.image)} alt={item.name} />
                      <ArrowUpRight size={20} />
                    </div>

                    <span>OUR COLLECTION</span>
                    <h3>{item.name}</h3>
                    <p>{item.shortDescription}</p>
                  </Link>
                ))}
            </div>
          </section>
        )}
    </main>
  )
}

export default ProductDetailsPage
