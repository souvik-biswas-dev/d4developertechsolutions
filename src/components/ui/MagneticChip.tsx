'use client';

import React, { useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

interface MagneticChipProps {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}

/**
 * Tech chip: leans toward the cursor while hovered and lights up with a glow that follows it.
 * Uses direct style writes (no React state), so it is safe inside the moving marquee.
 */
export default function MagneticChip({ children, className = '', glow = '20,200,240' }: MagneticChipProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.35}px) scale(1.06)`;
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
    el.style.boxShadow = `0 0 24px rgba(${glow},0.35), 0 0 4px rgba(${glow},0.6)`;
    el.style.borderColor = `rgba(${glow},0.55)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
    el.style.borderColor = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group relative overflow-hidden transition-[transform,box-shadow,border-color] duration-200 ease-out ${className}`}
      style={{ ['--gx' as string]: '50%', ['--gy' as string]: '50%' }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: `radial-gradient(90px circle at var(--gx) var(--gy), rgba(${glow},0.28), transparent 70%)` }}
      />
      <span className="relative flex items-center gap-3">{children}</span>
    </div>
  );
}
