export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://d4developertechsolutions.pages.dev'

export const siteConfig = {
  name: 'D4Developer Tech Solutions',
  shortName: 'D4Developer',
  tagline: 'Build smarter. Grow faster.',
  description:
    'We design, build & deploy web apps, mobile apps and AI automations for startups and businesses — from idea to production, fast.',
  phone: '+91 8918818386',
  phoneRaw: '918918818386',
  email: 'dev.souvikbiswas@gmail.com',
  whatsappUrl: 'https://wa.me/918918818386',
  whatsappGreeting:
    'Hi D4Developer Tech Solutions! 👋 I visited your website and I\'d like to discuss a project.',
  url: SITE_URL,
  portfolioUrl: 'https://souvikbiswas-portfolio.pages.dev',
  location: 'India',
  servesWorldwide: true,
  foundedYear: 2024,
  themeColor: '#050816',
  keywords: [
    'web development agency India',
    'mobile app development',
    'AI automation',
    'WhatsApp automation',
    'SaaS development',
    'Next.js developers',
    'React Native developers',
    'Kolkata software agency',
    'Siliguri software agency',
    'full stack development India',
  ],
} as const
