'use client'

import type { CSSProperties } from 'react'
import { createTimeline, onScroll } from 'animejs'
import { FaGithub, FaExternalLinkAlt, FaRocket, FaTasks, FaLanguage, FaCalculator, FaCreditCard, FaBookMedical } from 'react-icons/fa'
import { SiPython, SiJavascript, SiRust } from 'react-icons/si'
import type { IconType } from 'react-icons'
import { useLanguage } from '@/lib/LanguageContext'
import { useAnimeScope } from '@/lib/journey/useAnimeScope'
import { usePinned } from '@/lib/journey/usePinned'
import { parallaxLayers, revealLines, revealUp } from '@/lib/journey/reveal'

type Project = {
  title: string
  tagline: string
  description: string
  tech: string[]
  roles: string[]
  icon: IconType
  result: string
  link?: string
  github?: string
}

type ProjectCardProps = {
  project: Project
  index: number
  size?: 'flagship' | 'notable'
  ar: boolean
  outcomeLabel: string
  pinCard?: boolean
}

function ProjectCard({ project, index, size = 'flagship', ar, outcomeLabel, pinCard = false }: ProjectCardProps) {
  const isFlagship = size === 'flagship'
  const primaryLink = project.link ?? project.github ?? '#'

  return (
    <div className="group relative h-full" data-pin-card={pinCard ? '' : undefined} data-reveal-card={pinCard ? undefined : ''}>
      <div
        className={`relative h-full ${isFlagship ? 'p-7 md:p-8' : 'p-6'} bg-graphite border border-wire hover:border-signal transition-colors duration-200 overflow-hidden`}
      >
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-5 pb-5 border-b border-wire">
            <div
              className={`${isFlagship ? 'w-12 h-12' : 'w-11 h-11'} border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors`}
            >
              <project.icon className={isFlagship ? 'text-xl' : 'text-lg'} />
            </div>

            <div className="flex items-center gap-1">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 border border-wire flex items-center justify-center text-ash hover:text-signal hover:border-signal transition-colors"
                  aria-label={`${project.title} GitHub`}
                >
                  <FaGithub size={14} />
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 border border-wire flex items-center justify-center text-ash hover:text-signal hover:border-signal transition-colors"
                  aria-label={project.title}
                >
                  <FaExternalLinkAlt size={12} />
                </a>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash/60">
                {String(index + 1).padStart(2, '0')} ·
              </span>
              <h3
                className={`font-extrabold tracking-[-0.04em] ${isFlagship ? 'text-2xl md:text-[1.75rem]' : 'text-xl'} text-paper group-hover:text-signal transition-colors leading-none font-mono`}
              >
                {project.title}
              </h3>
            </div>
            <p className={`text-ash text-xs md:text-sm ${ar ? 'font-rubik' : 'font-mono'}`}>{project.tagline}</p>
          </div>

          {project.roles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.roles.map((role) => (
                <span
                  key={role}
                  className={`px-2 py-1 text-[0.65rem] uppercase tracking-[0.04em] border border-wire text-ash ${ar ? 'font-rubik' : 'font-mono'}`}
                >
                  {role}
                </span>
              ))}
            </div>
          )}

          <p className={`text-ash leading-relaxed mb-5 ${isFlagship ? 'text-sm' : 'text-xs md:text-sm'} ${ar ? 'font-rubik' : 'font-mono'}`}>
            {project.description}
          </p>

          {project.result && (
            <div className="mb-5 pl-3 border-l border-signal">
              <span className="block font-mono text-[0.65rem] tracking-[0.18em] uppercase text-signal mb-1">
                / {outcomeLabel}
              </span>
              <span className={`text-sm text-paper font-medium ${ar ? 'font-rubik' : 'font-mono'}`}>
                {project.result}
              </span>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span key={tech} className="tag-chip">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <a
          href={primaryLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hover-only absolute bottom-5 right-5 text-signal opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
          tabIndex={-1}
        >
          <FaExternalLinkAlt size={14} />
        </a>
      </div>
    </div>
  )
}

export default function Projects() {
  const { t, language } = useLanguage()
  const ar = language === 'ar'
  const pinned = usePinned()

  // Desktop: one scroll-synced timeline brings the three flagships forward out of
  // the field one at a time (FLIP: measured slot → grid centre), ending exactly in
  // the static grid layout so releasing the pin changes nothing. Elsewhere: flow.
  const root = useAnimeScope<HTMLElement>((_, { motion }) => {
    const el = root.current
    if (!el || !motion) return
    const header = el.querySelector<HTMLElement>('[data-pin-header]')
    const grid = el.querySelector<HTMLElement>('[data-pin-grid]')
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-pin-card]'))
    if (!header || !grid || cards.length === 0) return
    parallaxLayers(el)

    if (!pinned) {
      const h2 = header.querySelector<HTMLElement>('[data-lines]')
      if (h2) revealLines(h2)
      revealUp(header.querySelectorAll('[data-reveal-head]'), { staggerMs: 80, trigger: header })
      revealUp(cards, { staggerMs: 100, y: 40, trigger: grid })
      return
    }

    // Rects are visual (post-zoom) pixels; transforms apply in the zoomed local
    // space, so divide by the stage zoom (see .pin-inner in globals.css).
    const inner = el.querySelector<HTMLElement>('.pin-inner')
    const zoom = parseFloat((inner && getComputedStyle(inner).zoom) || '1') || 1
    const g = grid.getBoundingClientRect()
    const cx = g.left + g.width / 2
    const cy = g.top + g.height / 2
    const offsets = cards.map((c) => {
      const r = c.getBoundingClientRect()
      return { dx: (cx - (r.left + r.width / 2)) / zoom, dy: (cy - (r.top + r.height / 2)) / zoom }
    })
    // [arrive start, arrive end / travel start, travel end] in timeline ms (0..1000 = pin progress)
    const windows: [number, number, number][] = [
      [120, 360, 620],
      [360, 620, 860],
      [620, 860, 1000],
    ]
    const tl = createTimeline({
      defaults: { ease: 'linear' },
      autoplay: onScroll({ target: el, enter: 'top top', leave: 'bottom bottom', sync: true }),
    })
    tl.add(header, { translateY: [24, 0], duration: 120 }, 0)
    cards.forEach((card, i) => {
      const { dx, dy } = offsets[i]
      const [a0, a1, a2] = windows[i]
      card.style.zIndex = String(i + 1)
      tl.set(card, { translateX: dx, translateY: dy, scale: 1.12, opacity: 0, filter: 'blur(10px)' }, 0)
      tl.add(card, { opacity: [0, 1], filter: ['blur(10px)', 'blur(0px)'], scale: [1.12, 1.06], duration: a1 - a0 }, a0)
      tl.add(card, { translateX: [dx, 0], translateY: [dy, 0], scale: [1.06, 1], duration: a2 - a1 }, a1)
    })
  }, [language, pinned])

  const notableRoot = useAnimeScope<HTMLDivElement>((_, { motion }) => {
    const el = notableRoot.current
    if (!el || !motion) return
    revealUp(el.querySelectorAll('[data-reveal-notable-head]'))
    revealUp(el.querySelectorAll('[data-reveal-card]'), { staggerMs: 80, y: 32 })
    revealUp(el.querySelectorAll('[data-reveal-notable-cta]'))
  }, [language])

  const roleLabels = ar
    ? ['Scrum Master', 'مهندس DevOps', 'مطور Full-Stack']
    : ['Scrum Master', 'DevOps Engineer', 'Full-Stack Developer']

  const flagships: Project[] = [
    {
      title: 'Tornix.ai',
      tagline: t('AI-Powered Project Management SaaS', 'منصة SaaS لإدارة المشاريع بالذكاء الاصطناعي'),
      description: t(
        'AI-powered project management platform serving construction and enterprise clients. Built a Gantt chart module with Critical Path Method (CPM) engine and Primavera P6 / XER file compatibility.',
        'منصة إدارة مشاريع مدعومة بالذكاء الاصطناعي تخدم عملاء الإنشاءات والمؤسسات. بنيتُ وحدة Gantt chart مع محرك Critical Path Method (CPM) وتوافق مع ملفات Primavera P6 / XER.'
      ),
      tech: ['React', 'Python', 'AWS EC2', 'Docker', 'GitHub Actions'],
      roles: roleLabels,
      icon: FaTasks,
      result: t('CPM engine · Primavera P6/XER compatibility', 'محرك CPM · توافق مع Primavera P6/XER'),
      link: 'https://tornix.ai',
    },
    {
      title: 'Oravex.app',
      tagline: t('NLP-Powered Odoo ERP Platform', 'منصة ERP مبنية على Odoo بالمعالجة اللغوية'),
      description: t(
        'Full ERP platform built on Odoo 18 combining Natural Language Processing with core ERP modules: users interact with the ERP using natural language queries. Custom NLP modules on a React/Next.js + Odoo stack.',
        'منصة ERP متكاملة مبنية على Odoo 18 تدمج معالجة اللغة الطبيعية مع وحدات الـ ERP الأساسية: يتفاعل المستخدم مع النظام عبر استعلامات بلغته الطبيعية. وحدات NLP مخصّصة على حزمة React/Next.js + Odoo.'
      ),
      tech: ['React', 'Next.js', 'Odoo 18', 'Python', 'PostgreSQL'],
      roles: roleLabels,
      icon: FaLanguage,
      result: t('Natural-language ERP queries', 'استعلامات ERP باللغة الطبيعية'),
      link: 'https://oravex.app',
    },
    {
      title: 'Costra.net',
      tagline: t('AI Cost Estimation & Construction Analytics', 'تقدير التكلفة وتحليلات الإنشاءات بالذكاء الاصطناعي'),
      description: t(
        'AI-driven cost estimation and construction analytics platform with Arabic RTL support. Built interactive cost calculators and financial dashboards; managed deployment with SSL hardening and uptime monitoring.',
        'منصة تقدير تكلفة وتحليلات إنشاءات مدعومة بالذكاء الاصطناعي مع دعم كامل للغة العربية و RTL. بنيتُ حاسبات تكلفة تفاعلية ولوحات تحكم مالية، وأَدرتُ النشر مع تأمين SSL ومراقبة الـ Uptime.'
      ),
      tech: ['Node.js', 'Python', 'Chart.js', 'Docker', 'Nginx'],
      roles: roleLabels,
      icon: FaCalculator,
      result: t('Arabic RTL · secured & monitored', 'دعم عربي RTL · مؤمَّن ومُراقَب'),
      link: 'https://costra.net',
    },
  ]

  const notableBuilds: Project[] = [
    {
      title: 'Pharmacy Manual',
      tagline: t(
        'Offline Egyptian Drug Index & Price Checker (Android)',
        'دليل أدوية مصر ومُدقّق الأسعار — بدون إنترنت (أندرويد)'
      ),
      description: t(
        'An Arabic-first, fully offline Android app indexing 24,868+ Egyptian medicines: bilingual, diacritic-insensitive search across Arabic alias, English name, and active ingredient; a price checker that badges cheaper same-ingredient alternatives; and browse by drug class, manufacturer, and route. Distributed as a direct APK with a download page that always serves the latest signed build.',
        'تطبيق أندرويد عربيّ أولاً يعمل بالكامل بدون إنترنت، يفهرس أكثر من 24,868 دواءً مصرياً: بحث ثنائي اللغة غير حسّاس للتشكيل بالاسم العربي والإنجليزي والمادة الفعّالة؛ ومُدقّق أسعار يُبرز البدائل الأرخص بنفس المادة؛ وتصفّح حسب التصنيف والشركة وطريقة الإعطاء. يُوزَّع كملف APK مباشر مع صفحة تحميل تقدّم دائماً أحدث إصدار موقّع.'
      ),
      tech: ['Android', 'Offline-first', 'Bilingual', 'RTL'],
      roles: [],
      icon: FaBookMedical,
      result: t('24,868+ medicines · offline · free', 'أكثر من 24,868 دواءً · بدون إنترنت · مجاني'),
      link: '/apps/pharmacy-manual',
      github: 'https://github.com/karem505/pharmacy-manual-apk',
    },
    {
      title: 'Tamara Payments Skill',
      tagline: t(
        'Open-Source AI Skill for Tamara (BNPL) Integration',
        'أداة مفتوحة المصدر لتكامل مدفوعات تمارا (BNPL) بالذكاء الاصطناعي'
      ),
      description: t(
        "Open-source Claude skill that gives any AI agent Tamara's real documentation — a complete offline mirror of docs.tamara.co (139 pages + full OpenAPI for all 25 endpoints) plus a quick-reference for the checkout → authorise → capture → refund flow, webhooks, plugins (WooCommerce, Shopify, Salla, Magento, Zid) and in-store/POS across the GCC.",
        'أداة مفتوحة المصدر (Claude skill) تمنح أي وكيل ذكاء اصطناعي وثائق تمارا الحقيقية — نسخة كاملة بدون إنترنت من docs.tamara.co (139 صفحة + الـ OpenAPI الكامل لكل الـ 25 endpoint) مع مرجع سريع لمسار checkout ← authorise ← capture ← refund والـ webhooks والإضافات (WooCommerce، Shopify، سلة، Magento، زد) ونقاط البيع عبر الخليج.'
      ),
      tech: ['Claude Skill', 'Tamara API', 'BNPL', 'OpenAPI', 'Markdown'],
      roles: [],
      icon: FaCreditCard,
      result: t('139 docs mirrored · open source', '139 صفحة موثّقة · مفتوح المصدر'),
      github: 'https://github.com/karem505/tamara-payments-skill',
    },
    {
      title: 'Paymob Payments Skill',
      tagline: t(
        'Open-Source AI Skill for Paymob Payment Gateway Integration',
        'أداة مفتوحة المصدر لتكامل بوابة دفع باي موب بالذكاء الاصطناعي'
      ),
      description: t(
        "Open-source skill for Claude Code, Codex, and AI coding agents with Paymob's real documentation — a complete offline mirror of developers.paymob.com (116 pages with full request/response schemas) plus a quick-reference for the Intention API, Unified Checkout, HMAC-SHA512 webhook verification (the exact 20-key order), refunds, saved cards, and mobile wallets across Egypt, KSA, UAE, and Oman.",
        'أداة مفتوحة المصدر لوكلاء البرمجة بالذكاء الاصطناعي (Claude Code و Codex) تمنحهم وثائق باي موب الحقيقية — نسخة كاملة بدون إنترنت من developers.paymob.com (116 صفحة بكامل نماذج الطلب والاستجابة) مع مرجع سريع لـ Intention API و Unified Checkout والتحقق من HMAC-SHA512 للـ webhooks بالترتيب الدقيق للمفاتيح، والاسترداد والبطاقات المحفوظة والمحافظ الإلكترونية في مصر والسعودية والإمارات وعُمان.'
      ),
      tech: ['Claude Code', 'Codex', 'Paymob API', 'Agent Skill', 'Markdown'],
      roles: [],
      icon: FaCreditCard,
      result: t('116 docs mirrored · open source (MIT)', '116 صفحة موثّقة · مفتوح المصدر (MIT)'),
      github: 'https://github.com/karem505/paymob-payments-skill',
    },
    {
      title: 'whatRust',
      tagline: t('Lightweight WhatsApp Web Desktop Client', 'عميل سطح مكتب خفيف لـ WhatsApp Web'),
      description: t(
        'Open-source WhatsApp Web desktop client built with Rust and Tauri v2 — a lean, native alternative to the Electron-based official app. Renders WhatsApp Web in the OS-native webview (WebKitGTK / WebView2 / WKWebView) with a system tray, native notifications, persistent login, and voice/video calls across Linux, Windows, and macOS.',
        'عميل سطح مكتب مفتوح المصدر لـ WhatsApp Web مبني بـ Rust و Tauri v2 — بديل أصلي خفيف عن التطبيق الرسمي المعتمد على Electron. يعرض WhatsApp Web عبر webview النظام الأصلي (WebKitGTK / WebView2 / WKWebView) مع شريط نظام وإشعارات أصلية وتسجيل دخول دائم ومكالمات صوت وفيديو على لينكس وويندوز وماك.'
      ),
      tech: ['Rust', 'Tauri v2', 'WebView', 'Cross-platform'],
      roles: [],
      icon: SiRust,
      result: t('~90 MB native shell · open source (MIT)', 'واجهة أصلية ~90 ميجابايت · مفتوح المصدر (MIT)'),
      github: 'https://github.com/karem505/whatRust',
    },
    {
      title: 'OpenClaw Agent Dashboard',
      tagline: t('Agent Management UI', 'واجهة إدارة الوكلاء'),
      description: t(
        'Glassmorphic agent management dashboard for OpenClaw with task kanban, document editor, real-time agent monitoring, and 11 API integrations.',
        'لوحة إدارة وكلاء بتصميم Glassmorphic لـ OpenClaw مع Kanban للمهام، ومحرر مستندات، ومراقبة فورية للوكلاء، و 11 تكامل API.'
      ),
      tech: ['HTML', 'CSS', 'JavaScript', 'OpenClaw'],
      roles: [],
      icon: SiJavascript,
      result: t('11 API integrations · real-time monitoring', '11 تكامل API · مراقبة فورية'),
      github: 'https://github.com/karem505/openclaw-agent-dashboard',
    },
    {
      title: 'PE Live AI Agent',
      tagline: t('Production Voice AI', 'وكيل صوتي للإنتاج'),
      description: t(
        'Voice AI agent built with LiveKit Agents framework, featuring OpenAI Realtime API, MCP database integration, and Tavus video avatar support. Production-ready with 8 database tools.',
        'وكيل صوتي مبني على إطار LiveKit Agents مع OpenAI Realtime API وتكامل قاعدة بيانات عبر MCP ودعم Tavus Avatar. جاهز للإنتاج مع 8 أدوات قاعدة بيانات.'
      ),
      tech: ['Python', 'LiveKit', 'OpenAI Realtime', 'MCP', 'Tavus'],
      roles: [],
      icon: SiPython,
      result: t('Production-ready · 8 database tools', 'جاهز للإنتاج · 8 أدوات قاعدة بيانات'),
      github: 'https://github.com/karem505/PE-live-ai-agent',
    },
  ]

  const outcomeLabel = t('outcome', 'النتيجة')

  return (
    <>
      <section
        id="projects"
        ref={root}
        data-pinned={pinned ? 'true' : 'false'}
        style={{ '--span': 3.8 } as CSSProperties}
        className="pin-act px-6"
      >
        <div className="pin-stage max-w-7xl mx-auto w-full py-32">
          <div className="pin-inner">
          <div data-pin-header className="relative text-center mb-12">
            <span aria-hidden="true" className="watermark-num" data-depth="-0.3">004</span>
            <span data-reveal-head className="tab-eyebrow mb-6">004 · {t('shipped · work', 'الأعمال · المنشورة')}</span>
            <h2
              key={language}
              data-lines
              className={`pin-heading font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}
            >
              {t('Three production SaaS', 'ثلاث منصات SaaS في الإنتاج')}
              <span className="text-signal">.</span>
            </h2>
            <p data-reveal-head className={`text-ash max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
              {t(
                'Live products I architect, ship, and run as Full-Stack Developer, DevOps Engineer, and Scrum Master at Ailigent.',
                'منتجات حيّة أُصمّمها وأُطلقها وأُشغّلها كمطور Full-Stack ومهندس DevOps و Scrum Master في Ailigent.'
              )}
            </p>
          </div>

          <div data-pin-grid className="grid lg:grid-cols-3 gap-6">
            {flagships.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                size="flagship"
                ar={ar}
                outcomeLabel={outcomeLabel}
                pinCard
              />
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Notable builds flow after the pinned act (never inside the sticky stage). */}
      <div ref={notableRoot} className="relative px-6 pb-32 pt-4 lg:pt-12">
        <div className="max-w-7xl mx-auto">
          <div data-reveal-notable-head className="flex items-center gap-4 mb-8">
            <FaRocket className="text-signal" />
            <h3 className={`font-extrabold tracking-[-0.03em] text-2xl text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>
              {t('notable · builds', 'أعمال · مميزة')}
            </h3>
            <span className="flex-1 h-px bg-wire" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notableBuilds.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                size="notable"
                ar={ar}
                outcomeLabel={outcomeLabel}
              />
            ))}
          </div>

          <div data-reveal-notable-cta className="text-center mt-12">
            <a
              href="https://github.com/karem505"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper text-sm tracking-wide hover:border-signal hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}
            >
              <FaGithub size={16} />
              <span>{t('More on GitHub', 'المزيد على GitHub')}</span>
              <span className="text-ash group-hover:text-signal">↗</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 section-divider" />
      </div>
    </>
  )
}
