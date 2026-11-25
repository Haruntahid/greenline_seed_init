
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AboutContent } from '../../types/site.types'
import { getAboutContent, fetchAboutContent } from '../../services/about-content.service'
import { getAboutImage } from '../../services/about-image.service'
import { getGoogleDriveImageUrl } from '../../utils/google-drive-image'
import './AboutSection.css'
import { getTextFontClass } from '../../utils/typography'
function AboutSection() {
  const [aboutContent, setAboutContent] = useState<AboutContent>(getAboutContent)
  const [imageSrc, setImageSrc] = useState(aboutContent.image)

  useEffect(() => {
    void fetchAboutContent().then((data) => {
      setAboutContent(data)
      if (data.image) setImageSrc(getGoogleDriveImageUrl(data.image))
    })
  }, [])

  useEffect(() => {
    let objectUrl: string | null = null
    let isActive = true

    if (!aboutContent.image) {
      getAboutImage()
        .then((image) => {
          if (image && isActive) {
            objectUrl = URL.createObjectURL(image)
            setImageSrc(objectUrl)
          }
        })
        .catch((error) => {
          console.error('Unable to load About image:', error)
        })
    } else {
      setImageSrc(getGoogleDriveImageUrl(aboutContent.image))
    }

    return () => {
      isActive = false

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [aboutContent.image])

  return (
    <section id="about" className="about-section">
      <div className="about-preview">
        <div className="about-preview-image">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={aboutContent.imageAlt || 'Discover our company'}
              loading="lazy"
            />
          )}

          <span className={`about-preview-image-badge ${getTextFontClass(aboutContent.imageBadge)}`}>
            {aboutContent.imageBadge || 'GET TO KNOW US'}
          </span>
        </div>

        <div className="about-preview-content">
         <span className={`about-preview-eyebrow ${getTextFontClass(aboutContent.eyebrow)}`}>
  {aboutContent.eyebrow}
</span>

          <h2 className={getTextFontClass(aboutContent.title)}>
            {aboutContent.title}
          </h2>

          <p className={getTextFontClass(aboutContent.description)}>
            {aboutContent.description}
          </p>

          <div className="about-preview-highlights">
            {aboutContent.highlights.map((item, index) => (
              <div key={`${item.title}-${index}`}>
                <h3 className={getTextFontClass(item.title)}>
                  {item.title}
                </h3>
                <p className={getTextFontClass(item.description)}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

         <Link
  to={aboutContent.buttonLink || '/about'}
  className={`about-preview-link ${getTextFontClass(aboutContent.buttonLabel)}`}
>
  {aboutContent.buttonLabel || 'Discover Our Story'}
  <ArrowUpRight size={19} />
</Link>
        </div>
      </div>

    </section>
  )
}

export default AboutSection
