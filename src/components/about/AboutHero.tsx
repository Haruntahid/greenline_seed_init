
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import {
  getAboutPageContent,
  fetchAboutPageContent,
} from '../../services/about-page-content.service'
import { getGoogleDriveImageUrl } from '../../utils/google-drive-image'
import './AboutHero.css'

function AboutHero() {
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

  return (
    <section className="about-hero">
      <div className="about-hero-inner">
        <div className="about-hero-top">
          <span className="about-hero-eyebrow">
            <span className="about-hero-dot" />
            {aboutContent.eyebrow}
          </span>

          <span className="about-hero-index">
            ABOUT US — 001
          </span>
        </div>

        <div className="about-hero-heading">
          <h1>
            {aboutContent.title}
            <span className="about-hero-star">✳</span>
          </h1>

          <div className="about-hero-description">
            <p>{aboutContent.description}</p>

            <a href="#about-story" className="about-hero-link">
              Discover our story
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        <div className="about-hero-visual">
          <img
            src={getGoogleDriveImageUrl(aboutContent.image)}
            alt={aboutContent.imageAlt || 'Discover our company and our journey'}
          />

          <div className="about-hero-image-overlay" />

          <div className="about-hero-image-label">
            <span>OUR STORY</span>
            <span>01 / 07</span>
          </div>

          <a href="#about-story" className="about-hero-scroll">
            <span>SCROLL TO EXPLORE</span>
            <span className="about-hero-scroll-icon">
              <ArrowDown size={18} />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
