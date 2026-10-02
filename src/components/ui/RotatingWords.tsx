'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion, scrambleTo } from '@/lib/motion'

const WORDS = ['web apps', 'mobile apps', 'AI automations', 'SaaS platforms']

/** "We build <web apps | mobile apps | …>" with a scramble/decode swap between phrases. */
export default function RotatingWords() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = prefersReducedMotion()
    let i = 0
    let cancel: (() => void) | null = null

    const id = window.setInterval(() => {
      i = (i + 1) % WORDS.length
      cancel?.()
      if (reduced) el.textContent = WORDS[i]
      else cancel = scrambleTo(el, WORDS[i], 750)
    }, 2800)

    return () => {
      window.clearInterval(id)
      cancel?.()
    }
  }, [])

  return (
    <p className="font-display text-xl md:text-2xl text-gray-300" aria-label="We build web apps, mobile apps, AI automations and SaaS platforms">
      <span aria-hidden="true">
        We build{' '}
        <span className="relative inline-block min-w-[8.5em] text-[#14C8F0]">
          <span ref={ref}>{WORDS[0]}</span>
          <span className="ml-0.5 inline-block w-[2px] h-[1.05em] align-[-0.15em] bg-[#14C8F0] animate-pulse" />
        </span>
      </span>
    </p>
  )
}
