import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider } from '@/lib/language-context'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { headers } from 'next/headers'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: 'Atara — The Beautiful Fasting Timer',
  description: 'From Ataraxia — the Stoic state of unshakeable inner calm. Track your fasts with clarity and peace.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Atara',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const host = headerList.get('host') || ''
  
  // Dynamic Environment Detection based on Clerk Key
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
  const isProdKey = clerkPubKey.startsWith('pk_live_')
  
  const isDev = host.includes('localhost') || host.includes('127.0.0.1')
  const isAppSubdomain = host.startsWith('app.') || host.includes('.app.') || host.includes('atara-app')
  
  // Configuration for Multi-Domain / Satellite
  // Mandatory for custom domain (clerk.atarafast.com) to work on app.atarafast.com
  const isSatellite = isProdKey && (isAppSubdomain || isDev)
  const domain = isProdKey ? 'atarafast.com' : undefined

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased text-white bg-[#0f0f0f]`}>
        <ClerkProvider 
          isSatellite={isSatellite}
          domain={domain}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </ThemeProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  )
}

