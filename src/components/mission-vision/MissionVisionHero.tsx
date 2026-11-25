
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import './MissionVision.css'

function MissionVisionHero() {
  return (
    <section className="mv-hero">
      <div className="mv-hero-inner">
        <div className="mv-hero-top">
          <span className="mv-hero-eyebrow">
            <span className="mv-hero-dot" />
            OUR PURPOSE & DIRECTION
          </span>

          <span className="mv-hero-index">
            MISSION & VISION — 002
          </span>
        </div>

        <div className="mv-hero-heading">
          <h1>
            Driven by
            <br />
            <span>Purpose.</span>
            <br />
            Guided by Vision.
            <span className="mv-hero-star">✳</span>
          </h1>

          <div className="mv-hero-description">
            <p>
              Every meaningful journey begins with a purpose.
              Discover the principles that shape our direction,
              inspire our work, and define the future we envision.
            </p>

            <a href="#mission-section" className="mv-hero-link">
              Explore our purpose
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        <div className="mv-hero-visual">
          <div className="mv-hero-visual-content">
            <span className="mv-hero-visual-label">
              OUR GUIDING PRINCIPLES
            </span>

            <p>
              A clear purpose.
              <br />
              A meaningful direction.
              <br />
              A future worth building.
            </p>

            <span className="mv-hero-visual-caption">
              BUILT ON PURPOSE · DRIVEN BY IMPACT
            </span>
          </div>

          <div className="mv-hero-visual-decoration">
            <span>✳</span>
          </div>

          <a href="#mission-section" className="mv-hero-scroll">
            <span>SCROLL TO DISCOVER</span>
            <span className="mv-hero-scroll-icon">
              <ArrowDown size={18} />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default MissionVisionHero
