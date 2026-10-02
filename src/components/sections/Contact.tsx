'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData } from '@/lib/schemas';
import { buildContactMessage, buildWhatsAppUrl } from '@/lib/utils';
import { siteConfig } from '@/data/site';
import { services } from '@/data/services';
import { budgetRanges } from '@/data/navigation';
import SectionHeading from '@/components/ui/SectionHeading';
import { Phone, Mail, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onTouched'
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.website) return; // honeypot
    
    try {
      const message = buildContactMessage(data);
      const url = buildWhatsAppUrl(siteConfig.phoneRaw, message);
      
      setIsSuccess(true);
      window.open(url, '_blank');
      
      setTimeout(() => {
        reset();
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#050816]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Column - Info */}
          <div>
            <SectionHeading label="Get In Touch" title="Let's talk about your project" />
            <p className="mt-6 text-gray-400 font-body text-lg max-w-md">
              We respond within 2 hours during business hours. Fill out the form or reach out directly.
            </p>
            
            <div className="mt-12 space-y-8">
              <a href={`tel:+${siteConfig.phoneRaw}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#0f1629] border border-white/5 flex items-center justify-center group-hover:border-[#14C8F0] transition-colors">
                  <Phone className="w-5 h-5 text-[#14C8F0]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Call Us</p>
                  <p className="text-white font-display text-lg group-hover:text-[#14C8F0] transition-colors">{siteConfig.phone}</p>
                </div>
              </a>
              
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#0f1629] border border-white/5 flex items-center justify-center group-hover:border-[#14C8F0] transition-colors">
                  <Mail className="w-5 h-5 text-[#14C8F0]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email Us</p>
                  <p className="text-white font-display text-lg group-hover:text-[#14C8F0] transition-colors">{siteConfig.email}</p>
                </div>
              </a>
              
              <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#0f1629] border border-white/5 flex items-center justify-center group-hover:border-[#2F5BEA] transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#2F5BEA]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">WhatsApp</p>
                  <p className="text-white font-display text-lg group-hover:text-[#2F5BEA] transition-colors">Chat with us</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-[#0f1629]/50 p-8 rounded-3xl border border-white/5">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-display text-white">Message ready!</h3>
                <p className="text-gray-400">Complete sending in WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input type="text" {...register('website')} className="sr-only" aria-hidden="true" tabIndex={-1} autoComplete="off" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-sm font-medium text-gray-300">Full Name</label>
                    <input 
                      id="contact-name" {...register('name')} autoComplete="name" 
                      className="w-full bg-[#050816] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#14C8F0] transition-colors"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact-phone" className="text-sm font-medium text-gray-300">Phone Number</label>
                    <input 
                      id="contact-phone" {...register('phone')} autoComplete="tel" 
                      type="tel"
                      className="w-full bg-[#050816] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#14C8F0] transition-colors"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-gray-300">Email Address</label>
                  <input 
                    id="contact-email" {...register('email')} autoComplete="email" 
                    type="email"
                    className="w-full bg-[#050816] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#14C8F0] transition-colors"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-service" className="text-sm font-medium text-gray-300">Service Needed</label>
                    <select 
                      id="contact-service" {...register('service')}
                      className="w-full bg-[#050816] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#14C8F0] transition-colors appearance-none"
                    >
                      <option value="">Select a service</option>
                      {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    </select>
                    {errors.service && <p className="text-red-400 text-xs">{errors.service.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact-budget" className="text-sm font-medium text-gray-300">Budget Range</label>
                    <select 
                      id="contact-budget" {...register('budget')}
                      className="w-full bg-[#050816] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#14C8F0] transition-colors appearance-none"
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.budget && <p className="text-red-400 text-xs">{errors.budget.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-details" className="text-sm font-medium text-gray-300">Project Details</label>
                  <textarea 
                    id="contact-details" {...register('details')}
                    rows={4}
                    className="w-full bg-[#050816] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#14C8F0] transition-colors resize-none"
                    placeholder="Tell us about your project goals..."
                  />
                  {errors.details && <p className="text-red-400 text-xs">{errors.details.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="btn-shine w-full py-4 rounded-xl bg-gradient-to-r from-[#2F5BEA] to-[#7B3FF2] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send via WhatsApp'}
                </button>

                <div className="text-center">
                  <a href={`mailto:${siteConfig.email}`} className="text-sm text-gray-500 hover:text-[#14C8F0] transition-colors">
                    Prefer email? Send instead →
                  </a>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
