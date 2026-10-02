'use client';

import { siteConfig } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/utils';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-32 bg-[#050816] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(123,63,242,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="font-display text-5xl md:text-7xl font-bold mb-12">
          <span className="text-white">Let&apos;s build your</span><br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F5BEA] to-[#14C8F0]">
            next product
          </span>
        </h2>
        
        <Link
          href={buildWhatsAppUrl(siteConfig.phoneRaw, siteConfig.whatsappGreeting)}
          target="_blank"
          className="btn-shine inline-block px-10 py-5 rounded-full bg-gradient-to-r from-[#2F5BEA] to-[#7B3FF2] text-white text-lg font-medium hover:scale-105 transition-transform duration-300 shadow-xl shadow-[#2F5BEA]/20"
        >
          Start a Conversation
        </Link>
        
        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <a href={`tel:+${siteConfig.phoneRaw}`} className="text-gray-400 hover:text-[#14C8F0] transition-colors">
            Call Us
          </a>
          <span className="text-gray-700">|</span>
          <a href={`mailto:${siteConfig.email}`} className="text-gray-400 hover:text-[#14C8F0] transition-colors">
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}
