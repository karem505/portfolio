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
          <span className="text-primary font-medium mb-4 block">FAQ</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Common questions about AI automation, voice agents, and how I can help your business.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl glass border border-white/5 hover:border-primary/20 transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-display font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-primary flex-shrink-0"
                >
                  <FaChevronDown />
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-muted leading-relaxed">
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
