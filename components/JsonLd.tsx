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
      'Full-Stack Developer at Ailigent',
      'DevOps Engineer at Ailigent',
      'Scrum Master at Ailigent',
      'Business Analyst at Ailigent',
      'AI Automation Expert',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Ailigent',
      description: 'AI Automation Solutions',
    },
    description:
      'Full-Stack Developer, DevOps Engineer, Scrum Master and Business Analyst at Ailigent with 2+ years of experience shipping production-grade SaaS. Builds AI-powered products (Tornix.ai, Oravex.app, Costra.ailigent.ai) and voice AI agents (LiveKit, OpenAI Realtime, MCP, Tavus) for clients across Egypt, UAE, and KSA.',
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
      'Voice Agents',
      'LiveKit Agents',
      'OpenAI Realtime API',
      'MCP',
      'Model Context Protocol',
      'Tavus',
      'Business Automation',
      'Process Automation',
      'Digital Transformation',
      // DevOps
      'DevOps',
      'CI/CD Pipelines',
      'Docker',
      'GitHub Actions',
      'AWS EC2',
      'Railway',
      'Linux',
      'Nginx',
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
      // Backend
      'Backend Development',
      'Node.js',
      'FastAPI',
      'REST API',
      // Mobile
      'Flutter',
      'Mobile Development',
      // ERP & Domain
      'Odoo 18',
      'Enterprise Resource Planning',
      'Critical Path Method',
      'Primavera P6',
      'XER',
      // Agile & Business
      'Scrum',
      'Scrum Master',
      'Product Ownership',
      'Sprint Planning',
      'Backlog Management',
      'Business Analysis',
      'Requirements Engineering',
      'ROI Modelling',
      'Git',
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Full-Stack Developer',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'React, Next.js, Node.js, FastAPI, Python, TypeScript, Flutter',
      },
      {
        '@type': 'Occupation',
        name: 'DevOps Engineer',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'Docker, GitHub Actions, AWS EC2, Railway, CI/CD Pipelines, Linux, Nginx',
      },
      {
        '@type': 'Occupation',
        name: 'Scrum Master',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'Scrum, Sprint Planning, Backlog Management, Product Ownership, Team Facilitation',
      },
      {
        '@type': 'Occupation',
        name: 'Business Analyst',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'Requirements Engineering, Process Mapping, User Stories, ROI Modelling, Digital Transformation',
      },
      {
        '@type': 'Occupation',
        name: 'AI Automation Expert',
        occupationLocation: {
          '@type': 'Country',
          name: 'Egypt',
        },
        skills: 'Voice Agents, LiveKit Agents, OpenAI Realtime API, MCP, Tavus, Odoo 18',
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
      'Portfolio of Abo-Elmakarem Shohoud (كارم شهود) — Full-Stack Developer, DevOps Engineer, Scrum Master & AI Automation Expert at Ailigent.',
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
      'AI Automation Solutions — helping businesses cut operational costs by up to 70% through AI-powered SaaS products and process automation.',
    employee: {
      '@id': 'https://aboelmakarem.pro/#person',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cairo',
      addressCountry: 'Egypt',
    },
    areaServed: [
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
    knowsAbout: [
      'AI Automation',
      'Voice Agents',
      'Business Process Automation',
      'Digital Transformation',
      'DevOps',
      'Full-Stack Development',
      'ERP Systems',
      'Odoo 18',
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
    name: 'Abo-Elmakarem Shohoud — Full-Stack, DevOps & AI Automation',
    description:
      'Full-Stack Developer, DevOps Engineer, Scrum Master and AI Automation expert delivering SaaS products, voice AI agents, and Odoo ERP engagements across Egypt, UAE, and KSA.',
    provider: {
      '@type': 'Person',
      name: 'Abo-Elmakarem Shohoud',
    },
    areaServed: [
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Development & Automation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Full-Stack SaaS Development',
            description:
              'Production-grade web applications with TypeScript, React, Next.js, Node.js, Python, and FastAPI.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Voice AI Agent Development',
            description:
              'Custom voice AI agents using LiveKit Agents, OpenAI Realtime API, MCP, and Tavus for sales and customer support.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'DevOps & Cloud Infrastructure',
            description:
              'Docker containerization, GitHub Actions CI/CD, AWS EC2 and Railway deployments, Nginx reverse proxies on Linux.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Odoo 18 & ERP Engineering',
            description:
              'Custom Odoo 18 modules, NLP-powered ERP interfaces, and migrations for mid-market and enterprise clients.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Scrum Mastery & Agile Delivery',
            description:
              'Sprint planning, backlog grooming, team facilitation, and velocity tracking across cross-functional SaaS teams.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business Analysis & Digital Transformation',
            description:
              'Requirements workshops, process mapping, user-story authoring, and ROI modelling — consistently demonstrating 50–70% cost reduction.',
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
          text: 'My core stack: TypeScript, Python, React, Next.js, Node.js, FastAPI, and Flutter. For AI, LiveKit Agents, OpenAI Realtime API, MCP, and Tavus. For DevOps, Docker, GitHub Actions, AWS EC2, Railway, Linux, and Nginx. For ERP, Odoo 18. Every project gets the right stack for the job.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you work with international clients?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. I am based in Cairo, Egypt and I deliver engagements across Egypt, the UAE, and KSA — the three regions my Ailigent work primarily serves. Communication is in English or Arabic.',
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
