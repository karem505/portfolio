'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaLinkedin, FaGithub, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const form = e.currentTarget
      const data = new FormData(form)

      const encodedData = new URLSearchParams()
      encodedData.append('form-name', 'contact')
      encodedData.append('name', data.get('name') as string)
      encodedData.append('email', data.get('email') as string)
      encodedData.append('message', data.get('message') as string)

      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodedData.toString(),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error('Form submission failed')
      }
    } catch (err) {
      setError(t(
        'Something went wrong. Please try again or contact me on LinkedIn.',
        'حدث خطأ. حاول مرة أخرى أو تواصل معي عبر LinkedIn.'
      ))
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      label: t('Location', 'الموقع'),
      value: t('Cairo, Egypt', 'القاهرة، مصر'),
      href: null,
    },
    {
      icon: FaLinkedin,
      label: 'LinkedIn',
      value: t('Connect with me', 'تواصل معي'),
      href: 'https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244',
    },
    {
      icon: FaGithub,
      label: 'GitHub',
      value: '@karem505',
      href: 'https://github.com/karem505',
    },
  ]

  return (
    <section id="contact" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="tab-eyebrow mb-6">007 · {t('contact', 'تواصل')}</span>
          <h2 className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t("Let's work together", 'لنعمل معًا')}
            <span className="text-signal">.</span>
          </h2>
          <p className={`text-ash max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t(
              'Send a role, send a brief. I read every message and reply within 24 hours.',
              'أرسل وصف الوظيفة أو نطاق المشروع. أقرأ كل رسالة وأرد خلال 24 ساعة.'
            )}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: ar ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`h-full flex flex-col items-center justify-center p-12 bg-graphite border border-moss text-center ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <FaCheckCircle className="text-moss text-5xl mb-6" />
                <h3 className="font-extrabold tracking-[-0.03em] text-2xl mb-3 text-paper">
                  {t('Message sent', 'تم إرسال الرسالة')}
                  <span className="text-signal">.</span>
                </h3>
                <p className="text-ash mb-6 max-w-sm">
                  {t(
                    "Thank you for reaching out. I'll get back to you as soon as possible.",
                    'شكرًا لتواصلك. سأعود إليك في أقرب وقت ممكن.'
                  )}
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-wire text-paper text-sm hover:border-signal hover:text-signal transition-colors"
                >
                  <span>{t('Send another message', 'إرسال رسالة أخرى')}</span>
                  <span>{ar ? '←' : '→'}</span>
                </button>
              </motion.div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Don't fill this out: <input name="bot-field" />
                  </label>
                </p>

                <div>
                  <label htmlFor="name" className={`block text-[0.7rem] tracking-[0.18em] uppercase text-ash mb-2 ${ar ? 'font-rubik' : 'font-mono'}`}>
                    {t('Your name', 'الاسم')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={`w-full px-4 py-3 bg-graphite border border-wire focus:border-signal focus:outline-none text-paper placeholder-ash/50 text-sm transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}
                    placeholder={t('John Doe', 'محمد أحمد')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-[0.7rem] tracking-[0.18em] uppercase text-ash mb-2 ${ar ? 'font-rubik' : 'font-mono'}`}>
                    {t('Email address', 'البريد الإلكتروني')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-graphite border border-wire focus:border-signal focus:outline-none text-paper placeholder-ash/50 font-mono text-sm transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-[0.7rem] tracking-[0.18em] uppercase text-ash mb-2 ${ar ? 'font-rubik' : 'font-mono'}`}>
                    {t('Your message', 'الرسالة')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 bg-graphite border border-wire focus:border-signal focus:outline-none text-paper placeholder-ash/50 text-sm transition-colors resize-none ${ar ? 'font-rubik' : 'font-mono'}`}
                    placeholder={t('Tell me about your project...', 'حدّثني عن مشروعك...')}
                  />
                </div>

                {error && (
                  <p className={`text-signal text-sm ${ar ? 'font-rubik' : 'font-mono'}`}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-5 bg-paper text-ink text-sm font-medium tracking-wide flex items-center justify-center gap-3 hover:bg-signal hover:text-paper transition-colors duration-150 disabled:opacity-50 border border-paper hover:border-signal ${ar ? 'font-rubik' : 'font-mono'}`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border border-ink/30 border-t-ink rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaPaperPlane size={12} />
                      <span>{t('Send message', 'إرسال الرسالة')}</span>
                      <span>{ar ? '←' : '→'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: ar ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="border-t border-wire">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.4 + index * 0.06 }}
                  className="border-b border-wire group"
                >
                  {info.href ? (
                    <a
                      href={info.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-5 py-5 group-hover:px-2 transition-[padding] duration-200"
                    >
                      <div className="w-11 h-11 border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors">
                        <info.icon className="text-base" />
                      </div>
                      <div className="flex-1">
                        <div className={`text-ash text-[0.7rem] tracking-[0.18em] uppercase ${ar ? 'font-rubik' : 'font-mono'}`}>{info.label}</div>
                        <div className={`text-paper mt-1 group-hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}>
                          {info.value}
                        </div>
                      </div>
                      <span className="text-ash group-hover:text-signal font-mono text-sm transition-colors">↗</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-5 py-5">
                      <div className="w-11 h-11 border border-wire flex items-center justify-center text-paper">
                        <info.icon className="text-base" />
                      </div>
                      <div>
                        <div className={`text-ash text-[0.7rem] tracking-[0.18em] uppercase ${ar ? 'font-rubik' : 'font-mono'}`}>{info.label}</div>
                        <div className={`text-paper mt-1 ${ar ? 'font-rubik' : 'font-mono'}`}>{info.value}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="p-8 bg-signal text-ink"
            >
              <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase block mb-4 opacity-80">
                ▍ {t('recruiters · clients', 'مسؤولو · التوظيف · والعملاء')}
              </span>
              <h3 className={`font-extrabold tracking-[-0.04em] text-2xl md:text-3xl mb-4 leading-tight ${ar ? 'font-rubik' : 'font-mono'}`}>
                {t('Need someone who can ship?', 'تبحث عن من يُسلّم فعلًا؟')}
              </h3>
              <p className={`text-sm md:text-base mb-6 leading-relaxed opacity-90 max-w-md ${ar ? 'font-rubik' : 'font-mono'}`}>
                {t(
                  'Full-Stack, DevOps, and Scrum Master across three live SaaS products. Send a role brief or a project scope; I respond within 24 hours.',
                  'Full-Stack و DevOps و Scrum Master على ثلاث منصات SaaS حيّة. أرسل وصف وظيفة أو نطاق مشروع، وسأرد خلال 24 ساعة.'
                )}
              </p>
              <a
                href="https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 px-5 py-3 bg-ink text-paper text-sm font-medium hover:bg-paper hover:text-ink transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <FaLinkedin />
                <span>{t('Connect on LinkedIn', 'تواصل عبر LinkedIn')}</span>
                <span>{ar ? '←' : '→'}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
