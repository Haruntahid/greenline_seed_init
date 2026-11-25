
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import type { HeroCarouselContent } from '../../types/site.types'

import {
  getHeroCarouselContent,
  fetchHeroCarouselContent,
} from '../../services/hero-carousel.service'

import {
  getHeroSlideImage,
  getHeroImage,
} from '../../services/hero-image.service'

import './HeroSection.css'
import { getTextFontClass } from '../../utils/typography'

type SlideImages = {
  desktop?: string
  mobile?: string
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
function HeroSection() {
  const [carouselContent, setCarouselContent] = useState<HeroCarouselContent>(
    () => getHeroCarouselContent(),
  )

  useEffect(() => {
    let isActive = true
    void fetchHeroCarouselContent().then((data) => {
      if (isActive) {
        setCarouselContent(data)
      }
    })
    return () => {
      isActive = false
    }
  }, [])

  const slides = useMemo(
    () => carouselContent.slides.filter((slide) => slide.enabled),
    [carouselContent.slides],
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [imageMap, setImageMap] = useState<Record<string, SlideImages>>({})

  const touchStartX = useRef<number | null>(null)

  // Load desktop and mobile images for enabled slides.
  useEffect(() => {
    let cancelled = false
    const objectUrls: string[] = []

    async function loadImages() {
      try {
        const results = await Promise.all(
          slides.map(async (slide) => {
            const [desktopBlob, mobileBlob] = await Promise.all([
              getHeroSlideImage(slide.id, 'desktop'),
              getHeroSlideImage(slide.id, 'mobile'),
            ])

            let finalDesktopBlob = desktopBlob

            // Preserve the old uploaded Hero image during migration.
            if (
              !finalDesktopBlob &&
              !slide.imageUrl &&
              slide.id === 'hero-slide-1'
            ) {
              finalDesktopBlob = await getHeroImage()
            }

            const desktopObjectUrl = finalDesktopBlob
              ? URL.createObjectURL(finalDesktopBlob)
              : undefined

            const mobileObjectUrl = mobileBlob
              ? URL.createObjectURL(mobileBlob)
              : undefined

            if (desktopObjectUrl) objectUrls.push(desktopObjectUrl)
            if (mobileObjectUrl) objectUrls.push(mobileObjectUrl)

            return [
              slide.id,
              {
                desktop: desktopObjectUrl,
                mobile: mobileObjectUrl,
              },
            ] as const
          }),
        )

        if (cancelled) {
          objectUrls.forEach((url) => URL.revokeObjectURL(url))
          return
        }

        setImageMap(Object.fromEntries(results))
      } catch (error) {
        console.error('Unable to load Hero Carousel images:', error)
      }
    }

    void loadImages()

    return () => {
      cancelled = true
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [slides])

  // Detect reduced-motion preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Keep the active index valid when the enabled slides change.
  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, slides.length])

  const showNextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  const showPreviousSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + slides.length) % slides.length,
    )
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  // Autoplay.
  useEffect(() => {
    if (
      !carouselContent.settings.autoplay ||
      isPaused ||
      prefersReducedMotion ||
      slides.length <= 1
    ) {
      return
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, carouselContent.settings.interval)

    return () => window.clearInterval(interval)
  }, [
    carouselContent.settings.autoplay,
    carouselContent.settings.interval,
    isPaused,
    prefersReducedMotion,
    slides.length,
  ])

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
  ) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showNextSlide()
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPreviousSlide()
    }
  }

  const handleTouchStart = (
    event: React.TouchEvent<HTMLElement>,
  ) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLElement>,
  ) => {
    if (touchStartX.current === null) return

    const touchEndX = event.changedTouches[0]?.clientX ?? 0
    const difference = touchStartX.current - touchEndX

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        showNextSlide()
      } else {
        showPreviousSlide()
      }
    }

    touchStartX.current = null
  }

  if (slides.length === 0) {
    return null
  }

  return (
    <section
      id="hero"
      className="hero-section"
      aria-label="Featured content"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false)
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slides">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex

          const desktopImage =
            imageMap[slide.id]?.desktop ||
            convertGoogleDriveUrl(slide.imageUrl || '')

          const mobileImage =
            imageMap[slide.id]?.mobile ||
            convertGoogleDriveUrl(slide.mobileImageUrl || '') ||
            desktopImage

          return (
            <article
              key={slide.id}
              className={`hero-slide ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
              aria-label={`${index + 1} of ${slides.length}`}
            >
              {desktopImage && (
                <picture className="hero-slide-picture">
                  {mobileImage && (
                    <source
                      media="(max-width: 768px)"
                      srcSet={mobileImage}
                    />
                  )}

                  <img
                    className="hero-slide-image"
                    src={desktopImage}
                    alt={slide.imageAlt || ''}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </picture>
              )}

              <div className="hero-background-overlay" />

              <div className="hero-content">
                <span className={`hero-eyebrow ${getTextFontClass(slide.eyebrow)}`}>
                  {slide.eyebrow}
                </span>

                <h1 className={getTextFontClass(`${slide.title} ${slide.highlightedTitle}`)}>
                  {slide.title}
                  <span className={getTextFontClass(slide.highlightedTitle)}>
                    {' '}{slide.highlightedTitle}
                  </span>
                </h1>

                <p className={getTextFontClass(slide.description)}>
                  {slide.description}
                </p>

                <div className="hero-actions">
                  <Link
                    to={slide.primaryButton.link}
                    className={`hero-button primary ${getTextFontClass(slide.primaryButton.label)}`}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {slide.primaryButton.label}
                  </Link>

                  <Link
                    to={slide.secondaryButton.link}
                    className={`hero-button secondary ${getTextFontClass(slide.secondaryButton.label)}`}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {slide.secondaryButton.label}
                  </Link>

                  {slide.tertiaryButton && (
                    <Link
                      to={slide.tertiaryButton.link}
                      className={`hero-button tertiary ${getTextFontClass(slide.tertiaryButton.label)}`}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {slide.tertiaryButton.label}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {slides.length > 1 && carouselContent.settings.showArrows && (
        <div className="hero-navigation">
          <button
            type="button"
            className="hero-arrow hero-arrow-previous"
            onClick={showPreviousSlide}
            aria-label="Previous slide"
          >
            &#8592;
          </button>

          <button
            type="button"
            className="hero-arrow hero-arrow-next"
            onClick={showNextSlide}
            aria-label="Next slide"
          >
            &#8594;
          </button>
        </div>
      )}

      {slides.length > 1 && carouselContent.settings.showIndicators && (
        <div
          className="hero-indicators"
          role="group"
          aria-label="Choose a slide"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-indicator ${index === activeIndex ? 'is-active' : ''
                }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroSection
