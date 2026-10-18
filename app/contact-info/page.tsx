import { Metadata } from 'next'
import Link from 'next/link'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'
import { ServiceBreadcrumbJsonLd } from '@/components/JsonLd'
import ContactList from './ContactList'

const URL = 'https://aboelmakarem.pro/contact-info'

export const metadata: Metadata = {
  title: { absolute: 'Contact Abo-Elmakarem Shohoud — AI Training & Software' },
  description:
    'Contact Abo-Elmakarem Shohoud, CTO at Ailigent and corporate AI trainer in Cairo: WhatsApp +20 100 886 7488, email, LinkedIn. Egypt, UAE & Saudi Arabia.',
  alternates: {
    canonical: URL,
  },
  openGraph: {
    url: URL,
    title: 'Contact Abo-Elmakarem Shohoud',
    description:
      'WhatsApp, email and LinkedIn for Abo-Elmakarem Shohoud: corporate AI training, digital transformation and custom software in Egypt, the UAE and Saudi Arabia.',
  },
}

// Adds contact details to the site-wide Person node (merged by @id).
const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${URL}#contact`,
  url: URL,
  name: 'Contact Abo-Elmakarem Shohoud',
  inLanguage: 'en',
  isPartOf: { '@id': 'https://aboelmakarem.pro/#website' },
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://aboelmakarem.pro/#person',
    name: 'Abo-Elmakarem Shohoud',
    email: 'mailto:info@aboelmakarem.pro',
    telephone: '+201008867488',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+201008867488',
      email: 'info@aboelmakarem.pro',
      url: 'https://wa.me/201008867488',
      availableLanguage: ['English', 'Arabic'],
      areaServed: ['EG', 'AE', 'SA'],
    },
  },
}

const HELP = [
  {
    title: 'Corporate AI training',
    href: '/ai-training',
    text: 'Hands-on ChatGPT Business and Claude workshops for executives and employees, on-site or online, in Arabic or English.',
  },
  {
    title: 'Digital transformation',
    href: '/digital-transformation',
    text: 'Process automation, AI workflow redesign and ERP modernization, from scoping the project to shipping the software.',
  },
  {
    title: 'Custom software & AI products',
    href: '/#projects',
    text: 'Full-stack web, mobile and desktop products, built the way Tornix.ai, Oravex.app and Costra were built and shipped.',
  },
]

export default function ContactInfoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <ServiceBreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://aboelmakarem.pro' },
          { name: 'Contact', url: URL },
        ]}
      />
      <SimplePageHeader title="Contact" />
      <main className="min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="tab-eyebrow mb-6 mx-auto block w-fit">contact</span>
          <h1 className="font-mono font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] text-center">
            Get in touch<span className="text-signal">.</span>
          </h1>
          <p className="text-ash text-center text-base md:text-lg font-mono leading-relaxed mb-12 max-w-xl mx-auto">
            I&apos;m Abo-Elmakarem Shohoud (Karem), CTO at Ailigent and an independent corporate AI trainer based in
            Cairo. WhatsApp is the fastest way to reach me; email and LinkedIn work too.
          </p>
          <ContactList />

          <section className="mt-20 font-mono">
            <h2 className="font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-6">What I can help with</h2>
            <div className="grid gap-4">
              {HELP.map((h) => (
                <Link
                  key={h.href}
                  href={h.href}
                  className="group block border border-wire bg-graphite hover:border-signal transition-colors p-5"
                >
                  <h3 className="text-paper font-bold text-base group-hover:text-signal transition-colors">
                    {h.title} <span aria-hidden="true">→</span>
                  </h3>
                  <p className="text-ash text-sm leading-relaxed mt-2">{h.text}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16 font-mono">
            <h2 className="font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-4">
              What to include in your message
            </h2>
            <ul className="text-ash text-sm md:text-base leading-relaxed space-y-2 list-disc ps-5">
              <li>Your company and your role.</li>
              <li>What you need: a training workshop, a transformation project or a software build.</li>
              <li>For training: the audience (executives or employees), group size and preferred dates.</li>
              <li>For projects: the problem you want solved and any deadline.</li>
            </ul>
            <p className="text-ash text-sm md:text-base leading-relaxed mt-6">
              I work with companies across Egypt, the United Arab Emirates and Saudi Arabia, on-site or online, in Arabic
              or English.
            </p>
          </section>

          <section lang="ar" dir="rtl" className="mt-16 font-rubik text-right border-t border-wire pt-10">
            <h2 className="font-bold text-2xl text-paper mb-4">تواصل مع ابوالمكارم شهود</h2>
            <p className="text-ash text-base leading-relaxed">
              ابوالمكارم شهود (كارم)، المدير التقني (CTO) في Ailigent ومدرّب ذكاء اصطناعي مستقل للشركات، من القاهرة.
              أسرع طريقة للتواصل هي واتساب على الرقم <span dir="ltr">+20 100 886 7488</span>، أو البريد
              الإلكتروني <span dir="ltr">info@aboelmakarem.pro</span>. أقدّم تدريب الذكاء الاصطناعي للمديرين والموظفين،
              واستشارات التحول الرقمي، وبناء البرمجيات المخصّصة للشركات في مصر والإمارات والسعودية.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
