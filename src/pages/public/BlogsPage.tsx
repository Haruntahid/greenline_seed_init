
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Search,
} from 'lucide-react'
import { blogsConfig } from '../../config'
import type { BlogArticle, BlogCategory } from '../../types/site.types'
import { api } from '../../services/api'
import './BlogsPage.css'

const ARTICLES_PER_PAGE = 2

function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE)
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null)

  const [categoriesList, setCategoriesList] = useState<BlogCategory[]>(() =>
    [...blogsConfig.categories]
      .filter((category) => category.enabled)
      .sort((a, b) => a.order - b.order),
  )

  const [articlesList, setArticlesList] = useState<BlogArticle[]>(() =>
    [...blogsConfig.articles]
      .filter((article) => article.enabled)
      .sort((a, b) => a.order - b.order),
  )

  useEffect(() => {
    void Promise.all([
      api.blogs.getCategories().catch(() => null),
      api.blogs.list({ enabled: true }).catch(() => null),
    ]).then(([catRes, artRes]) => {
      if (catRes?.success && catRes.data && catRes.data.length > 0) {
        setCategoriesList(catRes.data.filter((c: BlogCategory) => c.enabled).sort((a: BlogCategory, b: BlogCategory) => a.order - b.order))
      }
      if (artRes?.success && artRes.data && artRes.data.length > 0) {
        setArticlesList(artRes.data.filter((a: BlogArticle) => a.enabled).sort((a: BlogArticle, b: BlogArticle) => a.order - b.order))
      }
    })
  }, [])

  const enabledCategories = categoriesList
  const enabledArticles = articlesList

  const featuredArticle = enabledArticles.find(
    (article) => article.featured,
  )

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return enabledArticles.filter((article) => {
      const category = enabledCategories.find(
        (item) => item.id === article.categoryId,
      )

      const matchesCategory =
        activeCategory === 'all' ||
        article.categoryId === activeCategory

      const searchableContent = [
        article.title,
        article.excerpt,
        article.author,
        category?.name ?? '',
        ...(article.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !normalizedQuery || searchableContent.includes(normalizedQuery)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery, enabledArticles, enabledCategories])


const handleCategoryChange = (categoryId: string) => {
  setActiveCategory(categoryId)
  setVisibleCount(ARTICLES_PER_PAGE)
  setExpandedArticleId(null)
}

const handleSearchChange = (value: string) => {
  setSearchQuery(value)
  setVisibleCount(ARTICLES_PER_PAGE)
  setExpandedArticleId(null)
}
const handleArticleToggle = (articleId: string) => {
  setExpandedArticleId((current) =>
    current === articleId ? null : articleId,
  )
}

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  const getCategoryName = (categoryId: string) =>
    enabledCategories.find((category) => category.id === categoryId)?.name ??
    'General'

  const featuredMatches =
    featuredArticle &&
    (activeCategory === 'all' ||
      featuredArticle.categoryId === activeCategory) &&
    (!searchQuery.trim() ||
      [
        featuredArticle.title,
        featuredArticle.excerpt,
        featuredArticle.author,
        getCategoryName(featuredArticle.categoryId),
        ...(featuredArticle.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase()))

  const showFeatured = Boolean(featuredMatches)

  const regularArticles = filteredArticles.filter(
    (article) => article.id !== featuredArticle?.id,
  )

  const displayedArticles = regularArticles.slice(0, visibleCount)

  const hasMoreArticles = displayedArticles.length < regularArticles.length

const renderArticleCard = (article: BlogArticle) => {
  const isExpanded = expandedArticleId === article.id

  return (
    <article
      className={`blog-article-card ${isExpanded ? 'expanded' : ''}`}
      key={article.id}
    >
      <div className="blog-card-image">
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
        />

        <span className="blog-card-category">
          {getCategoryName(article.categoryId)}
        </span>

        <span className="blog-card-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>
            <CalendarDays size={14} />
            {formatDate(article.publishedAt)}
          </span>

          <span>
            <Clock3 size={14} />
            {article.readTime}
          </span>
        </div>

        <h3>{article.title}</h3>

        <p>{article.excerpt}</p>

        <button
          type="button"
          className="blog-card-read-more"
          onClick={() => handleArticleToggle(article.id)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show Less' : 'Read More'}

          <ArrowRight
            size={16}
            className={isExpanded ? 'rotated' : ''}
          />
        </button>

        {isExpanded && (
          <div className="blog-expanded-content">
            <div className="blog-expanded-divider" />

            <div className="blog-expanded-body">
              <span className="blog-expanded-label">
                THE FULL STORY
              </span>

              <p>{article.content}</p>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="blog-expanded-tags">
                <span>EXPLORE TOPICS</span>

                <div>
                  {article.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="blog-expanded-close"
              onClick={() => handleArticleToggle(article.id)}
            >
              <ArrowRight size={15} className="rotated" />
              Close article
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

  return (
    <div className="blogs-page">
      <section className="blogs-hero">
        <div className="blogs-hero-decoration blogs-hero-decoration-one" />
        <div className="blogs-hero-decoration blogs-hero-decoration-two" />

        <div className="blogs-container blogs-hero-content">
          <span className="blogs-eyebrow">
            <span />
            {blogsConfig.eyebrow}
          </span>

          <h1>
            Stories worth
            <br />
            <span>exploring.</span>
          </h1>

          <p>{blogsConfig.description}</p>

          <div className="blogs-hero-bottom">
            <span>IDEAS. KNOWLEDGE. PERSPECTIVES.</span>
            <span>EST. 2026</span>
          </div>
        </div>
      </section>

      <section className="blogs-main-section">
        <div className="blogs-container">
          <div className="blogs-section-heading">
            <div>
              <span className="blogs-section-eyebrow">THE LATEST</span>
              <h2>From our journal</h2>
            </div>

            <span className="blogs-article-count">
              {enabledArticles.length.toString().padStart(2, '0')} ARTICLES
            </span>
          </div>

          {showFeatured && featuredArticle && (
            <section className="blog-featured">
              <Link
                to={`/blogs/${featuredArticle.slug}`}
                className="blog-featured-image"
                aria-label={`Read ${featuredArticle.title}`}
              >
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                />
                <span className="blog-featured-image-label">
                  EDITOR'S PICK
                </span>
              </Link>

              <div className="blog-featured-content">
                <span className="blog-featured-category">
                  {getCategoryName(featuredArticle.categoryId)}
                </span>

                <h2>{featuredArticle.title}</h2>

                <p>{featuredArticle.excerpt}</p>

                <div className="blog-featured-meta">
                  <span>{featuredArticle.author}</span>
                  <span>·</span>
                  <span>{formatDate(featuredArticle.publishedAt)}</span>
                  <span>·</span>
                  <span>{featuredArticle.readTime}</span>
                </div>

                <Link
                  to={`/blogs/${featuredArticle.slug}`}
                  className="blog-featured-link"
                >
                  Explore this story <ArrowUpRight size={18} />
                </Link>
              </div>
            </section>
          )}

          <div className="blogs-discovery">
            <div className="blogs-category-list">
              <button
                type="button"
                className={activeCategory === 'all' ? 'active' : ''}
                onClick={() => handleCategoryChange('all')}
              >
                All stories
              </button>

              {enabledCategories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={
                    activeCategory === category.id ? 'active' : ''
                  }
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <label className="blogs-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                aria-label="Search blog articles"
              />
            </label>
          </div>

          <div className="blogs-results-heading">
            <h2>Explore our stories</h2>
            <span>
              {regularArticles.length.toString().padStart(2, '0')} STORIES
            </span>
          </div>

          {displayedArticles.length > 0 ? (
            <>
              <div className="blogs-article-grid">
                {displayedArticles.map(renderArticleCard)}
              </div>

              {hasMoreArticles && (
                <div className="blogs-load-more">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((current) => current + ARTICLES_PER_PAGE)
                    }
                  >
                    Load more stories <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="blogs-empty-state">
              <Search size={32} />
              <h3>No stories found</h3>
              <p>
                Try another search term or select a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  handleCategoryChange('all')
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BlogsPage
