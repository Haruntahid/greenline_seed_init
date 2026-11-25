import './SiteHeader.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { getGoogleDriveImageUrl } from '../utils/google-drive-image'

const navigationLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Products', to: '/products' },
  { label: 'Portfolio', to: '/#portfolio' },
  { label: 'Gallery', to: '/gallary' },
  { label: 'Contact', to: '/contact' },
]

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [siteInfo, setSiteInfo] = useState<{ name: string; logo: string }>({
    name: 'Green Line Seed Store',
    logo: 'https://i.ibb.co.com/MkfVQN9m/Gemini-Generated-Image-xzxpi0xzxpi0xzxp-removebg-preview.png',
  })

  useEffect(() => {
    let isActive = true
    api.settings.getSite()
      .then((res) => {
        if (isActive && res?.success && res?.data) {
          setSiteInfo({
            name: res.data.name || 'Green Line Seed Store',
            logo: res.data.logo || 'https://i.ibb.co.com/MkfVQN9m/Gemini-Generated-Image-xzxpi0xzxpi0xzxp-removebg-preview.png',
          })
        }
      })
      .catch((err) => {
        console.error('Failed to load site settings for header:', err)
      })
    return () => {
      isActive = false
    }
  }, [])

  const closeMenus = () => {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="site-logo" to="/home" onClick={closeMenus}>
          <img
            src={getGoogleDriveImageUrl(siteInfo.logo) || '/images/greenline-logo.png'}
            alt={siteInfo.name}
            className="site-logo-image"
          />
          <span className="site-logo-text">{siteInfo.name}</span>
        </Link>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div
          id="primary-navigation"
          className={`site-nav-links ${menuOpen ? 'is-open' : ''}`}
        >
          {navigationLinks.slice(0, 1).map((link) => (
            <Link key={link.to} to={link.to} onClick={closeMenus}>
              {link.label}
            </Link>
          ))}

          <Link to="/about" onClick={closeMenus}>
            About Us
          </Link>

          {navigationLinks.slice(1).map((link) => (
            <Link key={link.to} to={link.to} onClick={closeMenus}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default SiteHeader
