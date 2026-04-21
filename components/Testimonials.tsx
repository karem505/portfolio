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
          <span className="text-primary font-medium mb-4 block">Testimonials</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            What <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
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
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 rounded-3xl glass border border-white/5 hover:border-primary/30 transition-all duration-300"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Quote Icon + Product Tag */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center`}
                >
                  <FaQuoteLeft className="text-white text-lg" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-white/90 border border-white/10">
                  {testimonial.product}
                </span>
              </div>

              {/* Quote Text */}
              <p className="text-muted leading-relaxed mb-8 relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="relative z-10">
                <div className="font-display font-bold text-white">{testimonial.name}</div>
                <div className="text-muted text-sm">
                  {testimonial.role}, {testimonial.company}
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
