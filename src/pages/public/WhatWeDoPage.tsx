
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import ServicesSection from '../../components/sections/ServicesSection'
import StatsSection from '../../components/sections/StatsSection'
import PortfolioSection from '../../components/sections/PortfolioSection'
import GlobalImpactVisual from '../../components/visuals/GlobalImpactVisual'
import './WhatWeDoPage.css'
import GlobalReachMap from '../../components/visuals/GlobalReachMap'
import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard'

function WhatWeDoPage() {
  return (
    <div className="what-we-do-page">
      <section className="what-we-do-hero">
        <div className="what-we-do-hero-container">
          <div className="what-we-do-hero-content">
            <span className="what-we-do-eyebrow">
              <span className="what-we-do-eyebrow-line" />
              OUR EXPERTISE & IMPACT
            </span>

            <h1>
              Digital
              <br />
              <span>Experiences.</span>
            </h1>

            <p>
              We combine expertise, innovation and collaboration
              to create meaningful digital experiences, deliver
              valuable solutions and make a lasting difference.
            </p>

            <div className="what-we-do-hero-actions">
              <a href="#services" className="what-we-do-explore">
                Explore our expertise
                <ArrowUpRight size={18} />
              </a>

              <a href="#portfolio" className="what-we-do-secondary-link">
                Discover our work
                <ArrowDown size={16} />
              </a>
            </div>

            <div className="what-we-do-hero-note">
              <span className="what-we-do-status-dot" />
              INNOVATION · COLLABORATION · IMPACT
            </div>
          </div>

          <div className="what-we-do-hero-visual">
            <GlobalImpactVisual />
          </div>
        </div>

        <div className="what-we-do-hero-decoration">
          <span>01 / EXPERTISE</span>
          <span>02 / IMPACT</span>
          <span>03 / INNOVATION</span>
        </div>
      </section>

<ServicesSection />

<StatsSection layout="wide" />
<GlobalReachMap />
<AnalyticsDashboard />
<PortfolioSection />
    </div>
  )
}

export default WhatWeDoPage
