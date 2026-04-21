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
          <span className="text-primary font-medium mb-4 block">About Me</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Transforming Ideas into
            <span className="gradient-text"> Digital Reality</span>
          </h2>
          <p className="text-muted max-w-3xl mx-auto text-lg">
            Full-Stack Developer and AI automation expert based in Cairo, Egypt with 2+ years of experience.
            At <span className="text-white font-semibold">Ailigent</span> I serve concurrently as Scrum Master,
            DevOps Engineer, and Full-Stack Developer across three live SaaS products —
            <span className="text-white font-semibold"> Tornix.ai</span>,
            <span className="text-white font-semibold"> Oravex.app</span>, and
            <span className="text-white font-semibold"> Costra.ailigent.ai</span> — delivering digital
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
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 rounded-2xl glass border border-white/5 hover:border-primary/30 transition-all duration-300"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                <item.icon className="text-white text-2xl" />
              </div>

              <h3 className="font-display font-bold text-xl mb-2 text-white group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
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
          <h3 className="font-display font-bold text-2xl text-center mb-10">Technical Skills</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + catIndex * 0.1 }}
                className="p-6 rounded-2xl glass border border-white/5 hover:border-primary/20 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-10 h-1 rounded-full bg-gradient-to-r ${category.accent}`} />
                  <h4 className="font-display font-semibold text-lg text-white">{category.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="tech-badge px-3 py-1.5 rounded-lg text-sm font-medium text-white/90"
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="text-center p-6 rounded-2xl glass border border-white/5"
            >
              <div className="font-display font-bold text-4xl md:text-5xl gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-muted text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
