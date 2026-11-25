export interface AnalyticsVisibility {
  section: boolean
  metrics: boolean
  distribution: boolean
  comparison: boolean
  trends: boolean
}
export interface AnalyticsMetric {
  id: string
  label: string
  value: number
  suffix: string
  description: string
}

export interface DistributionItem {
  name: string
  value: number
}

export interface ComparisonItem {
  name: string
  projects: number
  impact: number
}

export interface TrendItem {
  month: string
  projects: number
  beneficiaries: number
}

export const analyticsConfig = {
  // Demonstration data — replace with verified business data.
    // Client-controlled visibility settings.
  // These defaults will later be managed from the Admin Dashboard.
  visibility: {
    section: true,
    metrics: true,
    distribution: true,
    comparison: true,
    trends: true,
  } satisfies AnalyticsVisibility,
  metrics: [
    {
      id: 'projects',
      label: 'Projects Delivered',
      value: 150,
      suffix: '+',
      description: 'Projects completed successfully.',
    },
    {
      id: 'clients',
      label: 'Client Partnerships',
      value: 25,
      suffix: '+',
      description: 'Organizations and businesses served.',
    },
    {
      id: 'regions',
      label: 'Regions Reached',
      value: 12,
      suffix: '',
      description: 'Regions represented in our sample data.',
    },
    {
      id: 'satisfaction',
      label: 'Client Satisfaction',
      value: 98,
      suffix: '%',
      description: 'Illustrative satisfaction indicator.',
    },
  ] satisfies AnalyticsMetric[],

  // Demonstration distribution — percentages are illustrative.
  distribution: [
    { name: 'Web Development', value: 35 },
    { name: 'UI/UX Design', value: 25 },
    { name: 'Digital Solutions', value: 22 },
    { name: 'Consultancy', value: 18 },
  ] satisfies DistributionItem[],

  // Demonstration comparison data.
  comparison: [
    { name: 'Web', projects: 42, impact: 68 },
    { name: 'Design', projects: 30, impact: 52 },
    { name: 'Digital', projects: 26, impact: 61 },
    { name: 'Consultancy', projects: 18, impact: 39 },
  ] satisfies ComparisonItem[],

  // Demonstration monthly trend data.
  trends: [
    { month: 'Jan', projects: 8, beneficiaries: 120 },
    { month: 'Feb', projects: 12, beneficiaries: 180 },
    { month: 'Mar', projects: 10, beneficiaries: 155 },
    { month: 'Apr', projects: 16, beneficiaries: 240 },
    { month: 'May', projects: 19, beneficiaries: 290 },
    { month: 'Jun', projects: 23, beneficiaries: 350 },
    { month: 'Jul', projects: 21, beneficiaries: 325 },
    { month: 'Aug', projects: 27, beneficiaries: 410 },
    { month: 'Sep', projects: 30, beneficiaries: 465 },
    { month: 'Oct', projects: 34, beneficiaries: 520 },
    { month: 'Nov', projects: 38, beneficiaries: 590 },
    { month: 'Dec', projects: 42, beneficiaries: 650 },
  ] satisfies TrendItem[],
}
