export interface NavLink {
  label: string
  href: string
}

export const navLinks: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export const budgetRanges = [
  '₹10,000 – ₹20,000',
  '₹20,000 – ₹30,000',
  '₹30,000 – ₹50,000',
  '₹50,000 – ₹2,00,000',
  '₹2,00,000 – ₹5,00,000',
  '₹5,00,000 – ₹10,00,000',
  '₹10,00,000+',
  'Not sure yet',
] as const
