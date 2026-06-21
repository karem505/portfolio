import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FaAndroid } from 'react-icons/fa'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'
import { ServiceBreadcrumbJsonLd } from '@/components/JsonLd'
import { getLatestApk } from '@/lib/latestApk'

const BASE = 'https://aboelmakarem.pro/apps'

// ISR: keep the resolved app version(s) fresh without a redeploy — re-render
// every 5 min so a newly pushed APK shows up promptly.
export const revalidate = 300

type SP = { searchParams: { lang?: string } }

// App registry — append an entry here to list a future app. Each entry is
// self-contained; `versioned` opts a card into the live APK version badge.
type AppEntry = {
  id: string
  name: { en: string; ar: string }
  tagline: { en: string; ar: string }
  platform: string
  href: string
  icon: string
  highlights: { en: string[]; ar: string[] }
  versioned?: boolean
}

const APPS: AppEntry[] = [
  {
    id: 'pharmacy-manual',
    name: { en: 'Pharmacy Manual', ar: 'دليل الأدوية الإكلينيكي' },
    tagline: {
      en: 'Offline Egyptian drug index & price checker',
      ar: 'دليل أدوية مصري ومُدقّق أسعار — بدون إنترنت',
    },
    platform: 'Android',
    href: '/apps/pharmacy-manual',
    icon: '/apps/pharmacy-manual/icon.png',
    highlights: {
      en: ['24,868+ medicines', 'Works offline', 'Free · no ads'],
      ar: ['أكثر من 24,868 دواءً', 'يعمل بدون إنترنت', 'مجاني · بلا إعلانات'],
    },
    versioned: true,
  },
]

export function generateMetadata({ searchParams }: SP): Metadata {
  const ar = searchParams?.lang === 'ar'
  const title = ar
    ? 'تطبيقات ابوالمكارم شهود — تنزيلات مجانية'
    : 'Apps by Abo-Elmakarem Shohoud — Free Downloads'
  const description = ar
    ? 'تطبيقات مجانية قابلة للتثبيت من تطوير ابوالمكارم شهود (كارم). نزّلها مباشرةً — بدءاً من دليل الأدوية الإكلينيكي، دليل أدوية مصري ومُدقّق أسعار يعمل بدون إنترنت لأندرويد.'
    : 'Free, installable apps built by Abo-Elmakarem Shohoud (Karem). Download them directly — starting with Pharmacy Manual, an offline Egyptian drug index & price checker for Android.'
  const url = ar ? `${BASE}?lang=ar` : BASE
  const ogTitle = ar ? 'تطبيقات ابوالمكارم شهود' : 'Apps by Abo-Elmakarem Shohoud'
  const ogImage = `https://aboelmakarem.pro/api/og?title=${encodeURIComponent(ogTitle)}&category=${encodeURIComponent(ar ? 'تطبيقات' : 'Apps')}${ar ? '&lang=ar' : ''}`

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'en-US': BASE, 'ar-EG': `${BASE}?lang=ar`, 'x-default': BASE },
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      locale: ar ? 'ar_EG' : 'en_US',
      alternateLocale: ar ? ['en_US'] : ['ar_EG'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export default async function AppsPage({ searchParams }: SP) {
  const ar = searchParams?.lang === 'ar'
  const t = (en: string, arabic: string) => (ar ? arabic : en)
  const font = ar ? 'font-rubik' : 'font-mono'

  // Only the versioned app(s) need a live lookup. With one app this is a single
  // cached call; future versioned apps would resolve their own source.
  const apk = await getLatestApk()
  const versionFor = (a: AppEntry) => (a.versioned ? `v${apk.version}` : null)

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE}#apps`,
    name: ar ? 'تطبيقات ابوالمكارم شهود' : 'Apps by Abo-Elmakarem Shohoud',
    description: ar
      ? 'تطبيقات مجانية قابلة للتثبيت من تطوير ابوالمكارم شهود.'
      : 'Free, installable apps built by Abo-Elmakarem Shohoud.',
    url: ar ? `${BASE}?lang=ar` : BASE,
    inLanguage: ar ? 'ar' : 'en',
    isPartOf: { '@id': 'https://aboelmakarem.pro/#website' },
    about: { '@id': 'https://aboelmakarem.pro/#person' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: APPS.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://aboelmakarem.pro${a.href}`,
        name: ar ? a.name.ar : a.name.en,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ServiceBreadcrumbJsonLd
        items={[
          { name: t('Home', 'الرئيسية'), url: 'https://aboelmakarem.pro' },
          { name: t('Apps', 'التطبيقات'), url: BASE },
        ]}
      />

      <SimplePageHeader title={t('Apps', 'التطبيقات')} ar={ar} />

      <main lang={ar ? 'ar' : 'en'} dir={ar ? 'rtl' : 'ltr'} className="min-h-screen px-6 pb-24 pt-12">
        <div className="max-w-5xl mx-auto">
          {/* Language switch */}
          <div className={`mb-10 flex items-center gap-3 text-xs font-mono ${ar ? 'justify-start' : 'justify-end'}`}>
            <Link href="/apps" hrefLang="en" className={!ar ? 'text-signal' : 'text-ash hover:text-paper transition-colors'}>EN</Link>
            <span className="text-wire" aria-hidden="true">/</span>
            <Link href="/apps?lang=ar" hrefLang="ar" className={ar ? 'text-signal font-rubik' : 'text-ash hover:text-paper transition-colors font-rubik'}>ع</Link>
          </div>

          {/* Header */}
          <header className={ar ? 'text-right' : 'text-left'}>
            <span className="tab-eyebrow mb-6">{t('Apps · Free Downloads', 'التطبيقات · تنزيلات مجانية')}</span>
            <h1 className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[1.05] ${font}`}>
              {t('Apps', 'التطبيقات')}<span className="text-signal">.</span>
            </h1>
            <p className={`text-ash text-base md:text-lg leading-relaxed max-w-2xl ${ar ? 'ml-auto' : ''} ${font}`}>
              {t(
                'Free, installable apps I build and ship — download them directly, no app store required.',
                'تطبيقات مجانية قابلة للتثبيت أبنيها وأُطلقها — نزّلها مباشرةً، دون الحاجة لمتجر تطبيقات.'
              )}
            </p>
          </header>

          {/* App grid */}
          <section className="mt-14 grid sm:grid-cols-2 gap-5">
            {APPS.map((app) => {
              const version = versionFor(app)
              return (
                <Link
                  key={app.id}
                  href={app.href}
                  className={`group block border border-wire bg-graphite hover:border-signal transition-colors p-6 ${ar ? 'text-right' : ''}`}
                >
                  <div className={`flex items-start gap-4 ${ar ? 'flex-row-reverse' : ''}`}>
                    <Image
                      src={app.icon}
                      alt={t(`${app.name.en} app icon`, `أيقونة تطبيق ${app.name.ar}`)}
                      width={512}
                      height={512}
                      className="w-14 h-14 border border-wire shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className={`font-extrabold tracking-[-0.03em] text-xl text-paper group-hover:text-signal transition-colors leading-tight ${font}`}>
                        {ar ? app.name.ar : app.name.en}
                      </h2>
                      <p className={`text-ash text-sm mt-1 ${font}`}>{ar ? app.tagline.ar : app.tagline.en}</p>
                    </div>
                  </div>

                  <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ash ${font} ${ar ? 'justify-end' : ''}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <FaAndroid className="text-moss" /> {app.platform}
                    </span>
                    {version && (
                      <>
                        <span className="text-wire" aria-hidden="true">·</span>
                        <span className="tabular-nums">{version}</span>
                      </>
                    )}
                  </div>

                  <div className={`mt-4 flex flex-wrap gap-1.5 ${ar ? 'justify-end' : ''}`}>
                    {(ar ? app.highlights.ar : app.highlights.en).map((h) => (
                      <span key={h} className="tag-chip">{h}</span>
                    ))}
                  </div>

                  <span className={`mt-5 inline-flex items-center gap-2 text-sm text-signal ${font}`}>
                    {t('View & download', 'عرض وتحميل')}
                    <span aria-hidden="true">{ar ? '←' : '→'}</span>
                  </span>
                </Link>
              )
            })}
          </section>

          {/* Closing */}
          <div className={`mt-16 text-xs ${font}`}>
            <Link href="/" className="text-ash hover:text-signal transition-colors">
              {t('← Back to portfolio', 'العودة إلى الموقع →')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
