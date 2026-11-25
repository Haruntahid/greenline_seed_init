import { ChevronDown } from 'lucide-react'

import AboutContentEditor from '../../components/admin/AboutContentEditor'
import ServicesContentEditor from '../../components/admin/ServicesContentEditor'
import StatsContentEditor from '../../components/admin/StatsContentEditor'
import PortfolioContentEditor from '../../components/admin/PortfolioContentEditor'
import HeroCarouselEditor from '../../components/admin/HeroCarouselEditor'
import YouTubeVideosEditor from '../../components/admin/YouTubeVideosEditor'
import AboutPageContentEditor from '../../components/admin/AboutPageContentEditor'
import GalleryContentEditor from '../../components/admin/GalleryContentEditor'
import './WebsiteContentPage.css'

function WebsiteContentPage() {
  return (
    <div className="website-content-page">

      {/* Page Heading */}
      <div className="website-content-heading">
        <div>
          <span className="website-content-eyebrow">
            WEBSITE MANAGEMENT
          </span>

          <h1>Website Content</h1>

          <p>
            Manage the text, images, and sections displayed on your homepage.
          </p>
        </div>
      </div>

      {/* ==================================
          HERO CAROUSEL SECTION
      ================================== */}

      <details className="content-section-accordion">
        <summary className="content-section-accordion-header">
          <div>
            <span className="website-content-eyebrow">HOMEPAGE</span>

            <h2>Hero Carousel</h2>

            <p>
              Manage homepage slides, images, buttons, and carousel settings.
            </p>
          </div>

          <ChevronDown className="accordion-chevron" size={20} />
        </summary>

        <HeroCarouselEditor />
      </details>

      {/* ==================================
          ABOUT SECTION
      ================================== */}

      <details className="content-section-accordion">
        <summary className="content-section-accordion-header">
          <div>
            <span className="website-content-eyebrow">HOMEPAGE</span>

            <h2>About Section</h2>

            <p>
              Manage your company introduction and highlights.
            </p>
          </div>

          <ChevronDown className="accordion-chevron" size={20} />
        </summary>

        <AboutContentEditor />
      </details>

      {/* ==================================
          ABOUT US PAGE
      ================================== */}

      <details className="content-section-accordion">
        <summary className="content-section-accordion-header">
          <div>
            <span className="website-content-eyebrow">INNER PAGE</span>

            <h2>About Us Page</h2>

            <p>
              Manage the complete About Us page, including company story,
              leadership message, mission, vision, values, and achievements.
            </p>
          </div>

          <ChevronDown className="accordion-chevron" size={20} />
        </summary>

        <AboutPageContentEditor />
      </details>

      {/* ==================================
          SERVICES SECTION
      ================================== */}

      <details className="content-section-accordion">
        <summary className="content-section-accordion-header">
          <div>
            <span className="website-content-eyebrow">HOMEPAGE</span>

            <h2>Services Section</h2>

            <p>
              Manage your services and their homepage presentation.
            </p>
          </div>

          <ChevronDown className="accordion-chevron" size={20} />
        </summary>

        <ServicesContentEditor />
      </details>

      {/* ==================================
          STATS SECTION
      ================================== */}

      <details className="content-section-accordion">
        <summary className="content-section-accordion-header">
          <div>
            <span className="website-content-eyebrow">HOMEPAGE</span>

            <h2>Stats Section</h2>

            <p>
              Manage your company statistics and achievements.
            </p>
          </div>

          <ChevronDown className="accordion-chevron" size={20} />
        </summary>

        <StatsContentEditor />
      </details>

      {/* ==================================
          PORTFOLIO SECTION
      ================================== */}

      <details className="content-section-accordion">
        <summary className="content-section-accordion-header">
          <div>
            <span className="content-section-eyebrow">HOMEPAGE</span>
            <h2>Portfolio Section</h2>
            <p>Manage showcase cards, projects and Portfolio content.</p>
          </div>

          <ChevronDown size={20} />
        </summary>

        <div className="content-section-accordion-body">
          <PortfolioContentEditor />
        </div>
      </details>

      {/* ==================================
          GALLERY SECTION
      ================================== */}

      <details className="content-section-accordion">
        <summary className="content-section-accordion-header">
          <div>
            <span className="website-content-eyebrow">INNER PAGE</span>
            <h2>Gallery</h2>
            <p>
              Manage gallery images, titles, descriptions, and image uploads.
            </p>
          </div>

          <ChevronDown className="accordion-chevron" size={20} />
        </summary>

        <GalleryContentEditor />
      </details>

      {/* ==================================
          YOUTUBE VIDEOS SECTION
      ================================== */}

      <details className="content-section-accordion">
        <summary className="content-section-accordion-header">
          <div>
            <span className="website-content-eyebrow">HOMEPAGE</span>
            <h2>YouTube Videos</h2>
            <p>
              Manage homepage video gallery, featured videos, and carousel settings.
            </p>
          </div>
          <ChevronDown className="accordion-chevron" size={20} />
        </summary>

        <YouTubeVideosEditor />
      </details>

    </div>
  )
}

export default WebsiteContentPage
