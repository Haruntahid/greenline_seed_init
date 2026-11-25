
export interface StatItem {
  id: string
  label: string
  value: number
  suffix: string
  description: string
  image: string
  enabled: boolean
}

export const statsConfig: StatItem[] = [
  {
    id: 'projects',
    label: 'Projects Completed',
    value: 150,
    suffix: '+',
    description:
      'Transforming ambitious ideas into meaningful digital solutions and successful projects.',
    image: '/images/stats/projects.jpg',
      enabled: true,
  },
  {
    id: 'satisfaction',
    label: 'Client Satisfaction',
    value: 98,
    suffix: '%',
    description:
      'Building lasting partnerships through quality, collaboration and reliable delivery.',
    image: '/images/stats/clients.jpg',
      enabled: true,
  },
  {
    id: 'team',
    label: 'Team Members',
    value: 25,
    suffix: '+',
    description:
      'Bringing together talented people with diverse skills and a shared vision.',
    image: '/images/stats/team.jpg',
      enabled: true,
  },
  {
    id: 'experience',
    label: 'Years Experience',
    value: 10,
    suffix: '+',
    description:
      'Combining knowledge and experience to create solutions that move businesses forward.',
    image: '/images/stats/experience.jpg',
      enabled: true,
  },
]
