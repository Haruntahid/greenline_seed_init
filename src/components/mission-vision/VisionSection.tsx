
import { ArrowUpRight, Compass } from 'lucide-react'
import './MissionVision.css'

function VisionSection() {
  return (
    <section className="mv-vision" id="vision-section">
      <div className="mv-vision-inner">
        <div className="mv-vision-header">
          <span className="mv-section-eyebrow">
            <span className="mv-hero-dot" />
            WHERE WE ARE HEADED
          </span>
          <span className="mv-section-index">02 / OUR VISION</span>
        </div>

        <div className="mv-vision-layout">
          <div className="mv-vision-visual">
            <div className="mv-vision-image mv-vision-image-main">
              <img
                src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1400&q=85"
                alt="A cinematic mountain landscape"
              />
            </div>

            <div className="mv-vision-image mv-vision-image-top">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=85"
                alt="People collaborating around technology"
              />
            </div>

            <div className="mv-vision-image mv-vision-image-bottom">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=85"
                alt="A peaceful green forest"
              />
            </div>

            <div className="mv-vision-image mv-vision-image-accent">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=85"
                alt="Modern architecture reaching toward the sky"
              />
            </div>

            <div className="mv-vision-visual-caption">
              <span>BEYOND TODAY</span>
              <span>✳</span>
              <span>INTO TOMORROW</span>
            </div>
          </div>

          <div className="mv-vision-content">
            <div className="mv-vision-label">
              <Compass size={19} />
              <span>OUR VISION</span>
            </div>

            <h2>
              A future shaped
              <span> by possibility.</span>
            </h2>

            <p>
              To build a future where ideas become opportunities
              and innovation creates positive impact for people,
              communities, and the world.
            </p>

            <a href="#core-values-section" className="mv-section-link">
              Explore our core values
              <ArrowUpRight size={18} />
            </a>

            <span className="mv-vision-index">VISION — 002</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionSection
