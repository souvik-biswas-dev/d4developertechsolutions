export interface ProcessStep {
  id: string
  number: string
  title: string
  description: string
  iconName: string
}

export const processSteps: ProcessStep[] = [
  {
    id: 'discover',
    number: '01',
    title: 'Discover',
    description:
      'We dig into your business, your users and your goals. No generic questionnaires — a real conversation about what you need and why.',
    iconName: 'Search',
  },
  {
    id: 'design',
    number: '02',
    title: 'Design',
    description:
      'Wireframes, prototypes and user flows before a single line of code. You see exactly what you\'re getting and sign off on every screen.',
    iconName: 'PenTool',
  },
  {
    id: 'build',
    number: '03',
    title: 'Build',
    description:
      'Sprint-based development with weekly demos. Production-grade code, tested and reviewed. You\'re in the loop at every stage, not just at the end.',
    iconName: 'Code',
  },
  {
    id: 'deploy',
    number: '04',
    title: 'Deploy',
    description:
      'CI/CD pipelines, monitoring and zero-downtime deployments. Your product goes live with confidence — and we stick around for support.',
    iconName: 'Rocket',
  },
]
