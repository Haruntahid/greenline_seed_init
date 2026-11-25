
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, CalendarDays } from 'lucide-react'
import {
  getAboutPageContent,
  fetchAboutPageContent,
} from '../../services/about-page-content.service'
import { getTextFontClass } from '../../utils/typography'
import './JourneyTimeline.css'

function getGoogleDriveImageUrl(imageUrl: string): string {
  if (!imageUrl || !imageUrl.includes('drive.google.com')) {
    return imageUrl
  }

  try {
    const url = new URL(imageUrl)
    let fileId = url.searchParams.get('id')

    if (!fileId) {
      const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)/)
      fileId = fileMatch?.[1] ?? null
    }

    if (!fileId) return imageUrl

    return `https://drive.google.com/uc?export=view&id=${fileId}`
  } catch {
    return imageUrl
  }
}

function JourneyTimeline() {
  const [aboutContent, setAboutContent] = useState(getAboutPageContent)

  useEffect(() => {
    let isActive = true
    void fetchAboutPageContent().then((data) => {
      if (isActive) {
        setAboutContent(data)
      }
    })
    return () => {
      isActive = false
    }
  }, [])

  const milestones = (aboutContent.journey ?? []).filter(
    (item) => item.enabled,
  )

  const [visibleItems, setVisibleItems] = useState<string[]>([])
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-journey-id')

            if (id) {
              setVisibleItems((current) =>
                current.includes(id) ? current : [...current, id],
              )
            }
          }
        })
      },
      { threshold: 0.15 },
    )

    itemRefs.current.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [milestones.length])

  if (!aboutContent.sectionVisibility.journey || !milestones.length) {
    return null
  }

  return (
    <section className="journey-section" id="about-journey">
      <div className="journey-inner">
        <header className="journey-heading">
          <span className="journey-eyebrow">OUR EVOLUTION</span>

          <h2>
            Growing through
            <br />
            <span>every milestone.</span>
          </h2>

          <p>
            From our beginnings to where we stand today, every milestone
            reflects our commitment to growth, quality, and a greener future.
          </p>
        </header>

        <div className="journey-roadmap">
          <div className="journey-road" aria-hidden="true">
            <svg
              viewBox="0 0 180 1000"
              preserveAspectRatio="none"
              className="journey-road-svg"
            >
              <path
                d="M90 0 C90 70 145 75 145 145 S35 225 35 300 S145 380 145 455 S35 535 35 610 S145 690 145 765 S90 850 90 1000"
                className="journey-road-shadow"
              />
              <path
                d="M90 0 C90 70 145 75 145 145 S35 225 35 300 S145 380 145 455 S35 535 35 610 S145 690 145 765 S90 850 90 1000"
                className="journey-road-path"
              />
            </svg>
          </div>

          {milestones.map((milestone, index) => (
            <article
              key={milestone.id}
              ref={(element) => {
                if (element) {
                  itemRefs.current.set(milestone.id, element)
                } else {
                  itemRefs.current.delete(milestone.id)
                }
              }}
              data-journey-id={milestone.id}
              className={`journey-milestone ${
                index % 2 === 0 ? 'journey-milestone-left' : 'journey-milestone-right'
              } ${visibleItems.includes(milestone.id) ? 'is-visible' : ''}`}
            >
              <div className="journey-content">
                <div className="journey-date">
                  <span className="journey-calendar-icon">
                    <CalendarDays size={19} strokeWidth={1.8} />
                  </span>

                  <span className={`journey-year ${getTextFontClass(milestone.year)}`}>
                    {milestone.year}
                  </span>
                </div>

                <p className={`journey-description ${getTextFontClass(milestone.description)}`}>
                  {milestone.description}
                </p>

                <span className="journey-milestone-number">
                  MILESTONE {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="journey-visual">
                <div className="journey-image-frame">
                  {milestone.image ? (
                    <img
                      src={getGoogleDriveImageUrl(milestone.image)}
                      alt={`GreenLine Seed milestone ${milestone.year}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="journey-image-placeholder">
                      <span>GREENLINE SEED</span>
                      <CalendarDays size={34} />
                    </div>
                  )}

                  <span className="journey-image-corner" />
                  <span className="journey-image-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="journey-road-node" aria-hidden="true">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="journey-end">
          <span className="journey-end-icon">
            <ArrowDown size={20} />
          </span>
          <span>AND THE JOURNEY CONTINUES</span>
        </div>
      </div>
    </section>
  )
}

export default JourneyTimeline
