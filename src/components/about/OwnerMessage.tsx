
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import {
  getAboutPageContent,
  fetchAboutPageContent,
} from '../../services/about-page-content.service'
import { getTextFontClass } from '../../utils/typography'
import './OwnerMessage.css'

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

function OwnerMessage() {
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

  if (!aboutContent.sectionVisibility.owner) return null

  const owner = aboutContent.owner

  if (!owner) return null

  const paragraphs = owner.message
    .split(/\n+/)
    .filter((paragraph) => paragraph.trim())

  return (
    <section className="owner-message" id="owner-message">
      <div className="owner-message-inner">
        <div className="owner-message-profile">
          <div className="owner-message-image-area">
            {owner.image && (
              <div className="owner-message-image-frame">
                <img
                  className="owner-message-image"
                  src={getGoogleDriveImageUrl(owner.image)}
                  alt={owner.name}
                  loading="lazy"
                />
              </div>
            )}

            {owner.designation && (
              <span className={`owner-message-role ${getTextFontClass(owner.designation)}`}>
                {owner.designation}
              </span>
            )}
          </div>

          <div className="owner-message-identity">
            <h2 className={`owner-message-name ${getTextFontClass(owner.name)}`}>
              {owner.name}
            </h2>

            <span className={`owner-message-designation ${getTextFontClass(owner.designation)}`}>
              {owner.designation}
            </span>
          </div>
        </div>

        <div className="owner-message-details">
          <div className="owner-message-quote-card">
            <span className="owner-message-quote-mark owner-message-quote-open" aria-hidden="true">
              “
            </span>

            {owner.eyebrow && (
              <span className={`owner-message-eyebrow ${getTextFontClass(owner.eyebrow)}`}>
                {owner.eyebrow}
              </span>
            )}

            {owner.title && (
              <h3 className={`owner-message-title ${getTextFontClass(owner.title)}`}>
                {owner.title}
              </h3>
            )}

            {owner.quote && (
              <blockquote className={`owner-message-quote ${getTextFontClass(owner.quote)}`}>
                {owner.quote}
              </blockquote>
            )}

            {paragraphs.length > 0 && (
              <div className="owner-message-body">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className={getTextFontClass(paragraph)}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            <span className="owner-message-quote-mark owner-message-quote-close" aria-hidden="true">
              ”
            </span>
          </div>

          <div className="owner-message-actions">
            <a
              className="owner-message-button owner-message-button-primary"
              href="/products"
            >
              Our Products <ArrowUpRight size={17} />
            </a>

            <a
              className="owner-message-button owner-message-button-outline"
              href="/contact"
            >
              Contact Us <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OwnerMessage
