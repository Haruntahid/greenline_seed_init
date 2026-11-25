
import {
  Lightbulb,
  Handshake,
  ShieldCheck,
  Leaf,
  Target,
  Users,
} from 'lucide-react'
import './MissionVision.css'

const coreValues = [
  {
    number: '01',
    title: 'Innovation',
    description:
      'We embrace fresh thinking and creative solutions to turn possibilities into meaningful progress.',
    icon: Lightbulb,
  },
  {
    number: '02',
    title: 'Collaboration',
    description:
      'We believe meaningful achievements happen when people work together and share knowledge.',
    icon: Handshake,
  },
  {
    number: '03',
    title: 'Integrity',
    description:
      'We act with honesty, transparency, and accountability in everything we do.',
    icon: ShieldCheck,
  },
  {
    number: '04',
    title: 'Sustainability',
    description:
      'We make responsible choices that contribute to a better future for generations to come.',
    icon: Leaf,
  },
  {
    number: '05',
    title: 'Excellence',
    description:
      'We pursue quality, continuous improvement, and meaningful results in every endeavour.',
    icon: Target,
  },
  {
    number: '06',
    title: 'People First',
    description:
      'We value people, respect diverse perspectives, and put human impact at the heart of progress.',
    icon: Users,
  },
]

function CoreValues() {
  return (
    <section className="mv-values" id="core-values-section">
      <div className="mv-values-inner">
        <div className="mv-values-header">
          <div>
            <span className="mv-section-eyebrow">
              <span className="mv-hero-dot" />
              WHAT WE BELIEVE IN
            </span>
            <h2>
              The values that
              <span> define us.</span>
            </h2>
          </div>

          <p>
            Our values guide our decisions, shape our culture,
            and influence every step of our journey.
          </p>
        </div>

        <div className="mv-values-grid">
          {coreValues.map((value) => {
            const Icon = value.icon

            return (
              <article className="mv-value-item" key={value.number}>
                <div className="mv-value-top">
                  <span className="mv-value-number">{value.number}</span>
                  <span className="mv-value-icon">
                    <Icon size={23} strokeWidth={1.6} />
                  </span>
                </div>

                <h3>{value.title}</h3>

                <p>{value.description}</p>

                <span className="mv-value-bottom-line" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CoreValues
