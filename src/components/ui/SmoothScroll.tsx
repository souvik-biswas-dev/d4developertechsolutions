'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { registerGsap, prefersReducedMotion, scrollState, setLenis } from '@/lib/motion'

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 * It also publishes per-frame scroll velocity (used by the tech marquee).
 * With prefers-reduced-motion, native scrolling is used and nothing is smoothed.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap()
    let lenis: Lenis | null = null
    let last = window.scrollY

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true })
      setLenis(lenis)
      lenis.on('scroll', ScrollTrigger.update)
    }

    const tick = (time: number) => {
      lenis?.raf(time * 1000)
      const y = window.scrollY
      scrollState.velocity = y - last
      last = y
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      setLenis(null)
      scrollState.velocity = 0
    }
  }, [])

  return null
}
