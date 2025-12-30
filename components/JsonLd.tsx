export function PersonJsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abo-Elmakarem Shohoud',
    alternateName: [
      'Abo Elmakarem',
      'Karem Shohoud',
      'karem shohoud',
      'كارم شهود',
      'ابوالمكارم شهود',
    ],
    url: 'https://abo-elmakarem.netlify.app',
    image: 'https://abo-elmakarem.netlify.app/profile.jpg',
    jobTitle: [
      'CEO',
      'AI Automation Expert',
      'Voice Agent Developer',
      'Full-Stack Developer',
      'RPA Developer',
      'DevOps Engineer',
      'Frontend Developer',
      'Backend Developer',
      'AI Developer',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Ailigent',
      description: 'AI Automation Solutions',
    },
    description:
      'AI Automation Expert, RPA Developer, DevOps Engineer & Full-Stack Developer helping businesses cut costs by up to 70% using AI & Automation. Specializing in Voice Agents, LiveKit, OpenAI, Frontend and Backend development.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cairo',
      addressCountry: 'Egypt',
    },
    sameAs: [
      'https://github.com/karem505',
      'https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244',
      'https://www.upwork.com/freelancers/~01ecbec4eb4f418011',
      'https://twitter.com/karem_shohud',
    ],
    knowsAbout: [
      // AI & Automation
      'Artificial Intelligence',
      'Machine Learning',
      'Voice Agents',
      'LiveKit',
      'OpenAI',
      'OpenAI Realtime API',
      'Business Automation',
      'Digital Transformation',
      // RPA
      'RPA',
      'Robotic Process Automation',
      'UiPath',
      'Process Automation',
      // DevOps
      'DevOps',
      'CI/CD',
      'Docker',
      'Kubernetes',
      'Cloud Computing',
      'AWS',
      'Railway',
      // Programming Languages
      'Python',
      'TypeScript',
      'JavaScript',
      'Dart',
      // Frontend
      'Frontend Development',
      'React',
      'Next.js',
      'Tailwind CSS',
      'HTML',
      'CSS',
      // Backend
      'Backend Development',
      'Node.js',
      'Express',
      'FastAPI',
      'REST API',
      'GraphQL',
      // Mobile
      'Flutter',
      'Mobile Development',
      // Tools
      'n8n',
      'Odoo',
      'Git',
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'AI Automation Expert',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'AI, Voice Agents, Python, TypeScript, LiveKit, OpenAI',
      },
      {
        '@type': 'Occupation',
        name: 'RPA Developer',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'RPA, UiPath, Process Automation, Business Automation',
      },
      {
        '@type': 'Occupation',
        name: 'DevOps Engineer',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'Docker, Kubernetes, CI/CD, Cloud Computing',
      },
      {
        '@type': 'Occupation',
        name: 'Full-Stack Developer',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'React, Next.js, Node.js, FastAPI, Python, TypeScript',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  )
}

export function WebsiteJsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Abo-Elmakarem Shohoud Portfolio',
    alternateName: [
      'Abo-Elmakarem Portfolio',
      'Karem Shohoud Portfolio',
      'كارم شهود',
      'ابوالمكارم شهود',
    ],
    url: 'https://abo-elmakarem.netlify.app',
    description:
      'Portfolio of Abo-Elmakarem Shohoud (كارم شهود) - AI Automation Expert, RPA Developer, DevOps Engineer & Full-Stack Developer',
    author: {
      '@type': 'Person',
      name: 'Abo-Elmakarem Shohoud',
    },
    inLanguage: ['en-US', 'ar'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  )
}

export function OrganizationJsonLd() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ailigent',
    description:
      'AI Automation Solutions - Helping businesses cut costs by up to 70% through AI, RPA, and process automation',
    founder: {
      '@type': 'Person',
      name: 'Abo-Elmakarem Shohoud',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cairo',
      addressCountry: 'Egypt',
    },
    areaServed: 'Worldwide',
    knowsAbout: [
      'AI Automation',
      'Voice Agents',
      'Business Process Automation',
      'RPA',
      'DevOps',
      'Full-Stack Development',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
    />
  )
}

export function ProfessionalServiceJsonLd() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Abo-Elmakarem Shohoud - AI & Development Services',
    description:
      'AI Automation Expert offering Voice Agent Development, RPA, DevOps, Frontend, Backend, and Full-Stack Development services.',
    provider: {
      '@type': 'Person',
      name: 'Abo-Elmakarem Shohoud',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Development & Automation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Voice Agent Development',
            description:
              'Custom AI voice agents using LiveKit and OpenAI Realtime API for customer support, sales, and automation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'RPA Development',
            description:
              'Robotic Process Automation solutions using UiPath and custom bots to automate repetitive business tasks',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'DevOps Services',
            description:
              'CI/CD pipeline setup, Docker containerization, Kubernetes orchestration, and cloud infrastructure management',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Frontend Development',
            description:
              'Modern web applications using React, Next.js, TypeScript, and Tailwind CSS',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Backend Development',
            description:
              'Scalable APIs and server-side applications using Node.js, FastAPI, Python, and Express',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI & Machine Learning',
            description:
              'Custom AI solutions, model integration, and intelligent automation systems',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business Process Automation',
            description:
              'End-to-end workflow automation using n8n, Odoo, and custom solutions to reduce costs by up to 70%',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  )
}

export function BreadcrumbJsonLd() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://abo-elmakarem.netlify.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://abo-elmakarem.netlify.app/#about',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Experience',
        item: 'https://abo-elmakarem.netlify.app/#experience',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Projects',
        item: 'https://abo-elmakarem.netlify.app/#projects',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Contact',
        item: 'https://abo-elmakarem.netlify.app/#contact',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}
