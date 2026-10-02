'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { navLinks } from '@/data/navigation';
import { siteConfig } from '@/data/site';
import { getLenis } from '@/lib/motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const lenis = getLenis();
    if (href === '#top') {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector<HTMLElement>(href);
    if (target) {
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-navy-900/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <a
            href="#top"
            onClick={(e) => handleLinkClick(e, '#top')}
            aria-label={siteConfig.name}
            className="flex items-center gap-3 group"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={270}
              height={262}
              priority
              suppressHydrationWarning
              className="h-10 w-auto shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="font-display font-semibold text-white tracking-wide hidden sm:block">
              {siteConfig.name}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-body text-gray-300 hover:text-brand-cyan transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="btn-shine inline-block bg-gradient-to-r from-brand-blue to-brand-violet text-white px-6 py-2.5 rounded-full font-body font-medium hover:shadow-[0_0_15px_rgba(47,91,234,0.5)] transition-shadow"
            >
              Free Consultation
            </a>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-navy-900 flex flex-col"
          >
            <div className="flex items-center justify-end p-4 md:p-8">
              <button
                className="text-white p-2"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={32} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="font-display text-3xl text-white hover:text-brand-cyan transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="mt-8 bg-gradient-to-r from-brand-blue to-brand-violet text-white px-8 py-3 rounded-full font-body font-medium text-lg"
              >
                Free Consultation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
