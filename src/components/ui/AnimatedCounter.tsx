'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { prefersReducedMotion } from '@/lib/motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

const SETS = 3; // each digit column holds 0-9 three times so it can "roll" a few turns

function Digit({ digit, phase, order, duration }: { digit: number; phase: 'final' | 'reset' | 'run'; order: number; duration: number }) {
  // phase "final": plain value (server render / reduced motion). "reset": snapped to 0. "run": rolls to the digit.
  const row = phase === 'reset' ? 0 : (SETS - 1) * 10 + digit;
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top leading-none" aria-hidden="true">
      <span
        className="flex flex-col will-change-transform"
        style={{
          transform: `translateY(-${(row / (SETS * 10)) * 100}%)`,
          transition: phase === 'run' ? `transform ${duration + order * 220}ms cubic-bezier(0.16, 1, 0.3, 1)` : 'none',
        }}
      >
        {Array.from({ length: SETS * 10 }, (_, i) => (
          <span key={i} className="block h-[1em] leading-none tabular-nums">
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Odometer-style counter: every digit is a column of numbers that rolls into place. */
export default function AnimatedCounter({ value, suffix = '', duration = 1600, className = '' }: AnimatedCounterProps) {
  const [ref, isInView] = useInView<HTMLSpanElement>({ triggerOnce: true, rootMargin: '-10% 0px' });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!prefersReducedMotion()) setArmed(true); // after mount: snap digits to 0, ready to roll
  }, []);

  const phase: 'final' | 'reset' | 'run' = !armed ? 'final' : isInView ? 'run' : 'reset';
  const digits = String(Math.round(value)).split('');

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`} aria-label={`${value}${suffix}`}>
      <span className="inline-flex h-[1em] leading-none">
        {digits.map((d, i) => (
          <Digit key={i} digit={Number(d)} phase={phase} order={digits.length - 1 - i} duration={duration} />
        ))}
      </span>
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}
