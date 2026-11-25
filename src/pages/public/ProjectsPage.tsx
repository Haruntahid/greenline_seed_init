
import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  ArrowUpRight,
  X,
  Activity,
  Layers3,
  Code2,
  Cpu,
  ExternalLink,
  Command,
} from 'lucide-react'
import { portfolioConfig } from '../../config'
import type { PortfolioProject } from '../../types/site.types'
import { api } from '../../services/api'
import './ProjectsPage.css'

function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Projects')
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null)

  const [projectsList, setProjectsList] = useState<PortfolioProject[]>(() =>
    portfolioConfig.projects
      .filter((project) => project.enabled)
      .sort((a, b) => a.order - b.order),
  )

  useEffect(() => {
    void api.projects
      .list({ enabled: true })
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setProjectsList(res.data.sort((a, b) => a.order - b.order))
        }
      })
      .catch(console.error)
  }, [])

  const categories = useMemo(
    () => [
      'All Projects',
      ...new Set(projectsList.map((project) => project.category)),
    ],
    [projectsList],
  )

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return projectsList.filter((project) => {
      const matchesCategory =
        activeCategory === 'All Projects' ||
        project.category === activeCategory

      const searchableText = [
        project.title,
        project.description,
        project.category,
        ...(project.technologies ?? []),
        ...(project.services ?? []),
      ]
        .join(' ')
        .toLowerCase()

      return matchesCategory && (!query || searchableText.includes(query))
    })
  }, [projectsList, activeCategory, searchQuery])

  const clearFilters = () => {
    setSearchQuery('')
    setActiveCategory('All Projects')
  }

  useEffect(() => {
    if (!selectedProject) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProject])

  const featuredCount = projectsList.filter(
    (project) => project.featured,
  ).length

  return (
    <main className="projects-page">

      {/* HERO */}
      <section className="observatory-hero">
        <div className="observatory-grid" />
        <div className="observatory-glow observatory-glow-one" />
        <div className="observatory-glow observatory-glow-two" />

        <div className="observatory-orbit orbit-one">
          <span />
        </div>
        <div className="observatory-orbit orbit-two">
          <span />
        </div>

        <div className="observatory-hero-inner">
          <div className="observatory-status">
            <span className="status-indicator" />
            DIGITAL INNOVATION / PROJECT ARCHIVE
          </div>

          <div className="observatory-hero-layout">
            <div className="observatory-hero-copy">
              <p className="observatory-index">[ THE WORKSPACE — 001 ]</p>

              <h1>
                Ideas become
                <br />
                <span>digital reality.</span>
              </h1>

              <p className="observatory-description">
                A closer look at the ideas, technologies and collaborations
                shaping meaningful digital experiences.
              </p>

              <a href="#project-explorer" className="observatory-explore">
                EXPLORE THE ARCHIVE
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="observatory-visual" aria-hidden="true">
              <div className="visual-core">
                <div className="core-ring ring-a" />
                <div className="core-ring ring-b" />
                <div className="core-ring ring-c" />
                <div className="core-center">
                  <Command size={39} strokeWidth={1.2} />
                </div>
                <span className="visual-node node-a" />
                <span className="visual-node node-b" />
                <span className="visual-node node-c" />
              </div>
              <span className="visual-coordinate coordinate-a">23.8103° N</span>
              <span className="visual-coordinate coordinate-b">90.4125° E</span>
              <span className="visual-caption">SYSTEM / CREATIVE ENGINEERING</span>
            </div>
          </div>

          <div className="observatory-metrics">
            <div className="metric-item">
              <span className="metric-number">
                {String(projectsList.length).padStart(2, '0')}
              </span>
              <span className="metric-label">PROJECTS ARCHIVED</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">
                {String(featuredCount).padStart(2, '0')}
              </span>
              <span className="metric-label">FEATURED WORKS</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">
                {String(categories.length - 1).padStart(2, '0')}
              </span>
              <span className="metric-label">PROJECT CATEGORIES</span>
            </div>
            <div className="metric-system">
              <Activity size={17} />
              <span>ARCHIVE STATUS: ONLINE</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT EXPLORER */}
      <section className="project-explorer" id="project-explorer">
        <div className="project-explorer-inner">

          <div className="explorer-heading">
            <div>
              <span className="section-code">01 / PROJECT DATABASE</span>
              <h2>
                Selected <span>work.</span>
              </h2>
            </div>

            <p>
              Every project is a different problem to solve.
              Explore the thinking and technology behind the work.
            </p>
          </div>

          <div className="explorer-toolbar">
            <div className="explorer-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search projects, services or technologies..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search projects"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <span className="explorer-count">
              SHOWING <strong>{String(filteredProjects.length).padStart(2, '0')}</strong>
              {' / '}
              {String(projectsList.length).padStart(2, '0')}
            </span>
          </div>

          <div className="explorer-filters">
            <span className="filter-label">FILTER BY /</span>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredProjects.length > 0 ? (
            <div className="observatory-project-grid">
              {filteredProjects.map((project, index) => (
                <button
                  type="button"
                  className={`observatory-project-card ${
                    index === 0 ? 'has-featured-project' : ''
                  }`}
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  aria-label={`View details for ${project.title}`}
                >
                  <div className="project-card-visual">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                    />

                    <div className="project-image-overlay" />

                    <span className="project-card-index">
                      PROJECT / {String(index + 1).padStart(2, '0')}
                    </span>

                    {project.featured && (
                      <span className="project-card-featured">
                        <Activity size={12} />
                        FEATURED
                      </span>
                    )}

                    <span className="project-card-open">
                      <ArrowUpRight size={22} />
                    </span>

                    <span className="project-image-bottom">
                      <span>{project.category.toUpperCase()}</span>
                      <span>{project.year}</span>
                    </span>
                  </div>

<div className="project-card-information">
  <div className="project-card-title-row">
    <h3>{project.title}</h3>
    <ArrowUpRight size={19} />
  </div>

  <p>{project.description}</p>

  {project.technologies && project.technologies.length > 0 && (
    <div className="project-card-technologies">
      {project.technologies.slice(0, 3).map((technology) => (
        <span key={technology}>{technology}</span>
      ))}

      {project.technologies.length > 3 && (
        <span>+{project.technologies.length - 3}</span>
      )}
    </div>
  )}

  <div className="project-card-footer">
    <span>VIEW CASE STUDY</span>
    <span className="project-card-line" />
    <span>#{String(project.order).padStart(3, '0')}</span>
  </div>
</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="observatory-empty">
              <Search size={30} />
              <h3>No matching projects.</h3>
              <p>Try another search term or select a different category.</p>
              <button type="button" onClick={clearFilters}>
                RESET EXPLORER <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null)
            }
          }}
        >
          <article
            className="project-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <button
              type="button"
              className="project-modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project details"
            >
              <X size={22} />
            </button>

            <div className="project-modal-cover">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
              />
              <div className="project-modal-cover-overlay" />
              <span>PROJECT ARCHIVE / {selectedProject.year}</span>
            </div>

            <div className="project-modal-content">
              <div className="project-modal-meta">
                <span>{selectedProject.category}</span>
                <span>CASE STUDY / {selectedProject.id}</span>
              </div>

              <h2 id="project-modal-title">{selectedProject.title}</h2>
              <p className="project-modal-intro">
                {selectedProject.overview || selectedProject.description}
              </p>

              {selectedProject.challenge && (
                <div className="project-modal-section">
                  <span>01 / THE CHALLENGE</span>
                  <p>{selectedProject.challenge}</p>
                </div>
              )}

              {selectedProject.solution && (
                <div className="project-modal-section">
                  <span>02 / OUR SOLUTION</span>
                  <p>{selectedProject.solution}</p>
                </div>
              )}

              {selectedProject.services &&
                selectedProject.services.length > 0 && (
                  <div className="project-modal-section">
                    <span>03 / SERVICES</span>
                    <div className="project-modal-tags">
                      {selectedProject.services.map((service) => (
                        <span key={service}>{service}</span>
                      ))}
                    </div>
                  </div>
                )}

              {selectedProject.technologies &&
                selectedProject.technologies.length > 0 && (
                  <div className="project-modal-section">
                    <span>04 / TECHNOLOGY STACK</span>
                    <div className="project-modal-tags technology-tags">
                      {selectedProject.technologies.map((technology) => (
                        <span key={technology}>
                          <Code2 size={13} />
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {selectedProject.gallery &&
                selectedProject.gallery.length > 0 && (
                  <div className="project-modal-section">
                    <span>05 / VISUAL GALLERY</span>
                    <div className="project-modal-gallery">
                      {selectedProject.gallery.map((image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt={`${selectedProject.title} gallery ${index + 1}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                )}

              {selectedProject.impact && (
                <div className="project-modal-impact">
                  <Layers3 size={20} />
                  <div>
                    <span>PROJECT IMPACT</span>
                    <p>{selectedProject.impact}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="project-modal-bottom">
              <span><Cpu size={15} /> DIGITAL WORK / BUILT WITH PURPOSE</span>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
              >
                CLOSE CASE STUDY <ExternalLink size={14} />
              </button>
            </div>
          </article>
        </div>
      )}
    </main>
  )
}

export default ProjectsPage
