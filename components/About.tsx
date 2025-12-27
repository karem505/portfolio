'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  SiTypescript, SiPython, SiReact, SiNextdotjs, SiNodedotjs,
  SiFlutter, SiDocker, SiFastapi, SiOpenai
} from 'react-icons/si'
import { FaRobot, FaMicrophone, FaCode, FaMobile } from 'react-icons/fa'

const skills = [
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6' },
  { name: 'Python', icon: SiPython, color: '#3776ab' },
  { name: 'React', icon: SiReact, color: '#61dafb' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Flutter', icon: SiFlutter, color: '#02569b' },
  { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
  { name: 'Docker', icon: SiDocker, color: '#2496ed' },
  { name: 'OpenAI', icon: SiOpenai, color: '#10a37f' },
]

const expertise = [
  {
    icon: FaRobot,
    title: 'AI Automation',
    description: 'Building intelligent systems that automate complex business processes',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: FaMicrophone,
    title: 'Voice Agents',
    description: 'Creating conversational AI with LiveKit & OpenAI Realtime API',
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    icon: FaCode,
    title: 'Full-Stack Dev',
    description: 'End-to-end development with modern frameworks and best practices',
    gradient: 'from-orange-500 to-yellow-400',
  },
  {
    icon: FaMobile,
    title: 'Mobile Apps',
    description: 'Cross-platform mobile development with Flutter',
    gradient: 'from-green-500 to-emerald-400',
  },
]

const stats = [
  { value: '15+', label: 'Projects Completed' },
  { value: '70%', label: 'Cost Reduction' },
  { value: '2+', label: 'Years Experience' },
  { value: '10+', label: 'Happy Clients' },
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
          <p className="text-muted max-w-2xl mx-auto text-lg">
            I'm an AI automation expert passionate about building solutions that make businesses
            more efficient. Based in Cairo, Egypt, I specialize in voice agents and intelligent systems.
          </p>
        </motion.div>

        {/* Expertise Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="font-display font-bold text-2xl text-center mb-8">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="tech-badge px-5 py-3 rounded-xl flex items-center gap-3 cursor-default"
              >
                <skill.icon size={24} style={{ color: skill.color }} />
                <span className="font-medium text-white">{skill.name}</span>
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
