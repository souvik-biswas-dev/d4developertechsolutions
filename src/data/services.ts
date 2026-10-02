export interface Service {
  id: string
  title: string
  tagline: string
  description: string
  iconName: string
}

export const services: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    tagline: 'Sites that perform',
    description:
      'Fast, responsive web apps built with Next.js, React and modern stacks. From landing pages to complex dashboards — shipped production-ready.',
    iconName: 'Globe',
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Apps',
    tagline: 'Native feel, one codebase',
    description:
      'Cross-platform mobile apps with React Native that look and feel native on iOS and Android. Push notifications, offline mode, app store deployment.',
    iconName: 'Smartphone',
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    tagline: 'Your team, amplified',
    description:
      'Custom AI agents, chatbots and workflow automations that handle repetitive tasks so your team focuses on what matters. Powered by GPT, Gemini and open-source models.',
    iconName: 'Brain',
  },
  {
    id: 'saas-platforms',
    title: 'SaaS Platforms',
    tagline: 'From zero to recurring revenue',
    description:
      'Full SaaS products with multi-tenancy, billing integration, user management and analytics dashboards. We handle the architecture — you handle the growth.',
    iconName: 'Layers',
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    tagline: 'Ship with confidence',
    description:
      'CI/CD pipelines, Docker containers, Kubernetes orchestration and AWS infrastructure. Your code deploys automatically, scales on demand and stays up.',
    iconName: 'Cloud',
  },
  {
    id: 'whatsapp-automation',
    title: 'WhatsApp Automation',
    tagline: 'Business on autopilot',
    description:
      'WhatsApp Business API integrations for automated customer support, order confirmations, appointment reminders and lead nurturing. 24/7 without lifting a finger.',
    iconName: 'MessageCircle',
  },
]
