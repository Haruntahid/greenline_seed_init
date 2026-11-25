
import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

import type {
  HeroCarouselContent,
  HeroSlide,
} from '../../types/site.types'

import {
  getHeroCarouselContent,
  fetchHeroCarouselContent,
  saveHeroCarouselContent,
  resetHeroCarouselContent,
} from '../../services/hero-carousel.service'
import { getTextFontClass } from '../../utils/typography'
import { ImageUploadField } from './ImageUploadField'
import './HeroCarouselEditor.css'

function HeroCarouselEditor() {
  const [content, setContent] = useState<HeroCarouselContent>(
    () => getHeroCarouselContent(),
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    void fetchHeroCarouselContent().then((data) => {
      if (!cancelled) {
        setContent(data)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const updateSlide = <K extends keyof HeroSlide>(
    id: string,
    field: K,
    value: HeroSlide[K],
  ) => {
    setContent((previous) => ({
      ...previous,
      slides: previous.slides.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide,
      ),
    }))
    setMessage('')
  }

  const updateButton = (
    id: string,
    button: 'primaryButton' | 'secondaryButton' | 'tertiaryButton',
    field: 'label' | 'link',
    value: string,
  ) => {
    setContent((previous) => ({
      ...previous,
      slides: previous.slides.map((slide) => {
        if (slide.id !== id) return slide

        const current = slide[button] ?? { label: '', link: '' }

        return {
          ...slide,
          [button]: { ...current, [field]: value },
        }
      }),
    }))
    setMessage('')
  }

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `hero-slide-${Date.now()}`,
      eyebrow: 'NEW SLIDE',
      title: 'Add your heading',
      highlightedTitle: 'Here.',
      description: 'Write a short description for this slide.',
      imageUrl: '',
      mobileImageUrl: '',
      imageAlt: 'Describe the slide image',
      primaryButton: { label: 'Explore More', link: '/products' },
      secondaryButton: { label: 'About Us', link: '/about' },
      enabled: true,
    }

    setContent((previous) => ({
      ...previous,
      slides: [...previous.slides, newSlide],
    }))
    setMessage('New slide added. Save your changes when finished.')
  }

const removeSlide = (id: string) => {
  if (content.slides.length <= 1) {
    setMessage('At least one slide must remain.')
    return
  }

  if (!window.confirm('Remove this slide?')) return

  setContent((previous) => ({
    ...previous,
    slides: previous.slides.filter((slide) => slide.id !== id),
  }))

  setMessage('Slide removed. Save your changes to apply it.')
}

  const moveSlide = (id: string, direction: 'up' | 'down') => {
    setContent((previous) => {
      const currentIndex = previous.slides.findIndex(
        (slide) => slide.id === id,
      )

      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= previous.slides.length
      ) {
        return previous
      }

      const updatedSlides = [...previous.slides]

      ;[updatedSlides[currentIndex], updatedSlides[targetIndex]] = [
        updatedSlides[targetIndex],
        updatedSlides[currentIndex],
      ]

      return { ...previous, slides: updatedSlides }
    })

    setMessage('')
  }

  const updateSettings = (
    field: keyof HeroCarouselContent['settings'],
    value: boolean | number | 'fade',
  ) => {
    setContent((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        [field]: value,
      },
    }))
    setMessage('')
  }

  const handleSave = async () => {
    if (!content.slides.some((slide) => slide.enabled)) {
      setMessage('Enable at least one slide before saving.')
      return
    }

    try {
      await saveHeroCarouselContent(content)
      setMessage('Hero Carousel settings saved successfully.')
    } catch (error) {
      console.error('Unable to save Hero Carousel:', error)
      setMessage('Unable to save changes. Please try again.')
    }
  }

  const handleReset = async () => {
    if (
      !window.confirm(
        'Reset the entire Hero Carousel to its default content and settings?',
      )
    ) {
      return
    }

    try {
      const defaultCarousel = await resetHeroCarouselContent()
      setContent(defaultCarousel)
      setMessage('Hero Carousel has been reset to defaults.')
    } catch (error) {
      console.error('Unable to reset Hero Carousel:', error)
      setMessage('Unable to reset. Please try again.')
    }
  }


  return (
    <section className="content-editor-panel">
      <div className="content-editor-form">

        {/* Slide list */}
        <div className="content-editor-group">
          <div className="content-editor-list-heading">
            <div>
              <h3>Carousel Slides</h3>
              <p>Add, edit, enable, disable, and reorder your slides.</p>
            </div>

            <button
              type="button"
              className="content-editor-add-button"
              onClick={addSlide}
            >
              <Plus size={16} />
              Add Slide
            </button>
          </div>

          {content.slides.map((slide, index) => (
            <article className="hero-carousel-editor-card" key={slide.id}>
              <div className="hero-carousel-editor-header">
                <div>
                  <h4>Slide {index + 1}</h4>
                  <span>{slide.id}</span>
                </div>

                <button
                  type="button"
                  className="content-editor-delete-button"
                  onClick={() => removeSlide(slide.id)}
                  aria-label={`Remove slide ${index + 1}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <label className="service-editor-toggle">
                <input
                  type="checkbox"
                  checked={slide.enabled}
                  onChange={(event) =>
                    updateSlide(slide.id, 'enabled', event.target.checked)
                  }
                />
                <span>Slide enabled</span>
              </label>

              <div className="hero-carousel-editor-order">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSlide(slide.id, 'up')}
                >
                  <ChevronUp size={16} /> Move up
                </button>

                <button
                  type="button"
                  disabled={index === content.slides.length - 1}
                  onClick={() => moveSlide(slide.id, 'down')}
                >
                  <ChevronDown size={16} /> Move down
                </button>
              </div>

              <div className="content-editor-divider" />

              {/* Slide text */}
              <h3>Slide Content</h3>

              <label>
                Eyebrow
                <input
                    className={getTextFontClass(slide.eyebrow)}
                  value={slide.eyebrow}
                  onChange={(event) =>
                    updateSlide(slide.id, 'eyebrow', event.target.value)
                  }
                />
              </label>

              <label>
                Main heading
                <input
                className={getTextFontClass(slide.title)}
                  value={slide.title}
                  onChange={(event) =>
                    updateSlide(slide.id, 'title', event.target.value)
                  }
                />
              </label>

              <label>
                Highlighted heading
                <input
                className={getTextFontClass(slide.highlightedTitle)}
                  value={slide.highlightedTitle}
                  onChange={(event) =>
                    updateSlide(
                      slide.id,
                      'highlightedTitle',
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Description
                <textarea
                className={getTextFontClass(slide.description)}
                  rows={3}
                  value={slide.description}
                  onChange={(event) =>
                    updateSlide(slide.id, 'description', event.target.value)
                  }
                />
              </label>

              {/* Images */}
              <div className="content-editor-divider" />
              <h3>Slide Images</h3>

              {(['desktop', 'mobile'] as const).map((device) => {
                const imageUrl =
                  device === 'desktop'
                    ? slide.imageUrl
                    : slide.mobileImageUrl
                   

                return (
                  <div className="hero-carousel-image-field" key={device}>
                    <ImageUploadField
                      label={device === 'desktop' ? 'Desktop Slide Image' : 'Mobile Slide Image'}
                      value={imageUrl ?? ''}
                      onChange={(newUrl) => {
                        updateSlide(
                          slide.id,
                          device === 'desktop' ? 'imageUrl' : 'mobileImageUrl',
                          newUrl,
                        )
                      }}
                      placeholder={`Upload image file or enter ${device} image URL`}
                      helpText={`Upload from device or paste link. Recommended: ${device === 'desktop' ? '1920x800' : '800x1000'}.`}
                    />
                  </div>
                )
              })}

              <label>
                Image alternative text
                <input
                  value={slide.imageAlt ?? ''}
                  onChange={(event) =>
                    updateSlide(slide.id, 'imageAlt', event.target.value)
                  }
                  placeholder="Describe the slide image"
                />
              </label>

              {/* Buttons */}
              <div className="content-editor-divider" />
              <h3>Primary Button</h3>

              <label>
                Button label
                <input
                  value={slide.primaryButton.label}
                  onChange={(event) =>
                    updateButton(
                      slide.id,
                      'primaryButton',
                      'label',
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Button link
                <input
                  value={slide.primaryButton.link}
                  onChange={(event) =>
                    updateButton(
                      slide.id,
                      'primaryButton',
                      'link',
                      event.target.value,
                    )
                  }
                />
              </label>

              <div className="content-editor-divider" />
              <h3>Secondary Button</h3>

              <label>
                Button label
                <input
                  value={slide.secondaryButton.label}
                  onChange={(event) =>
                    updateButton(
                      slide.id,
                      'secondaryButton',
                      'label',
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Button link
                <input
                  value={slide.secondaryButton.link}
                  onChange={(event) =>
                    updateButton(
                      slide.id,
                      'secondaryButton',
                      'link',
                      event.target.value,
                    )
                  }
                />
              </label>

              <div className="content-editor-divider" />

              <label className="service-editor-toggle">
                <input
                  type="checkbox"
                  checked={!!slide.tertiaryButton}
                  onChange={(event) =>
                    updateSlide(
                      slide.id,
                      'tertiaryButton',
                      event.target.checked
                        ? { label: 'Contact Us', link: '/contact' }
                        : undefined,
                    )
                  }
                />
                <span>Enable tertiary button</span>
              </label>

              {slide.tertiaryButton && (
                <>
                  <label>
                    Tertiary button label
                    <input
                      value={slide.tertiaryButton.label}
                      onChange={(event) =>
                        updateButton(
                          slide.id,
                          'tertiaryButton',
                          'label',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Tertiary button link
                    <input
                      value={slide.tertiaryButton.link}
                      onChange={(event) =>
                        updateButton(
                          slide.id,
                          'tertiaryButton',
                          'link',
                          event.target.value,
                        )
                      }
                    />
                  </label>
                </>
              )}
            </article>
          ))}
        </div>

        {/* Global carousel settings */}
        <div className="content-editor-group">
          <div className="content-editor-divider" />
          <h3>Carousel Settings</h3>

          <label className="service-editor-toggle">
            <input
              type="checkbox"
              checked={content.settings.autoplay}
              onChange={(event) =>
                updateSettings('autoplay', event.target.checked)
              }
            />
            <span>Enable autoplay</span>
          </label>

          <label>
            Autoplay interval (milliseconds)
            <input
              type="number"
              min="2000"
              step="500"
              value={content.settings.interval}
              onChange={(event) =>
                updateSettings(
                  'interval',
                  Math.max(2000, Number(event.target.value)),
                )
              }
            />
          </label>

          <label>
            Transition effect
            <select
              value={content.settings.transition}
              disabled
            >
              <option value="fade">Fade</option>
            </select>
          </label>

          <label className="service-editor-toggle">
            <input
              type="checkbox"
              checked={content.settings.showArrows}
              onChange={(event) =>
                updateSettings('showArrows', event.target.checked)
              }
            />
            <span>Show navigation arrows</span>
          </label>

          <label className="service-editor-toggle">
            <input
              type="checkbox"
              checked={content.settings.showIndicators}
              onChange={(event) =>
                updateSettings('showIndicators', event.target.checked)
              }
            />
            <span>Show slide indicators</span>
          </label>
        </div>
      </div>

      {message && (
        <p className="content-editor-message" role="status">
          {message}
        </p>
      )}

      <div className="content-editor-actions">
        <button
          type="button"
          className="content-editor-reset-button"
          onClick={() => void handleReset()}
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          className="content-editor-save-button"
          onClick={handleSave}
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </section>
  )
}

export default HeroCarouselEditor
