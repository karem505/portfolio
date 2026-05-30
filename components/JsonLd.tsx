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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://aboelmakarem.pro/#webpage',
    },
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
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'wikidata',
      value: 'Q139799493',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cairo',
      addressCountry: 'EG',
    },
    sameAs: [
      'https://github.com/karem505',
      'https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244',
      'https://www.upwork.com/freelancers/~01ecbec4eb4f418011',
      'https://twitter.com/karem_shohud',
      'https://dev.to/karem505',
      'https://www.wikidata.org/wiki/Q139799493',
      // 'https://stackoverflow.com/users/<id>/<name>', // TODO: add after creating Stack Overflow user page
      // 'https://www.youtube.com/@<handle>', // TODO: add after creating YouTube channel
      // 'https://medium.com/@<handle>', // TODO: add after creating Medium profile
      // 'https://hashnode.com/@<handle>', // TODO: add after creating Hashnode profile
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
      addressCountry: 'EG',
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
            name: 'Digital Transformation Consulting',
            url: 'https://aboelmakarem.pro/digital-transformation',
            description:
              'Independent digital transformation consulting that ships working software: process automation, AI-powered workflow redesign, ERP and legacy modernization, and replacing spreadsheets with connected systems — designed and built by the same person, across Egypt, UAE, and KSA.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Professional AI Training',
            url: 'https://aboelmakarem.pro/ai-training',
            description:
              'Hands-on corporate AI training for employees and executives on ChatGPT, Claude, prompt engineering, and agentic automation — delivered on-site or live online, in Arabic or English, across Egypt, UAE, and KSA.',
          },
        },
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

// ── /ai-training ─────────────────────────────────────────────────────────────

export function AiTrainingServiceJsonLd({ ar = false }: { ar?: boolean }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://aboelmakarem.pro/ai-training#service',
    name: ar
      ? 'تدريب احترافي على الذكاء الاصطناعي للموظفين والمدراء التنفيذيين'
      : 'Professional AI Training for Employees & Executives',
    serviceType: 'Corporate AI Training',
    url: 'https://aboelmakarem.pro/ai-training',
    description: ar
      ? 'تدريب عملي على الذكاء الاصطناعي للموظفين والمدراء التنفيذيين في مصر والإمارات والسعودية — ChatGPT وClaude وهندسة الأوامر والأتمتة الذكية، مطبَّق على العمل اليومي. حضورياً أو أونلاين، بالعربية أو الإنجليزية، بلا برمجة.'
      : 'Hands-on corporate AI training for employees and executives across Egypt, the UAE, and Saudi Arabia. Practical, instructor-led upskilling on real tools — ChatGPT, Claude, prompt engineering, and agentic automation — applied to daily work. Delivered on-site or live online, in Arabic or English. No coding.',
    provider: {
      '@id': 'https://aboelmakarem.pro/#person',
    },
    areaServed: [
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
    availableLanguage: [
      { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    audience: {
      '@type': 'BusinessAudience',
      name: 'Companies and teams (SMEs to enterprises) in Egypt and the Gulf',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI Training Tracks',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Training for Employees',
            description:
              'Workflow-first training: prompt engineering, drafting and editing, summarizing documents, data analysis, faster customer replies, and automating repetitive tasks with ChatGPT and Claude.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Training for Executives & Leaders',
            description:
              'Leadership track: spotting high-value AI use cases, setting policy and governance, evaluating risk, and a working prompt set for research, communication, and decision support.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Prompt Engineering Workshop',
            description:
              'Writing clear instructions that get accurate, reliable results from ChatGPT and Claude, with a tested prompt library each participant keeps.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Generative AI & Agentic Automation Training',
            description:
              'Generative AI for writing, summarizing, and analysis, plus agentic AI and workflow automation for repetitive tasks — with responsible, safe use of AI on company data.',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function AiTrainingCourseJsonLd({ ar = false }: { ar?: boolean }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': 'https://aboelmakarem.pro/ai-training#course',
    name: ar
      ? 'تدريب احترافي على الذكاء الاصطناعي للموظفين والمدراء التنفيذيين'
      : 'Professional AI Training for Employees & Executives',
    description: ar
      ? 'تدريب عملي بقيادة مدرّب يُعلّم الموظفين والمدراء استخدام أدوات الذكاء الاصطناعي الحقيقية — ChatGPT وClaude وهندسة الأوامر والأتمتة الذكية — في مهامهم اليومية. سير عمل تطبيقي لا نظريات ولا برمجة. يُقدَّم بالعربية أو الإنجليزية في مصر والإمارات والسعودية.'
      : 'Hands-on, instructor-led corporate AI training that teaches employees and executives to use real AI tools — ChatGPT, Claude, prompt engineering, and agentic automation — on their actual daily tasks. Practical workflows, not theory or coding. Delivered in Arabic or English across Egypt, the UAE, and Saudi Arabia.',
    url: 'https://aboelmakarem.pro/ai-training',
    provider: {
      '@type': 'Person',
      '@id': 'https://aboelmakarem.pro/#person',
      name: 'Abo-Elmakarem Shohoud',
      url: 'https://aboelmakarem.pro',
    },
    about: [
      'Prompt Engineering',
      'Generative AI',
      'ChatGPT',
      'Claude',
      'Agentic Automation',
      'AI for Business',
    ],
    teaches: ar
      ? [
          'هندسة الأوامر مع ChatGPT وClaude',
          'الذكاء الاصطناعي التوليدي للصياغة والتحرير والتلخيص والتحليل',
          'الذكاء الاصطناعي الوكيلي وأتمتة سير العمل للمهام المتكررة',
          'الاستخدام المسؤول والآمن للذكاء الاصطناعي مع بيانات الشركة',
        ]
      : [
          'Prompt engineering with ChatGPT and Claude',
          'Generative AI for drafting, editing, summarizing, and analysis',
          'Agentic AI and workflow automation for repetitive tasks',
          'Responsible, safe use of AI with company data',
        ],
    inLanguage: ar ? ['ar', 'en'] : ['en', 'ar'],
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'Corporate employees and executives',
    },
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        name: 'On-Site Corporate AI Workshop',
        description:
          'On-site AI training at your offices across Egypt, the UAE, and Saudi Arabia.',
        courseMode: 'Onsite',
        courseWorkload: 'PT4H',
        inLanguage: ['en', 'ar'],
        location: {
          '@type': 'Place',
          name: 'Client offices across Egypt, the UAE, and Saudi Arabia',
          address: {
            '@type': 'PostalAddress',
            addressCountry: ['EG', 'AE', 'SA'],
          },
        },
        instructor: {
          '@type': 'Person',
          '@id': 'https://aboelmakarem.pro/#person',
          name: 'Abo-Elmakarem Shohoud',
        },
      },
      {
        '@type': 'CourseInstance',
        name: 'Live Online Corporate AI Workshop',
        description: 'Live online AI training for distributed and remote teams.',
        courseMode: 'Online',
        courseWorkload: 'PT4H',
        inLanguage: ['en', 'ar'],
        instructor: {
          '@type': 'Person',
          '@id': 'https://aboelmakarem.pro/#person',
          name: 'Abo-Elmakarem Shohoud',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function AiTrainingFaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://aboelmakarem.pro/ai-training#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is corporate AI training and who is it for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Corporate AI training is hands-on, instructor-led upskilling that teaches your staff to use real AI tools — ChatGPT, Claude, generative AI, and agentic automation — on their actual daily tasks. It is for both rank-and-file employees who want to work faster and executives who set AI strategy. Sessions focus on practical prompt engineering and live workflows, not abstract theory or coding.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer separate AI training for employees and for executives?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Employee tracks are workflow-first: writing, analysis, reporting, customer replies, and automating repetitive tasks with ChatGPT and Claude. Executive and leadership tracks focus on AI strategy, evaluating use cases, governance, and decision-making, plus a working set of prompts for research and communication. Both run as one coordinated program so the whole organization adopts AI consistently.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the training available on-site in the UAE, Saudi Arabia, and Egypt?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Karem delivers AI training on-site at your offices across the UAE (Dubai, Abu Dhabi), Saudi Arabia (Riyadh, Jeddah), and Egypt (Cairo), as well as live online for distributed teams. Sessions can be delivered in English or Arabic, with examples tailored to your industry and your team’s real, day-to-day work.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does an AI training workshop take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Formats range from a focused half-day workshop of three to four hours to multi-session programs spread over several weeks. A half-day session builds immediate momentum on two or three high-value tasks, while a multi-week program drives deeper, lasting adoption. The right length depends on team size, current AI skill level, and your goals, scoped with you before booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Will the training work for non-technical staff?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The training is built for non-technical teams — marketing, sales, HR, finance, operations, and admin. There is no coding. The core skill is prompt engineering: writing clear instructions that get accurate, useful results from AI. Everyone practises on their own real tasks during the session and leaves with a tested prompt library they can use immediately.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can the training be delivered in Arabic?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Karem is a native Arabic speaker based in Cairo and delivers AI training fully in Arabic or English for teams across Egypt and the Gulf. Arabic delivery removes the language barrier that slows AI adoption, lets staff practise prompts in Arabic and English, and aligns naturally with regional digital-transformation goals such as Saudi Vision 2030 and the UAE’s national AI agenda.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function AiTrainingBreadcrumbJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aboelmakarem.pro' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'AI Training',
        item: 'https://aboelmakarem.pro/ai-training',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── /digital-transformation ──────────────────────────────────────────────────

export function DigitalTransformationServiceJsonLd({ ar = false }: { ar?: boolean }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://aboelmakarem.pro/digital-transformation#service',
    name: ar ? 'استشارات التحول الرقمي للشركات' : 'Digital Transformation Consulting',
    serviceType: 'Digital Transformation Consulting',
    url: 'https://aboelmakarem.pro/digital-transformation',
    description: ar
      ? 'استشارات تحول رقمي مستقلة تُسلّم أنظمة تعمل فعلاً لا عروضاً تقديمية. يعيد ابوالمكارم شهود تصميم العمليات وأتمتتها — أتمتة العمليات، إعادة تصميم سير العمل بالذكاء الاصطناعي، تحديث أنظمة ERP والأنظمة القديمة، واستبدال ملفات الإكسل بأنظمة متصلة — ثم يبنيها. خدمة في مصر والإمارات والسعودية، بالعربية والإنجليزية.'
      : 'Independent digital transformation consulting that ships working software, not slide decks. Abo-Elmakarem Shohoud redesigns and automates operations — process automation, AI-powered workflow redesign, ERP and legacy modernization, and replacing spreadsheets with connected systems — then builds them. Serving companies across Egypt, the UAE, and Saudi Arabia, in Arabic and English.',
    provider: {
      '@id': 'https://aboelmakarem.pro/#person',
    },
    areaServed: [
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
    availableLanguage: [
      { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    audience: {
      '@type': 'BusinessAudience',
      name: 'SMEs and mid-market companies in Egypt and the Gulf',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Transformation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business Process Automation',
            description:
              'Automate data entry, approvals, hand-offs, and reporting — replacing repetitive, error-prone manual steps with connected software.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI-Powered Process Redesign',
            description:
              'Embed AI where it genuinely adds value: document handling, drafting, classification, and decision support inside the workflows your team already uses.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Spreadsheet-to-Software Modernization',
            description:
              'Replace fragile Excel and disconnected tools with one connected system that gives real-time visibility and a single source of truth.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'ERP & Legacy System Modernization',
            description:
              'Upgrade or replace aging or off-the-shelf ERP and legacy systems in phases, without halting day-to-day operations.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Internal Tools',
            description:
              'Dashboards and apps built around how your team actually works, delivered as working software by the same person who scopes them.',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function DigitalTransformationFaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://aboelmakarem.pro/digital-transformation#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is digital transformation, and how is it different from digitizing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Digital transformation redesigns how a business operates — its processes, data, and decisions — using software and AI, not just converting paper to digital files. Digitization turns one manual step digital; transformation rethinks the entire workflow so work moves faster, errors fall, and you gain real-time visibility. It usually replaces spreadsheets and siloed tools with one connected system.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does digital transformation consulting cost for an SME?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cost depends entirely on scope. A focused diagnostic and roadmap is a small, fixed engagement; automating one department or replacing a spreadsheet process is a contained project; a full operations overhaul costs more and runs in phases. Abo-Elmakarem Shohoud scopes work in stages so you fund one measurable outcome at a time rather than a large upfront budget. No single price fits every company.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I hire an independent consultant or a large agency?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An independent consultant gives you senior, hands-on attention, lower overhead, and direct accountability — the same person who plans the work also builds and ships it. Agencies add account managers, layers, and cost. For SMEs and mid-market firms wanting practical results fast, an experienced independent consultant who can both advise and engineer is usually faster and more cost-effective than an agency that only advises.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you automate manual or spreadsheet-based processes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Abo-Elmakarem Shohoud starts by mapping how the work really happens, then identifies the repetitive, error-prone steps. He replaces scattered spreadsheets with one connected system, automates the hand-offs, and adds AI where it genuinely helps — data entry, document handling, approvals, and reporting. The result is fewer manual steps, faster cycles, and real-time visibility, rolled out in phases so the team adapts smoothly.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does AI fit into digital transformation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI turns digital transformation from simple digitization into systems that can read, draft, classify, and support decisions. In practice it automates data entry, document processing, approvals, reporting, and customer responses — cutting manual effort and errors while speeding work up. Abo-Elmakarem Shohoud adds AI only where it creates real value for your business, not technology for its own sake, and builds it into the workflow your team already uses.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do you provide digital transformation services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Abo-Elmakarem Shohoud provides digital transformation consulting for companies across Egypt (Cairo), the UAE (Dubai, Abu Dhabi), and Saudi Arabia (Riyadh, Jeddah), delivered on-site or remotely. He works in both Arabic and English and aligns engagements with regional digital-economy goals such as Saudi Vision 2030, making him a practical fit for SMEs and mid-market firms across the Gulf and Egypt.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function DigitalTransformationBreadcrumbJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aboelmakarem.pro' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Digital Transformation',
        item: 'https://aboelmakarem.pro/digital-transformation',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Language-aware service FAQ + breadcrumb ──────────────────────────────────
// Fed the already-localized strings from each page's getContent(ar), so the
// structured data matches the visible Arabic/English copy. These supersede the
// hardcoded AiTrainingFaqJsonLd / DigitalTransformationFaqJsonLd / *Breadcrumb*
// components above (which are kept only for reference and are no longer rendered).

export function ServiceFaqJsonLd({ id, faq }: { id: string; faq: { q: string; a: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ServiceBreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
