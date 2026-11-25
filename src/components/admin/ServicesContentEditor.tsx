
import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Plus,
  RotateCcw,
  Save,
  Star,
  Trash2,
} from 'lucide-react'
import type {
  ServicesContent,
  ServiceItem,
} from '../../types/site.types'
import {
  getServicesContent,
  fetchServicesContent,
  saveServicesContent,
  resetServicesContent,
} from '../../services/services-content.service'

const availableIcons = [
  'Code',
  'Palette',
  'Megaphone',
  'Lightbulb',
]

function ServicesContentEditor() {
  const [content, setContent] = useState<ServicesContent>(
    getServicesContent,
  )
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void fetchServicesContent().then((data) => {
      setContent(data)
    })
  }, [])

  const updateSectionField = (
    field: 'eyebrow' | 'title' | 'description',
    value: string,
  ) => {
    setContent((previous) => ({
      ...previous,
      [field]: value,
    }))
    setSaved(false)
  }

  const updateService = (
    id: string,
    field: keyof ServiceItem,
    value: string | boolean,
  ) => {
    setContent((previous) => ({
      ...previous,
      services: previous.services.map((service) =>
        service.id === id
          ? { ...service, [field]: value }
          : service,
      ),
    }))
    setSaved(false)
  }

  const addService = () => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      title: 'New Service',
      description: 'Add a description for this service.',
      icon: 'Code',
      enabled: true,
      featured: false,
    }

    setContent((previous) => ({
      ...previous,
      services: [...previous.services, newService],
    }))
    setSaved(false)
  }

  const removeService = (id: string) => {
    const service = content.services.find(
      (item) => item.id === id,
    )

    if (!service) return

    if (
      !window.confirm(
        `Remove "${service.title}" from your Services section?`,
      )
    ) {
      return
    }

    setContent((previous) => ({
      ...previous,
      services: previous.services.filter(
        (item) => item.id !== id,
      ),
    }))
    setSaved(false)
  }

  const setFeaturedService = (id: string) => {
    setContent((previous) => ({
      ...previous,
      services: previous.services.map((service) => ({
        ...service,
        featured: service.id === id,
      })),
    }))
    setSaved(false)
  }

  const clearFeaturedService = () => {
    setContent((previous) => ({
      ...previous,
      services: previous.services.map((service) => ({
        ...service,
        featured: false,
      })),
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      await saveServicesContent(content)
      setSaved(true)
    } catch (error) {
      console.error('Unable to save Services content:', error)
      window.alert(
        'Could not save Services changes. Please try again.',
      )
    }
  }

  const handleReset = async () => {
    if (
      !window.confirm(
        'Reset the Services section and all service cards to their original defaults?',
      )
    ) {
      return
    }

    try {
      await resetServicesContent()
      const fresh = await fetchServicesContent()
      setContent(fresh)
      setSaved(false)
    } catch (error) {
      console.error('Unable to reset Services content:', error)
      window.alert(
        'Could not reset Services content. Please try again.',
      )
    }
  }

  return (
    <section className="content-editor-panel">
      <div className="content-editor-panel-heading">
        <div>
          <span className="website-content-eyebrow">HOMEPAGE</span>
          <h2>Services Section</h2>
          <p>
            Manage your services, descriptions, visibility and featured card.
          </p>
        </div>
      </div>

      <div className="content-editor-form">
        <div className="content-editor-divider" />

        <h3>Section introduction</h3>

        <label>
          Eyebrow text
          <input
            value={content.eyebrow}
            onChange={(event) =>
              updateSectionField('eyebrow', event.target.value)
            }
          />
        </label>

        <label>
          Section title
          <input
            value={content.title}
            onChange={(event) =>
              updateSectionField('title', event.target.value)
            }
          />
        </label>

        <label>
          Section description
          <textarea
            rows={4}
            value={content.description}
            onChange={(event) =>
              updateSectionField('description', event.target.value)
            }
          />
        </label>

        <div className="content-editor-divider" />

        <div>
          <h3>Service cards</h3>
          <p className="hero-image-help">
            Edit your service cards, control visibility and choose one featured service.
          </p>
        </div>

        {content.services.map((service, index) => (
          <div className="about-highlight-editor" key={service.id}>
            <div className="about-highlight-editor-heading">
              <h4>
                Service {index + 1}
                {service.featured ? ' — Featured' : ''}
              </h4>

              <button
                type="button"
                onClick={() => removeService(service.id)}
                aria-label={`Remove ${service.title}`}
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>

            <label>
              Service title
              <input
                value={service.title}
                onChange={(event) =>
                  updateService(
                    service.id,
                    'title',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Description
              <textarea
                rows={3}
                value={service.description}
                onChange={(event) =>
                  updateService(
                    service.id,
                    'description',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Icon
              <select
                value={service.icon}
                onChange={(event) =>
                  updateService(
                    service.id,
                    'icon',
                    event.target.value,
                  )
                }
              >
                {availableIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Card image URL
              <input
                type="url"
                value={service.image ?? ''}
                placeholder="https://example.com/service-image.jpg"
                onChange={(event) =>
                  updateService(
                    service.id,
                    'image',
                    event.target.value,
                  )
                }
              />
            </label>

            {service.image && (
              <div className="hero-image-preview">
                <span>Card image preview</span>
                <img
                  src={service.image}
                  alt={`${service.title} preview`}
                />
              </div>
            )}

            <label className="service-editor-toggle">
              <input
                type="checkbox"
                checked={service.enabled}
                onChange={(event) =>
                  updateService(
                    service.id,
                    'enabled',
                    event.target.checked,
                  )
                }
              />
              Show this service on the homepage
            </label>

            <button
              type="button"
              className="hero-image-upload-button"
              disabled={!service.enabled}
              onClick={() => setFeaturedService(service.id)}
            >
              <Star size={16} />
              {service.featured
                ? 'Featured service'
                : 'Set as featured service'}
            </button>
          </div>
        ))}

        <button
          type="button"
          className="hero-image-upload-button"
          onClick={addService}
        >
          <Plus size={17} />
          Add service
        </button>

        <button
          type="button"
          className="content-reset-button"
          onClick={clearFeaturedService}
        >
          Clear featured selection
        </button>
      </div>

      <div className="content-editor-actions">
        <button
          type="button"
          className="content-reset-button"
          onClick={handleReset}
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
            <CheckCircle2 size={17} />
          ) : (
            <Save size={17} />
          )}
          {saved ? 'Changes Saved' : 'Save Changes'}
        </button>
      </div>
    </section>
  )
}

export default ServicesContentEditor
