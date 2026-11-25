
import type { PortfolioContent } from '../types/site.types'

export const portfolioConfig: PortfolioContent = {
  eyebrow: 'DISCOVER OUR WORLD',

  title: 'Ideas Into Impact.',

  description:
    'Discover what drives us, what we believe in, and the meaningful digital experiences we create.',

  features: [
    {
      id: 'what-we-do',
      eyebrow: 'OUR EXPERTISE',
      title: 'What We Do',
      description:
        'Explore our capabilities, services and approach to creating meaningful solutions that help businesses move forward.',
      image: '/images/portfolio/what-we-do.jpg',
      link: '/what-we-do',
      buttonLabel: 'Explore Capabilities',
      enabled: true,
      order: 1,
    },
    {
      id: 'mission-vision',
      eyebrow: 'OUR PURPOSE',
      title: 'Mission & Vision',
      description:
        'Discover the purpose behind our work, the values that guide us and the future we are working to create.',
      image: '/images/portfolio/mission-vision.jpg',
      link: '/mission-vision',
      buttonLabel: 'Discover Our Vision',
      enabled: true,
      order: 2,
    },
  ],


projects: [
  {
    id: 'project-one',
    slug: 'digital-healthcare-platform',
    title: 'Digital Healthcare Platform',
    category: 'Healthcare',
    description:
      'A modern digital platform connecting healthcare services with the people who need them.',
    year: '2026',
    image: '/images/portfolio/healthcare.jpg',

    overview:
      'A digital healthcare solution designed to make healthcare services more accessible and connected.',
    challenge:
      'Connecting healthcare providers, patients and essential services through a unified digital experience.',
    solution:
      'A centralized platform with streamlined workflows and an intuitive user experience.',
    services: ['Web Development', 'UI/UX Design', 'Healthcare Technology'],
    technologies: ['React', 'TypeScript', 'Node.js'],
    gallery: [],
    impact: '',

    featured: true,
    enabled: true,
    order: 1,
  },
  {
    id: 'project-two',
    slug: 'modern-business-website',
    title: 'Modern Business Website',
    category: 'Web Development',
    description:
      'A professional digital presence designed to communicate a brand and grow its business.',
    year: '2026',
    image: '/images/portfolio/business.jpg',

    overview:
      'A modern corporate website focused on brand communication and digital presence.',
    challenge:
      'Presenting business information clearly while maintaining a consistent brand identity.',
    solution:
      'A responsive website with structured content and an engaging visual experience.',
    services: ['Web Development', 'Responsive Design'],
    technologies: ['React', 'TypeScript', 'CSS'],
    gallery: [],
    impact: '',

    featured: true,
    enabled: true,
    order: 2,
  },
  {
    id: 'project-three',
    slug: 'creative-brand-experience',
    title: 'Creative Brand Experience',
    category: 'Branding',
    description:
      'A distinctive visual identity and digital experience built around a brand story.',
    year: '2025',
    image: '/images/portfolio/branding.jpg',

    overview:
      'A brand-focused digital experience designed to communicate identity and values.',
    challenge:
      'Creating a recognizable and consistent visual experience across digital touchpoints.',
    solution:
      'A cohesive visual direction supported by thoughtful design and brand storytelling.',
    services: ['Brand Identity', 'UI/UX Design'],
    technologies: ['Figma', 'Adobe Illustrator'],
    gallery: [],
    impact: '',

    featured: false,
    enabled: true,
    order: 3,
  },
],


  closingCTA: {
    eyebrow: 'HAVE A PROJECT IN MIND?',
    title: 'Let’s Create Something Extraordinary.',
    description:
      'Have an idea or a challenge? Let’s discuss how we can turn it into something meaningful.',
    buttonLabel: 'Let’s Talk',
    buttonLink: '/#contact',
  },
}
