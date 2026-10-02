'use client';

import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion, registerGsap } from '@/lib/motion';
import ScrambleText from './ScrambleText';
import WordHighlight from './WordHighlight';

interface SectionHeadingProps {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * Eyebrow label decodes (scramble), the title reveals through a clip-path line with a
 * letter-spacing tween, and the optional subtitle highlights word by word on scroll.
 * Everything is visible by default; the hidden start state is only set once GSAP is running.
 */
export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      gsap.from('[data-title-inner]', {
        clipPath: 'inset(0 0 105% 0)',
        yPercent: 45,
        letterSpacing: '0.14em',
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
      gsap.from('[data-rule]', {
        scaleX: 0,
        transformOrigin: align === 'right' ? 'right center' : align === 'center' ? 'center center' : 'left center',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [align]);

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div ref={root} className={`flex flex-col gap-4 ${alignmentClasses[align]} ${className}`}>
      <div className="flex items-center gap-2">
        <div data-rule className="w-8 h-[2px] bg-brand-cyan" />
        <ScrambleText
          text={label.toUpperCase()}
          className="text-brand-cyan font-body font-semibold uppercase tracking-wider text-sm"
        />
      </div>

      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
        <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <span data-title-inner className="block">
            {title}
          </span>
        </span>
      </h2>

      {subtitle && (
        <WordHighlight
          text={subtitle}
          className="text-gray-300 font-body text-lg md:text-xl max-w-2xl"
          start="top 88%"
          end="bottom 55%"
        />
      )}
    </div>
  );
}
