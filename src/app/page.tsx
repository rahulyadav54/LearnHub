/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { HeroSection } from '@/components/home/hero-section'
import { CategoryGrid } from '@/components/home/category-grid'
import { AIBanner } from '@/components/home/ai-banner'
import { ContentCarousel } from '@/components/home/content-carousel'
import { Skeleton } from '@/components/ui/skeleton'

async function CategoriesData() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').limit(8)
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
  
  return <ContentCarousel title="Latest Question Papers" items={data as any || []} />
}

function SectionSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full" />)}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <Suspense fallback={<SectionSkeleton />}>
        <CategoriesData />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedNotesData />
      </Suspense>

      <AIBanner />

      <Suspense fallback={<SectionSkeleton />}>
        <PastPapersData />
      </Suspense>
    </div>
  )
}
