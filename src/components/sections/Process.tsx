'use client';

import { useEffect, useRef } from 'react';
import { processSteps } from '@/data/process';
import SectionHeading from '@/components/ui/SectionHeading';
import { Search, PenTool, Code, Rocket } from 'lucide-react';
import { prefersReducedMotion, registerGsap } from '@/lib/motion';

const iconMap: Record<string, React.ElementType> = {
  Search, PenTool, Code, Rocket,
};

// Passes through the four step nodes (x = 125, 375, 625, 875 of 1000) with a gentle wave between them.
const LINE = 'M125,48 C200,8 300,88 375,48 C450,8 550,88 625,48 C700,8 800,88 875,48';

/**
 * Desktop: the section is pinned while scrolling. An SVG line draws itself through steps 01 to 04,
 * and each card flips and lifts into place as the line reaches it.
 * Mobile / short screens: no pin. A vertical line draws with scroll and cards lift in as they enter.
 * Everything is fully visible by default and with reduced motion.
 */
export default function Process() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();

    const cards = () => gsap.utils.toArray<HTMLElement>('[data-step-card]', el);
    const nodes = () => gsap.utils.toArray<HTMLElement>('[data-step-node]', el);

    // Desktop with enough height: pinned, scrubbed timeline
    mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
      const path = el.querySelector('[data-line-path]');
      const c = cards();
      const n = nodes();
      gsap.set(path, { strokeDashoffset: 1 });
      gsap.set(c, { opacity: 0.15, y: 50, rotateY: -70, scale: 0.92, transformPerspective: 900 });
      gsap.set(n, { scale: 0.6, opacity: 0.35 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=2400', pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      tl.to(path, { strokeDashoffset: 0, duration: 3 }, 0);
      c.forEach((card, i) => {
        const at = Math.max(0, i - 0.1);
        tl.to(n[i], { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)' }, at);
        tl.to(card, { opacity: 1, y: 0, rotateY: 0, scale: 1, duration: 0.75, ease: 'power3.out' }, at + 0.05);
      });
      tl.to({}, { duration: 0.5 }); // short hold on the finished state
    });

    // Everything else: no pin
    mm.add({ narrow: '(max-width: 1023px)', shortWide: '(min-width: 1024px) and (max-height: 699px)' }, (ctx) => {
      const horizontal = !!(ctx.conditions as { shortWide?: boolean } | undefined)?.shortWide;
      const steps = el.querySelector('[data-steps]');
      const c = cards();

      if (horizontal) {
        const path = el.querySelector('[data-line-path]');
        gsap.set(path, { strokeDashoffset: 1 });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: steps, start: 'top 80%', end: 'bottom 55%', scrub: true },
        });
      } else {
        const line = el.querySelector('[data-line-v]');
        gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
        gsap.to(line, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: steps, start: 'top 70%', end: 'bottom 70%', scrub: true },
        });
      }

      c.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 44,
          rotateX: -22,
          transformPerspective: 800,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="process"
      ref={section}
      className="relative bg-[#050816] py-24 lg:py-0 lg:min-h-screen lg:flex lg:flex-col lg:justify-center"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading label="How We Work" title="From idea to production in four steps" />

        <div data-steps className="mt-14 relative">
          {/* Desktop: the line that draws itself from 01 to 04 */}
          <svg
            className="hidden lg:block absolute left-0 top-0 w-full h-24 pointer-events-none"
            viewBox="0 0 1000 96"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="proc-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
                <stop offset="0" stopColor="#2F5BEA" />
                <stop offset="0.55" stopColor="#7B3FF2" />
                <stop offset="1" stopColor="#14C8F0" />
              </linearGradient>
            </defs>
            <path d={LINE} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <path
              data-line-path
              d={LINE}
              fill="none"
              stroke="url(#proc-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={0}
            />
          </svg>

          {/* Mobile: vertical line */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-[2px] bg-white/10" aria-hidden="true" />
          <div
            data-line-v
            className="lg:hidden absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#2F5BEA] to-[#14C8F0]"
            aria-hidden="true"
          />

          <ol className="relative grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-0">
            {processSteps.map((step) => {
              const Icon = iconMap[step.iconName] || Code;
              return (
                <li key={step.id} className="relative pl-16 lg:pl-0 flex flex-col">
                  <div
                    data-step-node
                    className="absolute left-0 top-0 lg:static lg:h-24 lg:flex lg:items-center lg:justify-center"
                  >
                    <span className="w-12 h-12 rounded-full bg-[#050816] border-2 border-[#2F5BEA] flex items-center justify-center font-display font-bold text-sm text-white shadow-[0_0_20px_rgba(47,91,234,0.5)]">
                      {step.number}
                    </span>
                  </div>

                  <div
                    data-step-card
                    className="lg:mx-3 flex-1 bg-[#0f1629] p-7 rounded-3xl border border-white/5 relative"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2F5BEA] to-[#7B3FF2] flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-display text-2xl text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
