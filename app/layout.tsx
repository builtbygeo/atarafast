import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider } from '@/lib/language-context'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { headers } from 'next/headers'

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains",
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atara — The Beautiful Fasting Timer',
  description: 'From Ataraxia — the Stoic state of unshakeable inner calm. Track your fasts with clarity and peace.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Atara',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
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
  const isDev = host.includes('localhost') || host.includes('127.0.0.1')
  const isApp = host.startsWith('app.') || host.includes('.app.') || host.includes('atara-app')
  
  // On production, if we are on the app subdomain, we are a satellite
  const isSatellite = !isDev && isApp
  const domain = !isDev ? 'atarafast.com' : undefined

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased text-white bg-[#0f0f0f]`}>
        <ClerkProvider 
          domain={!isDev ? 'atarafast.com' : undefined}
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

