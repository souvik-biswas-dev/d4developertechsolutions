'use client';

import { siteConfig } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/utils';
import MagneticButton from '@/components/ui/MagneticButton';
import HeroHeadline from '@/components/ui/HeroHeadline';
import RotatingWords from '@/components/ui/RotatingWords';
import WordHighlight from '@/components/ui/WordHighlight';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// The 3D scene is client-only and loaded lazily so it never blocks the headline
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false });

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#050816]">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center w-full">
          {/* Text Content - Left Side */}
          <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6">
            <div className="inline-block rounded-full p-[1px] bg-gradient-to-r from-[#2F5BEA] to-[#7B3FF2]">
              <div className="px-4 py-1.5 rounded-full bg-[#050816] text-xs font-semibold tracking-wider text-gray-300 uppercase">
                Web & Mobile App Agency
              </div>
            </div>
            
            <HeroHeadline />

            <RotatingWords />
            
            <WordHighlight
              text={siteConfig.description}
              className="font-body text-lg text-gray-300 max-w-xl"
              minOpacity={0.35}
              trigger="#hero"
              start="top top"
              end="+=55%"
            />
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <MagneticButton>
                <Link 
                  href={buildWhatsAppUrl(siteConfig.phoneRaw, siteConfig.whatsappGreeting)}
                  target="_blank"
                  className="btn-shine block px-8 py-4 rounded-full bg-gradient-to-r from-[#2F5BEA] to-[#7B3FF2] text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap text-center w-full sm:w-auto"
                >
                  Get Free Consultation
                </Link>
              </MagneticButton>
              
              <MagneticButton>
                <a 
                  href={`tel:+${siteConfig.phoneRaw}`}
                  className="btn-shine block px-8 py-4 rounded-full border border-[#14C8F0] text-[#14C8F0] hover:bg-[#14C8F0]/10 transition-colors whitespace-nowrap text-center w-full sm:w-auto font-medium"
                >
                  Call Us
                </a>
              </MagneticButton>

              <MagneticButton>
                <a 
                  href={`mailto:${siteConfig.email}`}
                  className="btn-shine block px-8 py-4 rounded-full border border-gray-600 text-white hover:bg-white/5 transition-colors whitespace-nowrap text-center w-full sm:w-auto font-medium"
                >
                  Email
                </a>
              </MagneticButton>
            </div>
          </div>
          
          {/* 3D Canvas Space - Right Side */}
          <div className="relative w-full lg:w-1/2 h-[420px] sm:h-[500px] lg:h-[680px]">
            <HeroScene />
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-gray-500" />
      </div>
    </section>
  );
}
