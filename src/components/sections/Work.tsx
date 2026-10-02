'use client';

import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/projects';
import type { Project } from '@/data/projects';
import { siteConfig } from '@/data/site';
import SectionHeading from '@/components/ui/SectionHeading';
import BrowserMockup from '@/components/ui/BrowserMockup';
import ProjectModal from '@/components/ui/ProjectModal';
import { prefersReducedMotion, registerGsap } from '@/lib/motion';

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();

    // Parallax on the screenshots (all sizes)
    mm.add('(min-width: 0px)', () => {
      gsap.utils.toArray<HTMLElement>('[data-stack]', el).forEach((card) => {
        const img = card.querySelector('[data-parallax]');
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    });

    // Desktop: sticky stacking. As the next card slides over, the one beneath scales down and dims.
    mm.add('(min-width: 1024px)', () => {
      const wrappers = gsap.utils.toArray<HTMLElement>('[data-stack]', el);
      wrappers.forEach((wrap, i) => {
        const next = wrappers[i + 1];
        if (!next) return;
        const inner = wrap.querySelector('[data-stack-inner]');
        const dim = wrap.querySelector('[data-dim]');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: next, start: 'top 92%', end: 'top 22%', scrub: true },
        });
        tl.to(inner, { scale: 0.9, transformOrigin: '50% 0%' }, 0).to(dim, { opacity: 0.65 }, 0);
      });
    });

    // Below desktop: simple lift-in
    mm.add('(max-width: 1023px)', () => {
      gsap.utils.toArray<HTMLElement>('[data-stack-inner]', el).forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
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
    <section id="work" ref={root} className="py-24 bg-[#050816]">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          label="Our Work"
          title="Products we've built."
          subtitle="Open any project to see its screenshots and the tech behind it."
        />

        <div className="mt-16">
          {projects.map((project, index) => {
            const isLast = index === projects.length - 1;
            return (
              <div
                key={project.id}
                data-stack
                className={`relative lg:sticky lg:top-[var(--stick)] ${isLast ? '' : 'mb-10 lg:mb-[26vh]'}`}
                style={{ ['--stick' as string]: `${104 + index * 16}px` }}
              >
                <article
                  data-stack-inner
                  className="relative rounded-3xl bg-[#0c1226] border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10 items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-display text-sm text-[#14C8F0]">
                          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                        </span>
                        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-300">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl lg:text-4xl text-white mb-6">{project.title}</h3>

                      <div className="space-y-4">
                        {project.problem && (
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Problem</span>
                            <p className="text-sm text-gray-400 leading-relaxed">{project.problem}</p>
                          </div>
                        )}
                        {project.solution && (
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Solution</span>
                            <p className="text-sm text-gray-300 leading-relaxed">{project.solution}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">What we built</span>
                          <p className="text-sm text-[#14C8F0] font-medium leading-relaxed">{project.built}</p>
                        </div>
                      </div>

                      {project.stack.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 rounded-full bg-[#050816] text-[#14C8F0] text-xs font-medium border border-[#14C8F0]/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActive(project)}
                          className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#2F5BEA] to-[#7B3FF2] text-white text-sm font-medium"
                        >
                          View project demo <span aria-hidden="true">→</span>
                        </button>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white text-sm font-medium hover:bg-white/5 transition-colors"
                          >
                            Live demo <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <BrowserMockup
                      title={project.title}
                      shot={project.screenshots[0]}
                      priority={index === 0}
                      onOpen={() => setActive(project)}
                    />
                  </div>

                  {/* dims as the next card slides over this one */}
                  <div data-dim className="absolute inset-0 bg-[#02040d] opacity-0 pointer-events-none" aria-hidden="true" />
                </article>
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <a
            href={siteConfig.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[#14C8F0] hover:text-white transition-colors font-medium group"
          >
            See the founder&apos;s full portfolio
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
