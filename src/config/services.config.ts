
import type { ServicesContent } from '../types/site.types'

export const servicesConfig: ServicesContent = {
  eyebrow: 'WHAT WE DO',
  title: 'Digital Experiences.',
  description:
    'We turn ambitious ideas into meaningful digital products through thoughtful design, intelligent technology and strategic execution.',

  services: [
    {
      id: 'web-development',
      title: 'Web Development',
      description:
        'Modern, responsive and scalable websites tailored to your business needs.',
      icon: 'Code',
      enabled: true,

      heroTitle: 'Websites that move businesses forward.',
      heroDescription:
        'We build high-performing digital experiences that combine beautiful design, reliable technology and purposeful functionality.',

      overviewTitle: 'More than just a website.',
      overviewDescription:
        'Your website is often the first interaction customers have with your business. We create responsive, accessible and scalable web solutions that communicate your value, strengthen your brand and support your long-term growth.',

      features: [
        {
          title: 'Custom Website Development',
          description:
            'Purpose-built websites designed around your brand, business goals and customer needs.',
          icon: 'Code',
        },
        {
          title: 'Responsive Design',
          description:
            'Seamless experiences across desktops, tablets and mobile devices.',
          icon: 'MonitorSmartphone',
        },
        {
          title: 'Performance Optimization',
          description:
            'Fast-loading, optimized websites built with performance and usability in mind.',
          icon: 'Gauge',
        },
        {
          title: 'Scalable Architecture',
          description:
            'Flexible technical foundations that can grow alongside your business.',
          icon: 'Layers',
        },
      ],

      process: [
        {
          number: '01',
          title: 'Discovery',
          description:
            'We understand your business, audience, requirements and project goals.',
        },
        {
          number: '02',
          title: 'Planning & Design',
          description:
            'We define the structure, user experience and visual direction.',
        },
        {
          number: '03',
          title: 'Development',
          description:
            'We transform the approved design into a functional website.',
        },
        {
          number: '04',
          title: 'Testing & Launch',
          description:
            'We validate functionality, responsiveness and performance before launch.',
        },
      ],

      ctaTitle: 'Ready to build your next digital experience?',
      ctaDescription:
        'Let’s create a website that reflects your ambition and helps your business grow.',
    },

    {
      id: 'ui-ux-design',
      title: 'UI/UX Design',
      description:
        'Intuitive and engaging digital experiences designed around your users.',
      icon: 'Palette',
      enabled: true,

      heroTitle: 'Design that makes every interaction meaningful.',
      heroDescription:
        'We turn complex ideas into intuitive digital experiences through thoughtful research, purposeful interfaces and human-centered design.',

      overviewTitle: 'Great design starts with understanding people.',
      overviewDescription:
        'A successful digital product should feel natural to use. We combine user research, information architecture and visual design to create experiences that are easy to understand, enjoyable to navigate and aligned with your business objectives.',

      features: [
        {
          title: 'User Research',
          description:
            'Understand user expectations, behaviors and pain points through structured research.',
          icon: 'Users',
        },
        {
          title: 'Wireframing',
          description:
            'Organize information and define the structure before visual design begins.',
          icon: 'PanelsTopLeft',
        },
        {
          title: 'Interface Design',
          description:
            'Create polished, consistent and visually engaging digital interfaces.',
          icon: 'Palette',
        },
        {
          title: 'Prototyping',
          description:
            'Explore interactive concepts and validate design decisions before development.',
          icon: 'MousePointerClick',
        },
      ],

      process: [
        {
          number: '01',
          title: 'Research',
          description:
            'We explore your audience, product requirements and user challenges.',
        },
        {
          number: '02',
          title: 'Structure',
          description:
            'We develop user flows, information architecture and wireframes.',
        },
        {
          number: '03',
          title: 'Visual Design',
          description:
            'We create the interface, visual language and interactive prototypes.',
        },
        {
          number: '04',
          title: 'Validation',
          description:
            'We review usability and refine the experience based on feedback.',
        },
      ],

      ctaTitle: 'Have an idea worth designing?',
      ctaDescription:
        'Let’s turn your vision into a thoughtful and engaging user experience.',
    },

    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      description:
        'Strategic digital marketing to increase visibility and reach your audience.',
      icon: 'Megaphone',
      enabled: true,

      heroTitle: 'Make your brand impossible to overlook.',
      heroDescription:
        'We help businesses build meaningful online visibility, connect with the right audiences and turn digital attention into measurable opportunities.',

      overviewTitle: 'Visibility with a clear purpose.',
      overviewDescription:
        'Effective digital marketing goes beyond publishing content or running advertisements. It requires a clear understanding of your audience, a consistent brand message and a strategy that connects every digital channel to your business goals.',

      features: [
        {
          title: 'SEO Strategy',
          description:
            'Improve your website visibility and help potential customers discover your business.',
          icon: 'Search',
        },
        {
          title: 'Social Media Strategy',
          description:
            'Build a consistent brand presence and meaningful audience engagement.',
          icon: 'Share2',
        },
        {
          title: 'Content Marketing',
          description:
            'Develop useful and engaging content that communicates your brand value.',
          icon: 'FileText',
        },
        {
          title: 'Campaign Analytics',
          description:
            'Measure campaign performance and use insights to improve future decisions.',
          icon: 'ChartNoAxesCombined',
        },
      ],

      process: [
        {
          number: '01',
          title: 'Market Research',
          description:
            'We analyze your audience, market position and competitive landscape.',
        },
        {
          number: '02',
          title: 'Strategy',
          description:
            'We establish marketing objectives, channels and campaign direction.',
        },
        {
          number: '03',
          title: 'Execution',
          description:
            'We launch and manage campaigns across selected digital channels.',
        },
        {
          number: '04',
          title: 'Measure & Improve',
          description:
            'We evaluate performance and refine the strategy using campaign insights.',
        },
      ],

      ctaTitle: 'Let’s grow your digital presence.',
      ctaDescription:
        'Build stronger connections with your audience through purposeful digital marketing.',
    },

    {
      id: 'consultancy',
      title: 'Business Consultancy',
      description:
        'Practical guidance to help your business make better digital decisions.',
      icon: 'Lightbulb',
      enabled: true,

      heroTitle: 'Better decisions. Stronger digital businesses.',
      heroDescription:
        'We help organizations identify opportunities, solve digital challenges and make confident technology decisions.',

      overviewTitle: 'Clarity before complexity.',
      overviewDescription:
        'Digital transformation requires more than adopting new tools. It requires the right strategy, a clear understanding of business processes and practical execution. We help you evaluate your current position and identify the most valuable next steps.',

      features: [
        {
          title: 'Digital Strategy',
          description:
            'Define a practical roadmap that aligns technology with your business objectives.',
          icon: 'Target',
        },
        {
          title: 'Process Improvement',
          description:
            'Identify operational gaps and opportunities to improve business workflows.',
          icon: 'Workflow',
        },
        {
          title: 'Technology Advisory',
          description:
            'Evaluate technology options and select solutions that fit your requirements.',
          icon: 'Lightbulb',
        },
        {
          title: 'Project Guidance',
          description:
            'Support planning, coordination and execution throughout digital initiatives.',
          icon: 'BriefcaseBusiness',
        },
      ],

      process: [
        {
          number: '01',
          title: 'Understand',
          description:
            'We learn about your business model, challenges and priorities.',
        },
        {
          number: '02',
          title: 'Assess',
          description:
            'We evaluate existing processes, systems and opportunities.',
        },
        {
          number: '03',
          title: 'Recommend',
          description:
            'We provide practical recommendations and a prioritized roadmap.',
        },
        {
          number: '04',
          title: 'Support',
          description:
            'We help guide implementation and evaluate progress.',
        },
      ],

      ctaTitle: 'Let’s find the right direction for your business.',
      ctaDescription:
        'Discuss your challenges with us and explore practical ways forward.',
    },
  ],
}
