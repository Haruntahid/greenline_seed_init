import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Sprout,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa'

import { footerConfig, siteConfig } from '../config'
import { api } from '../services/api'
import { getGoogleDriveImageUrl } from '../utils/google-drive-image'
import './Footer.css'

const socialIcons = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
  YouTube: FaYoutube,
  WhatsApp: FaWhatsapp,
}

function Footer() {
  const currentYear = new Date().getFullYear()
  const [siteData, setSiteData] = useState({
    name: siteConfig.name,
    logo: siteConfig.logo,
    contact: siteConfig.contact,
  })

  useEffect(() => {
    let isActive = true
    Promise.all([
      api.settings.getSite().catch(() => null),
      api.contact.getMeta().catch(() => null),
    ]).then(([siteRes, contactRes]) => {
      if (!isActive) return
      setSiteData((prev) => ({
        name: siteRes?.data?.name || prev.name,
        logo: siteRes?.data?.logo || prev.logo,
        contact: {
          email: contactRes?.data?.email || siteRes?.data?.contact?.email || prev.contact.email,
          phone: contactRes?.data?.phone || siteRes?.data?.contact?.phone || prev.contact.phone,
          address: contactRes?.data?.address || siteRes?.data?.contact?.address || prev.contact.address,
        },
      }))
    })
    return () => {
      isActive = false
    }
  }, [])

  return (
    <footer className="site-footer">
      {/* Decorative background */}
      <div className="footer-glow footer-glow-one" />
      <div className="footer-glow footer-glow-two" />

      <svg
        className="footer-growth-lines"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="growth-line growth-line-one"
          d="M-50 230 C180 40 300 310 520 145 S900 30 1100 155 S1350 260 1490 70"
        />
        <path
          className="growth-line growth-line-two"
          d="M-50 265 C180 75 310 345 530 180 S910 65 1110 190 S1360 295 1490 105"
        />
        <path
          className="growth-line growth-line-three"
          d="M-50 195 C160 5 290 275 510 110 S890 -5 1090 120 S1340 225 1490 35"
        />
      </svg>

      <div className="footer-container">
        {/* Main footer content */}
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-column footer-about">
            <Link to="/" className="footer-brand" aria-label={`${siteData.name} home`}>
              <img
                src={getGoogleDriveImageUrl(siteData.logo) || siteData.logo}
                alt={`${siteData.name} logo`}
                className="footer-logo"
              />
              <span className="footer-brand-name">
                {siteData.name}
              </span>
            </Link>

            <span className="footer-label">Growing Together</span>

            <p className="footer-about-description">
              {footerConfig.description}
            </p>

            <div className="footer-socials">
              {footerConfig.socialLinks.map((social) => {
                const Icon =
                  socialIcons[
                    social.platform as keyof typeof socialIcons
                  ]

                if (!Icon) return null

                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`footer-social-icon footer-social-${social.platform.toLowerCase()}`}
                    aria-label={social.platform}
                    title={social.platform}
                  >
                    <Icon size={17} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Explore */}
          <div className="footer-column footer-explore">
            <span className="footer-label">Explore</span>

            <div className="footer-link-list">
              {footerConfig.quickLinks.map((link) => (
                <Link key={link.label} to={link.href}>
                  {link.label}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="footer-column footer-contact">
            <span className="footer-label">Get in touch</span>

            <p className="footer-contact-intro">
              Have a question? We are here to help you grow.
            </p>

            <a href={`mailto:${siteData.contact.email}`}>
              <span className="footer-contact-icon">
                <Mail size={16} />
              </span>
              <span>{siteData.contact.email}</span>
            </a>

            <a href={`tel:${siteData.contact.phone}`}>
              <span className="footer-contact-icon">
                <Phone size={16} />
              </span>
              <span>{siteData.contact.phone}</span>
            </a>

            <div className="footer-address">
              <span className="footer-contact-icon">
                <MapPin size={16} />
              </span>
              <span>{siteData.contact.address}</span>
            </div>

            <a
              href="https://wa.me/8801805917900"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp-link"
            >
              <FaWhatsapp size={17} />
              Chat with us on WhatsApp
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* Large wrapped wordmark */}
        <div className="footer-wordmark">
          <div className="footer-wordmark-top">
            <span>GREEN</span>
            <span className="footer-wordmark-line">LINE</span>
          </div>

          <div className="footer-wordmark-bottom">
            <span>SEED STORE</span>
            <Sprout className="footer-wordmark-sprout" />
          </div>

          <div className="footer-wordmark-caption">
            <span>Rooted in quality.</span>
            <span>Growing for tomorrow.</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>
            {footerConfig.copyright.replace(
              '{year}',
              String(currentYear),
            )}
          </p>

          <span className="footer-credit">
            Made for a greener tomorrow <span>✦</span>
          </span>

          <button
            className="footer-back-to-top"
            type="button"
            aria-label="Back to top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
          >
            <ArrowUp size={19} />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer