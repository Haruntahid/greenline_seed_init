
import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, Images } from 'lucide-react'

import {
  getGalleryContent,
  fetchGalleryContent,
} from '../../services/gallery-content.service'
import { getGalleryImage } from '../../services/gallery-image.service'
import { getGoogleDriveImageUrl } from '../../utils/google-drive-image'
import YouTubeVideosSection from '../../components/sections/YouTubeVideosSection'

import type { GalleryContent } from '../../types/site.types'

import './GallaryPage.css'

const INITIAL_VISIBLE_ITEMS = 8
const LOAD_MORE_ITEMS = 8

function GallaryPage() {
  const [content, setContent] = useState<GalleryContent>(getGalleryContent)

  useEffect(() => {
    let isActive = true
    void fetchGalleryContent().then((data) => {
      if (isActive) {
        setContent(data)
      }
    })
    return () => {
      isActive = false
    }
  }, [])
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({})
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ITEMS)

  const galleryItems = useMemo(
    () =>
      content.items
        .filter((item) => item.enabled && item.image.trim())
        .sort((a, b) => a.order - b.order),
    [content.items],
  )

  useEffect(() => {
    let isActive = true
    const objectUrls: string[] = []

    async function loadUploadedImages() {
      const imageEntries = await Promise.all(
        galleryItems
          .filter((item) => item.imageType === 'upload')
          .map(async (item) => {
            const blob = await getGalleryImage(item.id)

            if (!blob) return null

            const objectUrl = URL.createObjectURL(blob)
            objectUrls.push(objectUrl)

            return [item.id, objectUrl] as const
          }),
      )

      if (!isActive) {
        objectUrls.forEach((url) => URL.revokeObjectURL(url))
        return
      }

      const imageMap: Record<string, string> = {}

      imageEntries.forEach((entry) => {
        if (entry) imageMap[entry[0]] = entry[1]
      })

      setUploadedImages(imageMap)
    }

    void loadUploadedImages().catch((error: unknown) => {
      console.error('Failed to load gallery images:', error)
    })

    return () => {
      isActive = false
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [galleryItems])

  const getImageSource = (item: GalleryContent['items'][number]) => {
    if (item.imageType === 'upload') {
      return uploadedImages[item.id] ?? ''
    }

    return getGoogleDriveImageUrl(item.image)
  }

  const hasMoreItems = visibleCount < galleryItems.length

  return (
    <>
      <section className="gallery-hero">
        <div className="gallery-hero-inner">
          <div className="gallery-hero-top">
            <span className="gallery-hero-eyebrow">
              <span className="gallery-hero-dot" />
              {content.eyebrow}
            </span>

            <span className="gallery-hero-index">GALLERY — 006</span>
          </div>

          <div className="gallery-hero-heading">
            <h1>
              {content.title}
              <span className="gallery-hero-star">✳</span>
            </h1>

            <div className="gallery-hero-description">
              <p>{content.description}</p>

              <a href="#gallery-collection" className="gallery-hero-link">
                Explore our moments
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <a href="#gallery-collection" className="gallery-scroll-link">
            <span>SCROLL TO EXPLORE</span>
            <span className="gallery-scroll-icon">
              <ArrowDown size={18} />
            </span>
          </a>
        </div>
      </section>

      <section className="gallery-collection" id="gallery-collection">
        <div className="gallery-collection-inner">
          <div className="gallery-collection-heading">
            <div>
              <span className="gallery-section-eyebrow">A VISUAL JOURNEY</span>
              <h2>Our Moments</h2>
            </div>

            <span className="gallery-item-count">
              {String(galleryItems.length).padStart(2, '0')} MOMENTS
            </span>
          </div>

          {galleryItems.length > 0 ? (
            <>
              <div className="gallery-masonry">
                {galleryItems.slice(0, visibleCount).map((item, index) => {
                  const imageSource = getImageSource(item)

                  return (
                    <article
                      className={`gallery-card gallery-card-${index % 4}`}
                      key={item.id}
                    >
                      <div className="gallery-card-image">
                        {imageSource ? (
                          <img
                            src={imageSource}
                            alt={item.title || 'GreenLine Seed gallery image'}
                            loading={index < 4 ? 'eager' : 'lazy'}
                          />
                        ) : (
                          <div className="gallery-image-placeholder">
                            <Images size={30} />
                          </div>
                        )}

                        <span className="gallery-card-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="gallery-card-details">
                        <h3>{item.title}</h3>
                        {item.description && <p>{item.description}</p>}
                      </div>
                    </article>
                  )
                })}
              </div>

              {hasMoreItems && (
                <div className="gallery-load-more">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((current) => current + LOAD_MORE_ITEMS)
                    }
                  >
                    See More
                    <ArrowDown size={17} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="gallery-empty-state">
              <Images size={38} />
              <h3>Our gallery is growing</h3>
              <p>
                Memorable moments and stories will appear here soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <YouTubeVideosSection />
    </>
  )
}

export default GallaryPage
