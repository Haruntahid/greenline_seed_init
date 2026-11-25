
import type { ThemeConfig } from '../types/site.types'

export const themeConfig: ThemeConfig = {
  colors: {
    primary: '#2563EB',
    secondary: '#1E293B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    muted: '#64748B',
  },

  typography: {
    headingFont: 'Arial',
    bodyFont: 'Arial',
  },

  appearance: {
    preset: 'transparent',
    headerStyle: 'transparent',
    cardStyle: 'transparent',
  },

  sections: {
    services: {
      background: '#071D18',
      surface: '#1C4334',
      accent: '#65D6A4',
      heading: '#F4F8F5',
      text: '#F2F8F4',
      muted: '#A5B9AF',
      border: 'rgba(158, 211, 184, 0.15)',
    },

stats: {
  background: '#071D18',
  surface: '#1C4334',
  accent: '#75E3B1',
  heading: '#F4F8F5',
  text: '#F4F8F5',
  muted: '#A5B9AF',
  border: 'rgba(158, 211, 184, 0.15)',
},

    portfolio: {
      background: '#0B211B',
      surface: '#193A2D',
      accent: '#75E3B1',
      heading: '#F4F8F5',
      text: '#F4F8F5',
      muted: '#A5B9AF',
      border: 'rgba(158, 211, 184, 0.14)',
    },

    contact: {
      background: '#071D18',
      surface: '#1C4334',
      accent: '#75E3B1',
      heading: '#F4F8F5',
      text: '#F4F8F5',
      muted: '#A5B9AF',
      border: 'rgba(158, 211, 184, 0.15)',
    },

    footer: {
      background: '#04150F',
      surface: '#193A2D',
      accent: '#75E3B1',
      heading: '#F4F8F5',
      text: '#F4F8F5',
      muted: '#91A99B',
      border: 'rgba(158, 211, 184, 0.15)',
    },
  },
}
