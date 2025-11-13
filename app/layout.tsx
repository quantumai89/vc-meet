import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeCall - Talk Freely. Instantly. Globally.',
  description: 'Free video calling app - No sign-in, no cost. Create or join meetings instantly.',
  keywords: ['video call', 'free', 'zoom alternative', 'webrtc', 'meeting'],
  authors: [{ name: 'VibeCall Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-vibe-darker">
          {children}
        </div>
      </body>
    </html>
  )
}
