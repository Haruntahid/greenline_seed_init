
import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react'

import type {
  AboutPageContent,
  AboutPageSectionVisibility,
} from '../../types/site.types'

import { ImageUploadField } from './ImageUploadField'
import {
  getAboutPageContent,
  fetchAboutPageContent,
  saveAboutPageContent,
  resetAboutPageContent,
} from '../../services/about-page-content.service'

type SectionKey = keyof AboutPageSectionVisibility

const sections: {
  key: SectionKey
  title: string
  description: string
}[] = [
  {
    key: 'hero',
    title: 'Introduction / Hero',
    description: 'Manage the main introduction of your company.',
  },
  {
    key: 'story',
    title: 'Company Story',
    description: 'Manage your company history and background.',
  },
  {
    key: 'owner',
    title: "Owner's Message",
    description: 'Manage the message from your company leadership.',
  },
  {
    key: 'journey',
    title: 'Company Journey',
    description: 'Manage your company milestones and timeline.',
  },
  {
    key: 'missionVision',
    title: 'Mission & Vision',
    description: 'Manage your company mission and vision.',
  },
  {
    key: 'values',
    title: 'Company Values',
    description: 'Manage your core values and principles.',
  },
  {
    key: 'achievements',
    title: 'Achievements',
    description: 'Manage your company achievements.',
  },
  {
    key: 'closing',
    title: 'Closing Statement',
    description: 'Manage the final message of your About Us page.',
  },
]

function AboutPageContentEditor() {
  const [content, setContent] = useState<AboutPageContent>(
    getAboutPageContent,
  )

  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    void fetchAboutPageContent().then((data) => {
      if (!cancelled) {
        setContent(data)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  function updateHero<K extends 'eyebrow' | 'title' | 'description' | 'image' | 'imageAlt'>(
    field: K,
    value: AboutPageContent[K],
  ) {
    setContent((previous) => ({
      ...previous,
      [field]: value,
    }))

    setSaved(false)
    setMessage('')
  }

  function handleVisibilityChange(
    key: SectionKey,
    enabled: boolean,
  ) {
    setContent((previous) => ({
      ...previous,
      sectionVisibility: {
        ...previous.sectionVisibility,
        [key]: enabled,
      },
    }))

    setSaved(false)
    setMessage('')
  }
    function updateJourneyMilestone(
    index: number,
    field: 'year' | 'description' | 'image',
    value: string,
  ) {
    setContent((previous) => ({
      ...previous,
      journey: previous.journey.map((milestone, milestoneIndex) =>
        milestoneIndex === index
          ? { ...milestone, [field]: value }
          : milestone,
      ),
    }))

    setSaved(false)
    setMessage('')
  }

  function addJourneyMilestone() {
    setContent((previous) => ({
      ...previous,
      journey: [
        ...previous.journey,
        {
          id: `journey-${Date.now()}`,
          year: '',
          description: '',
          image: '',
          enabled: true,
        },
      ],
    }))

    setSaved(false)
    setMessage('')
  }

  function deleteJourneyMilestone(index: number) {
    if (!window.confirm('Delete this journey milestone?')) return

    setContent((previous) => ({
      ...previous,
      journey: previous.journey.filter(
        (_, milestoneIndex) => milestoneIndex !== index,
      ),
    }))

    setSaved(false)
    setMessage('')
  }

  function moveJourneyMilestone(
    index: number,
    direction: -1 | 1,
  ) {
    setContent((previous) => {
      const journey = [...previous.journey]
      const targetIndex = index + direction

      if (targetIndex < 0 || targetIndex >= journey.length) {
        return previous
      }

      ;[journey[index], journey[targetIndex]] = [
        journey[targetIndex],
        journey[index],
      ]

      return {
        ...previous,
        journey,
      }
    })

    setSaved(false)
    setMessage('')
  }

  async function handleSave() {
    try {
      await saveAboutPageContent(content)
      setSaved(true)
      setMessage('About Us page content saved successfully.')
    } catch (error) {
      console.error('Unable to save About Us page content:', error)
      setMessage('Unable to save changes. Please try again.')
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      'Reset all About Us page content to its default settings?',
    )

    if (!confirmed) return

    try {
      const resetData = await resetAboutPageContent()

      setContent(resetData)
      setSaved(false)
      setMessage('About Us page content has been reset.')
    } catch (error) {
      console.error('Unable to reset About Us page content:', error)
      setMessage('Unable to reset content. Please try again.')
    }
  }

  return (
    <section className="content-editor-panel">
      <div className="content-editor-panel-heading">
        <span className="website-content-eyebrow">
          COMPANY PAGE
        </span>

        <h2>About Us Page Editor</h2>

        <p>
          Manage your complete About Us page independently
          from the homepage About section.
        </p>
      </div>

      <div className="content-editor-form">
        <div>
          <h3>Page Sections</h3>
          <p>
            Expand each section to manage its content and
            control whether it appears on the public page.
          </p>
        </div>

        {sections.map((section) => (
          <details
            className="content-section-accordion"
            key={section.key}
          >
            <summary className="content-section-accordion-header">
              <div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>

              <ChevronDown
                className="accordion-chevron"
                size={20}
              />
            </summary>

            <div className="content-editor-panel">
              <label className="service-editor-toggle">
                <input
                  type="checkbox"
                  checked={content.sectionVisibility[section.key]}
                  onChange={(event) =>
                    handleVisibilityChange(
                      section.key,
                      event.target.checked,
                    )
                  }
                />

                <span>
                  {content.sectionVisibility[section.key]
                    ? 'Section visible on public page'
                    : 'Section hidden from public page'}
                </span>
              </label>

              {section.key === 'hero' && (
                <div className="content-editor-form">
                  <h3>Introduction Content</h3>

                  <label>
                    Eyebrow
                    <input
                      value={content.eyebrow}
                      onChange={(event) =>
                        updateHero('eyebrow', event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Main heading
                    <input
                      value={content.title}
                      onChange={(event) =>
                        updateHero('title', event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      rows={5}
                      value={content.description}
                      onChange={(event) =>
                        updateHero('description', event.target.value)
                      }
                    />
                  </label>

                  <div className="content-editor-divider" />

                  <h3>Hero Image</h3>

                  <ImageUploadField
                    label="About Page Hero Image"
                    value={content.image ?? ''}
                    onChange={(newUrl) => updateHero('image', newUrl)}
                    placeholder="Upload image or paste link"
                  />

                  <label>
                    Image alternative text
                    <input
                      value={content.imageAlt ?? ''}
                      placeholder="Describe the Hero image"
                      onChange={(event) =>
                        updateHero('imageAlt', event.target.value)
                      }
                    />
                  </label>
                </div>
              )}

              {section.key === 'story' && (
                <div className="content-editor-form">
                  <h3>Company Story Content</h3>

                  <label>
                    Eyebrow
                    <input
                      value={content.story.eyebrow}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          story: {
                            ...previous.story,
                            eyebrow: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <label>
                    Main heading
                    <input
                      value={content.story.title}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          story: {
                            ...previous.story,
                            title: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <label>
                    Story paragraphs
                    <textarea
                      rows={10}
                      value={content.story.description.join('\n\n')}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          story: {
                            ...previous.story,
                            description: event.target.value
                              .split(/\n\s*\n/)
                              .filter((paragraph) => paragraph.trim()),
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                      placeholder="Separate paragraphs with a blank line."
                    />
                  </label>

                  <div className="content-editor-divider" />

                  <h3>Primary Story Image</h3>

                  <label>
                    Image URL
                    <input
                      type="url"
                      value={content.story.image}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          story: {
                            ...previous.story,
                            image: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                      placeholder="https://example.com/company-story.jpg"
                    />
                  </label>

                  <h3>Secondary Story Image</h3>

                  <label>
                    Image URL
                    <input
                      type="url"
                      value={content.story.secondaryImage ?? ''}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          story: {
                            ...previous.story,
                            secondaryImage: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                      placeholder="https://example.com/company-culture.jpg"
                    />
                  </label>

                  <label>
                    Image caption
                    <input
                      value={content.story.imageCaption ?? ''}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          story: {
                            ...previous.story,
                            imageCaption: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                      placeholder="A short caption about the images"
                    />
                  </label>
                </div>
              )}

              {section.key === 'owner' && (
                <div className="content-editor-form">
                  <h3>Owner's Message Content</h3>

                  <label>
                    Eyebrow
                    <input
                      value={content.owner.eyebrow}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          owner: {
                            ...previous.owner,
                            eyebrow: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <label>
                    Main heading
                    <input
                      value={content.owner.title}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          owner: {
                            ...previous.owner,
                            title: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <label>
                    Owner's name
                    <input
                      value={content.owner.name}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          owner: {
                            ...previous.owner,
                            name: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <label>
                    Designation
                    <input
                      value={content.owner.designation}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          owner: {
                            ...previous.owner,
                            designation: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <label>
                    Owner's message
                    <textarea
                      rows={6}
                      value={content.owner.message}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          owner: {
                            ...previous.owner,
                            message: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <label>
                    Highlighted quotation
                    <textarea
                      rows={4}
                      value={content.owner.quote}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          owner: {
                            ...previous.owner,
                            quote: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <label>
                    Signature
                    <input
                      value={content.owner.signature}
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          owner: {
                            ...previous.owner,
                            signature: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>

                  <div className="content-editor-divider" />

                  <h3>Owner's Image</h3>

                  <label>
                    Image URL
                    <input
                      type="url"
                      value={content.owner.image}
                      placeholder="https://example.com/owner.jpg"
                      onChange={(event) => {
                        setContent((previous) => ({
                          ...previous,
                          owner: {
                            ...previous.owner,
                            image: event.target.value,
                          },
                        }))
                        setSaved(false)
                        setMessage('')
                      }}
                    />
                  </label>
                </div>
              )}
                            {section.key === 'journey' && (
                <div className="content-editor-form journey-admin-editor">
                  <div className="journey-admin-heading">
                    <div>
                      <h3>Company Journey Milestones</h3>
                      <p>
                        Add, edit, delete, and reorder the milestones
                        displayed on your public Company Journey timeline.
                      </p>
                    </div>

                    <span className="journey-admin-count">
                      {content.journey.length} Milestones
                    </span>
                  </div>

                  {content.journey.map((milestone, index) => {
                    const imageUrl = milestone.image?.trim() ?? ''
                    const driveMatch = imageUrl.match(
                      /(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]+)/,
                    )
                    const previewUrl = driveMatch
                      ? `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`
                      : imageUrl

                    return (
                      <article
                        className="journey-admin-card"
                        key={milestone.id}
                      >
                        <div className="journey-admin-card-header">
                          <div>
                            <span className="journey-admin-number">
                              MILESTONE {String(index + 1).padStart(2, '0')}
                            </span>
                            <h4>
                              {milestone.year.trim() || 'New Milestone'}
                            </h4>
                          </div>

                          <div className="journey-admin-controls">
                            <button
                              type="button"
                              title="Move Up"
                              aria-label={`Move milestone ${index + 1} up`}
                              disabled={index === 0}
                              onClick={() =>
                                moveJourneyMilestone(index, -1)
                              }
                            >
                              <ArrowUp size={16} />
                              <span>Move Up</span>
                            </button>

                            <button
                              type="button"
                              title="Move Down"
                              aria-label={`Move milestone ${index + 1} down`}
                              disabled={
                                index === content.journey.length - 1
                              }
                              onClick={() =>
                                moveJourneyMilestone(index, 1)
                              }
                            >
                              <ArrowDown size={16} />
                              <span>Move Down</span>
                            </button>

                            <button
                              type="button"
                              className="journey-admin-delete"
                              onClick={() =>
                                deleteJourneyMilestone(index)
                              }
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        <label>
                          Year
                          <input
                            type="text"
                            value={milestone.year}
                            placeholder="e.g. ২০২৫"
                            onChange={(event) =>
                              updateJourneyMilestone(
                                index,
                                'year',
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        <label>
                          Description
                          <textarea
                            rows={4}
                            value={milestone.description}
                            placeholder="Describe this company milestone..."
                            onChange={(event) =>
                              updateJourneyMilestone(
                                index,
                                'description',
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        <label>
                          Image URL
                          <input
                            type="url"
                            value={milestone.image ?? ''}
                            placeholder="https://example.com/image.jpg"
                            onChange={(event) =>
                              updateJourneyMilestone(
                                index,
                                'image',
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        {previewUrl && (
                          <div className="journey-admin-image-preview">
                            <img
                              src={previewUrl}
                              alt={`Preview for ${milestone.year || 'journey milestone'}`}
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none'
                              }}
                            />
                            <span>Image Preview</span>
                          </div>
                        )}
                      </article>
                    )
                  })}

                  {content.journey.length === 0 && (
                    <div className="journey-admin-empty">
                      <p>No journey milestones have been added yet.</p>
                    </div>
                  )}

                  <button
                    type="button"
                    className="journey-admin-add-button"
                    onClick={addJourneyMilestone}
                  >
                    <Plus size={18} />
                    Add New Milestone
                  </button>
                </div>
              )}

            </div>
          </details>
        ))}
      </div>

      {message && (
        <p className="content-editor-message" role="status">
          {message}
        </p>
      )}

      <div className="content-editor-actions">
        <button
          type="button"
          className="content-reset-button"
          onClick={() => void handleReset()}
        >
          <RotateCcw size={16} />
          Reset to Default
        </button>

        <button
          type="button"
          className="content-save-button"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <CheckCircle2 size={16} />
              Saved
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </section>
  )
}

export default AboutPageContentEditor