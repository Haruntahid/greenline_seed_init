
import { useEffect, useState } from 'react'
import {
  ImagePlus,
  Plus,
  Save,
  Trash2,
  RotateCcw,
} from 'lucide-react'

import type { GalleryContent, GalleryItem } from '../../types/site.types'
import {
  getGalleryContent,
  fetchGalleryContent,
  saveGalleryContent,
  resetGalleryContent,
} from '../../services/gallery-content.service'
import {
  getGalleryImage,
  deleteGalleryImage,
} from '../../services/gallery-image.service'
import { ImageUploadField } from './ImageUploadField'
import './GalleryContentEditor.css'

function GalleryContentEditor() {
  const [content, setContent] = useState<GalleryContent>(() =>
    getGalleryContent(),
  )
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    void fetchGalleryContent().then((data) => {
      if (!cancelled) {
        setContent(data)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const imageSignature = content.items
    .map((item) => `${item.id}:${item.imageType}:${item.image}`)
    .join('|')

  useEffect(() => {
    let cancelled = false
    const objectUrls: string[] = []

    const loadUploadedImages = async () => {
      const previews: Record<string, string> = {}

      for (const item of content.items) {
        if (item.imageType !== 'upload') continue

        try {
          const image = await getGalleryImage(item.id)

          if (image) {
            const objectUrl = URL.createObjectURL(image)
            objectUrls.push(objectUrl)
            previews[item.id] = objectUrl
          }
        } catch (error) {
          console.error(`Failed to load gallery image ${item.id}:`, error)
        }
      }

      if (!cancelled) {
        setImagePreviews(previews)
      } else {
        objectUrls.forEach(URL.revokeObjectURL)
      }
    }

    void loadUploadedImages()

    return () => {
      cancelled = true
      objectUrls.forEach(URL.revokeObjectURL)
    }
  }, [imageSignature])

  const updateItem = (
    itemId: string,
    updates: Partial<GalleryItem>,
  ) => {
    setContent((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      ),
    }))
  }

  const addItem = () => {
    const newItem: GalleryItem = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      image: '',
      imageType: 'url',
      enabled: true,
      order: content.items.length,
    }

    setContent((current) => ({
      ...current,
      items: [...current.items, newItem],
    }))

    setMessage('')
  }

  const handleUrlChange = async (
    itemId: string,
    imageUrl: string,
  ) => {
    const currentItem = content.items.find((item) => item.id === itemId)

    if (currentItem?.imageType === 'upload') {
      try {
        await deleteGalleryImage(itemId)
      } catch (error) {
        console.error('Failed to replace uploaded gallery image:', error)
      }

      setImagePreviews((current) => {
        const previousUrl = current[itemId]
        if (previousUrl) URL.revokeObjectURL(previousUrl)

        const updated = { ...current }
        delete updated[itemId]
        return updated
      })
    }

    updateItem(itemId, {
      image: imageUrl,
      imageType: 'url',
    })
  }

  const handleDeleteItem = async (itemId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this gallery image?',
    )

    if (!confirmed) return

    try {
      await deleteGalleryImage(itemId)
    } catch (error) {
      console.error('Failed to delete gallery image:', error)
    }

    setImagePreviews((current) => {
      const previousUrl = current[itemId]
      if (previousUrl) URL.revokeObjectURL(previousUrl)

      const updated = { ...current }
      delete updated[itemId]
      return updated
    })

    setContent((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== itemId),
    }))

    setMessage('Gallery item removed. Save your changes to confirm.')
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const normalizedContent: GalleryContent = {
        ...content,
        items: content.items.map((item, index) => ({
          ...item,
          order: index,
          title: item.title.trim(),
          description: item.description.trim(),
          image: item.image.trim(),
        })),
      }

      await saveGalleryContent(normalizedContent)
      setContent(normalizedContent)
      setMessage('Gallery content saved successfully.')
    } catch (error) {
      console.error('Failed to save gallery content:', error)
      setMessage('Unable to save gallery content. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Reset gallery content? This will remove all gallery items.',
    )

    if (!confirmed) return

    for (const item of content.items) {
      try {
        await deleteGalleryImage(item.id)
      } catch (error) {
        console.error('Failed to remove gallery image:', error)
      }
    }

    Object.values(imagePreviews).forEach(URL.revokeObjectURL)
    setImagePreviews({})
    setContent(await resetGalleryContent())
    setMessage('Gallery content has been reset.')
  }

  return (
    <div className="content-editor-panel gallery-admin-editor">
      <div className="content-editor-group">
        <p>
          Add and manage the images displayed on your public Gallery page.
          You can upload images or use direct image links.
        </p>

        <div className="gallery-admin-list-heading">
          <div>
            <h3>Gallery Images</h3>
            <span>{content.items.length} image(s)</span>
          </div>

          <button
            type="button"
            className="gallery-admin-add-button"
            onClick={addItem}
          >
            <Plus size={16} />
            Add Image
          </button>
        </div>

        {content.items.length > 0 ? (
          content.items.map((item, index) => (
            <article className="gallery-admin-card" key={item.id}>
                <div className="gallery-admin-card-header">
                  <div>
                    <span className="gallery-admin-number">
                      IMAGE {String(index + 1).padStart(2, '0')}
                    </span>
                    <h4>{item.title || 'Untitled Image'}</h4>
                  </div>

                  <button
                    type="button"
                    className="gallery-admin-delete-button"
                    onClick={() => void handleDeleteItem(item.id)}
                    aria-label={`Delete image ${index + 1}`}
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>
                </div>

                <ImageUploadField
                  label="Gallery Image (Upload or Link)"
                  value={item.image ?? ''}
                  onChange={(newUrl) => void handleUrlChange(item.id, newUrl)}
                  placeholder="Upload image or paste link"
                />

                <label className="gallery-admin-field">
                  Image Title
                  <input
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateItem(item.id, { title: event.target.value })
                    }
                    placeholder="Enter image title"
                  />
                </label>

                <label className="gallery-admin-field">
                  Short Description
                  <textarea
                    value={item.description}
                    onChange={(event) =>
                      updateItem(item.id, {
                        description: event.target.value,
                      })
                    }
                    placeholder="Write a short description"
                    rows={3}
                  />
                </label>
              </article>
          ))
        ) : (
          <div className="gallery-admin-empty">
            <ImagePlus size={34} />
            <h4>No gallery images yet</h4>
            <p>Select Add Image to create your first gallery item.</p>
          </div>
        )}

        <div className="gallery-admin-info">
          <strong>Tip:</strong> Ensure external image links are publicly accessible before saving.
        </div>

        <div className="content-editor-actions">
          <button
            type="button"
            className="content-editor-reset-button"
            onClick={() => void handleReset()}
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            className="content-editor-save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {message && (
          <p className="content-editor-message" role="status">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default GalleryContentEditor
