'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaChartLine, FaChalkboardTeacher, FaCode } from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const cards = [
    {
      icon: FaChartLine,
      href: '/digital-transformation',
      title: t('Digital Transformation', 'التحول الرقمي'),
      blurb: t(
        'Replace spreadsheets and manual steps with connected software. I map your process, automate the repetitive work with AI, and modernize legacy or ERP systems — rolled out in phases, not a big-bang rewrite.',
        'استبدال ملفات الإكسل والخطوات اليدوية بأنظمة متصلة. أُحلّل عملياتكم، وأُتمتة المهام المتكررة بالذكاء الاصطناعي، وأُحدّث الأنظمة القديمة وأنظمة ERP — على مراحل، لا دفعة واحدة.'
      ),
      cta: t('Explore digital transformation', 'اعرف المزيد عن التحول الرقمي'),
    },
    {
      icon: FaChalkboardTeacher,
      href: '/ai-training',
      title: t('Professional AI Training', 'تدريب الذكاء الاصطناعي'),
      blurb: t(
        'Hands-on AI training for employees and executives. Separate tracks for daily workflows and for strategy — ChatGPT, Claude, prompt engineering, and agentic automation, practiced on your team’s real tasks. No coding required.',
        'تدريب عملي على الذكاء الاصطناعي للموظفين والمدراء التنفيذيين. مساران منفصلان: للمهام اليومية وللاستراتيجية — ChatGPT وClaude وهندسة الأوامر والأتمتة، يُطبَّق على مهام فريقكم الحقيقية. بلا برمجة.'
      ),
      cta: t('Explore AI training', 'اعرف المزيد عن تدريب الذكاء الاصطناعي'),
    },
    {
      icon: FaCode,
      href: '/contact-info',
      title: t('Custom AI & Software', 'برمجيات وذكاء اصطناعي مخصّص'),
      blurb: t(
        'Need something built, not just advised? I ship full-stack apps, AI features, and internal tools end to end — the same way I build Tornix.ai, Oravex.app, and Costra.net. Tell me the problem.',
        'تحتاج بناءً فعلياً لا استشارة فقط؟ أُطوّر تطبيقات متكاملة وميزات ذكاء اصطناعي وأدوات داخلية من البداية للنهاية — كما أبني Tornix.ai وOravex.app وCostra.net. أخبرني بالمشكلة.'
      ),
      cta: t('Start a conversation', 'ابدأ المحادثة'),
    },
  ]

  return (
    <section id="services" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="tab-eyebrow mb-6">005 · {t('services', 'الخدمات')}</span>
          <h2 className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}>
            {ar ? (
              <>
                خدمتان أقدّمهما للشركات:<br />
                أُحدّث العمل، وأُدرّب الفريق<span className="text-signal">.</span>
              </>
            ) : (
              <>
                Two things I do for companies:<br />
                modernize the work, train the people<span className="text-signal">.</span>
              </>
            )}
          </h2>
          <p className={`text-ash max-w-3xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {ar
              ? 'استشاري مستقل ومدرب ذكاء اصطناعي للشركات في مصر والإمارات والسعودية. أُعيد تصميم طريقة سير عملياتكم، ثم أُدرّب فريقكم على تشغيلها بالذكاء الاصطناعي. بالعربية أو الإنجليزية، حضورياً أو عن بُعد.'
              : 'Independent consultant and corporate AI trainer for teams across Egypt, the UAE, and Saudi Arabia. I redesign how your operations run, then get your people using AI to run them. In Arabic or English, on-site or remote.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={card.href}
                dir={ar ? 'rtl' : 'ltr'}
                className="group relative flex h-full flex-col p-6 bg-graphite border border-wire hover:border-signal transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors duration-200">
                    <card.icon className="text-lg" />
                  </div>
                  <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className={`font-bold text-lg mb-2 text-paper group-hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}>
                  {card.title}
                </h3>
                <p className={`text-ash text-sm leading-relaxed mb-6 ${ar ? 'font-rubik' : 'font-mono'}`}>
                  {card.blurb}
                </p>

                <span className={`mt-auto inline-flex items-center gap-2 text-sm text-paper group-hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}>
                  <span aria-hidden="true">{ar ? '←' : ''}</span>
                  <span>{card.cta}</span>
                  <span aria-hidden="true">{ar ? '' : '→'}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
