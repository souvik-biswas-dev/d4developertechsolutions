'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion, scrambleTo } from '@/lib/motion'

interface ScrambleTextProps {
  text: string
  className?: string
  /** ms before the decode starts once the label is on screen */
  delay?: number
}

/** Small eyebrow labels: decodes from random glyphs when scrolled into view. Plain text by default. */
export default function ScrambleText({ text, className = '', delay = 0 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let cancel: (() => void) | null = null
    let timer = 0

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        timer = window.setTimeout(() => {
          cancel = scrambleTo(el, text, 900)
        }, delay)
      },
      { threshold: 0.6 }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      cancel?.()
    }
  }, [text, delay])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  )
}
