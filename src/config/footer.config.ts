
import type { FooterContent } from '../types/site.types'

export const footerConfig: FooterContent = {
  brandName: 'Green Line Seed Store',

  description:
    'Quality seeds for better harvests. Supporting farmers with trusted agricultural products and solutions.',

  quickLinks: [
    { label: 'Home', href: '/home' },
    { label: 'Products', href: '/products' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Gallery', href: '/gallary' },
    { label: 'Contact', href: '/contact' },
  ],

  socialLinks: [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/p/GREEN-LINE-SEED-CO-100069325356863/',
    },
    {
      platform: 'YouTube',
      url: 'https://www.youtube.com/@GreenLineSeedStore',
    },
    {
      platform: 'WhatsApp',
      url: 'https://wa.me/8801805917900',
    },
  ],

  copyright: '© {year} Green Line Seed Store. All rights reserved.',
  privacyPolicy: '#privacy',
  termsConditions: '#terms',
}
