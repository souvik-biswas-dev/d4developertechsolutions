'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion, registerGsap } from '@/lib/motion'

const LINES = [
  { text: 'Build smarter.', gradient: false },
  { text: 'Grow faster.', gradient: true },
]

const TRACK = 'linear-gradient(90deg, #ffffff 0%, #ffffff 33.3%, #2F5BEA 66.6%, #14C8F0 100%)'

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wi, arr) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((c, ci) => (
            <span key={ci} className="hh-char inline-block will-change-transform">
              {c}
            </span>
          ))}
          {wi < arr.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

/**
 * Hero headline. Server-rendered as plain, fully visible text (the gradient is plain CSS).
 * After mount, GSAP splits the effect across characters: each rises out of a masked line with
 * rotateX, stagger and a slight skew, then the gradient on "Grow faster." sweeps across once.
 * Nothing is hidden until the animation is actually created, and any error restores the text.
 */
export default function HeroHeadline() {
  const root = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const { gsap } = registerGsap()
    const chars = Array.from(el.querySelectorAll<HTMLElement>('.hh-char'))
    const gradLine = el.querySelector<HTMLElement>('.hh-grad')
    const gradChars = gradLine ? Array.from(gradLine.querySelectorAll<HTMLElement>('.hh-char')) : []
    let width = 0
    let shift = 0
    const sweep = { s: 0 }

    // Per-char gradient: every character shows its own slice of one shared gradient track,
    // so the colours stay continuous across the whole line while the characters move.
    const paint = () => {
      if (!gradLine) return
      const lineLeft = gradLine.getBoundingClientRect().left
      width = gradLine.getBoundingClientRect().width
      gradChars.forEach((c) => {
        const x = c.getBoundingClientRect().left - lineLeft
        c.dataset.x = String(x)
        c.style.backgroundPosition = `${-x - shift}px 0`
        c.style.backgroundSize = `${width * 3}px 100%`
      })
    }

    const ctx = gsap.context(() => {
      try {
        if (gradLine) {
          gradLine.style.backgroundImage = 'none'
          gradChars.forEach((c) => {
            c.style.backgroundImage = TRACK
            c.style.backgroundRepeat = 'no-repeat'
            c.style.setProperty('-webkit-background-clip', 'text')
            c.style.backgroundClip = 'text'
            c.style.color = 'transparent'
          })
          paint()
        }

        const tl = gsap.timeline({ delay: 1.9 }) // starts as the preloader fades out
        tl.from(chars, {
          yPercent: 115,
          rotateX: -80,
          skewY: 8,
          transformPerspective: 800,
          transformOrigin: '50% 100%',
          duration: 1,
          ease: 'expo.out',
          stagger: 0.035,
        })
        if (gradLine) {
          tl.to(
            sweep,
            {
              s: 2,
              duration: 1.5,
              ease: 'power2.inOut',
              onUpdate: () => {
                shift = sweep.s * width
                gradChars.forEach((c) => {
                  c.style.backgroundPosition = `${-Number(c.dataset.x) - shift}px 0`
                })
              },
            },
            '-=0.35'
          )
        }
      } catch {
        gsap.set(chars, { clearProps: 'all' })
      }
    }, el)

    const onResize = () => paint()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [])

  return (
    <h1
      ref={root}
      aria-label="Build smarter. Grow faster."
      className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.08] tracking-tight"
    >
      {LINES.map((line) => (
        <span key={line.text} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]" aria-hidden="true">
          {line.gradient ? (
            <span className="hh-grad relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#2F5BEA] to-[#14C8F0]">
              <Words text={line.text} />
            </span>
          ) : (
            <span className="inline-block text-white">
              <Words text={line.text} />
            </span>
          )}
        </span>
      ))}
    </h1>
  )
}
