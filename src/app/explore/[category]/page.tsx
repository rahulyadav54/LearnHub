import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', resolvedParams.category)
    .single()

  if (!category) return { title: 'Category Not Found' }

  return {
    title: `${category.name} Study Materials | HamroLearning Nepal`,
    description: category.description || `Browse free ${category.name} study notes, question papers, books, and academic resources for Nepali students preparing for ${category.name} exams.`,
    keywords: [`${category.name} study notes`, `${category.name} question papers`, `${category.name} Nepal`, `${category.name} preparation`, `${category.name} materials`],
    alternates: {
      canonical: `/explore/${resolvedParams.category}`,
    },
  }
}

const baseUrl = 'https://learnhub.com.np'

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', resolvedParams.category)
    .single()

  if (!category) return notFound()

  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('category_id', category.id)
    .order('name')

  const { data: flatSubjects } = await supabase
    .from('subjects')
    .select('*')
    .eq('category_id', category.id)
    .is('program_id', null)
    .order('name')

  const hasPrograms = programs && programs.length > 0
  const hasFlatSubjects = flatSubjects && flatSubjects.length > 0

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}` },
      { '@type': 'ListItem', position: 2, name: 'Explore', item: `${baseUrl}/explore` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${baseUrl}/explore/${resolvedParams.category}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/explore" className="hover:text-primary">Explore</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{category.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="mt-2 text-muted-foreground">Select your specific program or subject below.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hasPrograms && programs.map((prog) => (
            <Link key={prog.id} href={`/explore/${resolvedParams.category}/${prog.slug}`}>
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all bg-background p-6">
                <CardTitle className="text-xl">{prog.name}</CardTitle>
              </Card>
            </Link>
          ))}

          {hasFlatSubjects && flatSubjects.map((sub) => (
            <Link key={sub.id} href={`/explore/${resolvedParams.category}/none/none/${sub.slug}`}>
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all bg-background p-6">
                <CardTitle className="text-xl">{sub.name}</CardTitle>
              </Card>
            </Link>
          ))}
          
          {!hasPrograms && !hasFlatSubjects && (
            <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg border-dashed">
              No programs or subjects found for this category yet.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
