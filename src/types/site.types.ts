export interface SiteConfig {
  name: string
  description: string
  logo: string

  contact: {
    email: string
    phone: string
    address: string
  }

  features: {
    customCursor: boolean
  }
}

export interface SectionConfig {
  id: string
  name: string
  enabled: boolean
  order: number
}


export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    muted: string
  }

  typography: {
    headingFont: string
    bodyFont: string
  }

  appearance: {
    preset: 'minimal' | 'transparent' | 'glass'
    headerStyle: 'solid' | 'transparent' | 'glass'
    cardStyle: 'solid' | 'transparent' | 'glass'
  }

  sections: {
  services: SectionTheme
  stats: SectionTheme
  portfolio: SectionTheme
  contact: SectionTheme
  footer: SectionTheme
}
}

export interface SectionTheme {
  background: string
  surface: string
  accent: string
  heading: string
  text: string
  muted: string
  border: string
}


export interface HeroContent {
  eyebrow: string
  title: string
  highlightedTitle: string
    description: string
  imageUrl?: string
  imageAlt?: string

  primaryButton: {
    label: string
    link: string
  }

  secondaryButton: {
    label: string
    link: string
  }

  tertiaryButton?: {
    label: string
    link: string
  }
}
// export interface AboutContent {
//   eyebrow: string
//   title: string
//   description: string
//   image: string

//   highlights: {
//     title: string
//     description: string
//   }[]
// }


export interface HeroSlide extends HeroContent {
  id: string
  enabled: boolean
  mobileImageUrl?: string
}

export interface HeroCarouselContent {
  slides: HeroSlide[]

  settings: {
    autoplay: boolean
    interval: number
    transition: 'fade'
    showArrows: boolean
    showIndicators: boolean
  }
}


export interface AboutHighlight {
  title: string
  description: string
}

export interface AboutStory {
  eyebrow: string
  title: string
  description: string[]
  image: string
  secondaryImage?: string
  imageCaption?: string
}


export interface JourneyMilestone {
  id: string
  year: string
  description: string
  image?: string
  enabled: boolean
}


export interface AboutValue {
  id: string
  title: string
  description: string
  icon: string
}

export interface TeamSocialLink {
  platform: 'LinkedIn' | 'Facebook' | 'Instagram' | 'X' | 'YouTube' | 'Website'
  url: string
}

export interface TeamMember {
  id: string
  name: string
  designation: string
  quote: string
  biography: string
  image: string
  socialLinks: TeamSocialLink[]
  featured: boolean
  enabled: boolean
  order: number
}

export interface AboutAchievement {
  id: string
  value: string
  label: string
  description?: string
}

export interface AboutContent {
  eyebrow: string
  title: string
  description: string
  image: string

    imageAlt?: string
  imageBadge?: string
  buttonLabel?: string
  buttonLink?: string

  highlights: AboutHighlight[]

  story?: AboutStory
  journey?: JourneyMilestone[]
  values?: AboutValue[]
  team?: TeamMember[]
  achievements?: AboutAchievement[]

  closing?: {
    eyebrow: string
    title: string
    description: string
    buttonLabel?: string
    buttonLink?: string
  }

owner: {
  eyebrow: string
  title: string
  name: string
  designation: string
  image: string
  quote: string
  message: string
  signature: string
}

}


/**
 * Homepage About Section
 * Used by the homepage About editor and AboutSection component.
 */
export interface HomepageAboutContent {
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt?: string
  imageBadge?: string
  buttonLabel?: string
  buttonLink?: string
  highlights: AboutHighlight[]
}


export interface AboutPageSectionVisibility {
  hero: boolean
  story: boolean
  owner: boolean
  journey: boolean
  missionVision: boolean
  values: boolean
  achievements: boolean
  closing: boolean
}

/**
 * Full About Us Page
 * Independent content model for the /about page.
 * Team management remains separate.
 */
export interface AboutPageContent {
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt?: string
  imageBadge?: string

  story: AboutStory
  journey: JourneyMilestone[]
  highlights: AboutHighlight[]
  values: AboutValue[]
  achievements: AboutAchievement[]

  owner: {
    eyebrow: string
    title: string
    name: string
    designation: string
    image: string
    quote: string
    message: string
    signature: string
  }

  closing: {
    eyebrow: string
    title: string
    description: string
    buttonLabel?: string
    buttonLink?: string
  }
  sectionVisibility: AboutPageSectionVisibility

missionVision: {
  mission: {
    title: string
    description: string
  }
  vision: {
    title: string
    description: string
  }
}
}



export interface ServiceFeature {
  title: string
  description: string
  icon: string
}

export interface ServiceProcessStep {
  number: string
  title: string
  description: string
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  image?: string
  featured?: boolean
  enabled: boolean

  // Service details page content
  heroTitle?: string
  heroDescription?: string
  overviewTitle?: string
  overviewDescription?: string
  features?: ServiceFeature[]
  process?: ServiceProcessStep[]
  ctaTitle?: string
  ctaDescription?: string
}



export interface ServicesContent {
  eyebrow: string
  title: string
  description: string
  services: ServiceItem[]
}



export interface PortfolioProject {
  id: string
  slug: string
  title: string
  category: string
  description: string
  year: string
  image: string

  // Project details modal content
  overview?: string
  challenge?: string
  solution?: string

  // Project information
  services?: string[]
  technologies?: string[]
  gallery?: string[]
  impact?: string

  // Project management
  featured: boolean
  enabled: boolean
  order: number
}


export interface PortfolioFeature {
  id: string
  eyebrow: string
  title: string
  description: string
  image: string
  link: string
  buttonLabel: string
  enabled: boolean
  order: number
}

export interface PortfolioClosingCTA {
  eyebrow: string
  title: string
  description: string
  buttonLabel: string
  buttonLink: string
}


export interface PortfolioContent {
  eyebrow: string
  title: string
  description: string
  features: PortfolioFeature[]
  projects: PortfolioProject[]
  closingCTA: PortfolioClosingCTA
}



export interface ContactContent {
  eyebrow: string
  title: string
  description: string
  email: string
  phone: string
  address: string
  whatsapp: string
  formTitle: string
  formDescription: string
  mapEnabled: boolean
}


export interface FooterLink {
  label: string
  href: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface FooterContent {
  brandName: string
  description: string
  quickLinks: FooterLink[]
  socialLinks: SocialLink[]
  copyright: string
  privacyPolicy: string
  termsConditions: string
}


export interface ProductSpecification {
  label: string
  value: string
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
  enabled: boolean
  order: number
}


export interface ProductItem {
  id: string
  sku: string
  slug: string
  name: string

  shortDescription: string
  description: string
  categoryId: string

  image: string
  gallery?: string[]

  specifications?: ProductSpecification[]

  price: number
  discountPrice?: number
  unit?: string

stockStatus: 'in_stock' | 'out_of_stock'
  featured: boolean
  enabled: boolean
  order: number

  createdAt?: string
  updatedAt?: string
}


export interface ProductsContent {
  eyebrow: string
  title: string
  description: string
  categories: ProductCategory[]
  products: ProductItem[]
}


export interface BlogCategory {
  id: string
  name: string
  description?: string
  enabled: boolean
  order: number
}

export interface BlogArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string

  categoryId: string
  author: string
  authorRole?: string
  authorImage?: string

  coverImage: string
  publishedAt: string
  readTime: string
  tags?: string[]

  featured: boolean
  enabled: boolean
  order: number
}

export interface BlogsContent {
  eyebrow: string
  title: string
  description: string
  categories: BlogCategory[]
  articles: BlogArticle[]
}

export interface YouTubeVideo {
  id: string
  videoId: string
  title: string
  description: string
  category: string
  featured: boolean
  enabled: boolean
  order: number
}

export interface YouTubeVideosContent {
  eyebrow: string
  title: string
  description: string
  videos: YouTubeVideo[]
  settings: {
    autoplay: boolean
    interval: number
    showArrows: boolean
    showIndicators: boolean
  }
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  image: string
  imageType: 'upload' | 'url'
  enabled: boolean
  order: number
}

export interface GalleryContent {
  eyebrow: string
  title: string
  description: string
  items: GalleryItem[]
}
