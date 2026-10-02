type ClassValue = any;

/* Lightweight clsx — no external dep needed */
export function clsx_internal(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string' && x.length > 0)
    .join(' ')
}

/* Simple class-name merger (cn) since we don't need tailwind-merge for this project */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}

/* Format phone for display */
export function formatPhone(phone: string): string {
  return phone.replace(/(\+91)\s?(\d{5})(\d{5})/, '$1 $2 $3')
}

/* Build WhatsApp URL with encoded message */
export function buildWhatsAppUrl(phoneRaw: string, message: string): string {
  return `https://wa.me/${phoneRaw}?text=${encodeURIComponent(message)}`
}

/* Build contact form WhatsApp message */
export function buildContactMessage(data: {
  name: string
  phone: string
  email: string
  service: string
  budget: string
  details: string
}): string {
  return `Hi D4Developer Tech Solutions! 👋

*Name:* ${data.name}
*Phone:* ${data.phone}
*Email:* ${data.email}
*Service:* ${data.service}
*Budget:* ${data.budget}
*Project details:* ${data.details}`
}

/* Lerp helper for smooth animations */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

/* Clamp value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/* Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/* Detect if running on a touch device */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
