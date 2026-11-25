
import { ArrowUpRight, Sparkles } from 'lucide-react'

const missionPillars = [
  {
    number: '01',
    label: 'OUR MISSION',
    title: 'Create meaningful solutions.',
    description:
      'To turn ideas into practical solutions through innovation, creativity, and responsible thinking.',
  },
  {
    number: '02',
    label: 'OUR COMMITMENT',
    title: 'Empower people through innovation.',
    description:
      'To create opportunities through collaboration, knowledge sharing, and continuous improvement.',
  },
  {
    number: '03',
    label: 'OUR IMPACT',
    title: 'Make a lasting difference.',
    description:
      'To contribute to positive and sustainable change for people, communities, and the world.',
  },
  {
    number: '04',
    label: 'OUR FUTURE',
    title: 'Build what comes next.',
    description:
      'To move forward with purpose, responsibility, and a vision for a better tomorrow.',
  },
]

function MissionSection() {
  return (
    <section className="mv-mission" id="mission-section">
      <div className="mv-mission-inner">
        <div className="mv-mission-header">
          <span className="mv-section-eyebrow">
            <span className="mv-hero-dot" />
            WHAT DRIVES US
          </span>
          <span className="mv-section-index">01 / OUR MISSION</span>
        </div>

        <div className="mv-mission-intro">
          <Sparkles size={20} />
          <p>Purpose is not just what we believe. It is what we do.</p>
        </div>

        <div className="mv-mission-list">
          {missionPillars.map((pillar, index) => (
            <article
              className={`mv-mission-pillar ${
                index % 2 === 1 ? 'mv-mission-pillar-right' : ''
              }`}
              key={pillar.number}
            >
              <span className="mv-pillar-number">{pillar.number}</span>

              <div className="mv-pillar-content">
                <span className="mv-pillar-label">{pillar.label}</span>
                <h2>{pillar.title}</h2>
                <p>{pillar.description}</p>
                <a href="#vision-section" className="mv-section-link">
                  Discover our vision
                  <ArrowUpRight size={18} />
                </a>
              </div>

              <span className="mv-pillar-decoration" aria-hidden="true">
                ✳
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MissionSection
