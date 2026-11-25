
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { servicesConfig } from '../../config'
import './ServicesPage.css'

function ServicesPage() {
  const visibleServices = servicesConfig.services.filter(
    (service) => service.enabled,
  )

  return (
    <main className="services-page">
      {/* Editorial Hero */}
      <section className="services-hero">
        <div className="services-hero-inner">
          <div className="services-hero-content">
            <span className="services-eyebrow">
              <span className="services-eyebrow-line" />
              {servicesConfig.eyebrow}
            </span>

            <h1>
              {servicesConfig.title}
            </h1>

            <p className="services-hero-description">
              {servicesConfig.description}
            </p>

            <a href="#service-list" className="services-scroll-link">
              Explore our expertise
              <ArrowDown size={17} />
            </a>
          </div>

          <div className="services-hero-side">
            <span className="services-hero-index">01 — 04</span>

            <div className="services-hero-note">
              <span>OUR APPROACH</span>
              <p>
                Thoughtful strategy.
                <br />
                Meaningful design.
                <br />
                Intelligent technology.
              </p>
            </div>

            <div className="services-hero-decoration">
              <span>CREATIVE</span>
              <span>DIGITAL</span>
              <span>EXPERIENCES</span>
            </div>
          </div>
        </div>

        <div className="services-hero-bottom">
          <span>STRATEGY / DESIGN / DEVELOPMENT</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* Services List */}
      <section className="services-list-section" id="service-list">
        <div className="services-list-heading">
          <div>
            <span className="services-eyebrow">
              WHAT WE BRING TO THE TABLE
            </span>

            <h2>
              Our areas of <span>expertise.</span>
            </h2>
          </div>

          <p>
            From the first idea to the final experience,
            we help businesses move forward with purpose.
          </p>
        </div>

        <div className="services-list">
          {visibleServices.map((service, index) => (
            <Link
              to={`/services/${service.id}`}
              className="service-list-item"
              key={service.id}
            >
              <span className="service-list-number">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="service-list-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>

              <span className="service-list-action">
                <ArrowUpRight size={22} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ServicesPage
