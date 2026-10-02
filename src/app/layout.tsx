import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Sora } from 'next/font/google'
import { siteConfig, SITE_URL } from '@/data/site'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: SITE_URL }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
}

function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: siteConfig.name,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.svg`,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: siteConfig.phone,
          contactType: 'sales',
          email: siteConfig.email,
          areaServed: 'Worldwide',
          availableLanguage: ['English', 'Hindi', 'Bengali'],
        },
        sameAs: [siteConfig.portfolioUrl],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#service`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: SITE_URL,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        areaServed: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 22.5726,
            longitude: 88.3639,
          },
          geoRadius: '50000',
        },
        priceRange: '$$',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Software Development Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Web Development',
                description:
                  'Fast, responsive web apps built with Next.js, React and modern stacks.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Mobile App Development',
                description:
                  'Cross-platform mobile apps with React Native for iOS and Android.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'AI Automation',
                description:
                  'Custom AI agents, chatbots and workflow automations.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'SaaS Platform Development',
                description:
                  'Full SaaS products with multi-tenancy, billing and analytics.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cloud & DevOps',
                description:
                  'CI/CD pipelines, Docker, Kubernetes and AWS infrastructure.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'WhatsApp Automation',
                description:
                  'WhatsApp Business API integrations for automated customer support.',
              },
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${sora.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="bg-navy-900 text-gray-200 font-body antialiased film-grain">
        {children}
      </body>
    </html>
  )
}
