
import type { BlogsContent } from '../types/site.types'

export const blogsConfig: BlogsContent = {
  eyebrow: 'OUR JOURNAL',
  title: 'Insights, Ideas & Perspectives',
  description:
    'Explore our latest stories, industry insights, ideas and perspectives.',

  categories: [
    {
      id: 'technology',
      name: 'Technology',
      description: 'Technology trends and digital innovation.',
      enabled: true,
      order: 1,
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Business strategies and industry insights.',
      enabled: true,
      order: 2,
    },
    {
      id: 'innovation',
      name: 'Innovation',
      description: 'New ideas, solutions and emerging technologies.',
      enabled: true,
      order: 3,
    },
    {
      id: 'company-news',
      name: 'Company News',
      description: 'Updates, announcements and company activities.',
      enabled: true,
      order: 4,
    },
  ],

  articles: [
    {
      id: 'blog-001',
      slug: 'the-future-of-digital-transformation',
      title: 'The Future of Digital Transformation',
      excerpt:
        'Discover how digital technologies are reshaping businesses and creating new opportunities.',
      content:
        'Digital transformation is changing how organizations operate, communicate and deliver value. This demonstration article will eventually be replaced with real editorial content.',
      categoryId: 'technology',
      author: 'Editorial Team',
      authorRole: 'Content & Research',
      coverImage: '/images/blog/digital-transformation.jpg',
      publishedAt: '2026-10-20',
      readTime: '5 min read',
      tags: ['Digital Transformation', 'Technology', 'Business'],
      featured: true,
      enabled: true,
      order: 1,
    },
    {
      id: 'blog-002',
      slug: 'building-a-customer-focused-business',
      title: 'Building a Customer-Focused Business',
      excerpt:
        'Learn why understanding customer needs is essential for sustainable business growth.',
      content:
        'A customer-focused business puts customer needs at the center of its decisions. This demonstration article explores the importance of customer experience.',
      categoryId: 'business',
      author: 'Editorial Team',
      coverImage: '/images/blog/customer-focused-business.jpg',
      publishedAt: '2026-10-15',
      readTime: '4 min read',
      tags: ['Customer Experience', 'Business Growth'],
      featured: true,
      enabled: true,
      order: 2,
    },
    {
      id: 'blog-003',
      slug: 'innovation-that-creates-real-impact',
      title: 'Innovation That Creates Real Impact',
      excerpt:
        'Explore how practical innovation can solve problems and create meaningful change.',
      content:
        'Innovation is not simply about introducing new technology. It is about finding better ways to solve real-world problems.',
      categoryId: 'innovation',
      author: 'Editorial Team',
      coverImage: '/images/blog/innovation-impact.jpg',
      publishedAt: '2026-10-10',
      readTime: '6 min read',
      tags: ['Innovation', 'Digital Solutions'],
      featured: false,
      enabled: true,
      order: 3,
    },
    {
      id: 'blog-004',
      slug: 'inside-our-company-journey',
      title: 'Inside Our Company Journey',
      excerpt:
        'A look at the milestones, experiences and ideas shaping our journey.',
      content:
        'Every organization has a journey shaped by people, ideas and experiences. This demonstration article introduces our company journal.',
      categoryId: 'company-news',
      author: 'Editorial Team',
      coverImage: '/images/blog/company-journey.jpg',
      publishedAt: '2026-10-05',
      readTime: '3 min read',
      tags: ['Company News', 'Our Journey'],
      featured: false,
      enabled: true,
      order: 4,
    },
  ],
}
