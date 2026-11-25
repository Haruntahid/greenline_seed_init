
import type { HeroCarouselContent } from '../types/site.types'

export const heroCarouselConfig: HeroCarouselContent = {
  slides: [
    {
      id: 'hero-slide-1',
      eyebrow: 'GROWING WITH NATURE',
      title: 'Seeds for a',
      highlightedTitle: 'Greener Tomorrow.',
      description:
        'Discover quality seeds that inspire growth and help cultivate a greener future.',
      imageUrl: '',
      imageAlt: 'Agricultural field with healthy green crops',
      primaryButton: {
        label: 'Explore Seeds',
        link: '/products',
      },
      secondaryButton: {
        label: 'About Us',
        link: '/about',
      },
      tertiaryButton: {
        label: 'Contact Us',
        link: '/contact',
      },
      enabled: true,
    },
    {
      id: 'hero-slide-2',
      eyebrow: 'DISCOVER OUR SEEDS',
      title: 'Discover the Seeds of',
      highlightedTitle: 'Possibility.',
      description:
        'Explore a world of agricultural possibilities through a diverse selection of seeds.',
      imageUrl: '',
      imageAlt: 'Close-up of agricultural seeds and seedlings',
      primaryButton: {
        label: 'Explore Products',
        link: '/products',
      },
      secondaryButton: {
        label: 'Learn More',
        link: '/about',
      },
      enabled: true,
    },
    {
      id: 'hero-slide-3',
      eyebrow: 'GROWING TOGETHER',
      title: 'Growing Together,',
      highlightedTitle: 'Naturally.',
      description:
        'A shared commitment to nature, cultivation and a more sustainable tomorrow.',
      imageUrl: '',
      imageAlt: 'Farmland surrounded by natural greenery',
      primaryButton: {
        label: 'Discover More',
        link: '/about',
      },
      secondaryButton: {
        label: 'Contact Us',
        link: '/contact',
      },
      enabled: true,
    },
  ],

  settings: {
    autoplay: true,
    interval: 6000,
    transition: 'fade',
    showArrows: true,
    showIndicators: true,
  },
}
