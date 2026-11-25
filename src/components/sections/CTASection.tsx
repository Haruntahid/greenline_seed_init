
import { Link } from 'react-router-dom'
import { MoveUpRight } from 'lucide-react'
import { getPortfolioContent } from '../../services/portfolio-content.service'
import './CTASection.css'

function CTASection() {
  const { closingCTA } = getPortfolioContent()

  return (
    <section id="cta" className="cta-section">
      <div className="cta-container">
        <div className="portfolio-closing">
          <div className="portfolio-closing-content">
            <span>{closingCTA.eyebrow}</span>
            <h3>{closingCTA.title}</h3>
            <p>{closingCTA.description}</p>
          </div>

          <Link
            to={closingCTA.buttonLink}
            className="portfolio-closing-button"
          >
            <span>{closingCTA.buttonLabel}</span>
            <MoveUpRight size={21} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTASection
