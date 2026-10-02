'use client';

import React, { useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  /** moving highlight on the card surface */
  glare?: boolean;
  /** cursor-following spotlight on the card border */
  spotlight?: boolean;
}

/**
 * 3D tilt that follows the cursor, with a moving glare and a spotlight border
 * (a radial gradient masked to the 1px border). All updates are direct style writes in rAF,
 * so hovering never triggers a React re-render.
 */
export default function TiltCard({
  children,
  className = '',
  tiltStrength = 9,
  glare = true,
  spotlight = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      card.style.transform = `rotateX(${(0.5 - py) * 2 * tiltStrength}deg) rotateY(${(px - 0.5) * 2 * tiltStrength}deg) translateZ(0)`;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      card.style.setProperty('--mxp', `${clientX - r.left}px`);
      card.style.setProperty('--myp', `${clientY - r.top}px`);
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    const card = cardRef.current;
    if (card) card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className="w-full h-full" style={{ perspective: '1100px' }}>
      <div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`group relative w-full h-full transition-transform duration-300 ease-out will-change-transform ${className}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {spotlight && <span aria-hidden="true" className="spotlight-border" />}
        {glare && <span aria-hidden="true" className="card-glare" />}
        {children}
      </div>
    </div>
  );
}
