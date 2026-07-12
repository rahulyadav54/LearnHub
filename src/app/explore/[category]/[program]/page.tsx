import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export default async function ProgramPage({ params }: { params: Promise<{ category: string, program: string }> }) {
  const resolvedParams = await params
  
  // If "none", this is a flat structure, handled at subject level
  if (resolvedParams.program === 'none') return notFound()

  const supabase = await createClient()
  
  const { data: program } = await supabase
    .from('programs')
    .select('id, name, category_id, categories(name)')
    .eq('slug', resolvedParams.program)
    .single()

  if (!program) return notFound()

  // Find semesters for this program
  const { data: semesters } = await supabase
    .from('semesters')
    .select('*')
    .eq('program_id', program.id)
    .order('order_index')

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/explore" className="hover:text-primary">Explore</Link>
          <ChevronRight className="w-4 h-4" />
          {/* @ts-expect-error type */}
          <Link href={`/explore/${resolvedParams.category}`} className="hover:text-primary">{program.categories?.name || resolvedParams.category}</Link>
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
  )
}
