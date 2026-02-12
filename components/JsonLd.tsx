export function PersonJsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://aboelmakarem.pro/#person',
    name: 'Abo-Elmakarem Shohoud',
    alternateName: [
      'Abo Elmakarem',
      'Karem Shohoud',
      'karem shohoud',
      'كارم شهود',
      'ابوالمكارم شهود',
    ],
    url: 'https://aboelmakarem.pro',
    image: 'https://aboelmakarem.pro/profile.jpg',
    jobTitle: [
      'CEO & Co-founder at Ailigent',
      'AI Automation Expert',
      'Full-Stack Developer',
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
    '@id': 'https://aboelmakarem.pro/#website',
    name: 'Abo-Elmakarem Shohoud Portfolio',
    alternateName: [
      'Abo-Elmakarem Portfolio',
      'Karem Shohoud Portfolio',
      'كارم شهود',
      'ابوالمكارم شهود',
    ],
    url: 'https://aboelmakarem.pro',
    description:
      'Portfolio of Abo-Elmakarem Shohoud (كارم شهود) - AI Automation Expert, RPA Developer, DevOps Engineer & Full-Stack Developer',
    publisher: {
      '@id': 'https://aboelmakarem.pro/#person',
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
    '@id': 'https://aboelmakarem.pro/#organization',
    name: 'Ailigent',
    url: 'https://aboelmakarem.pro',
    logo: {
      '@type': 'ImageObject',
      url: 'https://aboelmakarem.pro/logo.png',
    },
    description:
      'AI Automation Solutions - Helping businesses cut costs by up to 70% through AI, RPA, and process automation',
    founder: {
      '@id': 'https://aboelmakarem.pro/#person',
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
    areaServed: 'Worldwide',
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

export function FAQPageJsonLd() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is AI automation and how can it help my business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI automation uses artificial intelligence to handle repetitive tasks, make decisions, and streamline workflows. It can help your business reduce manual work, cut operational costs by up to 70%, and free your team to focus on high-value activities.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do voice agents work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Voice agents use technologies like LiveKit and OpenAI Realtime API to have natural conversations with your customers. They can handle sales calls, customer support, appointment scheduling, and more — 24/7, without human intervention.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much can AI automation save my business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most businesses see cost reductions of 40-70% in automated processes. The exact savings depend on your current workflows, team size, and the complexity of tasks being automated. I provide a free audit to estimate your potential savings.',
        },
      },
      {
        '@type': 'Question',
        name: 'What technologies do you use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'I work with Python, TypeScript, React, Next.js, FastAPI, LiveKit, OpenAI Realtime API, Docker, and more. For automation, I use n8n, custom APIs, and AI models. Every project gets the right stack for the job.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you work with international clients?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. I work with clients worldwide. I am based in Cairo, Egypt, and I have experience working with businesses across the Middle East, Europe, and North America. Communication is in English or Arabic.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I get started with AI automation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start by reaching out through the contact form or LinkedIn. I will schedule a free consultation to understand your business needs, identify automation opportunities, and propose a solution with clear timelines and expected ROI.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
        item: 'https://aboelmakarem.pro',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://aboelmakarem.pro/blog',
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
