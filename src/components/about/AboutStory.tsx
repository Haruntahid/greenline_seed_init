
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import {
  getAboutPageContent,
  fetchAboutPageContent,
} from '../../services/about-page-content.service'
import { getTextFontClass } from '../../utils/typography'
import './AboutStory.css'

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

function AboutStory() {
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

  if (!aboutContent.sectionVisibility.story) return null

  const story = aboutContent.story

  if (!story) return null

  return (
    <section className="about-story" id="about-story">
      <div className="about-story-inner">
        <div className="about-story-heading">
          <span className={`about-story-eyebrow ${getTextFontClass(story.eyebrow)}`}>
            {story.eyebrow}
          </span>

          <h2 className={getTextFontClass(story.title)}>
            {story.title}
          </h2>

          <span className="about-story-decoration">
            <ArrowUpRight size={24} />
          </span>
        </div>

        <div className="about-story-content">
          <div className="about-story-visual">
            {story.image && (
              <img
                className="about-story-main-image"
                src={getGoogleDriveImageUrl(story.image)}
                alt="Our company story"
                loading="lazy"
              />
            )}

            {story.secondaryImage && (
              <img
                className="about-story-secondary-image"
                src={getGoogleDriveImageUrl(story.secondaryImage)}
                alt="Our company culture"
                loading="lazy"
              />
            )}

            {story.imageCaption && (
              <span className={`about-story-caption ${getTextFontClass(story.imageCaption)}`}>
                {story.imageCaption}
              </span>
            )}
          </div>

          <div className="about-story-text">
            <span className="about-story-number">01 — OUR STORY</span>

            {story.description.map((paragraph, index) => (
              <p key={index} className={getTextFontClass(paragraph)}>
                {paragraph}
              </p>
            ))}

            <a href="#about-journey" className="about-story-link">
              Explore our journey
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutStory
