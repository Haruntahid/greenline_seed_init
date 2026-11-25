
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import {
  getPortfolioContent,
  fetchPortfolioContent,
} from '../../services/portfolio-content.service'
import type { PortfolioContent } from '../../types/site.types'
import { getTextFontClass } from '../../utils/typography'
import { getGoogleDriveImageUrl } from '../../utils/google-drive-image'
import './PortfolioSection.css'

function PortfolioSection() {
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent>(
    getPortfolioContent,
  )

  useEffect(() => {
    let isActive = true
    void fetchPortfolioContent().then((data) => {
      if (isActive) {
        setPortfolioContent(data)
      }
    })
    return () => {
      isActive = false
    }
  }, [])

  const enabledFeatures = portfolioContent.features
    .filter((feature) => feature.enabled)
    .sort((a, b) => a.order - b.order)

  const enabledProjects = portfolioContent.projects
    .filter((project) => project.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section id="portfolio" className="portfolio-section" lang="bn">
      <div className="portfolio-container">

        {/* Section Introduction */}
        <div className="portfolio-heading">
          <div className="portfolio-heading-content">
            <span className={getTextFontClass(portfolioContent.eyebrow)}>
              {portfolioContent.eyebrow}
            </span>

            <h2 className={getTextFontClass(portfolioContent.title)}>
              {portfolioContent.title}
            </h2>
          </div>

          <p className={getTextFontClass(portfolioContent.description)}>
            {portfolioContent.description}
          </p>
        </div>

        {/* Company Showcase */}
        {enabledFeatures.length > 0 && (
          <div className="portfolio-features">
            {enabledFeatures.map((feature, index) => (
              <article
                className={`portfolio-feature portfolio-feature-${index + 1}`}
                key={feature.id}
              >
                <div className="portfolio-feature-image">
                  <img
                    src={getGoogleDriveImageUrl(feature.image)}
                    alt={feature.title}
                    loading="lazy"
                  />

                  <span className="portfolio-feature-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="portfolio-feature-content">
                  <span className={`portfolio-feature-eyebrow ${getTextFontClass(feature.eyebrow)}`}>
                    {feature.eyebrow}
                  </span>

                  <h3 className={getTextFontClass(feature.title)}>
                    {feature.title}
                  </h3>

                  <p className={getTextFontClass(feature.description)}>
                    {feature.description}
                  </p>

                  <Link
                    to={feature.link}
                    className="portfolio-action-button"
                  >
                    <span className={getTextFontClass(feature.buttonLabel)}>
                      {feature.buttonLabel}
                    </span>
                    <span className="portfolio-action-icon">
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Selected Work */}
        {enabledProjects.length > 0 && (
          <div className="portfolio-work">
            <div className="portfolio-work-heading">
              <div>
                <span className={`portfolio-work-eyebrow ${getTextFontClass('REAL-WORLD IMPACT')}`}>
                  REAL-WORLD IMPACT
                </span>

                <h3 className={getTextFontClass('Selected Work')}>
                  Selected Work<span>.</span>
                </h3>
              </div>

              <p className={getTextFontClass(
                "A closer look at some of the ideas, projects and experiences we've brought to life."
              )}>
                A closer look at some of the ideas, projects and
                experiences we've brought to life.
              </p>
            </div>

            <div className="portfolio-grid">
              {enabledProjects.map((project, index) => (
                <article
                  className="portfolio-card"
                  key={project.id}
                >
                  <div className="portfolio-image-wrapper">
                    <img
                      src={getGoogleDriveImageUrl(project.image)}
                      alt={project.title}
                      loading="lazy"
                    />

                    <div className="portfolio-image-overlay" />

                    <span className="portfolio-project-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="portfolio-project-link">
                      <ArrowUpRight size={23} />
                    </span>
                  </div>

                  <div className="portfolio-card-content">
                    <div>
                      <span className={`portfolio-category ${getTextFontClass(project.category)}`}>
                        {project.category}
                      </span>

                      <h4 className={getTextFontClass(project.title)}>
                        {project.title}
                      </h4>

                      <p className={getTextFontClass(project.description)}>
                        {project.description}
                      </p>
                    </div>

                    <span className="portfolio-year">
                      {project.year}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}



      </div>
    </section>
  )
}

export default PortfolioSection
