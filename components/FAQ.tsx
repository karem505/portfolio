'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const faqs = [
  {
    question: 'What is AI automation and how can it help my business?',
    answer:
      'AI automation uses artificial intelligence to handle repetitive tasks, make decisions, and streamline workflows. It can help your business reduce manual work, cut operational costs by up to 70%, and free your team to focus on high-value activities.',
  },
  {
    question: 'How do voice agents work?',
    answer:
      'Voice agents use technologies like LiveKit and OpenAI Realtime API to have natural conversations with your customers. They can handle sales calls, customer support, appointment scheduling, and more — 24/7, without human intervention.',
  },
  {
    question: 'How much can AI automation save my business?',
    answer:
      'Most businesses see cost reductions of 40-70% in automated processes. The exact savings depend on your current workflows, team size, and the complexity of tasks being automated. I provide a free audit to estimate your potential savings.',
  },
  {
    question: 'What technologies do you use?',
    answer:
      'My core stack: TypeScript, Python, React, Next.js, Node.js, FastAPI, and Flutter. For AI, LiveKit Agents, OpenAI Realtime API, MCP, and Tavus. For DevOps, Docker, GitHub Actions, AWS EC2, Railway, Linux, and Nginx. For ERP, Odoo 18. Every project gets the right stack for the job.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Yes. I am based in Cairo, Egypt and I deliver engagements across Egypt, the UAE, and KSA — the three regions my Ailigent work primarily serves. Communication is in English or Arabic.',
  },
  {
    question: 'How do I get started with AI automation?',
    answer:
      'Start by reaching out through the contact form or LinkedIn. I will schedule a free consultation to understand your business needs, identify automation opportunities, and propose a solution with clear timelines and expected ROI.',
  },
]

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" ref={ref} className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="tab-eyebrow mb-6">006 · faq</span>
          <h2 className="font-mono font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95]">
            Frequently asked<span className="text-signal">.</span>
          </h2>
          <p className="text-ash max-w-2xl mx-auto text-base md:text-lg font-mono leading-relaxed">
            Common questions about AI automation, voice agents, and how I can help your business.
          </p>
        </motion.div>

        {/* FAQ Items */}
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
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ash/55 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono font-bold text-paper text-base md:text-lg group-hover:text-signal transition-colors">
                    {faq.question}
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-signal flex-shrink-0 ml-4"
                >
                  <FaChevronDown size={12} />
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="pb-6 pl-12 pr-4 text-ash leading-relaxed font-mono text-sm md:text-base">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
