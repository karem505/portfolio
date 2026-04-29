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
      'Portfolio of Abo-Elmakarem Shohoud (كارم شهود): Full-Stack Developer, DevOps Engineer, Scrum Master, and Business Analyst at Ailigent.',
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
      'AI Automation Solutions: full-stack engineering, DevOps, and AI-powered SaaS delivery for clients across Egypt, UAE, and KSA.',
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
    name: 'Abo-Elmakarem Shohoud: Full-Stack, DevOps, and AI Automation',
    description:
      'Full-Stack Developer at Ailigent shipping production SaaS (Tornix.ai, Oravex.app, Costra) on TypeScript, React, Next.js, Python, and FastAPI. Concurrent DevOps Engineer and Scrum Master across all three products, with bilingual EN/AR delivery across Egypt, UAE, and KSA.',
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
              'Production web applications built on TypeScript, React, Next.js, Node.js, Python, and FastAPI, with Postgres, REST APIs, and Arabic RTL support.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Voice AI Agent Development',
            description:
              'Voice agents engineered on LiveKit Agents, OpenAI Realtime API, MCP, and Tavus, integrated into existing product flows.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'DevOps & Cloud Infrastructure',
            description:
              'Docker containerization, GitHub Actions CI/CD, AWS EC2 and Railway deployments, and Nginx reverse proxies on Linux.',
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
            name: 'Business Analysis & Requirements Engineering',
            description:
              'Requirements workshops, process mapping, user-story authoring, and translating stakeholder needs into sprint-ready technical specifications.',
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
        name: "What's your primary stack?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TypeScript, React, and Next.js on the frontend; Python (FastAPI) and Node.js on the backend; Postgres and Odoo 18 where ERP fits. Voice AI work runs on LiveKit Agents, OpenAI Realtime, MCP, and Tavus.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you ship and run three SaaS products concurrently?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Each product (Tornix.ai, Oravex.app, Costra) has its own repo, CI pipeline, and Docker image; I run sprint cadence as Scrum Master and own deployments end to end. Shared infra patterns and reusable modules keep the operating cost of three products closer to one.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you work in Arabic? Bilingual delivery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Arabic is a first-class surface in every product I build, with proper RTL, native typography, and Arabic-fluent stakeholder communication. I also write technical content in both English and Arabic.',
        },
      },
      {
        '@type': 'Question',
        name: "What's your DevOps setup?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Docker for everything, GitHub Actions for CI/CD, AWS EC2 and Railway for hosting, Nginx as the reverse proxy, and Linux on the metal. Observability via uptime checks, log shipping, and alerting on the boring-but-critical signals.',
        },
      },
      {
        '@type': 'Question',
        name: 'Open to full-time roles, contracts, or both?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Both. I take full-time roles, contract engagements, and fixed-scope projects, with a preference for work where I can own engineering and delivery end to end. Remote-friendly across CET/GMT-adjacent timezones.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can recruiters or hiring managers reach you fastest?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LinkedIn DM or the contact form on this site. I respond within 24 hours and read every message; paste a role brief or scope and I will reply with a fit assessment, not a templated thank-you.',
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
