import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaLinux, FaWindows, FaApple, FaShieldAlt, FaYoutube, FaBookOpen } from 'react-icons/fa'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'
import { RustyInboxAppJsonLd, ServiceFaqJsonLd, ServiceBreadcrumbJsonLd } from '@/components/JsonLd'
import { YouTubeFacade, CopyCommand } from './RustyInboxClient'

const BASE = 'https://aboelmakarem.pro/apps/rusty-inbox'
const REPO = 'https://github.com/karem505/rusty-inbox'
const RELEASES = `${REPO}/releases`
const POST = '/blog/rusty-inbox-open-source-email-client-rust-qt'

type SP = { searchParams: { lang?: string } }

const SHOTS = [
  { file: 'smart-inbox.jpg', en: 'Smart Inbox: people first, notifications and newsletters grouped and foldable', ar: 'الصندوق الذكي: رسائل الأشخاص أولاً، والإشعارات والنشرات في مجموعات قابلة للطي' },
  { file: 'reader.jpg', en: 'Reading a thread, with the HTML message rendered in a script-free frame', ar: 'قراءة محادثة، مع عرض رسالة HTML داخل إطار معزول بلا سكربتات' },
  { file: 'composer.jpg', en: 'Reply with rich text, recipient chips and attachments', ar: 'الرد بنص منسّق وخانات للمستلمين ومرفقات' },
  { file: 'bulk-actions.jpg', en: 'Select all or a range, then act on many messages at once', ar: 'حدّد الكل أو نطاقاً من الرسائل ونفّذ إجراءً عليها دفعة واحدة' },
  { file: 'accounts.jpg', en: 'Accounts: add any IMAP/SMTP account or import from Thunderbird', ar: 'الحسابات: أضف أي حساب IMAP/SMTP أو استورد من Thunderbird' },
  { file: 'light-theme.jpg', en: 'Light theme: colours and font follow the desktop theme', ar: 'الوضع الفاتح: الألوان والخط تتبع سمة سطح المكتب' },
]

export function generateMetadata({ searchParams }: SP): Metadata {
  const ar = searchParams?.lang === 'ar'
  const title = ar
    ? 'Rusty Inbox — عميل بريد مفتوح المصدر سريع مكتوب بـ Rust و Qt (لينكس وويندوز وماك)'
    : 'Rusty Inbox — Fast Open-Source Email Client in Rust + Qt (Linux, Windows, macOS)'
  const description = ar
    ? 'Rusty Inbox عميل بريد مجاني مفتوح المصدر لسطح المكتب: محرّك بريد بلغة Rust وواجهة Qt 6 / QML، صندوق وارد ذكي، تراجع عن الإرسال، واستيراد من Thunderbird. بدون تتبّع.'
    : 'Rusty Inbox is a free, open-source desktop email client: a native Rust mail engine with a Qt 6 / QML UI, Smart Inbox, Undo Send and Thunderbird import. No telemetry.'
  const url = ar ? `${BASE}?lang=ar` : BASE
  const ogImage = 'https://aboelmakarem.pro/apps/rusty-inbox/promo-poster.jpg'

  return {
    title: { absolute: title },
    description,
    keywords: [
      'Rusty Inbox',
      'open source email client',
      'Rust email client',
      'Qt email client',
      'Linux email client',
      'Thunderbird alternative',
      'native email client',
      'IMAP client',
      'desktop mail app',
      'Abo-Elmakarem Shohoud',
    ],
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
      images: [{ url: ogImage, width: 1600, height: 900, alt: 'Rusty Inbox — Fast. Native. Yours.' }],
      videos: [{ url: 'https://www.youtube.com/watch?v=eDgUudd3zOw' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export default function RustyInboxPage({ searchParams }: SP) {
  const ar = searchParams?.lang === 'ar'
  const t = (en: string, arabic: string) => (ar ? arabic : en)
  const font = ar ? 'font-rubik' : 'font-mono'
  const align = ar ? 'text-right' : 'text-left'
  const h2 = `font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`

  const stats = [
    { n: 'Rust', l: t('mail engine', 'محرّك البريد') },
    { n: 'Qt 6', l: t('QML interface', 'واجهة QML') },
    { n: '3', l: t('Linux · Windows · macOS', 'لينكس · ويندوز · ماك') },
    { n: '0', l: t('telemetry', 'تتبّع') },
  ]

  const features = [
    { en: 'Smart Inbox', enD: 'Mail from people comes first. Notifications, newsletters and invitations go into their own groups, which you can fold away.', a: 'الصندوق الذكي', aD: 'رسائل الأشخاص تظهر أولاً، والإشعارات والنشرات والدعوات في مجموعات خاصة يمكنك طيّها.' },
    { en: 'Unified mailboxes', enD: 'Every account in one inbox, with per-account Sent, Drafts and Done when you need them.', a: 'صندوق موحّد', aD: 'كل الحسابات في صندوق وارد واحد، مع مجلدات المُرسَل والمسودات والمنجَز لكل حساب عند الحاجة.' },
    { en: 'Undo Send & Send Later', enD: 'Messages wait in a local outbox, so you can take them back. A failed send retries by itself and stays under Scheduled.', a: 'التراجع عن الإرسال والجدولة', aD: 'تنتظر الرسائل في صندوق صادر محلي فتستطيع استرجاعها، والرسالة التي تفشل تُعاد محاولتها تلقائياً وتبقى ضمن المجدوَلة.' },
    { en: 'Drafts that sync', enD: 'Drafts save while you type and appear in your provider\'s Drafts folder; sent mail is filed in Sent and replies are flagged as answered.', a: 'مسودات متزامنة', aD: 'تُحفظ المسودات أثناء الكتابة وتظهر في مجلد المسودات لدى مزوّد البريد، وتُحفظ الرسائل المرسلة في Sent وتُعلَّم الرسائل التي رددت عليها.' },
    { en: 'Done, Snooze, Pin, bulk actions', enD: 'Select all or a range and act at once. Every action has undo.', a: 'إنجاز وتأجيل وتثبيت وإجراءات جماعية', aD: 'حدّد الكل أو نطاقاً ونفّذ الإجراء دفعة واحدة، مع إمكانية التراجع عن كل إجراء.' },
    { en: 'Keyboard first', enD: 'J/K to move, E for Done, S to snooze, R/A/F to reply, reply all and forward, C to compose, Ctrl+Enter to send.', a: 'لوحة المفاتيح أولاً', aD: 'J/K للتنقّل، E للإنجاز، S للتأجيل، R/A/F للرد والرد على الكل والتحويل، C لرسالة جديدة، Ctrl+Enter للإرسال.' },
    { en: 'Desktop native', enD: 'Tray icon with an unread dot, desktop notifications, mailto: links, a single running instance and live theming (Omarchy themes included).', a: 'أصلي على سطح المكتب', aD: 'أيقونة في شريط النظام بنقطة للرسائل غير المقروءة، وإشعارات سطح المكتب، وروابط mailto:، ونسخة واحدة تعمل، وتغيير السمة مباشرةً (بما فيها سمات Omarchy).' },
    { en: 'Import from Thunderbird', enD: 'Accounts, servers and saved passwords come over in one click when the profile has no primary password.', a: 'الاستيراد من Thunderbird', aD: 'الحسابات والخوادم وكلمات المرور المحفوظة تنتقل بنقرة واحدة إذا لم يكن الملف الشخصي محمياً بكلمة مرور رئيسية.' },
    { en: 'Local and private', enD: 'Mail is cached in SQLite on your machine. No accounts, analytics, crash reporting or cloud relay. It talks only to your mail servers.', a: 'محلي وخاص', aD: 'البريد مخزّن في SQLite على جهازك. لا حسابات ولا تحليلات ولا تقارير أعطال ولا خوادم وسيطة؛ يتصل فقط بخوادم بريدك.' },
  ]

  const layers = [
    { k: 'QML', en: 'Interface — every screen (inbox, reader, composer, settings) in Qt Quick / QML, driven through cxx-qt.', ar: 'الواجهة — كل الشاشات (الوارد والقراءة والكتابة والإعدادات) بـ Qt Quick / QML عبر cxx-qt.' },
    { k: 'bridge.rs', en: 'One QObject between QML and Rust: synchronous getters for anything already stored, Qt signals for network results.', ar: 'كائن QObject واحد بين QML و Rust: قراءة فورية لكل ما هو مخزّن محلياً، وإشارات Qt لنتائج الشبكة.' },
    { k: 'core', en: 'rusty-inbox-core — IMAP sync (async-imap + rustls), SMTP (lettre), MIME parsing, drafts, replies, Thunderbird import. No UI code.', ar: 'rusty-inbox-core — مزامنة IMAP (async-imap + rustls)، وإرسال SMTP (lettre)، وتحليل MIME، والمسودات والردود، واستيراد Thunderbird. بلا أي كود واجهة.' },
    { k: 'SQLite', en: 'Local cache of threads, messages, outbox and settings, so the window opens on stored mail instantly.', ar: 'تخزين محلي للمحادثات والرسائل وصندوق الصادر والإعدادات، فتُفتح النافذة على البريد المخزّن فوراً.' },
  ]

  const faq = [
    {
      q: t('What is Rusty Inbox?', 'ما هو Rusty Inbox؟'),
      a: t(
        'Rusty Inbox is a free, open-source desktop email client for Linux, Windows and macOS, built by Abo-Elmakarem Shohoud. Its mail engine is written in Rust and its interface in Qt 6 / QML, so it starts fast and stays light on memory. It works with any IMAP/SMTP account.',
        'Rusty Inbox عميل بريد إلكتروني مجاني ومفتوح المصدر لسطح المكتب على لينكس وويندوز وماك، من تطوير ابوالمكارم شهود. محرّك البريد مكتوب بلغة Rust والواجهة بـ Qt 6 / QML، لذلك يعمل بسرعة ويستهلك ذاكرة قليلة، ويدعم أي حساب IMAP/SMTP.'
      ),
    },
    {
      q: t('Is Rusty Inbox free and open source?', 'هل Rusty Inbox مجاني ومفتوح المصدر؟'),
      a: t(
        'Yes. The full source is on GitHub under your choice of the MIT or Apache 2.0 license. There is no paid tier and no account to create.',
        'نعم. الكود كاملاً على GitHub برخصة MIT أو Apache 2.0 حسب اختيارك. لا توجد خطة مدفوعة ولا حاجة لإنشاء حساب.'
      ),
    },
    {
      q: t('Does it work with Gmail and Outlook?', 'هل يعمل مع Gmail و Outlook؟'),
      a: t(
        'It works with any provider that offers IMAP and SMTP: Gmail (sign in with an app password), Fastmail, iCloud, Yahoo, cPanel hosting and standard mail servers. Most providers are detected from the address alone.',
        'يعمل مع أي مزوّد يوفّر IMAP و SMTP: Gmail (باستخدام كلمة مرور التطبيقات)، و Fastmail، و iCloud، و Yahoo، واستضافات cPanel، وخوادم البريد القياسية. يتعرّف على أغلب المزوّدين من عنوان البريد وحده.'
      ),
    },
    {
      q: t('Is it a good Thunderbird alternative?', 'هل هو بديل جيد لـ Thunderbird؟'),
      a: t(
        'It is built for people who want a faster, keyboard-first inbox. You can bring your Thunderbird accounts over in one click: servers, accounts and saved passwords are imported, as long as the profile has no primary password.',
        'صُمّم لمن يريد صندوق وارد أسرع يُدار بلوحة المفاتيح. يمكنك نقل حسابات Thunderbird بنقرة واحدة: تُستورد الخوادم والحسابات وكلمات المرور المحفوظة، ما دام الملف الشخصي غير محمي بكلمة مرور رئيسية.'
      ),
    },
    {
      q: t('How is it different from Electron mail apps?', 'ما الفرق بينه وبين تطبيقات البريد المبنية على Electron؟'),
      a: t(
        'The interface is Qt Quick drawn natively, not a web app inside a bundled browser, and all mail logic runs in compiled Rust. A web view is used only to display HTML message bodies, isolated and with scripts disabled.',
        'الواجهة مرسومة بـ Qt Quick بشكل أصلي، وليست تطبيق ويب داخل متصفح مدمج، وكل منطق البريد يعمل بكود Rust مُترجَم. يُستخدم عارض ويب فقط لعرض محتوى رسائل HTML، معزولاً ومع تعطيل السكربتات.'
      ),
    },
    {
      q: t('Does Rusty Inbox collect any data?', 'هل يجمع Rusty Inbox أي بيانات؟'),
      a: t(
        'No. It has no analytics, no crash reporting and no servers of its own. Mail, settings and passwords stay in your data directory and the app connects only to the mail servers you add.',
        'لا. لا يحتوي على تحليلات ولا تقارير أعطال ولا خوادم خاصة به. البريد والإعدادات وكلمات المرور تبقى في مجلد بياناتك، ولا يتصل التطبيق إلا بخوادم البريد التي تضيفها.'
      ),
    },
  ]

  const buildCmd = `git clone ${REPO} && cd rusty-inbox
cargo build --release
./target/release/rusty-inbox`

  return (
    <>
      <RustyInboxAppJsonLd ar={ar} />
      <ServiceFaqJsonLd id={`${BASE}#faq`} faq={faq} />
      <ServiceBreadcrumbJsonLd
        items={[
          { name: t('Home', 'الرئيسية'), url: 'https://aboelmakarem.pro' },
          { name: t('Apps', 'التطبيقات'), url: 'https://aboelmakarem.pro/apps' },
          { name: 'Rusty Inbox', url: BASE },
        ]}
      />

      <SimplePageHeader title="Rusty Inbox" ar={ar} />

      <main lang={ar ? 'ar' : 'en'} dir={ar ? 'rtl' : 'ltr'} className="min-h-screen px-6 pb-24 pt-12">
        <div className="max-w-5xl mx-auto">
          {/* Language switch */}
          <div className={`mb-10 flex items-center gap-3 text-xs font-mono ${ar ? 'justify-start' : 'justify-end'}`}>
            <Link href="/apps/rusty-inbox" hrefLang="en" className={!ar ? 'text-signal' : 'text-ash hover:text-paper transition-colors'}>EN</Link>
            <span className="text-wire" aria-hidden="true">/</span>
            <Link href="/apps/rusty-inbox?lang=ar" hrefLang="ar" className={ar ? 'text-signal font-rubik' : 'text-ash hover:text-paper transition-colors font-rubik'}>ع</Link>
          </div>

          {/* ── Hero ── */}
          <section className={align}>
            <span className="tab-eyebrow mb-6">{t('Open-source desktop app · Free', 'تطبيق سطح مكتب مفتوح المصدر · مجاني')}</span>
            <div className="flex items-center gap-5 mt-4 mb-6">
              <Image src="/apps/rusty-inbox/icon.png" alt={t('Rusty Inbox app icon', 'أيقونة تطبيق Rusty Inbox')} width={512} height={512} className="w-16 h-16 md:w-20 md:h-20" priority />
              <div>
                <h1 className="font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl text-paper leading-none font-mono" dir="ltr">
                  Rusty Inbox<span className="text-signal">.</span>
                </h1>
                <p className={`text-ash text-sm md:text-base mt-3 ${font}`}>
                  {t('A fast, native email client — Rust engine, Qt 6 interface', 'عميل بريد سريع وأصلي — محرّك Rust وواجهة Qt 6')}
                </p>
              </div>
            </div>

            <p className={`text-ash text-base md:text-lg leading-relaxed max-w-3xl ${ar ? 'ml-auto' : ''} ${font}`}>
              {t(
                'Rusty Inbox is a free, open-source email client for Linux, Windows and macOS that I designed and built. The whole mail engine is native Rust and the interface is Qt Quick, so the window opens in a fraction of a second and stays light on memory. It sorts your inbox into people, notifications and newsletters, and every action works from the keyboard.',
                'Rusty Inbox عميل بريد إلكتروني مجاني ومفتوح المصدر للينكس وويندوز وماك، صمّمته وبنيته بنفسي. محرّك البريد بالكامل مكتوب بلغة Rust والواجهة بـ Qt Quick، لذلك تُفتح النافذة في جزء من الثانية ويبقى استهلاك الذاكرة منخفضاً. يرتّب الوارد إلى أشخاص وإشعارات ونشرات، وكل إجراء متاح من لوحة المفاتيح.'
              )}
            </p>

            <div className={`mt-8 flex flex-wrap gap-3 ${ar ? 'justify-end' : ''}`}>
              <a href={REPO} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-3 px-6 py-4 bg-signal text-ink hover:bg-signal-deep transition-colors duration-150 text-base font-bold ${font}`}>
                <FaGithub /> <span>{t('Get it on GitHub', 'حمّله من GitHub')}</span>
              </a>
              <a href={RELEASES} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-3 px-6 py-4 border border-wire text-paper hover:border-signal hover:text-signal transition-colors duration-150 text-base ${font}`}>
                {t('Downloads & releases', 'التنزيلات والإصدارات')}
              </a>
            </div>

            <div className={`mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ash ${font} ${ar ? 'justify-end' : ''}`}>
              <span className="inline-flex items-center gap-1.5"><FaLinux className="text-paper" /> Linux</span>
              <span className="inline-flex items-center gap-1.5"><FaWindows className="text-paper" /> Windows 10/11</span>
              <span className="inline-flex items-center gap-1.5"><FaApple className="text-paper" /> macOS 12+</span>
              <span className="inline-flex items-center gap-1.5"><FaShieldAlt className="text-signal" /> {t('MIT / Apache-2.0 · no telemetry', 'MIT / Apache-2.0 · بدون تتبّع')}</span>
            </div>
          </section>

          {/* ── Stat band ── */}
          <section className="mt-16 grid grid-cols-2 md:grid-cols-4 border border-wire divide-x divide-wire rtl:divide-x-reverse">
            {stats.map((s) => (
              <div key={s.l} className="p-5 text-center">
                <div className="text-xl md:text-2xl font-extrabold text-paper font-mono">{s.n}</div>
                <div className={`mt-1 text-[0.7rem] uppercase tracking-wide text-ash ${font}`}>{s.l}</div>
              </div>
            ))}
          </section>

          {/* ── Videos ── */}
          <section className="mt-24">
            <h2 className={h2}>{t('Watch it in action', 'شاهده أثناء العمل')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <figure>
                <YouTubeFacade id="eDgUudd3zOw" poster="/apps/rusty-inbox/promo-poster.jpg" title="Rusty Inbox — Fast. Native. Yours." label={t('Play the Rusty Inbox launch video', 'تشغيل فيديو إطلاق Rusty Inbox')} />
                <figcaption className={`mt-2 text-xs text-ash ${font} ${align}`}>
                  <FaYoutube className="inline text-signal" /> {t('Launch video · 53 s', 'فيديو الإطلاق · 53 ثانية')}
                </figcaption>
              </figure>
              <figure>
                <YouTubeFacade id="QinUtaGOhWg" poster="/apps/rusty-inbox/tour-poster.jpg" title="Rusty Inbox — Feature tour" label={t('Play the Rusty Inbox feature tour', 'تشغيل الجولة في مزايا Rusty Inbox')} />
                <figcaption className={`mt-2 text-xs text-ash ${font} ${align}`}>
                  <FaYoutube className="inline text-signal" /> {t('Feature tour on a demo mailbox · 2 min 20 s', 'جولة في المزايا على صندوق تجريبي · دقيقتان و20 ثانية')}
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ── Screenshots ── */}
          <section className="mt-24">
            <h2 className={h2}>{t('Screenshots', 'لقطات الشاشة')}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {SHOTS.map((s) => (
                <figure key={s.file}>
                  <div className="border border-wire bg-graphite p-1.5">
                    <Image src={`/apps/rusty-inbox/${s.file}`} alt={ar ? s.ar : s.en} width={1600} height={1000} className="w-full h-auto" sizes="(max-width: 640px) 100vw, 480px" />
                  </div>
                  <figcaption className={`mt-2 text-xs text-ash ${font} ${align}`}>{ar ? s.ar : s.en}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* ── Features ── */}
          <section className="mt-24">
            <h2 className={h2}>{t('What it does', 'ماذا يفعل')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div key={f.en} className={`border border-wire bg-graphite p-5 ${ar ? 'text-right' : ''}`}>
                  <h3 className={`text-paper font-bold text-base mb-2 ${font}`}>{ar ? f.a : f.en}</h3>
                  <p className={`text-ash text-sm leading-relaxed ${font}`}>{ar ? f.aD : f.enD}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Architecture ── */}
          <section className="mt-24">
            <h2 className={h2}>{t('How it is built', 'كيف بُني')}</h2>
            <p className={`text-ash text-sm md:text-base leading-relaxed max-w-3xl mb-8 ${font} ${ar ? 'text-right ml-auto' : ''}`}>
              {t(
                'Two layers that never wait on each other. The engine runs inside the app on a small Tokio runtime; the interface reads anything already stored instantly and receives network results as Qt signals, so scrolling and typing never block on the network. IMAP connections are pooled per account, which keeps servers that throttle frequent logins happy.',
                'طبقتان لا تنتظر إحداهما الأخرى. يعمل المحرّك داخل التطبيق على Tokio runtime صغير، وتقرأ الواجهة كل ما هو مخزّن فوراً وتستقبل نتائج الشبكة كإشارات Qt، فلا يتوقف التمرير أو الكتابة بسبب الشبكة. اتصالات IMAP مُجمّعة لكل حساب، وهذا يريح الخوادم التي تقيّد تسجيلات الدخول المتكررة.'
              )}
            </p>
            <ol className="flex flex-col border border-wire divide-y divide-wire">
              {layers.map((l, i) => (
                <li key={l.k} className={`flex gap-5 p-5 ${ar ? 'text-right' : ''}`}>
                  <span className="shrink-0 font-mono text-signal text-sm tabular-nums w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="shrink-0 font-mono text-paper text-sm w-24" dir="ltr">{l.k}</span>
                  <span className={`text-ash text-sm leading-relaxed ${font}`}>{ar ? l.ar : l.en}</span>
                </li>
              ))}
            </ol>
            <div className={`mt-4 flex flex-wrap gap-1.5 ${ar ? 'justify-end' : ''}`}>
              {['Rust', 'Qt 6', 'QML', 'cxx-qt', 'Tokio', 'async-imap', 'rustls', 'lettre', 'SQLite'].map((x) => (
                <span key={x} className="tag-chip">{x}</span>
              ))}
            </div>
          </section>

          {/* ── Install ── */}
          <section className="mt-24">
            <h2 className={h2}>{t('Install', 'التثبيت')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`border border-wire bg-graphite p-5 ${ar ? 'text-right' : ''}`}>
                <h3 className={`text-paper font-bold text-base mb-3 ${font}`}>{t('Packages', 'الحزم الجاهزة')}</h3>
                <ul className={`flex flex-col gap-2 text-ash text-sm leading-relaxed ${font}`}>
                  <li>{t('Linux: AppImage and Flatpak bundle', 'لينكس: AppImage وحزمة Flatpak')}</li>
                  <li>{t('Arch Linux: the rusty-inbox package (AUR)', 'آرتش لينكس: حزمة rusty-inbox على AUR')}</li>
                  <li>{t('Windows 10/11: installer or portable zip', 'ويندوز 10/11: مثبّت أو نسخة محمولة zip')}</li>
                  <li>{t('macOS 12+: .dmg for Apple Silicon and Intel', 'ماك 12+: ملف dmg لمعالجات Apple Silicon و Intel')}</li>
                </ul>
                <a href={RELEASES} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex items-center gap-2 text-sm text-signal hover:underline ${font}`}>
                  <FaGithub /> {t('GitHub Releases', 'صفحة الإصدارات على GitHub')}
                </a>
              </div>
              <div className={`border border-wire bg-graphite p-5 ${ar ? 'text-right' : ''}`}>
                <h3 className={`text-paper font-bold text-base mb-3 ${font}`}>{t('Build from source', 'البناء من المصدر')}</h3>
                <p className={`text-ash text-sm leading-relaxed mb-3 ${font}`}>
                  {t('Needs Rust 1.85+ and Qt 6.8+ with Qt Quick, Quick Controls 2 and Qt WebEngine.', 'يتطلب Rust 1.85+ و Qt 6.8+ مع Qt Quick و Quick Controls 2 و Qt WebEngine.')}
                </p>
                <CopyCommand value={buildCmd} label={t('Copy build commands', 'نسخ أوامر البناء')} />
              </div>
            </div>
            <p className={`mt-4 text-xs text-ash ${font} ${align}`}>
              {t('Adding Gmail? Create an app password in your Google account and use it as the password. Coming from Thunderbird? Choose Import from Thunderbird.', 'تضيف Gmail؟ أنشئ كلمة مرور للتطبيقات من حساب Google واستخدمها ككلمة المرور. قادم من Thunderbird؟ اختر الاستيراد من Thunderbird.')}
            </p>
          </section>

          {/* ── Build story ── */}
          <section className="mt-24">
            <Link href={ar ? `${POST}?lang=ar` : POST} className={`group block border border-wire bg-graphite hover:border-signal transition-colors p-6 ${ar ? 'text-right' : ''}`}>
              <span className={`inline-flex items-center gap-2 text-xs text-signal ${font}`}><FaBookOpen /> {t('Build story', 'قصة البناء')}</span>
              <h2 className={`mt-3 font-extrabold tracking-[-0.03em] text-xl md:text-2xl text-paper group-hover:text-signal transition-colors ${font}`}>
                {t('How I built a native email client with Rust and Qt', 'كيف بنيت عميل بريد أصلياً بـ Rust و Qt')}
              </h2>
              <p className={`mt-2 text-ash text-sm leading-relaxed ${font}`}>
                {t('The architecture, the decisions that kept it fast, and what I learned shipping one codebase to three operating systems.', 'المعمارية، والقرارات التي أبقته سريعاً، وما تعلّمته من نشر كود واحد على ثلاثة أنظمة تشغيل.')}
              </p>
            </Link>
          </section>

          {/* ── FAQ ── */}
          <section className="mt-24" id="faq">
            <h2 className={h2}>{t('Frequently asked questions', 'الأسئلة الشائعة')}</h2>
            <div className="flex flex-col divide-y divide-wire border-y border-wire">
              {faq.map((item, i) => (
                <div key={i} className={`py-6 ${ar ? 'text-right' : ''}`}>
                  <h3 className={`font-bold text-base md:text-lg text-paper mb-2 ${font}`}>{item.q}</h3>
                  <p className={`text-ash text-sm md:text-base leading-relaxed ${font}`}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Author / services ── */}
          <section className="mt-16">
            <div className={`border border-wire bg-graphite p-6 ${ar ? 'text-right' : ''}`}>
              <p className={`text-sm text-ash leading-relaxed ${font}`}>
                {t('Built by ', 'من تطوير ')}
                <Link href={ar ? '/?lang=ar' : '/'} className="text-paper hover:text-signal">{t('Abo-Elmakarem Shohoud', 'ابوالمكارم شهود')}</Link>
                {t(
                  ', CTO and full-stack engineer in Cairo. I build fast, native internal tools and automate how companies work — see ',
                  '، مسؤول التقنية ومهندس full-stack في القاهرة. أبني أدوات داخلية سريعة وأصلية وأؤتمت طريقة عمل الشركات — راجع '
                )}
                <Link href={ar ? '/digital-transformation?lang=ar' : '/digital-transformation'} className="text-signal hover:underline">{t('digital transformation consulting', 'خدمات التحول الرقمي')}</Link>
                {t('.', '.')}
              </p>
            </div>
          </section>

          {/* ── Closing ── */}
          <section className="mt-16 text-center">
            <a href={REPO} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-3 px-6 py-4 bg-signal text-ink hover:bg-signal-deep transition-colors duration-150 text-base font-bold ${font}`}>
              <FaGithub /><span>{t('Star Rusty Inbox on GitHub', 'ادعم Rusty Inbox بنجمة على GitHub')}</span>
            </a>
            <div className={`mt-4 flex items-center justify-center gap-4 text-xs ${font}`}>
              <Link href={ar ? '/apps?lang=ar' : '/apps'} className="text-ash hover:text-signal transition-colors">{t('← All apps', 'كل التطبيقات →')}</Link>
              <span className="text-wire" aria-hidden="true">·</span>
              <Link href={ar ? '/?lang=ar' : '/'} className="text-ash hover:text-signal transition-colors">{t('Portfolio', 'الموقع')}</Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
