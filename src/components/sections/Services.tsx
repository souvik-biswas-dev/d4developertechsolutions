'use client';

import { useEffect, useRef } from 'react';
import { services } from '@/data/services';
import SectionHeading from '@/components/ui/SectionHeading';
import TiltCard from '@/components/ui/TiltCard';
import { Globe, Smartphone, Brain, Layers, Cloud, MessageCircle } from 'lucide-react';
import { prefersReducedMotion, registerGsap } from '@/lib/motion';

const iconMap: Record<string, React.ElementType> = {
  Globe, Smartphone, Brain, Layers, Cloud, MessageCircle,
};

export default function Services() {
  const grid = useRef<HTMLDivElement>(null);

  // Entrance from depth: cards start pushed back in Z and tipped over, then settle in a stagger.
  useEffect(() => {
    const el = grid.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.from('[data-card]', {
        opacity: 0,
        y: 70,
        z: -260,
        rotateX: -28,
        transformPerspective: 900,
        transformOrigin: '50% 100%',
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="py-24 bg-[#050816]">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          label="What We Do"
          title="Services built for growth"
          align="center"
          subtitle="From a landing page to a full SaaS platform, we design, build and deploy it."
        />

        <div ref={grid} className="mt-16 grid grid-cols-1 md:grid-cols-6 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.iconName] || Globe;

            let colSpan = 'md:col-span-2';
            if (index < 2) colSpan = 'md:col-span-3';
            if (index === 5) colSpan = 'md:col-span-6';

            return (
              <div key={service.id} data-card className={colSpan}>
                <TiltCard className="h-full p-8 rounded-2xl bg-[#0c1226] border border-white/5 hover:bg-[#0e1530] transition-colors">
                  <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(26px)' }}>
                    <div className="w-12 h-12 rounded-lg bg-[#2F5BEA]/10 flex items-center justify-center mb-6 group-hover:bg-[#2F5BEA]/20 transition-colors">
                      <Icon className={`w-6 h-6 text-[#14C8F0] origin-center [transform-box:fill-box] svc-${service.iconName}`} />
                    </div>
                    <h3 className="font-display text-2xl text-white mb-2">{service.title}</h3>
                    <p className="text-[#14C8F0] text-sm mb-4 font-medium">{service.tagline}</p>
                    <p className="text-gray-400 text-sm flex-grow leading-relaxed">{service.description}</p>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
