import { services } from './services'
import { techStack } from './techStack'
import { projects } from './projects'

export interface Stat {
  id: string
  value: number
  suffix: string
  label: string
}

/* Every number is counted from the site's own data files, so it can never drift from what is shown on the page. */
export const stats: Stat[] = [
  { id: 'services', value: services.length, suffix: '', label: 'Services we offer' },
  { id: 'technologies', value: techStack.length, suffix: '', label: 'Technologies we work with' },
  { id: 'case-studies', value: projects.length, suffix: '', label: 'Featured case studies' },
]
