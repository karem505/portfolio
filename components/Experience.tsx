'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaCode, FaClipboardList, FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const roles = [
    {
      icon: FaCode,
      title: t(
        'Full-Stack Developer / DevOps / Scrum Master',
        'مطور Full-Stack / DevOps / Scrum Master'
      ),
      focus: t('Engineering & Delivery', 'الهندسة والتسليم'),
      period: t('2023 – Present', '2023 – حتى الآن'),
      location: t('Cairo, Egypt', 'القاهرة، مصر'),
      bullets: ar
        ? [
            'أعمل بشكل متزامن كمطور Full-Stack ومهندس DevOps و Scrum Master على ثلاث منصات SaaS حيّة.',
            'أُصمّم وأبني تطبيقات Full-Stack باستخدام TypeScript و React و Next.js و Python و FastAPI و Node.js.',
            'أُدير البنية السحابية و الحاويات و خطوط CI/CD على Railway و AWS EC2 باستخدام Docker و GitHub Actions.',
            'أُيسّر طقوس Agile و أُدير الـ Backlog و أُنسّق تخطيط الـ Sprints عبر فرق متعددة الاختصاصات.',
            'أُصمّم وأنشر وكلاء صوتيين بالذكاء الاصطناعي باستخدام LiveKit Agents و OpenAI Realtime API لأتمتة المبيعات وخدمة العملاء.',
            'بنيتُ OpenClaw Agent Dashboard — واجهة إدارة وكلاء بتصميم Glassmorphic مع 11 تكامل API ومراقبة فورية.',
            'طوّرتُ PE Live AI Agent: وكيل صوتي جاهز للإنتاج مع تكامل قاعدة البيانات عبر MCP و 8 أدوات قاعدة بيانات ودعم Tavus Avatar.',
            'أُسلّم مشاريع العملاء من الألف إلى الياء — من تحليل المتطلبات وهندسة النظام إلى النشر وتحسين ما بعد الإطلاق.',
          ]
        : [
            'Serve concurrently as Full-Stack Developer, DevOps Engineer, and Scrum Master across three live SaaS platforms.',
            'Architect and build full-stack applications using TypeScript, React, Next.js, Python, FastAPI, and Node.js.',
            'Manage cloud infrastructure, containerization, and CI/CD pipelines on Railway and AWS EC2 using Docker and GitHub Actions.',
            'Facilitate Agile ceremonies, maintain product backlogs, and coordinate sprint planning across cross-functional teams.',
            'Design and deploy voice AI agents using LiveKit Agents framework and OpenAI Realtime API for sales and customer support automation.',
            'Built OpenClaw Agent Dashboard, a glassmorphic agent management UI with 11 API integrations and real-time monitoring.',
            'Developed PE Live AI Agent: production-ready voice AI with MCP database integration, 8 database tools, and Tavus video avatar support.',
            'Deliver client engagements end-to-end from requirements analysis and system architecture to deployment and post-launch optimization.',
          ],
    },
    {
      icon: FaClipboardList,
      title: t('Business Analyst', 'محلل أعمال'),
      focus: t('Requirements & ROI', 'المتطلبات والـ ROI'),
      period: t('2023 – Present', '2023 – حتى الآن'),
      location: t('Cairo, Egypt', 'القاهرة، مصر'),
      bullets: ar
        ? [
            'أُدير ورش متطلبات ورسم خرائط للعمليات لمشاريع التحول الرقمي في مصر والسعودية والإمارات.',
            'أُترجم احتياجات أصحاب العلاقة إلى مواصفات تقنية و User Stories و Backlog جاهز للسبرنت.',
            'أُحرّر متطلبات وظيفية وغير وظيفية ومعايير نجاح واختبارات قبول قابلة للتسليم الهندسي.',
          ]
        : [
            'Conduct requirements workshops and process mapping for digital transformation engagements across Egypt, KSA, and UAE.',
            'Translate stakeholder needs into technical specifications, user stories, and sprint-ready backlogs.',
            'Author functional and non-functional requirements, success criteria, and acceptance tests that engineering can ship against.',
          ],
    },
  ]

  return (
    <section id="experience" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="tab-eyebrow mb-6">003 · {t('experience', 'الخبرات')}</span>
          <h2 className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t('Roles at Ailigent', 'أدواري في Ailigent')}
            <span className="text-signal">.</span>
          </h2>
          <p className={`text-ash max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t(
              'Two concurrent roles: full-stack engineering and delivery, plus business analysis on digital transformation engagements.',
              'دوران متزامنان: هندسة Full-Stack وتسليم المنتج، بالإضافة إلى تحليل الأعمال في مشاريع التحول الرقمي.'
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mb-14"
        >
          <div className={`inline-flex items-center gap-4 px-5 py-3 border border-wire bg-graphite text-sm ${ar ? 'font-rubik' : 'font-mono'}`}>
            <FaBuilding className="text-signal" />
            <span className="font-bold text-paper tracking-[-0.02em]">Ailigent</span>
            <span className="text-wire">·</span>
            <span className="text-ash text-xs tracking-[0.04em] uppercase">
              {t('AI Automation Solutions', 'حلول أتمتة بالذكاء الاصطناعي')}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              className="group relative p-7 md:p-8 bg-graphite border border-wire hover:border-signal transition-colors duration-200"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-wire">
                  <div className="w-11 h-11 border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors">
                    <role.icon className="text-base" />
                  </div>
                  <span className={`text-[0.65rem] tracking-[0.18em] uppercase text-signal border border-signal px-2 py-1 ${ar ? 'font-rubik' : 'font-mono'}`}>
                    {role.focus}
                  </span>
                  <span className="ml-auto font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash/60">
                    {t('role', 'دور')} · {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className={`font-extrabold tracking-[-0.03em] text-xl md:text-2xl mb-4 text-paper leading-tight ${ar ? 'font-rubik' : 'font-mono'}`}>
                  {role.title}
                </h3>

                <div className={`flex flex-wrap items-center gap-x-5 gap-y-1 mb-6 text-xs text-ash ${ar ? 'font-rubik' : 'font-mono'}`}>
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-signal text-[0.7rem]" />
                    {role.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-signal text-[0.7rem]" />
                    {role.location}
                  </span>
                </div>

                <ul className="space-y-2">
                  {role.bullets.map((bullet, i) => (
                    <li key={i} className={`flex gap-3 text-ash text-sm leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
                      <span className="text-signal flex-shrink-0 font-bold mt-0.5">›</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-14 p-8 md:p-10 border border-signal bg-graphite"
        >
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 mb-4">
            <h3 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>
              {t('Concurrent delivery, end to end', 'تسليم متزامن من الألف إلى الياء')}
              <span className="text-signal">.</span>
            </h3>
            <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-signal">
              / {t('note', 'ملاحظة')}
            </span>
          </div>
          <p className={`text-ash max-w-3xl leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t(
              'Concurrent delivery across three SaaS products, plus business analysis on digital transformation engagements across Egypt, UAE, and KSA.',
              'تسليم متزامن لثلاث منصات SaaS، بالإضافة إلى تحليل الأعمال على مشاريع التحول الرقمي في مصر والإمارات والسعودية.'
            )}
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
