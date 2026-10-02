'use client';

import { stats } from '@/data/stats';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

export default function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#2F5BEA]/10 to-[#7B3FF2]/10 relative border-y border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-3 gap-4 lg:gap-0 divide-x divide-white/10">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center py-4 lg:py-0 text-center">
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 flex items-center">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <span className="text-gray-400 text-[10px] sm:text-sm font-medium uppercase tracking-wider px-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
