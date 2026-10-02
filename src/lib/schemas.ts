import { z } from 'zod'

/* Indian mobile phone: optional +91 prefix, then 10 digits starting with 6-9 */
const phoneRegex = /^(\+91)?[6-9]\d{9}$/

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  phone: z
    .string()
    // spaces and hyphens are allowed, so "+91 98765 43210" works
    .refine((v) => phoneRegex.test(v.replace(/[\s-]/g, '')), 'Enter a valid 10-digit Indian mobile number'),
  email: z
    .string()
    .email('Enter a valid email address'),
  service: z
    .string()
    .min(1, 'Please select a service'),
  budget: z
    .string()
    .min(1, 'Please select a budget range'),
  details: z
    .string()
    .min(10, 'Tell us a bit more (at least 10 characters)')
    .max(2000, 'Message is too long'),
  /* Honeypot — must remain empty */
  website: z.string().max(0, 'Bot detected').optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
