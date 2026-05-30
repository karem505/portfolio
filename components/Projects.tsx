'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaGithub, FaExternalLinkAlt, FaRocket, FaTasks, FaLanguage, FaCalculator } from 'react-icons/fa'
import { SiPython, SiJavascript, SiRust } from 'react-icons/si'
import type { IconType } from 'react-icons'
import { useLanguage } from '@/lib/LanguageContext'

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
  isInView: boolean
  size?: 'flagship' | 'notable'
  hoveredKey: string | null
  onHoverChange: (key: string | null) => void
  cardKey: string
  ar: boolean
  outcomeLabel: string
}

function ProjectCard({
  project,
  index,
  isInView,
  size = 'flagship',
  hoveredKey,
  onHoverChange,
  cardKey,
  ar,
  outcomeLabel,
}: ProjectCardProps) {
  const isFlagship = size === 'flagship'
  const primaryLink = project.link ?? project.github ?? '#'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onMouseEnter={() => onHoverChange(cardKey)}
      onMouseLeave={() => onHoverChange(null)}
      className="group relative"
    >
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
              <span
                key={tech}
                className="tag-chip"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <motion.a
          href={primaryLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={false}
          animate={{
            opacity: hoveredKey === cardKey ? 1 : 0,
          }}
          className="hover-only absolute bottom-5 right-5 text-signal"
          aria-hidden="true"
          tabIndex={-1}
        >
          <FaExternalLinkAlt size={14} />
        </motion.a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const { t, language } = useLanguage()
  const ar = language === 'ar'

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
      title: 'Costra.ailigent.ai',
      tagline: t('AI Cost Estimation & Construction Analytics', 'تقدير التكلفة وتحليلات الإنشاءات بالذكاء الاصطناعي'),
      description: t(
        'AI-driven cost estimation and construction analytics platform with Arabic RTL support. Built interactive cost calculators and financial dashboards; managed deployment with SSL hardening and uptime monitoring.',
        'منصة تقدير تكلفة وتحليلات إنشاءات مدعومة بالذكاء الاصطناعي مع دعم كامل للغة العربية و RTL. بنيتُ حاسبات تكلفة تفاعلية ولوحات تحكم مالية، وأَدرتُ النشر مع تأمين SSL ومراقبة الـ Uptime.'
      ),
      tech: ['Node.js', 'Python', 'Chart.js', 'Docker', 'Nginx'],
      roles: roleLabels,
      icon: FaCalculator,
      result: t('Arabic RTL · secured & monitored', 'دعم عربي RTL · مؤمَّن ومُراقَب'),
      link: 'https://costra.ailigent.ai',
    },
  ]

  const notableBuilds: Project[] = [
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
    <section id="projects" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="tab-eyebrow mb-6">004 · {t('shipped · work', 'الأعمال · المنشورة')}</span>
          <h2 className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t('Three production SaaS', 'ثلاث منصات SaaS في الإنتاج')}
            <span className="text-signal">.</span>
          </h2>
          <p className={`text-ash max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t(
              'Live products I architect, ship, and run as Full-Stack Developer, DevOps Engineer, and Scrum Master at Ailigent.',
              'منتجات حيّة أُصمّمها وأُطلقها وأُشغّلها كمطور Full-Stack ومهندس DevOps و Scrum Master في Ailigent.'
            )}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {flagships.map((project, index) => (
            <ProjectCard
              key={project.title}
              cardKey={`flagship-${index}`}
              project={project}
              index={index}
              isInView={isInView}
              size="flagship"
              hoveredKey={hoveredKey}
              onHoverChange={setHoveredKey}
              ar={ar}
              outcomeLabel={outcomeLabel}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4 mb-8"
        >
          <FaRocket className="text-signal" />
          <h3 className={`font-extrabold tracking-[-0.03em] text-2xl text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t('notable · builds', 'أعمال · مميزة')}
          </h3>
          <span className="flex-1 h-px bg-wire" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notableBuilds.map((project, index) => (
            <ProjectCard
              key={project.title}
              cardKey={`notable-${index}`}
              project={project}
              index={index}
              isInView={isInView}
              size="notable"
              hoveredKey={hoveredKey}
              onHoverChange={setHoveredKey}
              ar={ar}
              outcomeLabel={outcomeLabel}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/karem505"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper text-sm tracking-wide hover:border-signal hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}
          >
            <FaGithub size={16} />
            <span>{t('More on GitHub', 'المزيد على GitHub')}</span>
            <span className="text-ash group-hover:text-signal">↗</span>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
