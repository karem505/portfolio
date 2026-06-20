'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaPlay, FaCopy, FaCheck } from 'react-icons/fa'

export function DemoVideo({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string
  poster: string
  width: number
  height: number
  label: string
}) {
  const [play, setPlay] = useState(false)

  if (play) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="auto"
        className="w-full h-auto border border-wire bg-ink"
      />
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
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 380px"
        className="w-full h-auto"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/40 group-hover:bg-ink/25 transition-colors">
        <span className="flex items-center justify-center w-16 h-16 border border-paper bg-ink/70 text-paper group-hover:border-signal group-hover:text-signal transition-colors">
          <FaPlay className="ml-1" />
        </span>
      </span>
    </button>
  )
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
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
      className="inline-flex items-center gap-1.5 text-ash hover:text-signal transition-colors shrink-0"
    >
      {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
    </button>
  )
}
