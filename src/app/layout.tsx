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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "HamroLearning | The Ultimate Academic Portal",
    template: "%s | HamroLearning"
  },
  description: "HamroLearning provides students with dynamic notes, mock tests, scholarships, and an AI Tutor for academic excellence.",
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://learnhub.com.np",
    title: "HamroLearning Nepal",
    description: "Nepal's largest digital education platform for SEE, +2, Bachelors, and Loksewa aspirants.",
    siteName: "HamroLearning Nepal",
  },
  twitter: {
    card: "summary_large_image",
    title: "HamroLearning Nepal",
    description: "Nepal's largest digital education platform.",
  },
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
