import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FaDownload, FaGithub, FaAndroid, FaShieldAlt } from 'react-icons/fa'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'
import {
  PharmacyManualAppJsonLd,
  ServiceFaqJsonLd,
  ServiceBreadcrumbJsonLd,
} from '@/components/JsonLd'
import { getLatestApk } from '@/lib/latestApk'
import { DemoVideo, CopyButton } from './PharmacyManualClient'

const BASE = 'https://aboelmakarem.pro/apps/pharmacy-manual'
const DOWNLOAD = '/api/download/pharmacy-manual'
const REPO = 'https://github.com/karem505/pharmacy-manual-apk'
const DATA_REPO = 'https://github.com/karem505/egyptian-drug-database'

// Version-specific integrity values published in the repo README (v0.2.2).
const APK_SHA256 = 'da03c38b3690324f439833cb121d4900181a91827ab1065e0d9afbeb82df0181'
const CERT_SHA256 = '98a8ac45aa15f1c068ff8c7a6602592b0472be353bfb22158c43dd53f05b9403'

// ISR: re-resolve the latest APK + re-render hourly without a redeploy.
export const revalidate = 3600

type SP = { searchParams: { lang?: string } }

const SHOTS = [
  { file: '01.jpg', en: 'Bilingual search across 24,868+ medicines with prices', ar: 'بحث ثنائي اللغة عبر أكثر من 24,868 دواءً مع الأسعار' },
  { file: '02.jpg', en: 'Drug detail with cheaper same-ingredient alternatives', ar: 'تفاصيل الدواء مع بدائل أرخص بنفس المادة الفعّالة' },
  { file: '03.jpg', en: 'Drug detail with a class-coded chip', ar: 'تفاصيل الدواء مع وسم لوني حسب التصنيف' },
  { file: '04.jpg', en: 'Drug detail view', ar: 'عرض تفاصيل الدواء' },
  { file: '05.jpg', en: 'Browse by therapeutic class', ar: 'تصفّح حسب التصنيف الدوائي' },
  { file: '06.jpg', en: 'Browse by manufacturer and route', ar: 'تصفّح حسب الشركة وطريقة الإعطاء' },
]

export async function generateMetadata({ searchParams }: SP): Promise<Metadata> {
  const ar = searchParams?.lang === 'ar'
  const title = ar
    ? 'تحميل تطبيق دليل الأدوية الإكلينيكي — دليل أدوية مصر بدون إنترنت (أندرويد)'
    : 'Download Pharmacy Manual — Offline Egyptian Drug Index (Android)'
  const description = ar
    ? 'حمّل تطبيق دليل الأدوية الإكلينيكي لأندرويد: دليل أدوية مصري يعمل بدون إنترنت ومُدقّق أسعار، بحث ثنائي اللغة عبر أكثر من 24,868 دواءً ومقارنة أسعار البدائل. مجاني وبدون إعلانات.'
    : 'Download Pharmacy Manual for Android: an offline Egyptian drug index and price checker with bilingual search across 24,868+ medicines and same-ingredient price comparison. Free, no ads.'
  const url = ar ? `${BASE}?lang=ar` : BASE
  const ogTitle = ar ? 'دليل الأدوية الإكلينيكي' : 'Pharmacy Manual — Android App'
  const ogImage = `https://aboelmakarem.pro/api/og?title=${encodeURIComponent(ogTitle)}&category=${encodeURIComponent(ar ? 'تطبيق أندرويد' : 'Android App')}${ar ? '&lang=ar' : ''}`

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

export default async function PharmacyManualPage({ searchParams }: SP) {
  const ar = searchParams?.lang === 'ar'
  const t = (en: string, arabic: string) => (ar ? arabic : en)
  const font = ar ? 'font-rubik' : 'font-mono'
  const apk = await getLatestApk()

  const stats = [
    { n: '24,868+', l: t('medicines', 'دواء') },
    { n: t('Bilingual', 'لغتان'), l: t('AR + EN search', 'بحث عربي وإنجليزي') },
    { n: t('Price', 'الأسعار'), l: t('cheapest equivalent', 'أرخص بديل مكافئ') },
    { n: t('Offline', 'بدون نت'), l: t('no internet needed', 'لا يحتاج إنترنت') },
  ]

  const features = [
    { en: 'Bilingual, diacritic-insensitive search', enD: 'Search across 24,868+ medicines by Arabic alias, English name, or active ingredient — diacritics ignored.', a: 'بحث ثنائي اللغة غير حسّاس للتشكيل', aD: 'ابحث في أكثر من 24,868 دواءً بالاسم العربي أو الإنجليزي أو المادة الفعّالة — بدون حساسية للتشكيل.' },
    { en: 'Cheapest same-ingredient comparison', enD: 'Every drug detail badges cheaper equivalents with the same active ingredient, so you can find a lower-priced option.', a: 'مقارنة أرخص بديل بنفس المادة', aD: 'تُبرز صفحة كل دواء البدائل الأرخص بنفس المادة الفعّالة، لتجد خياراً أقل سعراً.' },
    { en: 'Browse by class, manufacturer, route', enD: 'Drill into therapeutic classes (with live counts), manufacturers, and routes of administration.', a: 'تصفّح حسب التصنيف والشركة والإعطاء', aD: 'تنقّل بين التصنيفات الدوائية (بأعداد حيّة) والشركات وطرق الإعطاء.' },
    { en: 'Light & dark, Arabic-first RTL', enD: 'A calm clinical design in both light and dark themes, fully right-to-left throughout.', a: 'فاتح وداكن، عربي أولاً (RTL)', aD: 'تصميم إكلينيكي هادئ بوضعين فاتح وداكن، بدعم كامل للكتابة من اليمين لليسار.' },
    { en: 'Self-updating database', enD: 'An embedded database refreshes itself from the source data when it changes — no app update needed.', a: 'قاعدة بيانات تُحدّث نفسها', aD: 'قاعدة بيانات مدمجة تُحدّث نفسها من المصدر عند تغيّره — دون تحديث التطبيق.' },
    { en: 'Works fully offline', enD: 'After install everything works without a connection — the whole index lives on your device.', a: 'يعمل بالكامل بدون إنترنت', aD: 'بعد التثبيت يعمل كل شيء دون اتصال — الفهرس كامل على جهازك.' },
  ]

  const changelog = [
    { v: '0.2.2', items: ar
      ? ['موقّع الآن بمفتاح إصدار رسمي بدل مفتاح التصحيح — هوية ثابتة وقابلة للتحقق.', 'ملاحظة لمرة واحدة: لتغيّر مفتاح التوقيع، من كان لديه إصدار أقدم عليه إزالته مرة قبل التثبيت.']
      : ['Now signed with a proper release key instead of the Android debug key — a stable, tamper-evident identity.', 'One-time note: because the signing key changed, anyone on an earlier build must uninstall it once before installing.'] },
    { v: '0.2.1', items: ar
      ? ['إصلاح زر «التحقق من التحديثات» — كانت أذونات الإنترنت ناقصة في إصدارات الإطلاق.']
      : ['Fixes the "check for updates" button — release builds were missing the INTERNET permission.'] },
    { v: '0.2.0', items: ar
      ? ['إعادة تصميم بصرية كاملة بطابع «الدليل الميداني الإكلينيكي».', 'أيقونة جديدة واسم عربي للتطبيق (دليل الأدوية).', 'تصفّح حسب التصنيف والشركة وطريقة الإعطاء، ومُدقّق أسعار أوضح.']
      : ['A complete "Clinical Field Guide" visual redesign.', 'New branded app icon and an Arabic app name (دليل الأدوية).', 'Browse by class, manufacturer, and route, plus a clearer price checker.'] },
  ]

  const installSteps = ar
    ? ['نزّل ملف الـ APK من زر التحميل بالأعلى.', 'فعّل «التثبيت من مصادر غير معروفة» في إعدادات أندرويد.', 'افتح الملف الذي نزّلته وأكمل التثبيت.', 'إن كان لديك إصدار أقدم مثبّت، أزله أولاً (تغيّر مفتاح التوقيع).']
    : ['Download the APK from the button above.', 'Enable "install from unknown sources" in your Android settings.', 'Open the downloaded file and complete the install.', 'If an older build is installed, uninstall it first (the signing key changed).']

  const faq = [
    { q: t('Is the app free?', 'هل التطبيق مجاني؟'), a: t('Yes — Pharmacy Manual is completely free, with no ads and no in-app purchases.', 'نعم — دليل الأدوية مجاني تماماً، بلا إعلانات وبلا مشتريات داخل التطبيق.') },
    { q: t('Does it need an internet connection?', 'هل يحتاج إلى إنترنت؟'), a: t('No. The entire drug index ships inside the app and works fully offline. It only goes online to refresh its database when the source data changes.', 'لا. الفهرس كامل داخل التطبيق ويعمل بدون إنترنت. يتصل فقط لتحديث قاعدة بياناته عند تغيّر بيانات المصدر.') },
    { q: t('Which Android versions are supported?', 'ما إصدارات أندرويد المدعومة؟'), a: t('Android 5.0 and newer.', 'أندرويد 5.0 وأحدث.') },
    { q: t('Is it safe? Why does Android warn about "unknown sources"?', 'هل هو آمن؟ ولماذا يحذّر أندرويد من «مصادر غير معروفة»؟'), a: t('The app is distributed directly as an APK rather than through the Play Store, so Android shows the standard sideload warning. The build is signed with a release key, and its SHA-256 fingerprints are published below and in the repository so you can verify your download.', 'يُوزَّع التطبيق مباشرةً كملف APK وليس عبر متجر Play، لذا يظهر تحذير التثبيت المعتاد. الإصدار موقّع بمفتاح رسمي، وبصمات SHA-256 منشورة بالأسفل وفي المستودع للتحقق من تنزيلك.') },
    { q: t('Where does the drug data come from?', 'من أين تأتي بيانات الأدوية؟'), a: t('From the open egyptian-drug-database, released under CC0. Prices and availability change constantly — always verify with the Egyptian Drug Authority and a licensed pharmacist.', 'من قاعدة بيانات الأدوية المصرية المفتوحة، المنشورة برخصة CC0. الأسعار والتوافر يتغيّران باستمرار — تحقّق دائماً من هيئة الدواء المصرية ومن صيدلي مرخّص.') },
    { q: t('Is it on the Google Play Store?', 'هل هو متوفر على متجر Google Play؟'), a: t('Not currently — it is distributed here as a direct APK download. This page always serves the latest version.', 'ليس حالياً — يُوزَّع هنا كتنزيل APK مباشر. تقدّم هذه الصفحة أحدث إصدار دائماً.') },
  ]

  const screenshotUrls = SHOTS.map((s) => `https://aboelmakarem.pro/apps/pharmacy-manual/${s.file}`)

  return (
    <>
      <PharmacyManualAppJsonLd
        ar={ar}
        version={apk.version}
        sizeBytes={apk.sizeBytes}
        downloadUrl={apk.downloadUrl}
        screenshots={screenshotUrls}
      />
      <ServiceFaqJsonLd id={`${BASE}#faq`} faq={faq} />
      <ServiceBreadcrumbJsonLd
        items={[
          { name: t('Home', 'الرئيسية'), url: 'https://aboelmakarem.pro' },
          { name: t('Pharmacy Manual', 'دليل الأدوية الإكلينيكي'), url: BASE },
        ]}
      />

      <SimplePageHeader title={t('Pharmacy Manual', 'دليل الأدوية')} ar={ar} />

      <main lang={ar ? 'ar' : 'en'} dir={ar ? 'rtl' : 'ltr'} className="min-h-screen px-6 pb-24 pt-12">
        <div className="max-w-5xl mx-auto">
          {/* Language switch */}
          <div className={`mb-10 flex items-center gap-3 text-xs font-mono ${ar ? 'justify-start' : 'justify-end'}`}>
            <Link href="/apps/pharmacy-manual" hrefLang="en" className={!ar ? 'text-signal' : 'text-ash hover:text-paper transition-colors'}>EN</Link>
            <span className="text-wire" aria-hidden="true">/</span>
            <Link href="/apps/pharmacy-manual?lang=ar" hrefLang="ar" className={ar ? 'text-signal font-rubik' : 'text-ash hover:text-paper transition-colors font-rubik'}>ع</Link>
          </div>

          {/* ── Hero (split) ── */}
          <section className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-12 items-center">
            <div className={ar ? 'text-right' : 'text-left'}>
              <span className="tab-eyebrow mb-6">{t('Android App · Free Download', 'تطبيق أندرويد · تحميل مجاني')}</span>
              <div className={`flex items-center gap-4 mb-5 ${ar ? 'flex-row-reverse' : ''}`}>
                <Image src="/apps/pharmacy-manual/icon.png" alt={t('Pharmacy Manual app icon', 'أيقونة تطبيق دليل الأدوية')} width={512} height={512} className="w-16 h-16 border border-wire" priority />
                <div className={ar ? 'text-right' : 'text-left'}>
                  <h1 className={`font-extrabold tracking-[-0.04em] text-3xl md:text-4xl text-paper leading-none ${font}`}>
                    {t('Pharmacy Manual', 'دليل الأدوية الإكلينيكي')}<span className="text-signal">.</span>
                  </h1>
                  <p className={`text-ash text-sm mt-2 ${font}`}>{t('Offline Egyptian drug index & price checker', 'دليل أدوية مصري ومُدقّق أسعار — بدون إنترنت')}</p>
                </div>
              </div>

              <a href={DOWNLOAD} className={`inline-flex items-center gap-3 px-6 py-4 bg-signal text-ink hover:bg-signal-deep transition-colors duration-150 text-base font-bold ${font}`}>
                <FaDownload />
                <span>{t(`Download v${apk.version}`, `تحميل الإصدار ${apk.version}`)}</span>
                <span className="opacity-80">· {apk.sizeLabel}</span>
              </a>

              <div className={`mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ash ${font} ${ar ? 'justify-end' : ''}`}>
                <span className="inline-flex items-center gap-1.5"><FaAndroid className="text-moss" /> {t('Android 5.0+', 'أندرويد 5.0+')}</span>
                <span>· {t('Free · No ads', 'مجاني · بلا إعلانات')}</span>
                <span className="inline-flex items-center gap-1.5"><FaShieldAlt className="text-signal" /> {t('Release-signed · SHA-256 verified', 'موقّع رسمياً · تحقق SHA-256')}</span>
              </div>

              <div className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs ${font} ${ar ? 'justify-end' : ''}`}>
                <a href={REPO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ash hover:text-signal transition-colors"><FaGithub /> {t('Source / releases on GitHub', 'المصدر / الإصدارات على GitHub')}</a>
                <a href={DATA_REPO} target="_blank" rel="noopener noreferrer" className="text-ash hover:text-signal transition-colors">{t('Open drug data (CC0)', 'بيانات الأدوية المفتوحة (CC0)')}</a>
              </div>
            </div>

            {/* Hero phone */}
            <div className="hidden md:block shrink-0">
              <div className="w-[240px] border border-wire bg-graphite p-2">
                <Image src={`/apps/pharmacy-manual/${SHOTS[0].file}`} alt={ar ? SHOTS[0].ar : SHOTS[0].en} width={824} height={1814} className="w-full h-auto" priority sizes="240px" />
              </div>
            </div>
          </section>

          {/* ── Stat band ── */}
          <section className="mt-16 grid grid-cols-2 md:grid-cols-4 border border-wire divide-x divide-wire rtl:divide-x-reverse">
            {stats.map((s) => (
              <div key={s.l} className="p-5 text-center">
                <div className={`text-xl md:text-2xl font-extrabold text-paper ${font}`}>{s.n}</div>
                <div className={`mt-1 text-[0.7rem] uppercase tracking-wide text-ash ${font}`}>{s.l}</div>
              </div>
            ))}
          </section>

          {/* ── Screenshot gallery ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('Screenshots', 'لقطات الشاشة')}</h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:mx-0 md:px-0">
              {SHOTS.map((s) => (
                <figure key={s.file} className="snap-center shrink-0 w-[60vw] max-w-[260px] md:w-auto md:max-w-none">
                  <div className="border border-wire bg-graphite p-2">
                    <Image src={`/apps/pharmacy-manual/${s.file}`} alt={ar ? s.ar : s.en} width={824} height={1814} className="w-full h-auto" sizes="(max-width: 768px) 60vw, 280px" />
                  </div>
                  <figcaption className={`mt-2 text-xs text-ash ${font} ${ar ? 'text-right' : ''}`}>{ar ? s.ar : s.en}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* ── Features ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('What it does', 'ماذا يفعل')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div key={f.en} className={`border border-wire bg-graphite p-5 ${ar ? 'text-right' : ''}`}>
                  <h3 className={`text-paper font-bold text-base mb-2 ${font}`}>{ar ? f.a : f.en}</h3>
                  <p className={`text-ash text-sm leading-relaxed ${font}`}>{ar ? f.aD : f.enD}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── What's new ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t("What's new", 'الجديد')}</h2>
            <div className="flex flex-col divide-y divide-wire border-y border-wire">
              {changelog.map((c) => (
                <div key={c.v} className={`py-6 ${ar ? 'text-right' : ''}`}>
                  <div className={`flex items-baseline gap-3 mb-3 ${ar ? 'flex-row-reverse' : ''}`}>
                    <span className="font-mono text-signal text-sm tabular-nums">v{c.v}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {c.items.map((it, i) => (
                      <li key={i} className={`flex gap-3 text-ash text-sm leading-relaxed ${font} ${ar ? 'flex-row-reverse text-right' : ''}`}>
                        <span className="text-signal shrink-0" aria-hidden="true">▍</span><span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Demo video ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('See it in action', 'شاهده أثناء العمل')}</h2>
            <div className="max-w-[320px] mx-auto">
              <DemoVideo src="/apps/pharmacy-manual/demo.mp4" poster="/apps/pharmacy-manual/demo-poster.jpg" width={582} height={1280} label={t('Play demo video', 'تشغيل الفيديو التوضيحي')} />
            </div>
          </section>

          {/* ── Install ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('How to install', 'كيفية التثبيت')}</h2>
            <ol className="flex flex-col gap-4">
              {installSteps.map((s, i) => (
                <li key={i} className={`flex gap-4 ${ar ? 'flex-row-reverse text-right' : ''}`}>
                  <span className={`shrink-0 w-8 h-8 border border-wire text-signal flex items-center justify-center font-mono text-sm tabular-nums`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`text-ash text-sm leading-relaxed self-center ${font}`}>{s}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Verify (collapsible) ── */}
          <section className="mt-16">
            <details className="border border-wire bg-graphite">
              <summary className={`cursor-pointer select-none px-5 py-4 text-paper font-bold text-sm ${font} ${ar ? 'text-right' : ''}`}>{t('Verify your download (optional)', 'تحقّق من تنزيلك (اختياري)')}</summary>
              <div className={`px-5 pb-5 flex flex-col gap-4 ${ar ? 'text-right' : ''}`} dir="ltr">
                <div>
                  <div className={`text-[0.7rem] uppercase tracking-wide text-ash mb-1 font-mono`}>APK SHA-256 (v0.2.2)</div>
                  <div className="flex items-center gap-2 bg-ink border border-wire px-3 py-2">
                    <code className="text-xs text-paper break-all font-mono">{APK_SHA256}</code>
                    <CopyButton value={APK_SHA256} label="Copy APK SHA-256" />
                  </div>
                </div>
                <div>
                  <div className={`text-[0.7rem] uppercase tracking-wide text-ash mb-1 font-mono`}>Signing certificate SHA-256</div>
                  <div className="flex items-center gap-2 bg-ink border border-wire px-3 py-2">
                    <code className="text-xs text-paper break-all font-mono">{CERT_SHA256}</code>
                    <CopyButton value={CERT_SHA256} label="Copy certificate SHA-256" />
                  </div>
                </div>
                <p className="text-xs text-ash font-mono">
                  {t('Hashes shown are for v0.2.2. The repository README always lists the current build\'s fingerprints: ', 'البصمات المعروضة لإصدار 0.2.2. يعرض ملف README في المستودع دائماً بصمات الإصدار الحالي: ')}
                  <a href={REPO} target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">github.com/karem505/pharmacy-manual-apk</a>
                </p>
              </div>
            </details>
          </section>

          {/* ── FAQ ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('Frequently asked questions', 'الأسئلة الشائعة')}</h2>
            <div className="flex flex-col divide-y divide-wire border-y border-wire">
              {faq.map((item, i) => (
                <div key={i} className={`py-6 ${ar ? 'text-right' : ''}`}>
                  <h3 className={`font-bold text-base md:text-lg text-paper mb-2 ${font}`}>{item.q}</h3>
                  <p className={`text-ash text-sm md:text-base leading-relaxed ${font}`}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Disclaimer ── */}
          <section className="mt-16">
            <div className={`border border-wire bg-graphite p-6 ${ar ? 'text-right' : ''}`}>
              <p className={`text-xs text-ash leading-relaxed ${font}`}>
                {t('Drug data is released under CC0 from the open egyptian-drug-database. Prices and availability change constantly. This app is for information only — always verify with the Egyptian Drug Authority and a licensed pharmacist before any clinical use.', 'بيانات الأدوية منشورة برخصة CC0 من قاعدة بيانات الأدوية المصرية المفتوحة. الأسعار والتوافر يتغيّران باستمرار. هذا التطبيق للمعلومات فقط — تحقّق دائماً من هيئة الدواء المصرية ومن صيدلي مرخّص قبل أي استخدام إكلينيكي.')}
              </p>
            </div>
          </section>

          {/* ── Closing CTA ── */}
          <section className="mt-16 text-center">
            <a href={DOWNLOAD} className={`inline-flex items-center gap-3 px-6 py-4 bg-signal text-ink hover:bg-signal-deep transition-colors duration-150 text-base font-bold ${font}`}>
              <FaDownload /><span>{t(`Download v${apk.version} · ${apk.sizeLabel}`, `تحميل الإصدار ${apk.version} · ${apk.sizeLabel}`)}</span>
            </a>
            <div className={`mt-4 text-xs ${font}`}>
              <Link href="/" className="text-ash hover:text-signal transition-colors">{t('← Back to portfolio', 'العودة إلى الموقع →')}</Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
