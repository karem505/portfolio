import Link from 'next/link'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'

export interface ServiceSection {
  h2: string
  body: string
  bullets?: string[]
  ordered?: boolean
}

export interface ServiceFaq {
  q: string
  a: string
}

export interface ServicePageContent {
  eyebrow: string
  h1: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  sections: ServiceSection[]
  faqHeading: string
  faq: ServiceFaq[]
  closingHeading: string
  closingBody: string
  closingButton: string
  closingHref: string
  // E-E-A-T: visible author byline + freshness (optional)
  authorName?: string
  authorRole?: string
  updatedLabel?: string
  updatedDate?: string
}

interface ServicePageProps {
  ar: boolean
  headerTitle: string
  basePath: string
  content: ServicePageContent
  schema?: React.ReactNode
}

/**
 * Shared, server-rendered layout for the service landing pages
 * (/ai-training, /digital-transformation). The page is rendered fully on the
 * server in the language selected by `?lang=ar`, so each language variant is
 * independently crawlable and indexable.
 */
export default function ServicePage({
  ar,
  headerTitle,
  basePath,
  content,
  schema,
}: ServicePageProps) {
  const font = ar ? 'font-rubik' : 'font-mono'
  const arrow = ar ? '←' : '→'

  return (
    <>
      {schema}
      <SimplePageHeader title={headerTitle} ar={ar} />

      <main
        lang={ar ? 'ar' : 'en'}
        dir={ar ? 'rtl' : 'ltr'}
        className="min-h-screen px-6 pb-24 pt-12"
      >
        <div className="max-w-3xl mx-auto">
          {/* Language switch */}
          <div className={`mb-10 flex items-center gap-3 text-xs font-mono ${ar ? 'justify-start' : 'justify-end'}`}>
            <Link
              href={basePath}
              className={!ar ? 'text-signal' : 'text-ash hover:text-paper transition-colors'}
              hrefLang="en"
            >
              EN
            </Link>
            <span className="text-wire" aria-hidden="true">/</span>
            <Link
              href={`${basePath}?lang=ar`}
              className={ar ? 'text-signal font-rubik' : 'text-ash hover:text-paper transition-colors font-rubik'}
              hrefLang="ar"
            >
              ع
            </Link>
          </div>

          {/* Hero */}
          <header className={ar ? 'text-right' : 'text-left'}>
            <span className="tab-eyebrow mb-6">{content.eyebrow}</span>
            <h1 className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[1.05] ${font}`}>
              {content.h1}
              <span className="text-signal">.</span>
            </h1>
            <p className={`text-ash text-base md:text-lg leading-relaxed mb-6 ${font}`}>
              {content.subtitle}
            </p>
            {content.authorName && (
              <div className={`mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-wire ${font}`}>
                <span>{ar ? 'بقلم' : 'By'}</span>
                <Link href="/" className="text-ash hover:text-paper transition-colors">
                  {content.authorName}
                </Link>
                {content.authorRole && <span>— {content.authorRole}</span>}
                {content.updatedDate && <span aria-hidden="true">·</span>}
                {content.updatedDate && (
                  <span>
                    {content.updatedLabel} {content.updatedDate}
                  </span>
                )}
              </div>
            )}
            <Link
              href={content.ctaHref}
              className={`inline-flex items-center gap-2 px-5 py-3 border border-paper bg-paper text-ink hover:bg-signal hover:border-signal hover:text-paper transition-colors duration-150 text-sm font-medium ${font}`}
            >
              <span>{content.ctaLabel}</span>
              <span aria-hidden="true">{arrow}</span>
            </Link>
          </header>

          {/* Sections */}
          <div className={`mt-20 flex flex-col gap-16 ${ar ? 'text-right' : 'text-left'}`}>
            {content.sections.map((section, i) => (
              <section key={i}>
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-signal tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper leading-tight ${font}`}>
                    {section.h2}
                  </h2>
                </div>
                <p className={`text-ash text-base leading-relaxed ${font}`}>
                  {section.body}
                </p>
                {section.bullets && section.bullets.length > 0 && (
                  section.ordered ? (
                    <ol className={`mt-5 flex flex-col gap-2.5 ${font}`}>
                      {section.bullets.map((b, bi) => (
                        <li key={bi} className="flex gap-3 text-ash text-sm leading-relaxed">
                          <span className="text-signal tabular-nums shrink-0">{String(bi + 1).padStart(2, '0')}</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className={`mt-5 flex flex-col gap-2.5 ${font}`}>
                      {section.bullets.map((b, bi) => (
                        <li key={bi} className="flex gap-3 text-ash text-sm leading-relaxed">
                          <span className="text-signal shrink-0" aria-hidden="true">▍</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </section>
            ))}
          </div>

          {/* FAQ */}
          <section className={`mt-24 ${ar ? 'text-right' : 'text-left'}`}>
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font}`}>
              {content.faqHeading}
            </h2>
            <div className="flex flex-col divide-y divide-wire border-y border-wire">
              {content.faq.map((item, i) => (
                <div key={i} className="py-6">
                  <h3 className={`font-bold text-base md:text-lg text-paper mb-2 ${font}`}>
                    {item.q}
                  </h3>
                  <p className={`text-ash text-sm md:text-base leading-relaxed ${font}`}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Closing CTA */}
          <section className="mt-24">
            <div className={`border border-wire bg-graphite p-8 md:p-10 ${ar ? 'text-right' : 'text-left'}`}>
              <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-4 ${font}`}>
                {content.closingHeading}
              </h2>
              <p className={`text-ash text-base leading-relaxed mb-8 ${font}`}>
                {content.closingBody}
              </p>
              <Link
                href={content.closingHref}
                className={`inline-flex items-center gap-2 px-5 py-3 border border-paper bg-paper text-ink hover:bg-signal hover:border-signal hover:text-paper transition-colors duration-150 text-sm font-medium ${font}`}
              >
                <span>{content.closingButton}</span>
                <span aria-hidden="true">{arrow}</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
