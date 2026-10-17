'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaPlay, FaCopy, FaCheck } from 'react-icons/fa'

// Click-to-load YouTube player: ships only a poster image until the visitor
// presses play, so the page carries no YouTube JS on first load.
export function YouTubeFacade({
  id,
  poster,
  title,
  label,
}: {
  id: string
  poster: string
  title: string
  label: string
}) {
  const [play, setPlay] = useState(false)

  if (play) {
    return (
      <div className="aspect-video w-full border border-wire bg-ink">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={label}
      className="group relative block w-full border border-wire hover:border-signal transition-colors"
    >
      <Image
        src={poster}
        alt=""
        width={1600}
        height={900}
        sizes="(max-width: 768px) 100vw, 480px"
        className="w-full h-auto"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/35 group-hover:bg-ink/20 transition-colors">
        <span className="flex items-center justify-center w-16 h-16 border border-paper bg-ink/70 text-paper group-hover:border-signal group-hover:text-signal transition-colors">
          <FaPlay className="ml-1" />
        </span>
      </span>
    </button>
  )
}

export function CopyCommand({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex items-start gap-3 bg-ink border border-wire px-4 py-3" dir="ltr">
      <code className="flex-1 text-xs md:text-sm text-paper font-mono whitespace-pre-wrap break-all">{value}</code>
      <button
        type="button"
        aria-label={label}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          } catch {
            /* clipboard unavailable — no-op */
          }
        }}
        className="inline-flex items-center text-ash hover:text-signal transition-colors shrink-0 mt-0.5"
      >
        {copied ? <FaCheck size={13} /> : <FaCopy size={13} />}
      </button>
    </div>
  )
}
