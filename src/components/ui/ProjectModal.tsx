'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Layers, X } from 'lucide-react';
import type { Project } from '@/data/projects';
import { getLenis } from '@/lib/motion';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * "Project demo" modal: a screenshot carousel (arrow keys, swipe or drag, buttons, dots) with a caption
 * and the tech stack. ESC closes, focus is trapped while open and restored on close, and page scroll
 * (including Lenis) is locked.
 */
export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const shots = project?.screenshots ?? [];
  const count = shots.length;

  useEffect(() => setMounted(true), []);
  useEffect(() => setPage([0, 0]), [project?.id]);

  const paginate = useCallback(
    (d: number) => {
      if (count < 2) return;
      setPage(([i]) => [(i + d + count) % count, d]);
    },
    [count]
  );

  // lock scroll, remember and restore focus
  useEffect(() => {
    if (!project) return;
    const previous = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();

    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [project]);

  // keyboard: ESC, arrows, focus trap
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'Tab' && dialog.current) {
        const items = Array.from(dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialog.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialog.current.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [project, onClose, paginate]);

  if (!mounted) return null;

  const shot = shots[index];

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-[#02040d]/85 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-demo-title"
            data-lenis-prevent
            className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0a1024] shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="flex items-start justify-between gap-4 p-5 sm:p-7 pb-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#14C8F0]">Project demo</p>
                <h3 id="project-demo-title" className="font-display text-2xl sm:text-3xl text-white mt-1">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{project.category}</p>
              </div>
              <button
                ref={closeBtn}
                type="button"
                onClick={onClose}
                aria-label="Close project demo"
                className="shrink-0 w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* carousel */}
            <div className="p-5 sm:p-7 pb-3">
              {count > 0 ? (
                <div
                  className="relative rounded-2xl overflow-hidden border border-white/10 bg-black"
                  style={{ aspectRatio: `${shots[0].width} / ${shots[0].height}` }}
                >
                  <AnimatePresence initial={false} custom={dir} mode="popLayout">
                    <motion.div
                      key={index}
                      custom={dir}
                      className="absolute inset-0 touch-pan-y cursor-grab active:cursor-grabbing"
                      variants={{
                        enter: (d: number) => ({ x: d >= 0 ? 80 : -80, opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (d: number) => ({ x: d >= 0 ? -80 : 80, opacity: 0 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      drag={count > 1 ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.25}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60 || info.velocity.x < -450) paginate(1);
                        else if (info.offset.x > 60 || info.velocity.x > 450) paginate(-1);
                      }}
                    >
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        sizes="(min-width: 1024px) 960px, 100vw"
                        draggable={false}
                        className="w-full h-full object-cover object-top select-none"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {count > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => paginate(-1)}
                        aria-label="Previous screenshot"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-black/80"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => paginate(1)}
                        aria-label="Next screenshot"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-black/80"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#12204d] via-[#0d1230] to-[#2a1458]"
                  style={{ aspectRatio: '1920 / 940' }}
                >
                  <Layers className="w-12 h-12 text-[#14C8F0]/80" />
                  <p className="font-display text-xl text-gray-200">{project.title}</p>
                  <p className="text-sm text-gray-500">Screenshots coming soon</p>
                </div>
              )}

              <div className="mt-4 flex items-start justify-between gap-4">
                <p className="text-sm text-gray-300 leading-relaxed" aria-live="polite">
                  {shot ? shot.caption : project.built}
                </p>
                {count > 1 && (
                  <div className="flex items-center gap-2 shrink-0 pt-1.5" role="group" aria-label="Choose screenshot">
                    {shots.map((s, i) => (
                      <button
                        key={s.src}
                        type="button"
                        onClick={() => setPage([i, i > index ? 1 : -1])}
                        aria-label={`Show screenshot ${i + 1} of ${count}`}
                        aria-current={i === index}
                        className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-[#14C8F0]' : 'w-2 bg-white/25 hover:bg-white/50'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 sm:px-7 pb-7">
              {shot && <p className="text-sm text-gray-400 leading-relaxed mb-5">{project.built}</p>}

              {project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2">
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

              {(project.liveUrl || project.sourceUrl) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-shine inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2F5BEA] to-[#7B3FF2] text-white text-sm font-medium"
                    >
                      Live demo <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-white text-sm font-medium hover:bg-white/5"
                    >
                      <Github className="w-4 h-4" /> Source
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
