import type { Metadata } from 'next'
import './globals.css'
import { ConvexClientProvider } from '@/components/ConvexClientProvider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'itwela.dev – AI product engineer & technical solutions specialist',
  description:
    'AI product engineer and full‑stack developer building technical solutions across web, AI, and music – featuring live projects, JobKompass, and an AI agent that understands my work.',
  openGraph: {
    title: 'itwela.dev – AI product engineer & technical solutions specialist',
    description:
      'Live macOS-style portfolio with embedded apps (JobKompass, music, photos, AI agent) powered by Convex and modern web tech.',
    url: 'https://itwela.dev',
    siteName: 'itwela.dev',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'itwela.dev – AI product engineer desktop',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'itwela.dev – AI product engineer & technical solutions specialist',
    description:
      'AI product engineer and full‑stack developer building technical solutions across web, AI, and music.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
        <Toaster
          position="top-right"
          theme="dark"
          offset={{ top: 44, right: 18 }}
          toastOptions={{
            classNames: {
              toast: 'mac-notification',
            },
          }}
        />
      </body>
    </html>
  )
}
