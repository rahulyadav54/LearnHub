/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { HeroSection } from '@/components/home/hero-section'
import { StatsBar } from '@/components/home/stats-bar'
import { CategoryGrid } from '@/components/home/category-grid'
import { AIBanner } from '@/components/home/ai-banner'
import { ContentCarousel } from '@/components/home/content-carousel'
import { Testimonials } from '@/components/home/testimonials'
import { CTASection } from '@/components/home/cta-section'
import { Skeleton } from '@/components/ui/skeleton'

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

      {/* 8. CTA Section */}
      <CTASection />
    </div>
  )
}
