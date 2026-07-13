/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react'
import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { HeroSection } from '@/components/home/hero-section'
import { StatsBar } from '@/components/home/stats-bar'
import { CategoryGrid } from '@/components/home/category-grid'
import { AIBanner } from '@/components/home/ai-banner'
import { ContentCarousel } from '@/components/home/content-carousel'
import { Testimonials } from '@/components/home/testimonials'
import { AIZayaAd } from '@/components/home/ai-zaya-ad'
import { CTASection } from '@/components/home/cta-section'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Home | HamroLearning Nepal',
  description: 'Discover Nepal\'s #1 education platform for SEE, +2, Bachelors, and Loksewa. Access free study notes, question papers, mock tests, AI Tutor, scholarships, and MCQ practice — all in one place.',
  keywords: ['free study notes Nepal', 'SEE preparation Nepal', '+2 study materials Nepal', 'mock tests Nepal', 'AI tutor Nepal', 'scholarships Nepal', 'question papers Nepal', 'MCQ practice Nepal', 'Loksewa preparation Nepal', 'Bachelor notes Nepal', 'online learning Nepal'],
  openGraph: {
    title: 'HamroLearning Nepal | #1 Education Platform for Nepali Students',
    description: 'Free study notes, question papers, mock tests, AI Tutor, scholarships, and career guidance for SEE, +2, Bachelors, and Loksewa aspirants across Nepal.',
    url: 'https://www.hamrolearning.com',
    siteName: 'HamroLearning Nepal',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'HamroLearning Nepal - AI-Powered Education Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HamroLearning Nepal | AI-Powered Education Platform',
    description: 'Nepal\'s most modern education platform for SEE, +2, Bachelors, and Loksewa aspirants. Free study materials, mock tests, and AI Tutor.',
  },
  alternates: {
    canonical: '/',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HamroLearning Nepal',
  url: 'https://www.hamrolearning.com',
  description: "Nepal's most modern AI-powered education platform for SEE, +2, Bachelors, and Loksewa aspirants.",
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.hamrolearning.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

async function CategoriesData() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('name').limit(8)
  return <CategoryGrid categories={data || []} />
}

async function FeaturedNotesData() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('content_items')
    .select('*, subjects(name)')
    .eq('content_type', 'note')
    .order('downloads_count', { ascending: false })
    .limit(8)
  return <ContentCarousel title="Featured Notes" items={data as any || []} />
}

async function PastPapersData() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('content_items')
    .select('*, subjects(name)')
    .eq('content_type', 'question_paper')
    .order('created_at', { ascending: false })
    .limit(8)
  return <ContentCarousel title="Latest Question Papers" items={data as any || []} viewAllHref="/explore" />
}

function SectionSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="section-padding">
      <div className="section-container">
        <Skeleton className="h-8 w-48 mb-3" />
        <Skeleton className="h-5 w-80 mb-10" />
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols} gap-5`}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="flex flex-col min-h-screen">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Stats Bar */}
        <StatsBar />

        {/* 3. Category Grid */}
        <Suspense fallback={<SectionSkeleton cols={4} />}>
          <CategoriesData />
        </Suspense>

        {/* 4. Featured Notes */}
        <Suspense fallback={<SectionSkeleton cols={4} />}>
          <FeaturedNotesData />
        </Suspense>

        {/* 5. AI Banner */}
        <AIBanner />

        {/* 6. Past Papers */}
        <Suspense fallback={<SectionSkeleton cols={4} />}>
          <PastPapersData />
        </Suspense>

        {/* 7. Testimonials */}
        <Testimonials />

        {/* 8. AI ZAYA Mobile App Ad */}
        <AIZayaAd />

        {/* 9. CTA Section */}
        <CTASection />
      </div>
    </>
  )
}
