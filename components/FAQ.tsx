'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const faqs = ar
    ? [
        {
          question: 'ما الـ Stack الأساسي الذي تعمل به؟',
          answer:
            'TypeScript و React و Next.js على الواجهة الأمامية، Python (FastAPI) و Node.js على الواجهة الخلفية، PostgreSQL و Odoo 18 حين يناسب الـ ERP. أعمال الـ Voice AI تعتمد على LiveKit Agents و OpenAI Realtime و MCP و Tavus.',
        },
        {
          question: 'كيف تُسلّم وتُشغّل ثلاث منصات SaaS بشكل متزامن؟',
          answer:
            'كل منتج (Tornix.ai، Oravex.app، Costra) له Repo مستقل و Pipeline خاص و Docker Image منفصل، وأُدير إيقاع الـ Sprints كـ Scrum Master وأمتلك النشر من الألف إلى الياء. أنماط البنية التحتية المشتركة والوحدات القابلة لإعادة الاستخدام تجعل تكلفة تشغيل ثلاثة منتجات أقرب إلى تكلفة منتج واحد.',
        },
        {
          question: 'هل تعمل بالعربية؟ هل تُسلّم باللغتين؟',
          answer:
            'نعم. اللغة العربية واجهة من الدرجة الأولى في كل منتج أبنيه، مع دعم RTL صحيح وتايبوغرافي عربي أصيل وتواصل احترافي مع أصحاب العلاقة بالعربية. أكتب أيضًا المحتوى التقني بالإنجليزية والعربية.',
        },
        {
          question: 'ما إعداد الـ DevOps لديك؟',
          answer:
            'Docker لكل شيء، GitHub Actions لـ CI/CD، AWS EC2 و Railway للاستضافة، Nginx كـ Reverse Proxy، و Linux على الـ Bare Metal. مراقبة عبر فحوصات Uptime وشحن السجلات وتنبيهات على الإشارات الأساسية المملّة والحساسة.',
        },
        {
          question: 'هل أنت متاح لأدوار Full-time أم عقود أم كليهما؟',
          answer:
            'كلاهما. أقبل أدوار Full-time وعقود مؤقتة ومشاريع بنطاق محدد، مع تفضيل للعمل الذي أستطيع فيه امتلاك الهندسة والتسليم بالكامل. مرن للعمل عن بُعد في توقيتات CET / GMT المجاورة.',
        },
        {
          question: 'ما أسرع طريقة للوصول إليّ لمسؤولي التوظيف ومديري التوظيف؟',
          answer:
            'رسالة LinkedIn أو نموذج التواصل في هذا الموقع. أرد خلال 24 ساعة وأقرأ كل رسالة. أرسل وصفًا للوظيفة أو نطاق المشروع وستحصل على تقييم Fit فعلي، لا ردًا قالبيًا.',
        },
      ]
    : [
        {
          question: "What's your primary stack?",
          answer:
            'TypeScript, React, and Next.js on the frontend; Python (FastAPI) and Node.js on the backend; Postgres and Odoo 18 where ERP fits. Voice AI work runs on LiveKit Agents, OpenAI Realtime, MCP, and Tavus.',
        },
        {
          question: 'How do you ship and run three SaaS products concurrently?',
          answer:
            'Each product (Tornix.ai, Oravex.app, Costra) has its own repo, CI pipeline, and Docker image; I run sprint cadence as Scrum Master and own deployments end to end. Shared infra patterns and reusable modules keep the operating cost of three products closer to one.',
        },
        {
          question: 'Do you work in Arabic? Bilingual delivery?',
          answer:
            'Yes. Arabic is a first-class surface in every product I build, with proper RTL, native typography, and Arabic-fluent stakeholder communication. I also write technical content in both English and Arabic.',
        },
        {
          question: "What's your DevOps setup?",
          answer:
            'Docker for everything, GitHub Actions for CI/CD, AWS EC2 and Railway for hosting, Nginx as the reverse proxy, and Linux on the metal. Observability via uptime checks, log shipping, and alerting on the boring-but-critical signals.',
        },
        {
          question: 'Open to full-time roles, contracts, or both?',
          answer:
            'Both. I take full-time roles, contract engagements, and fixed-scope projects, with a preference for work where I can own engineering and delivery end to end. Remote-friendly across CET/GMT-adjacent timezones.',
        },
        {
          question: 'How can recruiters or hiring managers reach you fastest?',
          answer:
            'LinkedIn DM or the contact form on this site. I respond within 24 hours and read every message; paste a role brief or scope and I will reply with a fit assessment, not a templated thank-you.',
        },
      ]

  return (
    <section id="faq" ref={ref} className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="tab-eyebrow mb-6">006 · {t('faq', 'أسئلة شائعة')}</span>
          <h2 className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t('Frequently asked', 'أسئلة متكررة')}
            <span className="text-signal">.</span>
          </h2>
          <p className={`text-ash max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t(
              'Stack, shipping cadence, languages, and how to reach me. Engineer-spoken, no consulting pitch.',
              'الـ Stack وإيقاع التسليم واللغات وكيفية الوصول إليّ. بلسان مهندس، بدون عرض استشاري.'
            )}
          </p>
        </motion.div>

        <div className="border-t border-wire">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="border-b border-wire transition-colors duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-baseline justify-between py-5 text-left group"
                aria-expanded={openIndex === index}
                aria-controls={`faq-panel-${index}`}
                id={`faq-button-${index}`}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ash/55 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-bold text-paper text-base md:text-lg group-hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}>
                    {faq.question}
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-signal flex-shrink-0 ml-4"
                  aria-hidden="true"
                >
                  <FaChevronDown size={12} />
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className={`pb-6 pl-12 pr-4 text-ash leading-relaxed text-sm md:text-base ${ar ? 'font-rubik' : 'font-mono'}`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
