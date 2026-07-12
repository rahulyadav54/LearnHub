import { createClient } from '@/utils/supabase/server'
import { ExploreClient } from '@/components/explore/explore-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Study Materials & Resources | HamroLearning Nepal',
  description: 'Browse free study notes, question papers, books, and academic resources for SEE, +2, Bachelors, Masters, TU, KU, CTEVT, and Loksewa. Organized by category, program, and subject.',
  keywords: ['study materials Nepal', 'free notes Nepal', 'question papers Nepal', 'SEE notes', '+2 notes Nepal', 'Bachelor notes Nepal', 'academic resources Nepal', 'Nepal education materials'],
  openGraph: {
    title: 'Explore Free Study Materials | HamroLearning Nepal',
    description: 'Access thousands of free study notes, question papers, and academic resources organized by curriculum for Nepali students.',
  },
  alternates: {
    canonical: '/explore',
  },
}

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<{ level?: string }> | { level?: string }
}) {
  const resolvedParams = await searchParams
  const level = resolvedParams?.level || "All"
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.hamrolearning.com' },
      { '@type': 'ListItem', position: 2, name: 'Explore', item: 'https://www.hamrolearning.com/explore' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="section-padding">
        <div className="section-container">
          {/* Header */}
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Content Library</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Explore the Curriculum</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Select your academic level or subject to dive into notes, question papers, and study resources.
            </p>
          </div>

          <div className="space-y-6">
            <ExploreClient categories={categories || []} initialLevel={level} />
          </div>
        </div>
      </div>
    </>
  )
}
