import type { Metadata } from 'next'
import ServicePage, { ServicePageContent } from '@/components/ServicePage'
import {
  RemoteAiTrainingServiceJsonLd,
  ServiceFaqJsonLd,
  ServiceBreadcrumbJsonLd,
} from '@/components/JsonLd'

const BASE = 'https://aboelmakarem.pro/remote-ai-training'

// English-only landing page for teams in the US, UK, Canada and Australia.
const title = 'Remote Corporate AI Training for US, UK, Canadian & Australian Teams'
const description =
  'Live online ChatGPT and Claude training for teams in the US, UK, Canada and Australia. Fixed prices from USD 800 a day, scheduled in your time zone.'
const ogTitle = 'Remote Corporate AI Training for Your Team'
const ogImage = `https://aboelmakarem.pro/api/og?title=${encodeURIComponent(ogTitle)}&category=${encodeURIComponent('AI Training')}`

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: BASE,
    languages: {
      'en-US': BASE,
      'en-GB': BASE,
      'en-CA': BASE,
      'en-AU': BASE,
      'x-default': BASE,
    },
  },
  openGraph: {
    type: 'website',
    url: BASE,
    title,
    description,
    locale: 'en_US',
    alternateLocale: ['en_GB', 'en_CA', 'en_AU'],
    images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
}

const content: ServicePageContent = {
  eyebrow: 'Remote AI Training · US · UK · Canada · Australia',
  h1: 'Remote Corporate AI Training for Teams in the US, UK, Canada & Australia',
  subtitle:
    'Live, hands-on ChatGPT and Claude training for your employees and leadership team, delivered online by Abo-Elmakarem Shohoud, a CTO who builds AI products for a living. Fixed public prices, sessions scheduled inside your working hours, and every exercise built on your team’s real work.',
  ctaLabel: 'Book a free scoping call',
  ctaHref: '/contact-info',
  sections: [
    {
      h2: 'What is remote corporate AI training?',
      body: 'Remote corporate AI training is a live, instructor-led workshop run over Zoom, Teams or Google Meet that teaches a company’s staff to use AI tools such as ChatGPT and Claude on their actual daily tasks. It is not a recorded course: participants practise on their own documents, emails and data during the session, ask questions as they go, and leave with prompts and workflows they use the next morning. It suits distributed teams, hybrid offices and companies that want training without flying a consultant in.',
    },
    {
      h2: 'Who is this training for?',
      body: 'It is built for teams that already have access to an AI tool, or are about to roll one out, and need people to use it well and safely. Most requests come from HR and L&D leads, operations managers and founders of small and mid-sized companies who want practical results without a large consultancy budget.',
      bullets: [
        'Employees in marketing, sales, HR, finance, operations and admin: drafting, summarizing, analysis, reporting and customer replies.',
        'Executive and leadership teams: use-case selection, AI policy, data-safety rules and a working prompt set for decisions and communication.',
        'Companies rolling out ChatGPT Business, ChatGPT Enterprise or Claude Team who want adoption, not just licences.',
        'UK and North American companies that sell into the EU and need to show staff AI literacy (see below).',
      ],
    },
    {
      h2: 'Formats and prices',
      body: 'Prices are fixed and published so you can budget before the first call. All sessions are live online, recorded for your internal use on request, and include the prompt library and a written guide for every participant. On-site delivery is available; travel and accommodation are added at cost.',
      bullets: [
        'Half-day workshop (3–4 hours): from USD 500 (about GBP 400), for up to 15 participants.',
        'Full-day workshop (up to 7 hours, split into two sessions if you prefer): from USD 800 (about GBP 600 / CAD 1,100 / AUD 1,250).',
        'Executive one-to-one coaching: USD 100 per hour, booked in blocks of three.',
        'Multi-week programme (weekly sessions plus practice between them): quoted after a short scoping call, priced from the day rate above.',
        'Invoiced in USD; GBP, CAD or AUD on request.',
      ],
    },
    {
      h2: 'Scheduled inside your working hours',
      body: 'Karem is based in Cairo (UTC+2, UTC+3 in summer), which overlaps the whole UK working day and a useful part of the North American and Australian day. Sessions are booked in your time zone, not his.',
      bullets: [
        'United Kingdom and Ireland: any time in the working day.',
        'US and Canada, Eastern time: mornings to early afternoon.',
        'US and Canada, Pacific time: early-morning sessions, or a full day split into two shorter sessions.',
        'Australia (Sydney, Melbourne, Brisbane): afternoon sessions your time.',
      ],
    },
    {
      h2: 'What does a training day cover?',
      body: 'Every programme is scoped around three or four tasks that eat the most time in your team, so the content differs by company. The core is the same: how to give AI clear instructions, how to check what it produces, and how to fold it into work you already do. There is no coding.',
      bullets: [
        'Prompting that gets accurate, usable output: context, examples, constraints and review.',
        'ChatGPT and Claude side by side, and when each is the better tool.',
        'Writing, summarizing and analysing real documents, spreadsheets and meeting notes.',
        'Custom GPTs and Claude Projects for recurring tasks.',
        'Simple automation of repetitive, multi-step work.',
        'What is safe to put into an AI tool, and what is not, under your company’s plan and policy.',
      ],
    },
    {
      h2: 'Does my company need AI literacy training under the EU AI Act?',
      body: 'Possibly, if you sell or deploy AI-enabled products or services in the EU. Article 4 of the EU AI Act has applied since 2 February 2025. As amended by the Digital Omnibus on AI (consolidated text of 27 July 2026), it requires providers and deployers of AI systems to take measures to support the development of AI literacy of the staff who operate or use those systems, without having to guarantee any specific level for each individual. Through the Act’s territorial scope (Article 2), it can reach UK, US, Canadian and Australian companies that place AI systems on the EU market or whose AI output is used in the EU. A documented, role-based training programme is a practical way to show you have taken those measures. This is general information, not legal advice.',
    },
    {
      h2: 'What does a delivered programme look like?',
      body: 'The same method is used in Karem’s live, multi-lecture AI course and in his executive workshops. Each lecture ships with an illustrated, step-by-step PDF guide, and participants build and deploy real work during the sessions rather than watching slides. Executive workshops run on the AI workspace the company already pays for, using the kind of material leaders handle every day.',
      bullets: [
        'A written, illustrated guide for every session, so people can repeat the workflow alone.',
        'Exercises on your own material, prepared with you before the session.',
        'A prompt library each participant keeps.',
        'A short follow-up after 30 days to see what stuck and fix what did not.',
      ],
    },
    {
      h2: 'Why train with a Cairo-based practitioner?',
      body: 'Because the trainer also builds the technology. Karem is CTO at Ailigent, where he leads three AI SaaS products (Tornix.ai, Oravex.app and Costra.net), and he has worked as a full-stack developer, DevOps engineer, Scrum Master and business analyst. He teaches what holds up in production. Working from Cairo also means senior-level training at a day rate well below most local consultancies, with a schedule that fits your day.',
      bullets: [
        'Practitioner, not a course reseller: he ships AI features to paying clients.',
        'Fluent English, and native Arabic for teams that need it.',
        'You deal with the trainer directly, from scoping to follow-up.',
      ],
    },
    {
      h2: 'How booking works',
      body: 'Booking takes a short call and an email. You get a written scope and a fixed quote before you commit to anything.',
      ordered: true,
      bullets: [
        'Free 30-minute scoping call: your team, your tools, the tasks that take the most time.',
        'Written scope and fixed quote within two working days.',
        'Preparation: exercises built on your sample material, under an NDA if you need one.',
        'Live delivery, then a follow-up session or call after 30 days.',
      ],
    },
  ],
  faqHeading: 'Frequently asked questions',
  faq: [
    {
      q: 'Is the training live, or a recorded course?',
      a: 'Live. Every session is run in real time over Zoom, Microsoft Teams or Google Meet, with participants working on their own tasks and asking questions as they go. You can record the session for internal use, and every participant gets a written guide and prompt library to keep.',
    },
    {
      q: 'How much does remote AI training cost?',
      a: 'A half-day workshop starts at USD 500 (about GBP 400), a full day at USD 800 (about GBP 600, CAD 1,100 or AUD 1,250), and executive one-to-one coaching is USD 100 per hour. Multi-week programmes are quoted after a free scoping call. On-site delivery adds travel and accommodation at cost.',
    },
    {
      q: 'Which AI tools do you train on?',
      a: 'Mainly ChatGPT (including ChatGPT Business and Enterprise) and Claude (including Claude Team), because those are what most teams use. If your company standardizes on another assistant, such as Microsoft 365 Copilot, the same prompting and review methods apply and the exercises are adapted to it.',
    },
    {
      q: 'Can you work in our time zone?',
      a: 'Yes. Sessions are scheduled in your time zone. The UK working day overlaps fully with Cairo; US and Canadian Eastern mornings, Pacific early mornings and Australian afternoons all work. A full day can be split into two shorter sessions on consecutive days.',
    },
    {
      q: 'Is it safe to use our company data in the exercises?',
      a: 'Exercises use material you choose and approve in advance, and the workshop covers what is safe to share with an AI tool under your plan and policy. Sample data can be anonymised, and an NDA can be signed before any material is shared.',
    },
    {
      q: 'Can you come on-site?',
      a: 'Yes, for larger groups or executive offsites. On-site delivery is priced at the same day rate, with travel and accommodation added at cost and agreed in the quote.',
    },
  ],
  closingHeading: 'Book a free scoping call',
  closingBody:
    'Tell Karem your team size, the AI tools you use and the tasks that take the most time. You will get a written scope and a fixed quote within two working days.',
  closingButton: 'Get in touch',
  closingHref: '/contact-info',
  authorName: 'Abo-Elmakarem Shohoud',
  authorRole: 'CTO at Ailigent · Independent AI Consultant & Corporate AI Trainer',
  updatedLabel: 'Updated',
  updatedDate: 'October 2026',
}

export default function RemoteAiTrainingPage() {
  return (
    <ServicePage
      ar={false}
      hideLanguageSwitch
      basePath="/remote-ai-training"
      headerTitle="Remote AI Training"
      content={content}
      schema={
        <>
          <RemoteAiTrainingServiceJsonLd />
          <ServiceFaqJsonLd id={`${BASE}#faq`} faq={content.faq} />
          <ServiceBreadcrumbJsonLd
            items={[
              { name: 'Home', url: 'https://aboelmakarem.pro' },
              { name: 'AI Training', url: 'https://aboelmakarem.pro/ai-training' },
              { name: 'Remote AI Training', url: BASE },
            ]}
          />
        </>
      }
    />
  )
}
