'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Ahmed R.',
    role: 'PMO Director',
    company: 'Enterprise Construction',
    product: 'Tornix.ai',
    quote:
      'The CPM Gantt module and Primavera XER compatibility in Tornix.ai transformed how we plan and track projects. Sprints ship on time and our PMO finally has a single source of truth.',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Omar K.',
    role: 'CTO',
    company: 'Mid-Market ERP Client',
    product: 'Oravex.app',
    quote:
      'Our team queries the ERP in plain Arabic and English now. Oravex.app cut the learning curve for non-technical users and our Odoo rollout came in weeks ahead of schedule.',
    gradient: 'from-indigo-500 to-violet-400',
  },
  {
    name: 'Sarah M.',
    role: 'Operations Lead',
    company: 'Contracting Firm',
    product: 'Costra.ailigent.ai',
    quote:
      'Costra gave us accurate cost estimates in Arabic RTL with dashboards we actually use. Ailigent handled everything from delivery to deployment — our operational costs dropped by more than half.',
    gradient: 'from-orange-500 to-red-500',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="testimonials" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="tab-eyebrow mb-6">005 · field · notes</span>
          <h2 className="font-mono font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95]">
            What clients say<span className="text-signal">.</span>
          </h2>
          <p className="text-ash max-w-2xl mx-auto text-base md:text-lg font-mono leading-relaxed">
            Real results from businesses that used AI automation to cut costs and scale faster.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative p-7 md:p-8 bg-graphite border border-wire hover:border-signal transition-colors duration-200"
            >
              {/* Quote Icon + Product Tag */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors">
                  <FaQuoteLeft className="text-sm" />
                </div>
                <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-signal border border-signal px-2 py-1">
                  {testimonial.product}
                </span>
              </div>

              {/* Quote Text */}
              <p className="text-paper leading-relaxed mb-8 font-mono text-sm md:text-base">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="pt-5 border-t border-wire">
                <div className="font-mono font-bold text-paper text-base">{testimonial.name}</div>
                <div className="text-ash text-xs font-mono mt-1 uppercase tracking-[0.04em]">
                  {testimonial.role} · {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
