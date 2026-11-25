
import { useEffect, useState } from 'react'
import { CheckCircle2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'

import type { PortfolioContent } from '../../types/site.types'
import {
  getPortfolioContent,
  fetchPortfolioContent,
  savePortfolioContent,
  resetPortfolioContent,
} from '../../services/portfolio-content.service'
import { ImageUploadField } from './ImageUploadField'



function PortfolioContentEditor() {
  const [content, setContent] = useState<PortfolioContent>(
    getPortfolioContent,
  )
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let isActive = true
    void fetchPortfolioContent().then((data) => {
      if (isActive) {
        setContent(data)
      }
    })
    return () => {
      isActive = false
    }
  }, [])

  const updateField = (
    field: 'eyebrow' | 'title' | 'description',
    value: string,
  ) => {
    setContent((previous) => ({
      ...previous,
      [field]: value,
    }))
    setSaved(false)
  }

  const updateFeature = <
    K extends keyof PortfolioContent['features'][number],
  >(
    featureId: string,
    field: K,
    value: PortfolioContent['features'][number][K],
  ) => {
    setContent((previous) => ({
      ...previous,
      features: previous.features.map((feature) =>
        feature.id === featureId
          ? { ...feature, [field]: value }
          : feature,
      ),
    }))
    setSaved(false)
  }

  const moveFeature = (featureId: string, direction: 'up' | 'down') => {
    setContent((previous) => {
      const features = [...previous.features].sort(
        (a, b) => a.order - b.order,
      )

      const currentIndex = features.findIndex(
        (feature) => feature.id === featureId,
      )

      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= features.length) {
        return previous
      }

      const updatedFeatures = [...features]
      const current = updatedFeatures[currentIndex]
      updatedFeatures[currentIndex] = updatedFeatures[targetIndex]
      updatedFeatures[targetIndex] = current

      return {
        ...previous,
        features: updatedFeatures.map((feature, index) => ({
          ...feature,
          order: index + 1,
        })),
      }
    })

    setSaved(false)
  }
  const addFeature = () => {
    setContent((previous) => ({
      ...previous,
      features: [
        ...previous.features,
        {
          id: `feature-${Date.now()}`,
          eyebrow: 'NEW FEATURE',
          title: 'New Feature',
          description: 'Add your feature description here.',
          image: '',
          link: '/',
          buttonLabel: 'Learn More',
          enabled: true,
          order: previous.features.length + 1,
        },
      ],
    }))

    setSaved(false)
  }

  const deleteFeature = (featureId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this feature card?',
    )

    if (!confirmed) return

    setContent((previous) => ({
      ...previous,
      features: previous.features
        .filter((feature) => feature.id !== featureId)
        .map((feature, index) => ({
          ...feature,
          order: index + 1,
        })),
    }))

    setSaved(false)
  }

  const updateProject = <
    K extends keyof PortfolioContent['projects'][number],
  >(
    projectId: string,
    field: K,
    value: PortfolioContent['projects'][number][K],
  ) => {
    setContent((previous) => ({
      ...previous,
      projects: previous.projects.map((project) =>
        project.id === projectId
          ? { ...project, [field]: value }
          : project,
      ),
    }))

    setSaved(false)
  }

  const moveProject = (projectId: string, direction: 'up' | 'down') => {
    setContent((previous) => {
      const projects = [...previous.projects].sort(
        (a, b) => a.order - b.order,
      )

      const currentIndex = projects.findIndex(
        (project) => project.id === projectId,
      )

      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= projects.length
      ) {
        return previous
      }

      const updatedProjects = [...projects]
      const current = updatedProjects[currentIndex]

      updatedProjects[currentIndex] = updatedProjects[targetIndex]
      updatedProjects[targetIndex] = current

      return {
        ...previous,
        projects: updatedProjects.map((project, index) => ({
          ...project,
          order: index + 1,
        })),
      }
    })

    setSaved(false)
  }

  const addProject = () => {
    setContent((previous) => ({
      ...previous,
      projects: [
        ...previous.projects,
        {
          id: `project-${Date.now()}`,
          slug: `new-project-${Date.now()}`,
          title: 'New Project',
          category: 'General',
          description: 'Add your project description here.',
          year: new Date().getFullYear().toString(),
          image: '',
          overview: '',
          challenge: '',
          solution: '',
          services: [],
          technologies: [],
          gallery: [],
          impact: '',
          featured: false,
          enabled: true,
          order: previous.projects.length + 1,
        },
      ],
    }))

    setSaved(false)
  }

  const deleteProject = (projectId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?',
    )

    if (!confirmed) return

    setContent((previous) => ({
      ...previous,
      projects: previous.projects
        .filter((project) => project.id !== projectId)
        .map((project, index) => ({
          ...project,
          order: index + 1,
        })),
    }))

    setSaved(false)
  }

  const updateClosingCTA = (
    field: keyof PortfolioContent['closingCTA'],
    value: string,
  ) => {
    setContent((previous) => ({
      ...previous,
      closingCTA: {
        ...previous.closingCTA,
        [field]: value,
      },
    }))

    setSaved(false)
  }


  const handleSave = async () => {
    try {
      await savePortfolioContent(content)
      setSaved(true)
    } catch (error) {
      console.error('Failed to save Portfolio content:', error)
      window.alert('Failed to save Portfolio content. Please try again.')
    }
  }

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Reset Portfolio content to its default settings? Your saved changes will be lost.',
    )

    if (!confirmed) return

    const defaultContent = await resetPortfolioContent()
    setContent(defaultContent)
    setSaved(false)
  }

  return (
    <section className="content-editor-panel">
      <div className="content-editor-panel-heading">
        <div>
          <h3>Portfolio Introduction</h3>
          <p>Edit the heading and introductory text of your Portfolio section.</p>
        </div>
      </div>

      <div className="content-editor-form">
        <div className="content-editor-field">
          <label htmlFor="portfolio-eyebrow">Eyebrow Text</label>
          <input
            id="portfolio-eyebrow"
            type="text"
            value={content.eyebrow}
            onChange={(event) =>
              updateField('eyebrow', event.target.value)
            }
          />
        </div>

        <div className="content-editor-field">
          <label htmlFor="portfolio-title">Section Title</label>
          <input
            id="portfolio-title"
            type="text"
            value={content.title}
            onChange={(event) =>
              updateField('title', event.target.value)
            }
          />
        </div>

        <div className="content-editor-field">
          <label htmlFor="portfolio-description">Description</label>
          <textarea
            id="portfolio-description"
            rows={4}
            value={content.description}
            onChange={(event) =>
              updateField('description', event.target.value)
            }
          />
        </div>
      </div>

      <div className="content-editor-divider" />

      <div className="content-editor-panel-heading">
        <div>
          <h3>Portfolio Feature Cards</h3>
          <p>Manage the showcase cards displayed in your Portfolio section.</p>
        </div>
      </div>
      <button
        type="button"
        className="content-editor-save-button"
        onClick={addFeature}
      >
        <Plus size={16} />
        Add Feature
      </button>
      {content.features
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((feature, index) => (
          <div className="content-editor-form" key={feature.id}>
            <div className="content-editor-divider" />

            <div className="content-editor-panel-heading">
              <h3>
                Feature {index + 1}: {feature.title}
              </h3>

              <label>
                <input
                  type="checkbox"
                  checked={feature.enabled}
                  onChange={(event) =>
                    updateFeature(
                      feature.id,
                      'enabled',
                      event.target.checked,
                    )
                  }
                />
                Enable card
              </label>
            </div>

            <div className="content-editor-field">
              <label>Eyebrow</label>
              <input
                type="text"
                value={feature.eyebrow}
                onChange={(event) =>
                  updateFeature(feature.id, 'eyebrow', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Title</label>
              <input
                type="text"
                value={feature.title}
                onChange={(event) =>
                  updateFeature(feature.id, 'title', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Description</label>
              <textarea
                rows={3}
                value={feature.description}
                onChange={(event) =>
                  updateFeature(feature.id, 'description', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <ImageUploadField
                label="Feature Image (Upload or Link)"
                value={feature.image}
                onChange={(newUrl) => updateFeature(feature.id, 'image', newUrl)}
                placeholder="Upload image file or enter URL"
              />
            </div>

            <div className="content-editor-field">
              <label>Destination Link</label>
              <input
                type="text"
                value={feature.link}
                onChange={(event) =>
                  updateFeature(feature.id, 'link', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Button Label</label>
              <input
                type="text"
                value={feature.buttonLabel}
                onChange={(event) =>
                  updateFeature(feature.id, 'buttonLabel', event.target.value)
                }
              />
            </div>

            <div className="content-editor-divider" />

            <div className="content-editor-panel-heading">
              <div>
                <h3>Portfolio Closing CTA</h3>
                <p>Manage the closing call-to-action content for your Portfolio section.</p>
              </div>
            </div>

            <div className="content-editor-field">
              <label>Eyebrow</label>
              <input
                type="text"
                value={content.closingCTA.eyebrow}
                onChange={(event) =>
                  updateClosingCTA('eyebrow', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Title</label>
              <input
                type="text"
                value={content.closingCTA.title}
                onChange={(event) =>
                  updateClosingCTA('title', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Description</label>
              <textarea
                rows={3}
                value={content.closingCTA.description}
                onChange={(event) =>
                  updateClosingCTA('description', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Button Label</label>
              <input
                type="text"
                value={content.closingCTA.buttonLabel}
                onChange={(event) =>
                  updateClosingCTA('buttonLabel', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Button Link</label>
              <input
                type="text"
                value={content.closingCTA.buttonLink}
                onChange={(event) =>
                  updateClosingCTA('buttonLink', event.target.value)
                }
              />
            </div>

            <div className="content-editor-actions">
              <button
                type="button"
                className="content-editor-reset-button"
                disabled={index === 0}
                onClick={() => moveFeature(feature.id, 'up')}
              >
                Move Up
              </button>

              <button
                type="button"
                className="content-editor-reset-button"
                disabled={index === content.features.length - 1}
                onClick={() => moveFeature(feature.id, 'down')}
              >
                Move Down
              </button>
              <button
                type="button"
                className="content-editor-reset-button"
                onClick={() => deleteFeature(feature.id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}

      <div className="content-editor-divider" />

      <div className="content-editor-panel-heading">
        <div>
          <h3>Portfolio Projects</h3>
          <p>Manage your selected work and project details.</p>
        </div>
      </div>

      <button
        type="button"
        className="content-editor-save-button"
        onClick={addProject}
      >
        <Plus size={16} />
        Add Project
      </button>

      {content.projects
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((project, index) => (
          <div className="content-editor-form" key={project.id}>
            <div className="content-editor-divider" />

            <div className="content-editor-panel-heading">
              <div>
                <h3>
                  Project {index + 1}: {project.title}
                </h3>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={project.enabled}
                    onChange={(event) =>
                      updateProject(
                        project.id,
                        'enabled',
                        event.target.checked,
                      )
                    }
                  />
                  Enable
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={project.featured}
                    onChange={(event) =>
                      updateProject(
                        project.id,
                        'featured',
                        event.target.checked,
                      )
                    }
                  />
                  Featured
                </label>
              </div>
            </div>

            <div className="content-editor-field">
              <label>Project Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(event) =>
                  updateProject(project.id, 'title', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Slug</label>
              <input
                type="text"
                value={project.slug}
                onChange={(event) =>
                  updateProject(project.id, 'slug', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Category</label>
              <input
                type="text"
                value={project.category}
                onChange={(event) =>
                  updateProject(project.id, 'category', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Description</label>
              <textarea
                rows={3}
                value={project.description}
                onChange={(event) =>
                  updateProject(project.id, 'description', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Year</label>
              <input
                type="text"
                value={project.year}
                onChange={(event) =>
                  updateProject(project.id, 'year', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <ImageUploadField
                label="Project Image (Upload or Link)"
                value={project.image}
                onChange={(newUrl) => updateProject(project.id, 'image', newUrl)}
                placeholder="Upload image file or enter URL"
              />
            </div>

            <div className="content-editor-divider" />

            <h4>Project Details</h4>

            <div className="content-editor-field">
              <label>Overview</label>
              <textarea
                rows={3}
                value={project.overview ?? ''}
                onChange={(event) =>
                  updateProject(project.id, 'overview', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Challenge</label>
              <textarea
                rows={3}
                value={project.challenge ?? ''}
                onChange={(event) =>
                  updateProject(project.id, 'challenge', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Solution</label>
              <textarea
                rows={3}
                value={project.solution ?? ''}
                onChange={(event) =>
                  updateProject(project.id, 'solution', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Impact</label>
              <textarea
                rows={3}
                value={project.impact ?? ''}
                onChange={(event) =>
                  updateProject(project.id, 'impact', event.target.value)
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Services (comma-separated)</label>
              <input
                type="text"
                value={(project.services ?? []).join(', ')}
                onChange={(event) =>
                  updateProject(
                    project.id,
                    'services',
                    event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                  )
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Technologies (comma-separated)</label>
              <input
                type="text"
                value={(project.technologies ?? []).join(', ')}
                onChange={(event) =>
                  updateProject(
                    project.id,
                    'technologies',
                    event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                  )
                }
              />
            </div>

            <div className="content-editor-field">
              <label>Gallery Image URLs (comma-separated)</label>
              <textarea
                rows={3}
                value={(project.gallery ?? []).join(', ')}
                onChange={(event) =>
                  updateProject(
                    project.id,
                    'gallery',
                    event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                  )
                }
              />
            </div>

            <div className="content-editor-actions">
              <button
                type="button"
                className="content-editor-reset-button"
                disabled={index === 0}
                onClick={() => moveProject(project.id, 'up')}
              >
                Move Up
              </button>

              <button
                type="button"
                className="content-editor-reset-button"
                disabled={index === content.projects.length - 1}
                onClick={() => moveProject(project.id, 'down')}
              >
                Move Down
              </button>

              <button
                type="button"
                className="content-editor-reset-button"
                onClick={() => deleteProject(project.id)}
              >
                <Trash2 size={16} />
                Delete Project
              </button>
            </div>
          </div>
        ))}


      <div className="content-editor-actions">
        <button
          type="button"
          className="content-editor-reset-button"
          onClick={handleReset}
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          className="content-editor-save-button"
          onClick={handleSave}
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>
    </section>
  )
}

export default PortfolioContentEditor
