
import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react'
import type { AboutContent } from '../../types/site.types'
import { ImageUploadField } from './ImageUploadField'
import {
  getAboutContent,
  fetchAboutContent,
  saveAboutContent,
  resetAboutContent,
} from '../../services/about-content.service'

function AboutContentEditor() {
  const [content, setContent] = useState<AboutContent>(getAboutContent)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void fetchAboutContent().then((data) => {
      setContent(data)
    })
  }, [])

  const updateField = (
    field: keyof AboutContent,
    value: string,
  ) => {
    setContent((previous) => ({
      ...previous,
      [field]: value,
    }))
    setSaved(false)
  }

  const updateHighlight = (
    index: number,
    field: 'title' | 'description',
    value: string,
  ) => {
    setContent((previous) => ({
      ...previous,
      highlights: previous.highlights.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item,
      ),
    }))
    setSaved(false)
  }

  const addHighlight = () => {
    setContent((previous) => ({
      ...previous,
      highlights: [
        ...previous.highlights,
        { title: '', description: '' },
      ],
    }))
    setSaved(false)
  }

  const removeHighlight = (index: number) => {
    setContent((previous) => ({
      ...previous,
      highlights: previous.highlights.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      await saveAboutContent(content)
      setSaved(true)
    } catch (error) {
      console.error('Unable to save About content:', error)
      window.alert('Could not save About changes. Please try again.')
    }
  }

  const handleReset = async () => {
    if (
      !window.confirm(
        'Reset the About section content and image to their original defaults?',
      )
    ) {
      return
    }

    try {
      const defaultContent = await resetAboutContent()

      setContent(defaultContent)
      setSaved(false)
    } catch (error) {
      console.error('Unable to reset About content:', error)
      window.alert('Could not reset About content. Please try again.')
    }
  }

  return (
    <section className="content-editor-panel">
      <div className="content-editor-panel-heading">
        <div>
          <span className="website-content-eyebrow">HOMEPAGE</span>
          <h2>About Section</h2>
          <p>
            Manage your company introduction, highlights and About image.
          </p>
        </div>
      </div>

      <div className="content-editor-form">
        <div className="content-editor-divider" />
        <ImageUploadField
          label="About Section Image"
          value={content.image}
          onChange={(newUrl) => {
            setContent((prev) => ({ ...prev, image: newUrl }))
            setSaved(false)
          }}
          placeholder="Upload image or paste image link"
          helpText="Upload an image from your device or paste an external / Google Drive link. Recommended: landscape."
        />

        <label>
          Image alternative text
          <input
            value={content.imageAlt ?? ''}
            placeholder="Describe the About image"
            onChange={(event) =>
              updateField('imageAlt', event.target.value)
            }
          />
        </label>

        <div className="content-editor-divider" />

        <h3>About introduction</h3>

        <label>
          Eyebrow text
          <input
            value={content.eyebrow}
            onChange={(event) =>
              updateField('eyebrow', event.target.value)
            }
          />
        </label>

        <label>
          Image badge text
          <input
            value={content.imageBadge ?? 'GET TO KNOW US'}
            onChange={(event) =>
              updateField('imageBadge', event.target.value)
            }
          />
        </label>

        <label>
          Main title
          <input
            value={content.title}
            onChange={(event) =>
              updateField('title', event.target.value)
            }
          />
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={content.description}
            onChange={(event) =>
              updateField('description', event.target.value)
            }
          />
        </label>

        <div className="content-editor-divider" />

        <div>
          <h3>About highlights</h3>
          <p className="hero-image-help">
            Add, edit or remove highlights such as Mission and Vision.
          </p>
        </div>

        {content.highlights.map((item, index) => (
          <div className="about-highlight-editor" key={index}>
            <div className="about-highlight-editor-heading">
              <h4>Highlight {index + 1}</h4>

              <button
                type="button"
                onClick={() => removeHighlight(index)}
                aria-label={`Remove highlight ${index + 1}`}
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>

            <label>
              Highlight title
              <input
                value={item.title}
                onChange={(event) =>
                  updateHighlight(index, 'title', event.target.value)
                }
              />
            </label>

            <label>
              Highlight description
              <textarea
                rows={3}
                value={item.description}
                onChange={(event) =>
                  updateHighlight(
                    index,
                    'description',
                    event.target.value,
                  )
                }
              />
            </label>
          </div>
        ))}

        <button
          type="button"
          className="hero-image-upload-button"
          onClick={addHighlight}
        >
          <Plus size={17} /> Add highlight
        </button>

        <div className="content-editor-divider" />

        <h3>About button</h3>

        <label>
          Button label
          <input
            value={content.buttonLabel ?? 'Discover Our Story'}
            onChange={(event) =>
              updateField('buttonLabel', event.target.value)
            }
          />
        </label>

        <label>
          Button link
          <input
            value={content.buttonLink ?? '/about'}
            onChange={(event) =>
              updateField('buttonLink', event.target.value)
            }
          />
        </label>
      </div>

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

export default AboutContentEditor
