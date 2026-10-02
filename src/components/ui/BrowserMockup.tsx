'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Layers } from 'lucide-react';
import type { Screenshot } from '@/data/projects';
import { prefersReducedMotion } from '@/lib/motion';

interface BrowserMockupProps {
  title: string;
  shot?: Screenshot;
  priority?: boolean;
  onOpen?: () => void;
}

/**
 * 3D browser / laptop frame around a project screenshot. It tilts toward the cursor on hover,
 * and the screenshot inside carries a data-parallax hook for the scroll parallax set up in <Work />.
 * Without a screenshot it renders a styled placeholder with the same frame.
 */
export default function BrowserMockup({ title, shot, onOpen }: BrowserMockupProps) {
  const frame = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = frame.current;
    if (!el || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width - 0.5;
      const py = (clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateX(${4 - py * 12}deg) rotateY(${-8 + px * 18}deg) scale(1.02)`;
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    if (frame.current) frame.current.style.transform = '';
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`Open the ${title} project demo`}
      className="group block w-full text-left cursor-pointer focus-visible:outline-offset-8"
      style={{ perspective: '1400px' }}
    >
      <div
        ref={frame}
        className="relative transition-transform duration-300 ease-out will-change-transform [transform:rotateX(4deg)_rotateY(-8deg)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="rounded-xl border border-white/10 bg-[#0b1022] shadow-[0_30px_60px_-20px_rgba(20,30,90,0.7)] overflow-hidden">
          {/* browser bar */}
          <div className="flex items-center gap-2 h-8 px-3 bg-[#111833] border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="mx-auto px-6 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-500 truncate max-w-[55%]">
              {title}
            </span>
            <span className="w-10" />
          </div>

          {/* screen */}
          {shot ? (
            <div className="relative overflow-hidden bg-black" style={{ aspectRatio: `${shot.width} / ${shot.height}` }}>
              <Image
                data-parallax
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                loading="lazy"
                sizes="(min-width: 1024px) 600px, 100vw"
                className="absolute left-0 top-[-6%] w-full h-[112%] object-cover object-top"
              />
              <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ) : (
            <div
              className="relative flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#12204d] via-[#0d1230] to-[#2a1458]"
              style={{ aspectRatio: '1920 / 940' }}
            >
              <Layers className="w-10 h-10 text-[#14C8F0]/80" />
              <span className="font-display text-gray-300">{title}</span>
              <span className="text-xs text-gray-500">Screenshots coming soon</span>
            </div>
          )}
        </div>

        {/* laptop base */}
        <div className="mx-auto h-2.5 w-[106%] -ml-[3%] rounded-b-2xl bg-gradient-to-b from-[#1d2650] to-[#0b1022] border-x border-b border-white/10" />
        <div className="mx-auto h-1 w-24 rounded-b-md bg-[#0b1022]/80" />
      </div>
    </button>
  );
}
