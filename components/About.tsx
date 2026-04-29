'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  FaCode, FaServer, FaUsers, FaMicrophone, FaChartLine, FaClipboardList
} from 'react-icons/fa'

const skillCategories = [
  {
    title: 'Languages & Frameworks',
    items: ['TypeScript', 'Python', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Flutter', 'FastAPI'],
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    title: 'DevOps & Infrastructure',
    items: ['Docker', 'GitHub Actions', 'AWS EC2', 'Railway', 'CI/CD Pipelines', 'Linux', 'Nginx'],
    accent: 'from-orange-500 to-yellow-400',
  },
  {
    title: 'AI & Automation',
    items: ['OpenAI Realtime API', 'LiveKit Agents', 'MCP (Model Context Protocol)', 'Tavus'],
    accent: 'from-purple-500 to-pink-400',
  },
  {
    title: 'ERP & Business Systems',
    items: ['Odoo 18', 'Process Automation', 'Business Analysis', 'Digital Transformation'],
    accent: 'from-indigo-500 to-violet-400',
  },
  {
    title: 'Agile & Leadership',
    items: ['Scrum Master', 'Product Ownership', 'Sprint Planning', 'Backlog Management'],
    accent: 'from-teal-500 to-green-400',
  },
]

const expertise = [
  {
    icon: FaCode,
    title: 'Full-Stack Development',
    description: 'TypeScript, React, Next.js, Python, FastAPI, and Node.js across production SaaS apps.',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: FaServer,
    title: 'DevOps & Cloud',
    description: 'Docker, GitHub Actions, AWS EC2, and Railway pipelines running three live products.',
    gradient: 'from-orange-500 to-yellow-400',
  },
  {
    icon: FaMicrophone,
    title: 'AI Voice Agents',
    description: 'Voice AI built with LiveKit Agents and OpenAI Realtime API for sales and support.',
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    icon: FaUsers,
    title: 'Scrum & Agile Delivery',
    description: 'Facilitating ceremonies, managing backlogs, and coordinating sprints across three SaaS teams.',
    gradient: 'from-teal-500 to-green-400',
  },
  {
    icon: FaClipboardList,
    title: 'Business Analysis',
    description: 'Requirements workshops and ROI modeling for digital transformation across Egypt, UAE, and KSA.',
    gradient: 'from-rose-500 to-pink-400',
  },
  {
    icon: FaChartLine,
    title: 'Digital Transformation',
    description: 'From legacy systems to AI-powered operations — consistently 50–70% cost reduction.',
    gradient: 'from-indigo-500 to-violet-400',
  },
]

const stats = [
  { value: '3', label: 'Live SaaS Products' },
  { value: '70%', label: 'Cost Reduction' },
  { value: '2+', label: 'Years Experience' },
  { value: '3', label: 'Regions Served' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="tab-eyebrow mb-6">002 · about</span>
          <h2 className="font-mono font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95]">
            Engineer with three<br />
            shipped products<span className="text-signal">.</span>
          </h2>
          <p className="text-ash max-w-3xl mx-auto text-base md:text-lg leading-relaxed font-mono">
            Full-Stack Developer and AI automation expert based in Cairo, Egypt with 2+ years of experience.
            At <span className="text-paper font-semibold">Ailigent</span> I serve concurrently as Scrum Master,
            DevOps Engineer, and Full-Stack Developer across three live SaaS products —
            <span className="text-paper font-semibold"> Tornix.ai</span>,
            <span className="text-paper font-semibold"> Oravex.app</span>, and
            <span className="text-paper font-semibold"> Costra.ailigent.ai</span> — delivering digital
            transformation engagements across Egypt, UAE, and KSA.
          </p>
        </motion.div>

        {/* Expertise Cards */}
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

              <h3 className="font-mono font-bold text-lg mb-2 text-paper group-hover:text-signal transition-colors">
                {item.title}
              </h3>
              <p className="text-ash text-sm leading-relaxed font-mono">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Skills by Category */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="mb-8 flex items-baseline gap-4">
            <h3 className="font-mono font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper">technical · stack</h3>
            <span className="h-px flex-1 bg-wire" />
            <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ash">{skillCategories.length} categories</span>
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
                  <h4 className="font-mono font-bold text-sm tracking-[0.04em] uppercase text-paper">{category.title}</h4>
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.06 }}
              className="p-6 border border-wire bg-graphite hover:border-signal transition-colors"
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash">{String(index + 1).padStart(2, '0')}</span>
                <span className="h-px flex-1 ml-3 bg-wire" />
              </div>
              <div className="font-mono font-extrabold tracking-[-0.04em] text-5xl md:text-6xl text-paper mb-2 leading-none">
                {stat.value}
              </div>
              <div className="text-ash text-xs font-mono uppercase tracking-[0.18em]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
