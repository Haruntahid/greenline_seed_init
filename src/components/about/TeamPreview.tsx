
import { Link } from 'react-router-dom'
import { ArrowUpRight, Users } from 'lucide-react'
import { aboutConfig } from '../../config/about.config'
import './TeamPreview.css'

function TeamPreview() {
  const enabledMembers = aboutConfig.team
    ?.filter((member) => member.enabled)
    .sort((a, b) => a.order - b.order) ?? []

  const featuredMember = enabledMembers.find((member) => member.featured)

  const previewMembers = enabledMembers
    .filter((member) => !member.featured)
    .slice(0, 2)

  return (
    <section className="team-preview-section">
      <div className="team-preview-container">
        <div className="team-preview-heading">
          <div className="team-preview-intro">
            <span className="team-preview-eyebrow">
              <Users size={15} />
              THE PEOPLE BEHIND OUR VISION
            </span>

            <h2>
              Great ideas are built
              <span> by great people.</span>
            </h2>

            <p>
              Behind every achievement is a team of passionate people
              bringing different experiences, ideas and perspectives together.
            </p>
          </div>

          <Link to="/our-team" className="team-preview-link">
            Meet Our Full Team
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="team-preview-content">
          {featuredMember && (
            <article className="team-preview-featured">
              <div className="team-preview-featured-image">
                <img
                  src={featuredMember.image}
                  alt={featuredMember.name}
                  loading="lazy"
                />
              </div>

              <div className="team-preview-featured-info">
                <span>LEADERSHIP</span>
                <h3>{featuredMember.name}</h3>
                <p className="team-preview-designation">
                  {featuredMember.designation}
                </p>
                <blockquote>“{featuredMember.quote}”</blockquote>
              </div>
            </article>
          )}

          <div className="team-preview-members">
            {previewMembers.map((member) => (
              <article className="team-preview-member" key={member.id}>
                <div className="team-preview-member-image">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                  />
                </div>

                <div className="team-preview-member-info">
                  <h3>{member.name}</h3>
                  <p>{member.designation}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="team-preview-bottom">
          <p>Different talents. One shared vision.</p>
          <Link to="/our-team">
            Discover the people behind our work
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TeamPreview
