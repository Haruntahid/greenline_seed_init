
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Users,
  Camera,
  Play,
  Globe,
  X,
} from 'lucide-react'
import { aboutConfig } from '../../config'
import type { TeamMember } from '../../types/site.types'
import './OurTeamSection.css'

function OurTeamSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const team = aboutConfig.team ?? []

  const enabledMembers = team
    .filter((member) => member.enabled)
    .sort((a, b) => a.order - b.order)

  const featuredMember = enabledMembers.find((member) => member.featured)

  const teamMembers = enabledMembers.filter(
    (member) => !member.featured,
  )

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

 const getSocialIcon = (
  platform: TeamMember['socialLinks'][number]['platform'],
) => {
  const iconProps = { size: 17, strokeWidth: 1.7 }

  switch (platform) {
    case 'LinkedIn':
      return <BriefcaseBusiness {...iconProps} />
    case 'Facebook':
      return <Users {...iconProps} />
    case 'Instagram':
      return <Camera {...iconProps} />
    case 'X':
      return <X {...iconProps} />
    case 'YouTube':
      return <Play {...iconProps} />
    case 'Website':
      return <Globe {...iconProps} />
    default:
      return null
  }
}

  const SocialLinks = ({ member }: { member: TeamMember }) => (
    <div className="team-social-links">
      {member.socialLinks.map((social) => (
        <a
          key={social.platform}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${member.name} on ${social.platform}`}
        >
          {getSocialIcon(social.platform)}
        </a>
      ))}
    </div>
  )

  if (enabledMembers.length === 0) return null

  return (
    <section
      className={`our-team-section ${isVisible ? 'is-visible' : ''}`}
      id="our-team"
      ref={sectionRef}
    >
      <div className="our-team-inner">
        {/* SECTION INTRO */}
        <div className="team-section-heading">
          <div className="team-heading-copy">
            <span className="team-eyebrow">THE PEOPLE BEHIND OUR WORK</span>

            <h2>
              Meet the minds.
              <br />
              <span>Behind the vision.</span>
            </h2>
          </div>

          <div className="team-heading-description">
            <span className="team-heading-number">OUR TEAM — 01</span>
            <p>
              Great ideas become extraordinary when passionate people
              come together with a shared purpose.
            </p>
          </div>
        </div>

        {/* FEATURED LEADER */}
        {featuredMember && (
          <article className="team-leader">
            <div className="team-leader-visual">
              <img
                src={featuredMember.image}
                alt={featuredMember.name}
                loading="lazy"
              />

              <span className="team-image-index">01 / LEADERSHIP</span>

              <div className="team-leader-image-label">
                <span>LEADERSHIP SPOTLIGHT</span>
                <ArrowUpRight size={20} />
              </div>
            </div>

            <div className="team-leader-content">
              <span className="team-member-category">
                FOUNDING LEADERSHIP
              </span>

              <h3>{featuredMember.name}</h3>

              <span className="team-member-designation">
                {featuredMember.designation}
              </span>

              <blockquote>
                “{featuredMember.quote}”
              </blockquote>

              <p className="team-member-biography">
                {featuredMember.biography}
              </p>

              <SocialLinks member={featuredMember} />

              <span className="team-leader-decoration">
                THE VISION STARTS HERE
              </span>
            </div>
          </article>
        )}

        {/* TEAM GRID */}
        {teamMembers.length > 0 && (
          <div className="team-people">
            <div className="team-people-heading">
              <div>
                <span className="team-eyebrow">THE PEOPLE WHO MAKE IT HAPPEN</span>
                <h3>Meet our team<span>.</span></h3>
              </div>

              <span className="team-people-count">
                {String(teamMembers.length).padStart(2, '0')} PEOPLE
              </span>
            </div>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <article className="team-person" key={member.id}>
                  <div className="team-person-visual">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                    />

                    <span className="team-person-number">
                      {String(index + 2).padStart(2, '0')}
                    </span>

                    <SocialLinks member={member} />
                  </div>

                  <div className="team-person-info">
                    <span className="team-person-designation">
                      {member.designation}
                    </span>

                    <h4>{member.name}</h4>

                    <p>{member.biography}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* EXPERTISE STRIP */}
        <div className="team-expertise">
          <span>BETTER TOGETHER</span>
          <p>
            Different perspectives. Shared ambition. One team moving
            forward.
          </p>
          <ArrowUpRight size={24} />
        </div>
      </div>
    </section>
  )
}

export default OurTeamSection
