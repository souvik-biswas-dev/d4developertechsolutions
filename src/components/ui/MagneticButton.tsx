'use client';

import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion, registerGsap } from '@/lib/motion';
import { isTouchDevice } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** How far the element follows the cursor (0..1). */
  strength?: number;
  /** Pull starts this many px outside the element. */
  radius?: number;
}

/** Pulls the wrapped button toward the cursor (also from just outside its edge) and springs back on leave. */
export default function MagneticButton({ children, className = '', strength = 0.35, radius = 70 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice() || prefersReducedMotion()) return;
    const { gsap } = registerGsap();
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    let active = false;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const inside =
        e.clientX > r.left - radius && e.clientX < r.right + radius && e.clientY > r.top - radius && e.clientY < r.bottom + radius;
      if (inside) {
        active = true;
        xTo((e.clientX - cx) * strength);
        yTo((e.clientY - cy) * strength);
      } else if (active) {
        active = false;
        xTo(0);
        yTo(0);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, radius]);

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
