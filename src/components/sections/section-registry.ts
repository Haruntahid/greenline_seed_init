
import type { ComponentType } from 'react'

import HeroSection from './HeroSection'
import AboutSection from './AboutSection'
import ProductsSection from './ProductsSection'
import StatsSection from './StatsSection'
import ServicesSection from './ServicesSection'
import PortfolioSection from './PortfolioSection'
import CTASection from './CTASection'
import ContactSection from './ContactSection'
import YouTubeVideosSection from './YouTubeVideosSection'

export const sectionRegistry: Record<string, ComponentType> = {
  hero: HeroSection,
  about: AboutSection,
  products: ProductsSection,
  stats: StatsSection,
  services: ServicesSection,
  portfolio: PortfolioSection,
  cta: CTASection,
  contact: ContactSection,
  youtubeVideos: YouTubeVideosSection,
}
