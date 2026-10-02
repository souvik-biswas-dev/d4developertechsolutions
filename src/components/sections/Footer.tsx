'use client';

import { siteConfig } from '@/data/site';
import { navLinks } from '@/data/navigation';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#02040a] pt-20 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Col 1 */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-display font-bold text-2xl text-white">
                {siteConfig.shortName}
              </span>
            </Link>
            <p className="text-[#14C8F0] text-sm font-medium mb-4">{siteConfig.tagline}</p>
            <p className="text-gray-500 text-sm max-w-sm">
              We engineer scalable software solutions and digital products that drive business growth.
            </p>
          </div>
          
          {/* Col 2 */}
          <div>
            <h4 className="font-display text-white font-medium mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#14C8F0] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Col 3 */}
          <div>
            <h4 className="font-display text-white font-medium mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:+${siteConfig.phoneRaw}`} className="flex items-center gap-3 text-gray-400 hover:text-[#14C8F0] transition-colors text-sm group">
                  <Phone className="w-4 h-4 group-hover:text-[#14C8F0]" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-gray-400 hover:text-[#14C8F0] transition-colors text-sm group">
                  <Mail className="w-4 h-4 group-hover:text-[#14C8F0]" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#2F5BEA] transition-colors text-sm group">
                  <MessageCircle className="w-4 h-4 group-hover:text-[#2F5BEA]" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
          
          <a 
            href={siteConfig.portfolioUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#14C8F0] transition-colors"
          >
            See the founder&apos;s portfolio →
          </a>
          
          <p>Built with Next.js on Cloudflare</p>
        </div>
        
      </div>
    </footer>
  );
}
