import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://learnhub.com.np'),
  title: {
    default: "HamroLearning Nepal | AI-Powered Education Platform for SEE, +2, Bachelors & Loksewa",
    template: "%s | HamroLearning Nepal"
  },
  description: "Nepal's most modern AI-powered education platform. Access free study notes, question papers, mock tests, MCQ practice, AI Tutor, scholarships, and career guidance for SEE, +2, Bachelors, Masters, TU, KU, CTEVT, and Loksewa aspirants.",
  keywords: ["HamroLearning", "Nepal education", "SEE preparation", "+2 study materials", "Bachelor notes Nepal", "Loksewa preparation", "mock tests Nepal", "AI tutor Nepal", "scholarships Nepal", "question papers Nepal", "MCQ practice Nepal", "study notes Nepal", "tuition Nepal", "Kathmandu education", "online learning Nepal", "free education Nepal"],
  authors: [{ name: "HamroLearning Team" }],
  creator: "HamroLearning Nepal",
  publisher: "HamroLearning Nepal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
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
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://learnhub.com.np",
    siteName: "HamroLearning Nepal",
    title: "HamroLearning Nepal | AI-Powered Education for SEE, +2, Bachelors & Loksewa",
    description: "Nepal's largest digital education platform. Get free study notes, question papers, mock tests, AI Tutor, scholarships, and career guidance for all Nepali students.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "HamroLearning Nepal - AI-Powered Education Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HamroLearning Nepal | AI-Powered Education Platform",
    description: "Nepal's most modern AI-powered education platform for SEE, +2, Bachelors, and Loksewa aspirants. Free study notes, mock tests, and AI Tutor.",
    images: ["/logo.png"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HamroLearning Nepal',
    description: "Nepal's most modern AI-powered education platform for SEE, +2, Bachelors, Masters, and Loksewa aspirants.",
    url: 'https://learnhub.com.np',
    logo: 'https://learnhub.com.np/logo.png',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@hamrolearning.com',
      contactType: 'customer support',
      availableLanguage: ['English', 'Nepali'],
      areaServed: 'NP',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    sameAs: [
      'https://facebook.com/hamrolearning',
      'https://twitter.com/hamrolearning',
      'https://instagram.com/hamrolearning',
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
