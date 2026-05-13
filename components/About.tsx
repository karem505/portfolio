'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  FaCode, FaServer, FaUsers, FaMicrophone, FaChartLine, FaClipboardList
} from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const skillCategories = [
    {
      title: t('Languages & Frameworks', 'لغات وأُطر العمل'),
      items: ['TypeScript', 'Python', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Flutter', 'FastAPI'],
    },
    {
      title: t('DevOps & Infrastructure', 'البنية التحتية و DevOps'),
      items: ['Docker', 'GitHub Actions', 'AWS EC2', 'Railway', 'CI/CD Pipelines', 'Linux', 'Nginx'],
    },
    {
      title: t('AI & Automation', 'الذكاء الاصطناعي والأتمتة'),
      items: ['OpenAI Realtime API', 'LiveKit Agents', 'MCP (Model Context Protocol)', 'Tavus'],
    },
    {
      title: t('ERP & Business Systems', 'أنظمة ERP والأعمال'),
      items: ['Odoo 18', t('Process Automation', 'أتمتة العمليات'), t('Business Analysis', 'تحليل الأعمال'), t('Digital Transformation', 'التحول الرقمي')],
    },
    {
      title: t('Agile & Leadership', 'القيادة و Agile'),
      items: ['Scrum Master', t('Product Ownership', 'ملكية المنتج'), t('Sprint Planning', 'تخطيط السبرنت'), t('Backlog Management', 'إدارة الـ Backlog')],
    },
  ]

  const expertise = [
    {
      icon: FaCode,
      title: t('Full-Stack Development', 'تطوير Full-Stack'),
      description: t(
        'TypeScript, React, Next.js, Python, FastAPI, and Node.js across production SaaS apps.',
        'TypeScript و React و Next.js و Python و FastAPI و Node.js على منصات SaaS فعلية في الإنتاج.'
      ),
    },
    {
      icon: FaServer,
      title: t('DevOps & Cloud', 'DevOps والسحابة'),
      description: t(
        'Docker, GitHub Actions, AWS EC2, and Railway pipelines running three live products.',
        'Docker و GitHub Actions و AWS EC2 و Railway تُشغّل ثلاث منصات إنتاج حيّة.'
      ),
    },
    {
      icon: FaMicrophone,
      title: t('AI Voice Agents', 'وكلاء الصوت بالذكاء الاصطناعي'),
      description: t(
        'Voice AI built with LiveKit Agents and OpenAI Realtime API for sales and support.',
        'وكلاء صوتيون مبنيون باستخدام LiveKit Agents و OpenAI Realtime API لخدمات المبيعات والدعم.'
      ),
    },
    {
      icon: FaUsers,
      title: t('Scrum & Agile Delivery', 'Scrum وتسليم Agile'),
      description: t(
        'Facilitating ceremonies, managing backlogs, and coordinating sprints across three SaaS teams.',
        'إدارة الـ Sprints و الـ Backlog وتنسيق العمل عبر ثلاث فرق SaaS متوازية.'
      ),
    },
    {
      icon: FaClipboardList,
      title: t('Business Analysis', 'تحليل الأعمال'),
      description: t(
        'Requirements workshops and ROI modeling for digital transformation across Egypt, UAE, and KSA.',
        'ورش متطلبات ونمذجة ROI لمشاريع التحول الرقمي في مصر والإمارات والسعودية.'
      ),
    },
    {
      icon: FaChartLine,
      title: t('Digital Transformation', 'التحول الرقمي'),
      description: t(
        'Modernizing legacy systems with engineering rigor and AI-powered automation.',
        'تحديث الأنظمة التقليدية بمعايير هندسية صارمة وأتمتة مدعومة بالذكاء الاصطناعي.'
      ),
    },
  ]

  return (
    <section id="about" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="tab-eyebrow mb-6">002 · {t('about', 'نبذة')}</span>
          <h2 className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}>
            {ar ? (
              <>
                مهندس بثلاث منصات<br />
                في الإنتاج<span className="text-signal">.</span>
              </>
            ) : (
              <>
                Engineer with three<br />
                shipped products<span className="text-signal">.</span>
              </>
            )}
          </h2>
          <p className={`text-ash max-w-3xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {ar ? (
              <>
                مطور Full-Stack وخبير أتمتة بالذكاء الاصطناعي مقيم في القاهرة، مصر، بخبرة تتجاوز السنتين.
                في <span className="text-paper font-semibold">Ailigent</span> أعمل بشكل متزامن كـ Scrum Master ومهندس
                DevOps ومطور Full-Stack على ثلاث منصات SaaS حيّة —
                <span className="text-paper font-semibold"> Tornix.ai</span>،
                <span className="text-paper font-semibold"> Oravex.app</span>،
                و<span className="text-paper font-semibold"> Costra.ailigent.ai</span> —
                أُسلّم مشاريع تحول رقمي في مصر والإمارات والسعودية.
              </>
            ) : (
              <>
                Full-Stack Developer and AI automation expert based in Cairo, Egypt with 2+ years of experience.
                At <span className="text-paper font-semibold">Ailigent</span> I serve concurrently as Scrum Master,
                DevOps Engineer, and Full-Stack Developer across three live SaaS products —
                <span className="text-paper font-semibold"> Tornix.ai</span>,
                <span className="text-paper font-semibold"> Oravex.app</span>, and
                <span className="text-paper font-semibold"> Costra.ailigent.ai</span> — delivering digital
                transformation engagements across Egypt, UAE, and KSA.
              </>
            )}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {expertise.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-6 bg-graphite border border-wire hover:border-signal transition-colors duration-200"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors duration-200">
                  <item.icon className="text-lg" />
                </div>
                <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className={`font-bold text-lg mb-2 text-paper group-hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}>
                {item.title}
              </h3>
              <p className={`text-ash text-sm leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="mb-8 flex items-baseline gap-4">
            <h3 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>
              {t('technical · stack', 'الحزمة · التقنية')}
            </h3>
            <span className="h-px flex-1 bg-wire" />
            <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ash">
              {skillCategories.length} {t('categories', 'فئات')}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-wire border border-wire max-w-5xl mx-auto">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + catIndex * 0.06 }}
                className="p-6 bg-ink hover:bg-graphite transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-wire">
                  <h4 className={`font-bold text-sm tracking-[0.04em] uppercase text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>{category.title}</h4>
                  <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash">{category.items.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="tag-chip"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
