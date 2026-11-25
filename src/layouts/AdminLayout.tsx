
import { useState, type ReactNode } from 'react'
import {
  LayoutDashboard,
  PanelsTopLeft,
  Images,
  Bot,
  Palette,
  Settings,
  ShieldCheck,
  Package,
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  hasPermission,
  type AdminModule,
} from '../auth/permissions.config'
import './AdminLayout.css'

interface AdminLayoutProps {
  children: ReactNode
}

interface NavigationItem {
  label: string
  path: string
  icon: typeof LayoutDashboard
  end?: boolean
  module: AdminModule
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Overview',
    path: '/admin',
    icon: LayoutDashboard,
    end: true,
    module: 'dashboard',
  },
  {
    label: 'Website Content',
    path: '/admin/content',
    icon: PanelsTopLeft,
    module: 'websiteContent',
  },
  {
  label: 'Product Management',
  path: '/admin/products',
  icon: Package,
  module: 'products',
},
  {
    label: 'Media Library',
    path: '/admin/media',
    icon: Images,
    module: 'mediaLibrary',
  },
  {
    label: 'Smart Assistant',
    path: '/admin/assistant',
    icon: Bot,
    module: 'smartAssistant',
  },
  {
    label: 'Theme & Appearance',
    path: '/admin/theme',
    icon: Palette,
    module: 'themeAppearance',
  },
  {
    label: 'Site Settings',
    path: '/admin/settings',
    icon: Settings,
    module: 'siteSettings',
  },
  {
    label: 'Security',
    path: '/admin/security',
    icon: ShieldCheck,
    module: 'security',
  },
]

function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const { session, logout } = useAuth()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const visibleNavigationItems = navigationItems.filter((item) =>
    session ? hasPermission(session.role, item.module) : false,
  )

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const userName = session?.displayName ?? 'Administrator'
  const userRole =
    session?.role === 'admin' ? 'Administrator' : 'Content Editor'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div
      className={`admin-layout ${isCollapsed ? 'admin-layout-collapsed' : ''}`}
    >
      {isMobileOpen && (
        <button
          className="admin-mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`admin-sidebar ${isMobileOpen ? 'admin-sidebar-mobile-open' : ''}`}
      >
        <div className="admin-brand">
          <div className="admin-brand-icon">M</div>

          <div className="admin-brand-text">
            <h2>MASTER</h2>
            <span>WEBSITE CONTROL</span>
          </div>

          <button
            className="admin-mobile-close"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="admin-sidebar-label">WORKSPACE</div>

        <nav className="admin-navigation">
          {visibleNavigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`
                }
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-profile-avatar">{userInitial}</div>

            <div className="admin-profile-info">
              <strong>{userName}</strong>
              <span>{userRole}</span>
            </div>
          </div>

          <div className="admin-sidebar-actions">
            <NavLink to="/" className="admin-back-to-site">
              <LogOut size={17} />
              <span>Back to Website</span>
            </NavLink>

            <button
              type="button"
              className="admin-logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <button
          className="admin-collapse-button"
          onClick={() => setIsCollapsed((previous) => !previous)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-mobile-menu"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="admin-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Overview</strong>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-system-status">
              <span />
              System Online
            </span>

            <div className="admin-topbar-avatar">{userInitial}</div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
