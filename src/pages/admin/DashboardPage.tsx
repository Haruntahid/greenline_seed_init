import { useEffect, useState } from 'react'
import {
  Globe,
  Layers3,
  FileText,
  Bot,
  ArrowUpRight,
  Activity,
  Clock3,
  Plus,
  ExternalLink,
  Settings2,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import './DashboardPage.css'

const shortcuts = [
  {
    title: 'Manage Website Content',
    description: 'Edit pages, sections and website text.',
    icon: FileText,
    path: '/admin/content',
  },
  {
    title: 'Manage Products Catalog',
    description: 'Add, update, and organize seed products and categories.',
    icon: Layers3,
    path: '/admin/products',
  },
  {
    title: 'Customize Appearance',
    description: 'Control colors, fonts and visual settings.',
    icon: Settings2,
    path: '/admin/theme',
  },
]

function DashboardPage() {
  const [dbConnected, setDbConnected] = useState(false)
  const [dbName, setDbName] = useState('greenline_seed')
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [sectionsCount, setSectionsCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)

  useEffect(() => {
    let active = true
    void Promise.all([
      api.health().catch(() => null),
      api.settings.getSections().catch(() => null),
      api.products.list().catch(() => null),
    ]).then(([healthRes, sectionsRes, productsRes]) => {
      if (!active) return
      if (healthRes?.connected) {
        setDbConnected(true)
        setDbName(healthRes.database || 'greenline_seed')
        setCollectionsCount(healthRes.collectionsCount || 0)
      }
      if (sectionsRes?.success && Array.isArray(sectionsRes.data)) {
        setSectionsCount(sectionsRes.data.length)
      }
      if (productsRes?.success && Array.isArray(productsRes.data)) {
        setProductsCount(productsRes.data.length)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const stats = [
    {
      title: 'Website Status',
      value: dbConnected ? 'Online' : 'Checking',
      description: dbConnected ? `Connected to ${dbName}` : 'Connecting to MongoDB',
      icon: Globe,
      status: dbConnected ? 'online' : undefined,
    },
    {
      title: 'Website Sections',
      value: String(sectionsCount).padStart(2, '0'),
      description: 'Configured homepage sections',
      icon: Layers3,
    },
    {
      title: 'Published Products',
      value: String(productsCount).padStart(2, '0'),
      description: 'Products stored in MongoDB',
      icon: FileText,
    },
    {
      title: 'DB Collections',
      value: String(collectionsCount).padStart(2, '0'),
      description: 'Active MongoDB collections',
      icon: Bot,
      status: dbConnected ? 'online' : undefined,
    },
  ]

  return (
    <div className="dashboard-page">
      {/* Page heading */}
      <div className="dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">
            <Activity size={13} />
            CONTROL CENTER
          </span>

          <h1>Dashboard Overview</h1>

          <p>
            Welcome to your website control center. All content and catalog data
            are managed directly in MongoDB.
          </p>
        </div>

        <Link to="/" target="_blank" className="dashboard-preview-button">
          <ExternalLink size={16} />
          Preview Website
        </Link>
      </div>

      {/* Statistics */}
      <div className="dashboard-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="dashboard-stat-card" key={stat.title}>
              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <Icon size={20} />
                </div>

                <ArrowUpRight size={17} className="dashboard-stat-arrow" />
              </div>

              <div className="dashboard-stat-value">
                {stat.value}

                {stat.status === 'online' && (
                  <span className="dashboard-status-dot" />
                )}
              </div>

              <h3>{stat.title}</h3>
              <p>{stat.description}</p>
            </article>
          )
        })}
      </div>

      {/* Main dashboard content */}
      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-quick-panel">
          <div className="dashboard-panel-heading">
            <div>
              <span className="dashboard-section-label">QUICK ACCESS</span>
              <h2>Management Shortcuts</h2>
            </div>

            <span className="dashboard-panel-icon">
              <Plus size={17} />
            </span>
          </div>

          <div className="dashboard-shortcut-list">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon

              return (
                <Link
                  to={shortcut.path}
                  className="dashboard-shortcut"
                  key={shortcut.title}
                >
                  <div className="dashboard-shortcut-icon">
                    <Icon size={19} />
                  </div>

                  <div className="dashboard-shortcut-content">
                    <h3>{shortcut.title}</h3>
                    <p>{shortcut.description}</p>
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="dashboard-shortcut-arrow"
                  />
                </Link>
              )
            })}
          </div>
        </section>

        <section className="dashboard-panel dashboard-status-panel">
          <div className="dashboard-panel-heading">
            <div>
              <span className="dashboard-section-label">SYSTEM HEALTH</span>
              <h2>System Overview</h2>
            </div>

            <Activity size={19} className="dashboard-muted-icon" />
          </div>

          <div className="dashboard-health-banner">
            <div className="dashboard-health-icon">
              <CheckCircle2 size={23} />
            </div>

            <div>
              <h3>{dbConnected ? 'Everything looks good' : 'Checking connection'}</h3>
              <p>
                {dbConnected
                  ? 'Application and MongoDB database are operational.'
                  : 'Waiting for MongoDB API response.'}
              </p>
            </div>
          </div>

          <div className="dashboard-system-row">
            <span>Public Website</span>
            <span className="dashboard-system-online">
              <i /> Online
            </span>
          </div>

          <div className="dashboard-system-row">
            <span>Admin JWT Auth</span>
            <span className="dashboard-system-online">
              <i /> Active
            </span>
          </div>

          <div className="dashboard-system-row">
            <span>Database ({dbName})</span>
            <span className={dbConnected ? 'dashboard-system-online' : 'dashboard-system-pending'}>
              <i /> {dbConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </section>
      </div>

      {/* Recent activity */}
      <section className="dashboard-panel dashboard-activity-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span className="dashboard-section-label">WORKSPACE</span>
            <h2>Recent Activity</h2>
          </div>

          <Clock3 size={18} className="dashboard-muted-icon" />
        </div>

        <div className="dashboard-empty-activity">
          <div className="dashboard-empty-icon">
            <Activity size={23} />
          </div>

          <h3>All changes sync directly to MongoDB</h3>

          <p>
            Updates made in Website Content and Product Management are saved
            immediately to the database and reflected on the live website.
          </p>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
