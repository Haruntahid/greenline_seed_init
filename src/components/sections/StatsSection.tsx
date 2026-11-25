
import { useEffect, useState } from 'react'
import { getStatsContent, fetchStatsContent, type StatsContent } from '../../services/stats-content.service'
import AnimatedCounter from '../ui/AnimatedCounter'
import {
  BriefcaseBusiness,
  Heart,
  Users,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react'
import './StatsSection.css'

const statIcons = {
  projects: BriefcaseBusiness,
  satisfaction: Heart,
  team: Users,
  experience: CalendarDays,
}

interface StatsSectionProps {
  layout?: 'default' | 'wide'
}

function StatsSection({ layout = 'default' }: StatsSectionProps) {
  const [statsContent, setStatsContent] = useState<StatsContent>(getStatsContent)

  useEffect(() => {
    void fetchStatsContent().then((data) => {
      setStatsContent(data)
    })
  }, [])

  const enabledStats = statsContent.stats.filter(
    (stat) => stat.enabled !== false,
  )

  const featuredStat =
    enabledStats.find(
      (stat) => stat.id === statsContent.featuredStatId,
    ) ?? enabledStats[0]

  if (!featuredStat) return null

  const supportingStats = enabledStats.filter(
    (stat) => stat.id !== featuredStat.id,
  )

  const FeaturedIcon =
    statIcons[featuredStat.id as keyof typeof statIcons]

  return (
    <section
    id="stats"
      className={`stats-section ${layout === 'wide' ? 'stats-section-wide' : ''}`}
    >
      <div className="stats-content">
        <div className="stats-editorial-intro">
          <span className="stats-eyebrow">
            <span className="stats-eyebrow-line" />
            {statsContent.eyebrow}
          </span>

          <h2>{statsContent.title}</h2>

          <p>{statsContent.description}</p>
        </div>

        <div className="stats-showcase">
          <div
            className="stats-featured-visual"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(4, 21, 15, 0.95), rgba(4, 21, 15, 0.08) 75%), url("${featuredStat.image}")`,
            }}
          >
            <div className="stats-featured-content">
              <span>OUR JOURNEY SO FAR</span>

              <div className="stats-featured-number">
                <AnimatedCounter
                  value={featuredStat.value}
                  suffix={featuredStat.suffix}
                />
              </div>

              <h3>{featuredStat.label}</h3>

              <p>{featuredStat.description}</p>
            </div>

            <div className="stats-featured-icon">
              {FeaturedIcon && (
                <FeaturedIcon size={22} strokeWidth={1.7} />
              )}
            </div>

            <span className="stats-featured-arrow">
              <ArrowUpRight size={24} />
            </span>
          </div>

          <div className="stats-editorial-list">
            {supportingStats.map((stat, index) => {
              const Icon =
                statIcons[stat.id as keyof typeof statIcons]

              return (
                <article className="stats-editorial-item" key={stat.id}>
                  <div
                    className="stats-item-image"
                    style={{
                      backgroundImage: `url("${stat.image}")`,
                    }}
                  />

                  <div className="stats-item-content">
                    <span className="stats-item-label">
                      {stat.label}
                    </span>

                    <h3>
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </h3>

                    <p>{stat.description}</p>
                  </div>

                  <div className="stats-item-icon">
                    {Icon && <Icon size={19} strokeWidth={1.8} />}
                  </div>

                  <span className="stats-item-index">
                    {String(index + 2).padStart(2, '0')}
                  </span>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
