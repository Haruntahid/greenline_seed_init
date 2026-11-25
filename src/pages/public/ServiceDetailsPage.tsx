
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { servicesConfig } from '../../config'
import './ServiceDetailsPage.css'

function ServiceDetailsPage() {
  const { slug } = useParams()

  // Find the requested enabled service
  const service = servicesConfig.services.find(
    (item) => item.id === slug && item.enabled,
  )

  // Handle invalid or disabled services
  if (!service) {
    return (
      <main className="service-details-not-found">
        <span>404 — SERVICE NOT FOUND</span>
        <h1>This service doesn't exist.</h1>
        <p>
          The service you're looking for may be unavailable
          or the address may be incorrect.
        </p>
        <Link to="/services">
          Explore our services <ArrowRight size={18} />
        </Link>
      </main>
    )
  }

  return (
    <main className="service-details-page">

      {/* SERVICE HERO */}
      <section className="service-details-hero">
        <div className="service-details-hero-inner">

          <div className="service-details-hero-content">
            <span className="service-details-eyebrow">
              <span />
              OUR SERVICES / {service.title}
            </span>

            <h1>
              {service.heroTitle || service.title}
            </h1>

            <p>
              {service.heroDescription || service.description}
            </p>

            <a href="#service-overview">
              Discover what we do
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="service-details-hero-side">
            <span>01 — 04</span>

            <div>
              <small>OUR EXPERTISE</small>
              <h2>{service.title}</h2>
            </div>

            <span className="service-details-hero-label">
              STRATEGY / CREATIVITY / EXECUTION
            </span>
          </div>

        </div>
      </section>

      {/* SERVICE OVERVIEW */}
      <section
        className="service-details-overview"
        id="service-overview"
      >
        <div className="service-details-overview-inner">

          <div>
            <span className="service-details-eyebrow">
              THE BIG PICTURE
            </span>

            <h2>
              {service.overviewTitle || service.title}
            </h2>
          </div>

          <p>
            {service.overviewDescription || service.description}
          </p>

        </div>
      </section>

      {/* SERVICE FEATURES */}
      {service.features && service.features.length > 0 && (
        <section className="service-details-features">
          <div className="service-details-section-heading">
            <span className="service-details-eyebrow">
              WHAT WE OFFER
            </span>

            <h2>
              Built around <span>your needs.</span>
            </h2>

            <p>
              Explore the capabilities that help us deliver
              meaningful results.
            </p>
          </div>

          <div className="service-details-feature-grid">
            {service.features.map((feature, index) => (
              <article
                className="service-details-feature-card"
                key={feature.title}
              >
                <span className="service-details-feature-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>

                <ArrowUpRight
                  className="service-details-feature-arrow"
                  size={22}
                />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SERVICE PROCESS */}
      {service.process && service.process.length > 0 && (
        <section className="service-details-process">
          <div className="service-details-section-heading">
            <span className="service-details-eyebrow">
              HOW WE WORK
            </span>

            <h2>
              A thoughtful process.
              <span> Meaningful results.</span>
            </h2>
          </div>

          <div className="service-details-process-grid">
            {service.process.map((step) => (
              <article
                className="service-details-process-card"
                key={step.number}
              >
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* FINAL CALL TO ACTION */}
      <section className="service-details-cta">
        <span className="service-details-eyebrow">
          LET'S WORK TOGETHER
        </span>

        <h2>
          {service.ctaTitle || 'Have a project in mind?'}
        </h2>

        <p>
          {service.ctaDescription ||
            'Let’s discuss how we can help your business move forward.'}
        </p>

        <Link to="/contact">
          Start a conversation
          <ArrowUpRight size={19} />
        </Link>
      </section>

    </main>
  )
}

export default ServiceDetailsPage
