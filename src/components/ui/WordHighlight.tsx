'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion, registerGsap } from '@/lib/motion'

interface WordHighlightProps {
  text: string
  className?: string
  /** Opacity of a word before it is "read". */
  minOpacity?: number
  /** ScrollTrigger trigger selector. Defaults to the paragraph itself. */
  trigger?: string
  start?: string
  end?: string
}

/**
 * Scroll-linked word-by-word highlight: each word goes from minOpacity to 100% as you scroll.
 * Words are fully visible until JS has mounted, so a failure never leaves dim text behind.
 */
export default function WordHighlight({
  text,
  className = '',
  minOpacity = 0.2,
  trigger,
  start = 'top 85%',
  end = 'bottom 45%',
}: WordHighlightProps) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const { gsap } = registerGsap()

    // Resolve the trigger ourselves: selector strings inside gsap.context() are scoped to `el`,
    // so "#hero" (an ancestor) would never be found.
    const triggerEl = trigger ? document.querySelector<HTMLElement>(trigger) : null
    if (trigger && !triggerEl) return

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>('[data-w]')
      gsap.fromTo(
        words,
        { opacity: minOpacity },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: triggerEl ?? el, start, end, scrub: true },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [minOpacity, trigger, start, end])

  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} data-w aria-hidden="true">
          {w}
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
