import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

let registered = false

/** Registers GSAP plugins once (client only) and returns the instances. */
export function registerGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return { gsap, ScrollTrigger }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Shared scroll state, written once per frame by <SmoothScroll /> and read by any component (marquee, etc.). */
export const scrollState = { velocity: 0 }

let lenisInstance: Lenis | null = null
export function setLenis(l: Lenis | null) {
  lenisInstance = l
}
export function getLenis(): Lenis | null {
  return lenisInstance
}

/* ───────────── text scramble / decode ───────────── */

const GLYPHS = '!<>-_/[]{}=+*^?#01'

/**
 * Decodes `target` into `el` from random glyphs, left to right. Returns a cancel function
 * that leaves the final text in place.
 */
export function scrambleTo(el: HTMLElement, target: string, durationMs = 800, onDone?: () => void): () => void {
  const len = target.length
  const resolveAt = Array.from({ length: len }, (_, i) => (i / Math.max(1, len)) * 0.6 + Math.random() * 0.4)
  const start = performance.now()
  let raf = 0
  let cancelled = false

  const tick = (now: number) => {
    if (cancelled) return
    const p = Math.min(1, (now - start) / durationMs)
    let out = ''
    for (let i = 0; i < len; i++) {
      const ch = target[i]
      if (ch === ' ' || p >= resolveAt[i]) out += ch
      else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    }
    el.textContent = out
    if (p < 1) raf = requestAnimationFrame(tick)
    else onDone?.()
  }

  raf = requestAnimationFrame(tick)
  return () => {
    cancelled = true
    cancelAnimationFrame(raf)
    el.textContent = target
  }
}
