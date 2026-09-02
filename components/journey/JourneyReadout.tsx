'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { getChapter } from '@/lib/journey/chapters'
import { useJourneyChapter } from '@/lib/journey/store'

/**
 * Timecode-style chapter readout (desktop only): "004 / shipped · work" plus a
 * chapter-progress wire driven by the --chapter-p CSS variable, so it only
 * re-renders when the chapter changes.
 */
export default function JourneyReadout() {
  const chapter = useJourneyChapter()
  const { language } = useLanguage()
  const ar = language === 'ar'
  const c = getChapter(chapter)

  return (
    <div
      aria-hidden="true"
      className="journey-readout hidden lg:flex fixed bottom-8 start-5 z-40 items-center gap-3 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash pointer-events-none select-none"
    >
      <span className="text-paper tabular-nums">{c.number}</span>
      <span className="text-wire">/</span>
      <span className={ar ? 'font-rubik' : ''}>{ar ? c.ar : c.en}</span>
      <span className="journey-readout-wire">
        <span />
      </span>
    </div>
  )
}
