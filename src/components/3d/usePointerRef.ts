'use client'

import { useEffect, useRef, type RefObject } from 'react'

export interface PointerState {
  /** -1..1 across the window (x) and -1..1 bottom-to-top (y). Used for tilt and parallax. */
  x: number
  y: number
  /** 0..1 inside the scene container (v is bottom-to-top). Used by the background shader. */
  u: number
  v: number
}

/**
 * Tracks the pointer in a mutable ref, so reading it every frame never triggers a React re-render.
 */
export function usePointerRef(container: RefObject<HTMLElement>) {
  const pointer = useRef<PointerState>({ x: 0, y: 0, u: 0.5, v: 0.5 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = pointer.current
      p.x = (e.clientX / window.innerWidth) * 2 - 1
      p.y = -((e.clientY / window.innerHeight) * 2 - 1)
      const el = container.current
      if (el) {
        const r = el.getBoundingClientRect()
        p.u = Math.min(1, Math.max(0, (e.clientX - r.left) / Math.max(1, r.width)))
        p.v = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / Math.max(1, r.height)))
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [container])

  return pointer
}
