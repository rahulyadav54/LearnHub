import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ category: string, program: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: program } = await supabase
    .from('programs')
    .select('name, description, categories(name)')
    .eq('slug', resolvedParams.program)
    .single()

  if (!program) return { title: 'Program Not Found' }

  const categoryName = (program.categories as any)?.name || resolvedParams.category

  return {
    title: `${program.name} ${categoryName} Study Materials | HamroLearning Nepal`,
    description: program.description || `Browse free ${program.name} study notes, question papers, books, and academic resources for ${categoryName} students in Nepal.`,
    keywords: [`${program.name} notes`, `${program.name} Nepal`, `${categoryName} ${program.name}`, `${program.name} study materials`, `${program.name} question papers`],
    alternates: {
      canonical: `/explore/${resolvedParams.category}/${resolvedParams.program}`,
    },
  }
}

const baseUrl = 'https://learnhub.com.np'

export default async function ProgramPage({ params }: { params: Promise<{ category: string, program: string }> }) {
  const resolvedParams = await params
  
  if (resolvedParams.program === 'none') return notFound()

  const supabase = await createClient()
  
  const { data: program } = await supabase
    .from('programs')
    .select('id, name, category_id, categories(name)')
    .eq('slug', resolvedParams.program)
    .single()

  if (!program) return notFound()

  const categoryName = (program.categories as any)?.name || resolvedParams.category
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}` },
      { '@type': 'ListItem', position: 2, name: 'Explore', item: `${baseUrl}/explore` },
      { '@type': 'ListItem', position: 3, name: categoryName, item: `${baseUrl}/explore/${resolvedParams.category}` },
      { '@type': 'ListItem', position: 4, name: program.name, item: `${baseUrl}/explore/${resolvedParams.category}/${resolvedParams.program}` },
    ],
  }

  const { data: semesters } = await supabase
    .from('semesters')
    .select('*')
    .eq('program_id', program.id)
    .order('order_index')

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
            <Link href={`/explore/${resolvedParams.category}`} className="hover:text-primary">{(program.categories as any)?.name || resolvedParams.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{program.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{program.name}</h1>
          <p className="mt-2 text-muted-foreground">Select your semester to view subjects.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {semesters && semesters.length > 0 ? (
            semesters.map((sem) => (
              <Link key={sem.id} href={`/explore/${resolvedParams.category}/${resolvedParams.program}/${sem.slug}`}>
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all bg-background p-6 text-center">
                  <CardTitle className="text-lg">{sem.name}</CardTitle>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg border-dashed">
              No semesters configured for this program yet.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
