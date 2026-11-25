
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

import {
  getYouTubeVideosContent,
  fetchYouTubeVideosContent,
} from '../../services/youtube-videos.service'
import type { YouTubeVideo } from '../../types/site.types'
import { getTextFontClass } from '../../utils/typography'
import './YouTubeVideosSection.css'

function YouTubeVideosSection() {
  const [content, setContent] = useState(getYouTubeVideosContent)

  useEffect(() => {
    let isActive = true
    void fetchYouTubeVideosContent().then((data) => {
      if (isActive) {
        setContent(data)
      }
    })
    return () => {
      isActive = false
    }
  }, [])

  const { eyebrow, title, description, videos, settings } = content

  const activeVideos = videos
    .filter((video) => video.enabled)
    .sort((a, b) => a.order - b.order)

  const videosPerPage = 3
  const pageCount = Math.ceil(activeVideos.length / videosPerPage)

  const [currentPage, setCurrentPage] = useState(0)
  const [selectedVideo, setSelectedVideo] =
    useState<YouTubeVideo | null>(null)

  const currentVideos = activeVideos.slice(
    currentPage * videosPerPage,
    currentPage * videosPerPage + videosPerPage,
  )

  const goToPage = (page: number) => {
    if (pageCount === 0) return

    setCurrentPage((page + pageCount) % pageCount)
    setSelectedVideo(null)
  }

  const goToPreviousPage = () => {
    goToPage(currentPage - 1)
  }

  const goToNextPage = () => {
    goToPage(currentPage + 1)
  }

  useEffect(() => {
    if (!settings.autoplay || pageCount <= 1) return

    const interval = window.setInterval(() => {
      setCurrentPage((page) => (page + 1) % pageCount)
      setSelectedVideo(null)
    }, Math.max(settings.interval, 1000))

    return () => window.clearInterval(interval)
  }, [settings.autoplay, settings.interval, pageCount])

  return (
    <section id="youtubeVideos" className="youtube-section">
      <div className="youtube-container">
<div className="youtube-heading">
  <span className={`youtube-eyebrow ${getTextFontClass(eyebrow)}`}>
    {eyebrow}
  </span>

  <h2 className={getTextFontClass(title)}>
    {title}
  </h2>

  <p className={getTextFontClass(description)}>
    {description}
  </p>
</div>

        {activeVideos.length > 0 ? (
          <>
            <div className="youtube-carousel">
              <div className="youtube-video-grid">
                {currentVideos.map((video) => (
                  <article className="youtube-video-card" key={video.id}>
                    <div className="youtube-card-thumbnail">
                      {selectedVideo?.id === video.id ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          className="youtube-thumbnail-button"
                          onClick={() => setSelectedVideo(video)}
                          aria-label={`Play ${video.title}`}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                            alt={video.title}
                            loading="lazy"
                          />
                          <span className="youtube-card-play">
                            <Play fill="currentColor" size={20} />
                          </span>
                        </button>
                      )}
                    </div>

                    <div className="youtube-card-info">
                      <div className="youtube-card-labels">
  <small className={getTextFontClass(video.category)}>
  {video.category}
</small>
  {video.featured && (
    <span className="youtube-featured-badge">
      Featured
    </span>
  )}
</div>

<h3 className={getTextFontClass(video.title)}>
  {video.title}
</h3>
{video.description && (
  <p className={getTextFontClass(video.description)}>
    {video.description}
  </p>
)}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {pageCount > 1 && (
              <div className="youtube-carousel-controls">
                {settings.showArrows && (
                  <button
                    className="youtube-carousel-arrow"
                    onClick={goToPreviousPage}
                    aria-label="Previous videos"
                  >
                    <ChevronLeft size={22} />
                  </button>
                )}

                {settings.showIndicators && (
                  <div className="youtube-carousel-indicators">
                    {Array.from({ length: pageCount }, (_, index) => (
                      <button
                        key={index}
                        className={`youtube-carousel-dot ${
                          currentPage === index ? 'active' : ''
                        }`}
                        onClick={() => goToPage(index)}
                        aria-label={`Go to video group ${index + 1}`}
                        aria-current={
                          currentPage === index ? 'true' : undefined
                        }
                      />
                    ))}
                  </div>
                )}

                {settings.showArrows && (
                  <button
                    className="youtube-carousel-arrow"
                    onClick={goToNextPage}
                    aria-label="Next videos"
                  >
                    <ChevronRight size={22} />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="youtube-empty">
  <div className="youtube-empty-icon">
    <Play size={42} />
  </div>

  <h3 className={getTextFontClass('Our Stories Are Coming to Video')}>
    Our Stories Are Coming to Video
  </h3>

  <p className={getTextFontClass(
    'Stay connected with GreenLine Seed for product showcases, farming stories and agricultural insights.'
  )}>
    Stay connected with GreenLine Seed for product showcases,
    farming stories and agricultural insights.
  </p>

  <span className={getTextFontClass('VIDEOS COMING SOON')}>
    VIDEOS COMING SOON
  </span>
</div>
        )}
      </div>
    </section>
  )
}

export default YouTubeVideosSection
