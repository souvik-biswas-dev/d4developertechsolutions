'use client';

import { useEffect, useRef } from 'react';
import { techStack } from '@/data/techStack';
import type { TechItem } from '@/data/techStack';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticChip from '@/components/ui/MagneticChip';
import { prefersReducedMotion, scrollState } from '@/lib/motion';

function Chip({ tech, tint }: { tech: TechItem; tint: string }) {
  return (
    <MagneticChip
      className="shrink-0 px-6 py-3 rounded-full bg-[#0f1629] border border-white/5"
      glow={tint === 'violet' ? '123,63,242' : '20,200,240'}
    >
      <span
        className={`w-6 h-6 rounded text-[#14C8F0] flex items-center justify-center text-xs font-bold ${
          tint === 'violet' ? 'bg-[#7B3FF2]/20' : 'bg-[#2F5BEA]/20'
        }`}
      >
        {tech.name.charAt(0)}
      </span>
      <span className="font-display text-gray-300 whitespace-nowrap">{tech.name}</span>
    </MagneticChip>
  );
}

/**
 * Infinite marquee whose speed and direction react to scroll velocity:
 * scrolling fast speeds it up, scrolling up reverses it.
 */
function MarqueeRow({ items, dir, tint }: { items: TechItem[]; dir: 1 | -1; tint: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;

    let x = 0;
    let smooth = 0; // smoothed scroll velocity
    let flip = 1; // smoothed direction factor (1 = normal, -1 = reversed)
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const BASE = 55; // px per second

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        smooth += (scrollState.velocity - smooth) * 0.08;
        const target = smooth < -1.5 ? -1 : 1;
        flip += (target - flip) * 0.06;
        const boost = 1 + Math.min(Math.abs(smooth) * 0.35, 7);
        const half = el.scrollWidth / 2;
        x += dir * flip * BASE * boost * dt;
        if (half > 0) {
          if (x <= -half) x += half;
          if (x >= 0 && dir === 1) x -= half;
          if (x > 0 && dir === -1) x -= half;
        }
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [dir]);

  return (
    <div className="flex overflow-hidden" aria-hidden="true">
      <div ref={track} className="flex shrink-0 items-center gap-6 pr-6 will-change-transform">
        {[...items, ...items, ...items, ...items].map((tech, i) => (
          <Chip key={`${tech.name}-${i}`} tech={tech} tint={tint} />
        ))}
      </div>
    </div>
  );
}

export default function TechStack() {
  const half = Math.ceil(techStack.length / 2);
  const row1 = techStack.slice(0, half);
  const row2 = techStack.slice(half);

  return (
    <section className="py-24 bg-[#050816] overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 mb-16">
        <SectionHeading label="Our Stack" title="Technologies we ship with" align="center" />
      </div>

      {/* Screen readers get the list once */}
      <ul className="sr-only">
        {techStack.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>

      <div className="relative flex flex-col gap-6">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />

        <MarqueeRow items={row1} dir={-1} tint="blue" />
        <MarqueeRow items={row2} dir={1} tint="violet" />
      </div>
    </section>
  );
}
