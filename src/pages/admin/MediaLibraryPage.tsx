import { useEffect, useState } from 'react'
import {
  Images,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Search,
} from 'lucide-react'
import { api } from '../../services/api'
import { convertGoogleDriveUrl } from '../../utils/google-drive-image'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import './MediaLibraryPage.css'

interface MediaItem {
  id: string
  name: string
  url: string
  category?: string
  createdAt?: string
}

function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // New Link modal state
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newCategory, setNewCategory] = useState('Products')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadMedia = async () => {
    setIsLoading(true)
    try {
      const res = await api.media.list()
      if (res.success && Array.isArray(res.data)) {
        setMediaList(res.data)
      }
    } catch (err: any) {
      console.error('Failed to load media:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadMedia()
  }, [])

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (!newUrl.trim()) {
      setFeedback({ type: 'error', message: 'Image URL is required' })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await api.media.saveLink({
        title: newTitle.trim() || 'Untitled Image',
        url: convertGoogleDriveUrl(newUrl.trim()),
        category: newCategory,
      })
      setFeedback({ type: 'success', message: res.message || 'Image added successfully!' })
      setNewTitle('')
      setNewUrl('')
      await loadMedia()
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save image' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media reference?')) return
    try {
      await api.media.delete(id)
      await loadMedia()
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete media')
    }
  }

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredMedia = mediaList.filter((m) => {
    const q = searchTerm.toLowerCase()
    return m.name?.toLowerCase().includes(q) || m.category?.toLowerCase().includes(q) || m.url?.toLowerCase().includes(q)
  })

  return (
    <div className="media-page">
      <div className="media-heading">
        <div>
          <span className="media-eyebrow">ASSETS & MEDIA</span>
          <h1>Media Library</h1>
          <p>
            Manage media assets and hosted image links. Storing URLs preserves your database storage quota.
          </p>
        </div>
      </div>

      <div className="media-grid-layout">
        {/* ADD IMAGE LINK FORM */}
        <div className="media-card add-card">
          <div className="media-card-header">
            <Plus size={20} className="media-card-icon" />
            <div>
              <h2>Add Image Link / File</h2>
              <p>Add image reference for use across products and sections</p>
            </div>
          </div>

          {feedback && (
            <div className={`media-alert ${feedback.type}`}>
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleAddLink} className="media-form">
            <div className="media-form-group">
              <label htmlFor="media-title">Image Title / Label</label>
              <input
                id="media-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Hybrid Tomato Field"
              />
            </div>

            <div className="media-form-group">
              <label htmlFor="media-category">Category</label>
              <select
                id="media-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="Products">Products</option>
                <option value="Gallery">Gallery</option>
                <option value="Hero & Slides">Hero & Slides</option>
                <option value="About Us">About Us</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="media-form-group">
              <ImageUploadField
                label="Image URL or Upload File"
                value={newUrl}
                onChange={(url) => setNewUrl(url)}
                placeholder="Paste image link or upload image"
                helpText="Direct upload hosts image automatically. Direct links are also supported."
              />
            </div>

            <button type="submit" className="media-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Save Image Link'}
            </button>
          </form>
        </div>

        {/* MEDIA LIST */}
        <div className="media-card list-card">
          <div className="media-card-header media-header-split">
            <div className="media-header-title">
              <Images size={20} className="media-card-icon" />
              <div>
                <h2>Saved Images ({filteredMedia.length})</h2>
                <p>Click copy to use the image link anywhere in your content</p>
              </div>
            </div>

            <div className="media-search-box">
              <Search size={16} />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by title, category..."
              />
            </div>
          </div>

          {isLoading ? (
            <p className="media-loading">Loading media items...</p>
          ) : filteredMedia.length === 0 ? (
            <div className="media-empty">
              <Images size={36} />
              <p>No media links found. Add your first image URL above.</p>
            </div>
          ) : (
            <div className="media-items-grid">
              {filteredMedia.map((m) => {
                const directUrl = convertGoogleDriveUrl(m.url)
                return (
                  <div className="media-item-card" key={m.id}>
                    <div className="media-item-img-wrapper">
                      <img src={directUrl} alt={m.name} loading="lazy" />
                      <span className="media-category-badge">{m.category || 'General'}</span>
                    </div>

                    <div className="media-item-info">
                      <strong>{m.name}</strong>
                      <small className="media-item-url">{m.url}</small>
                    </div>

                    <div className="media-item-actions">
                      <button
                        type="button"
                        className="media-copy-btn"
                        onClick={() => handleCopy(directUrl, m.id)}
                        title="Copy direct image URL"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check size={14} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy URL
                          </>
                        )}
                      </button>

                      <a
                        href={directUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="media-view-btn"
                        title="Open image in new tab"
                      >
                        <ExternalLink size={14} />
                      </a>

                      <button
                        type="button"
                        className="media-del-btn"
                        onClick={() => handleDelete(m.id)}
                        title="Delete from library"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaLibraryPage
