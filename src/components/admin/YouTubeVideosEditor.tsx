
import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Play,
} from 'lucide-react'

import type {
  YouTubeVideo,
  YouTubeVideosContent,
} from '../../types/site.types'

import {
  getYouTubeVideosContent,
  fetchYouTubeVideosContent,
  saveYouTubeVideosContent,
  resetYouTubeVideosContent,
} from '../../services/youtube-videos.service'

import './YouTubeVideosEditor.css'

function extractYouTubeVideoId(value: string): string {
  const input = value.trim()

  if (!input) return ''

  // Accept a direct YouTube video ID.
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input
  }

  try {
    const url = new URL(
      input.startsWith('http') ? input : `https://${input}`,
    )

    const hostname = url.hostname.replace(/^www\./, '')

    if (hostname === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] ?? ''
    }

    if (
      hostname === 'youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'youtube-nocookie.com'
    ) {
      if (url.searchParams.has('v')) {
        return url.searchParams.get('v') ?? ''
      }

      const parts = url.pathname.split('/').filter(Boolean)

      if (['embed', 'shorts', 'live'].includes(parts[0])) {
        return parts[1] ?? ''
      }
    }
  } catch {
    return ''
  }

  return ''
}

function isValidYouTubeVideoId(value: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(value)
}

function YouTubeVideosEditor() {
  const [content, setContent] = useState<YouTubeVideosContent>(
    () => getYouTubeVideosContent(),
  )

  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    void fetchYouTubeVideosContent().then((data) => {
      if (!cancelled) {
        setContent(data)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const sortedVideos = [...content.videos].sort(
    (a, b) => a.order - b.order,
  )

  const updateContent = (
    field: 'eyebrow' | 'title' | 'description',
    value: string,
  ) => {
    setContent((previous) => ({
      ...previous,
      [field]: value,
    }))
    setMessage('')
  }

  const updateVideo = <K extends keyof YouTubeVideo>(
    id: string,
    field: K,
    value: YouTubeVideo[K],
  ) => {
    setContent((previous) => ({
      ...previous,
      videos: previous.videos.map((video) =>
        video.id === id ? { ...video, [field]: value } : video,
      ),
    }))
    setMessage('')
  }

  const addVideo = () => {
    const newVideo: YouTubeVideo = {
      id: `youtube-video-${Date.now()}`,
      videoId: '',
      title: 'New video',
      description: '',
      category: 'Company',
      featured: false,
      enabled: true,
      order: content.videos.length + 1,
    }

    setContent((previous) => ({
      ...previous,
      videos: [...previous.videos, newVideo],
    }))

    setMessage('New video added. Complete its details before saving.')
  }

  const removeVideo = (id: string) => {
    const video = content.videos.find((item) => item.id === id)

    if (!video) return

    if (!window.confirm(`Remove "${video.title}" from the video gallery?`)) {
      return
    }

    setContent((previous) => ({
      ...previous,
      videos: previous.videos
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          order: index + 1,
        })),
    }))

    setMessage('Video removed. Save your changes to apply it.')
  }

  const moveVideo = (id: string, direction: 'up' | 'down') => {
    setContent((previous) => {
      const orderedVideos = [...previous.videos].sort(
        (a, b) => a.order - b.order,
      )

      const currentIndex = orderedVideos.findIndex(
        (video) => video.id === id,
      )

      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= orderedVideos.length
      ) {
        return previous
      }

      ;[
        orderedVideos[currentIndex],
        orderedVideos[targetIndex],
      ] = [
        orderedVideos[targetIndex],
        orderedVideos[currentIndex],
      ]

      return {
        ...previous,
        videos: orderedVideos.map((video, index) => ({
          ...video,
          order: index + 1,
        })),
      }
    })

    setMessage('')
  }

  const updateFeatured = (id: string, featured: boolean) => {
    setContent((previous) => ({
      ...previous,
      videos: previous.videos.map((video) => ({
        ...video,
        featured: video.id === id ? featured : false,
      })),
    }))

    setMessage('')
  }

  const updateSettings = (
    field: keyof YouTubeVideosContent['settings'],
    value: boolean | number,
  ) => {
    setContent((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        [field]: value,
      },
    }))

    setMessage('')
  }

  const handleSave = async () => {
    const videoIds = new Set<string>()

    for (const video of content.videos) {
      const videoId = extractYouTubeVideoId(video.videoId)

      if (!isValidYouTubeVideoId(videoId)) {
        setMessage(
          `Please enter a valid YouTube URL or 11-character video ID for "${video.title}".`,
        )
        return
      }

      if (!video.title.trim()) {
        setMessage('Every video must have a title.')
        return
      }

      if (videoIds.has(videoId)) {
        setMessage(`The video "${video.title}" is already in the gallery.`)
        return
      }

      videoIds.add(videoId)
    }

    const featuredVideos = content.videos.filter(
      (video) => video.featured,
    )

    if (featuredVideos.length > 1) {
      setMessage('Only one video can be featured at a time.')
      return
    }

    const normalizedContent: YouTubeVideosContent = {
      ...content,
      videos: content.videos.map((video, index) => ({
        ...video,
        videoId: extractYouTubeVideoId(video.videoId),
        order: index + 1,
      })),
      settings: {
        ...content.settings,
        interval: Math.max(2000, content.settings.interval),
      },
    }

    try {
      await saveYouTubeVideosContent(normalizedContent)
      setContent(normalizedContent)
      setMessage('YouTube Videos settings saved successfully.')
    } catch (error) {
      console.error('Unable to save YouTube Videos:', error)
      setMessage('Unable to save changes. Please try again.')
    }
  }

  const handleReset = async () => {
    if (
      !window.confirm(
        'Reset the YouTube Videos section to its default content and settings?',
      )
    ) {
      return
    }

    try {
      const defaults = await resetYouTubeVideosContent()
      setContent(defaults)
      setMessage('YouTube Videos section has been reset to defaults.')
    } catch (error) {
      console.error('Unable to reset YouTube Videos:', error)
      setMessage('Unable to reset. Please try again.')
    }
  }

  return (
    <section className="content-editor-panel youtube-admin-editor">
      <div className="content-editor-form">

        {/* Section content */}
        <div className="content-editor-group">
          <h3>Section Content</h3>
          <p>Manage the heading and introduction displayed above the videos.</p>

          <label>
            Eyebrow
            <input
              value={content.eyebrow}
              onChange={(event) =>
                updateContent('eyebrow', event.target.value)
              }
            />
          </label>

          <label>
            Section title
            <input
              value={content.title}
              onChange={(event) =>
                updateContent('title', event.target.value)
              }
            />
          </label>

          <label>
            Description
            <textarea
              rows={3}
              value={content.description}
              onChange={(event) =>
                updateContent('description', event.target.value)
              }
            />
          </label>
        </div>

        <div className="content-editor-divider" />

        {/* Video list */}
        <div className="content-editor-group">
          <div className="content-editor-list-heading">
            <div>
              <h3>YouTube Videos</h3>
              <p>
                Add videos, manage visibility, mark a featured video, and
                change their order.
              </p>
            </div>

            <button
              type="button"
              className="content-editor-add-button"
              onClick={addVideo}
            >
              <Plus size={16} />
              Add Video
            </button>
          </div>

          {sortedVideos.length === 0 && (
            <div className="youtube-admin-empty">
              <Play size={32} />
              <h4>No videos added yet</h4>
              <p>Add your first YouTube video to populate the homepage gallery.</p>
            </div>
          )}

          {sortedVideos.map((video, index) => (
            <article className="youtube-admin-video-card" key={video.id}>
              <div className="youtube-admin-video-header">
                <div className="youtube-admin-video-heading">
                  <span className="youtube-admin-video-number">
                    VIDEO {index + 1}
                  </span>
                  <h4>{video.title || 'Untitled video'}</h4>
                </div>

                <button
                  type="button"
                  className="content-editor-delete-button"
                  onClick={() => removeVideo(video.id)}
                  aria-label={`Remove ${video.title}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className="youtube-admin-video-order">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveVideo(video.id, 'up')}
                >
                  <ChevronUp size={16} />
                  Move up
                </button>

                <button
                  type="button"
                  disabled={index === sortedVideos.length - 1}
                  onClick={() => moveVideo(video.id, 'down')}
                >
                  <ChevronDown size={16} />
                  Move down
                </button>
              </div>

              <div className="content-editor-divider" />

              <label>
                YouTube URL or Video ID
                <input
                  value={video.videoId}
                  placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                  onChange={(event) =>
                    updateVideo(video.id, 'videoId', event.target.value)
                  }
                />
              </label>

              {isValidYouTubeVideoId(
                extractYouTubeVideoId(video.videoId),
              ) && (
                <div className="youtube-admin-preview">
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeVideoId(video.videoId)}/hqdefault.jpg`}
                    alt={`Thumbnail for ${video.title}`}
                  />
                  <span>Video ID: {extractYouTubeVideoId(video.videoId)}</span>
                </div>
              )}

              <label>
                Video title
                <input
                  value={video.title}
                  onChange={(event) =>
                    updateVideo(video.id, 'title', event.target.value)
                  }
                  placeholder="Enter video title"
                />
              </label>

              <label>
                Category
                <input
                  value={video.category}
                  onChange={(event) =>
                    updateVideo(video.id, 'category', event.target.value)
                  }
                  placeholder="e.g. Products, Farming, Company"
                />
              </label>

              <label>
                Description
                <textarea
                  rows={3}
                  value={video.description}
                  onChange={(event) =>
                    updateVideo(video.id, 'description', event.target.value)
                  }
                  placeholder="Write a short video description"
                />
              </label>

              <div className="youtube-admin-video-options">
                <label className="service-editor-toggle">
                  <input
                    type="checkbox"
                    checked={video.enabled}
                    onChange={(event) =>
                      updateVideo(video.id, 'enabled', event.target.checked)
                    }
                  />
                  <span>Video enabled</span>
                </label>

                <label className="service-editor-toggle">
                  <input
                    type="checkbox"
                    checked={video.featured}
                    onChange={(event) =>
                      updateFeatured(video.id, event.target.checked)
                    }
                  />
                  <span>Featured video</span>
                </label>
              </div>
            </article>
          ))}
        </div>

        <div className="content-editor-divider" />

        {/* Carousel settings */}
        <div className="content-editor-group">
          <h3>Carousel Settings</h3>
          <p>Control how the homepage video carousel behaves.</p>

          <label className="service-editor-toggle">
            <input
              type="checkbox"
              checked={content.settings.autoplay}
              onChange={(event) =>
                updateSettings('autoplay', event.target.checked)
              }
            />
            <span>Enable automatic carousel movement</span>
          </label>

          <label>
            Autoplay interval (milliseconds)
            <input
              type="number"
              min="2000"
              step="500"
              value={content.settings.interval}
              onChange={(event) =>
                updateSettings(
                  'interval',
                  Math.max(2000, Number(event.target.value)),
                )
              }
            />
          </label>

          <label className="service-editor-toggle">
            <input
              type="checkbox"
              checked={content.settings.showArrows}
              onChange={(event) =>
                updateSettings('showArrows', event.target.checked)
              }
            />
            <span>Show navigation arrows</span>
          </label>

          <label className="service-editor-toggle">
            <input
              type="checkbox"
              checked={content.settings.showIndicators}
              onChange={(event) =>
                updateSettings('showIndicators', event.target.checked)
              }
            />
            <span>Show pagination indicators</span>
          </label>

          <div className="youtube-admin-info">
            The homepage displays three videos per carousel group on desktop.
            Autoplay moves between groups; it does not automatically play
            YouTube videos.
          </div>
        </div>
      </div>

      {message && (
        <p className="content-editor-message" role="status">
          {message}
        </p>
      )}

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
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </section>
  )
}

export default YouTubeVideosEditor
