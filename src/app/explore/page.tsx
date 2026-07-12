import { createClient } from '@/utils/supabase/server'
import { ExploreClient } from '@/components/explore/explore-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Browse all academic categories — SEE, +2, Bachelors, Masters, and Loksewa study materials.',
}

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
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
          <ExploreClient categories={categories || []} />
        </div>
      </div>
    </div>
  )
}
