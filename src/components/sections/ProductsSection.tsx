import { useEffect, useState } from 'react'
import { getProductImage } from '../../services/product-image.service'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sprout } from 'lucide-react'
import {
  getProductsContent,
  fetchProductsContent,
} from '../../services/products-content.service'
import type { ProductsContent } from '../../types/site.types'
import { getGoogleDriveImageUrl } from '../../utils/google-drive-image'
import './ProductsSection.css'

function ProductsSection() {
  const [productsConfig, setProductsConfig] = useState<ProductsContent>(
    getProductsContent,
  )
  const [productImages, setProductImages] = useState<Record<string, string>>({})

  useEffect(() => {
    let isActive = true
    void fetchProductsContent().then((data) => {
      if (isActive) {
        setProductsConfig(data)
      }
    })
    return () => {
      isActive = false
    }
  }, [])

useEffect(() => {
  let isMounted = true
  const objectUrls: string[] = []

  async function loadProductImages() {
    const imageEntries = await Promise.all(
      productsConfig.products.map(async (product) => {
        const imageBlob = await getProductImage(product.id)

        if (!imageBlob) return null

        const imageUrl = URL.createObjectURL(imageBlob)
        objectUrls.push(imageUrl)

        return [product.id, imageUrl] as const
      }),
    )

    if (isMounted) {
      setProductImages(
        Object.fromEntries(
          imageEntries.filter(
            (entry): entry is readonly [string, string] => entry !== null,
          ),
        ),
      )
    } else {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }

  void loadProductImages()

  return () => {
    isMounted = false
    objectUrls.forEach((url) => URL.revokeObjectURL(url))
  }
}, [productsConfig.products])

  const visibleCategories = productsConfig.categories
    .filter((category) => category.enabled)
    .sort((a, b) => a.order - b.order)
    .map((category) => {
      const products = productsConfig.products
        .filter(
          (product) =>
            product.enabled && product.categoryId === category.id,
        )
        .sort((a, b) => a.order - b.order)
        .slice(0, 4)

      return { category, products }
    })
    .filter(({ products }) => products.length > 0)

  if (visibleCategories.length === 0) {
    return null
  }

  return (
    <section id="products" className="home-products-section">
      <div className="home-products-container">
        <div className="home-products-heading">
          <div>
            <span>{productsConfig.eyebrow}</span>
            <h2>{productsConfig.title}</h2>
          </div>

          <p>{productsConfig.description}</p>
        </div>

        <div className="home-products-categories">
          {visibleCategories.map(({ category, products }) => (
            <div
              className="home-products-category"
              key={category.id}
            >
              <div className="home-products-category-heading">
                <div>
                  <h3>{category.name}</h3>

                  {category.description && (
                    <p>{category.description}</p>
                  )}
                </div>

                <Link
                  to="/products"
                  className="home-products-view-all"
                  aria-label={`View all products in ${category.name}`}
                >
                  View All
                  <ArrowUpRight size={19} />
                </Link>
              </div>

              <div className="home-products-grid">
                {products.map((product, index) => (
                  <Link
                    to={`/products/${product.slug}`}
                    className="home-product-card"
                    key={product.id}
                  >
                    <div className="home-product-image">
                      {product.image ? (
                        <img
  src={productImages[product.id] || getGoogleDriveImageUrl(product.image)}
  alt={product.name}
  loading="lazy"
/>
                      ) : (
                        <div className="home-product-image-placeholder">
                          <Sprout size={42} strokeWidth={1.3} />
                        </div>
                      )}

                      <span className="home-product-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div className="home-product-action">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>

                    <div className="home-product-info">
                      <span>{category.name}</span>
                      <h4>{product.name}</h4>
                      <p>{product.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="home-products-footer">
          <Link to="/products" className="home-products-main-link">
            Explore All Products
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
