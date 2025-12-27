'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { SiPython, SiTypescript, SiDocker, SiNextdotjs } from 'react-icons/si'

const projects = [
  {
    title: 'PE Live AI Agent',
    description: 'Voice AI agent built with LiveKit Agents framework, featuring OpenAI Realtime API, MCP for database integration, and Tavus video avatar. Production-ready with 8 database tools.',
    tech: ['Python', 'LiveKit', 'OpenAI', 'MCP', 'Tavus'],
    icon: SiPython,
    color: '#3776ab',
    github: 'https://github.com/karem505/PE-live-ai-agent',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    title: 'Technical Support Agent',
    description: 'AI voice assistant for Odoo technical support with screen sharing capabilities and MCP integration. Natural voice conversations powered by LiveKit and OpenAI.',
    tech: ['Python', 'LiveKit', 'FastAPI', 'Odoo', 'MCP'],
    icon: SiPython,
    color: '#3776ab',
    github: 'https://github.com/karem505/technical-support-agent',
    gradient: 'from-purple-600 to-pink-500',
  },
  {
    title: 'Odoo Railway Deployment',
    description: 'Odoo 18 + LiveKit Voice Agent deployment template optimized for Railway. Easy one-click deployment for AI-powered Odoo instances.',
    tech: ['Python', 'Docker', 'Railway', 'Odoo', 'LiveKit'],
    icon: SiDocker,
    color: '#2496ed',
    github: 'https://github.com/karem505/odoo-railway-deployment',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Ailigent Spark',
    description: 'AI-powered business automation platform by Ailigent. Streamline operations and boost efficiency with intelligent automation solutions.',
    tech: ['TypeScript', 'Next.js', 'React', 'AI'],
    icon: SiNextdotjs,
    color: '#ffffff',
    github: 'https://github.com/karem505/ailigent-spark',
    gradient: 'from-indigo-600 to-violet-500',
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="projects" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-medium mb-4 block">My Work</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            A collection of projects showcasing my expertise in AI automation,
            voice agents, and full-stack development.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-3xl glass border border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Glow Effect */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-xl"
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                    >
                      <project.icon className="text-white text-2xl" />
                    </div>

                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-xl glass text-muted hover:text-white transition-colors"
                    >
                      <FaGithub size={20} />
                    </motion.a>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-2xl mb-3 text-white group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-muted border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    x: hoveredIndex === index ? 0 : -10,
                  }}
                  className="absolute bottom-8 right-8 text-primary"
                >
                  <FaExternalLinkAlt size={18} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com/karem505"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 font-semibold hover:bg-white/10 transition-all duration-300"
          >
            <FaGithub size={20} />
            View All Projects
          </motion.a>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
