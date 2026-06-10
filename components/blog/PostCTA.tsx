'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import type { Post } from '@/lib/types'

// Post types where AI-training is the more relevant primary offer; the rest lead
// with digital-transformation. Both links always render so every post passes
// internal-link equity to both money pages.
const TRAINING_FIRST: Post['post_type'][] = ['how-to', 'tutorial', 'insights']

interface PostCTAProps {
  postType: Post['post_type']
}

export default function PostCTA({ postType }: PostCTAProps) {
  const { language } = useLanguage()
  const ar = language === 'ar'
  const font = ar ? 'font-rubik' : 'font-mono'

  const training = {
    href: '/ai-training',
    title: ar
      ? 'تدريب الذكاء الاصطناعي للموظفين والمدراء'
      : 'AI Training for Employees & Executives',
    desc: ar
      ? 'درّب فريقك على ChatGPT وClaude وهندسة الأوامر والأتمتة — حضورياً أو أونلاين في مصر والإمارات والسعودية.'
      : 'Hands-on ChatGPT, Claude, prompt-engineering & automation training — on-site or online across Egypt, the UAE & KSA.',
  }
  const dx = {
    href: '/digital-transformation',
    title: ar
      ? 'التحول الرقمي وأتمتة العمليات'
      : 'Digital Transformation & Process Automation',
    desc: ar
      ? 'حوّل العمليات اليدوية إلى أنظمة مؤتمتة مدعومة بالذكاء الاصطناعي تتوسّع مع نمو أعمالك.'
      : 'Turn manual, repetitive operations into automated, AI-powered systems that scale.',
  }

  const cards = TRAINING_FIRST.includes(postType) ? [training, dx] : [dx, training]

  return (
    <aside
      dir={ar ? 'rtl' : 'ltr'}
      className={`mt-12 sm:mt-16 pt-8 border-t border-white/10 ${ar ? 'text-right' : 'text-left'}`}
    >
      <span className="tab-eyebrow mb-4">{ar ? 'اعمل مع كارم' : 'Work with Karem'}</span>
      <h2 className={`font-display font-bold text-xl sm:text-2xl mb-2 mt-3 text-paper ${font}`}>
        {ar
          ? 'حوِّل هذه الأفكار إلى نتائج فعلية'
          : 'Turn these ideas into real results'}
      </h2>
      <p className={`text-muted text-sm sm:text-base leading-relaxed mb-6 ${font}`}>
        {ar
          ? 'يساعد ابوالمكارم شهود (كارم) الشركات في مصر والخليج على تبنّي الذكاء الاصطناعي عملياً — تدريباً وتحوّلاً رقمياً.'
          : 'Abo-Elmakarem Shohoud (Karem) helps companies across Egypt & the Gulf adopt AI in practice — through training and digital transformation.'}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group block p-5 border border-wire bg-graphite hover:border-signal transition-colors duration-200"
          >
            <h3
              className={`font-bold text-base mb-2 text-paper group-hover:text-signal transition-colors ${font}`}
            >
              {card.title}
            </h3>
            <p className={`text-ash text-sm leading-relaxed ${font}`}>{card.desc}</p>
            <span
              className={`mt-3 inline-flex items-center gap-2 text-signal text-sm font-medium ${font}`}
            >
              {ar ? 'اعرف المزيد' : 'Learn more'}
              <span aria-hidden="true">{ar ? '←' : '→'}</span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
