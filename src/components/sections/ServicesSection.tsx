
import { useEffect, useState } from 'react'
import type { ServicesContent } from '../../types/site.types'
import { getServicesContent, fetchServicesContent } from '../../services/services-content.service'
import {
  Code,
  Palette,
  Megaphone,
  Lightbulb,
  ArrowUpRight,
} from 'lucide-react'
import './ServicesSection.css'

const serviceIcons = {
  Code,
  Palette,
  Megaphone,
  Lightbulb,
}

function ServicesSection() {
  const [servicesContent, setServicesContent] = useState<ServicesContent>(getServicesContent)

  useEffect(() => {
    void fetchServicesContent().then((data) => {
      setServicesContent(data)
    })
  }, [])

  const enabledServices = servicesContent.services.filter(
    (service) => service.enabled,
  )

  const featuredService = enabledServices.find(
    (service) => service.featured,
  )

  const supportingServices = enabledServices.filter(
    (service) => service.id !== featuredService?.id,
  )

  const renderServiceIcon = (iconName: string) => {
    const Icon =
      serviceIcons[iconName as keyof typeof serviceIcons]

    return Icon ? <Icon size={25} strokeWidth={1.7} /> : null
  }

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <div className="services-heading">
          <div>
            <span>{servicesContent.eyebrow}</span>
            <h2>{servicesContent.title}</h2>
          </div>

          <p>{servicesContent.description}</p>
        </div>

        <div
          className={`services-layout ${
    featuredService ? 'has-featured-service' : 'no-featured-service'
  }`}
>
          {featuredService && (
            <article
              className="service-card service-card-featured"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(4, 24, 17, 0.96) 0%, rgba(4, 24, 17, 0.72) 55%, rgba(4, 24, 17, 0.2) 100%), url("${featuredService.image || ''}")`,
              }}
            >
              <div className="service-card-content">
                <span className="service-featured-label">
                  FEATURED EXPERTISE
                </span>

                <div className="service-icon">
                  {renderServiceIcon(featuredService.icon)}
                </div>

                <h3>{featuredService.title}</h3>

                <p>{featuredService.description}</p>

                <a
                  href={`/services/${featuredService.id}`}
                  className="service-explore-link"
                >
                  Explore service
                  <ArrowUpRight size={19} />
                </a>
              </div>

              <span className="service-card-number">01</span>
            </article>
          )}

          <div className="services-supporting-grid">
            {supportingServices.map((service, index) => (
              <article
                className="service-card service-card-small"
                key={service.id}
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(4, 24, 17, 0.97) 0%, rgba(4, 24, 17, 0.72) 65%, rgba(4, 24, 17, 0.25) 100%), url("${service.image || ''}")`,
                }}
              >
                <div className="service-card-content">
                  <div className="service-icon">
                    {renderServiceIcon(service.icon)}
                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <a
                    href={`/services/${service.id}`}
                    className="service-explore-link"
                  >
                    Explore
                    <ArrowUpRight size={17} />
                  </a>
                </div>

                <span className="service-card-number">
                  {String(index + (featuredService ? 2 : 1)).padStart(2, '0')}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
