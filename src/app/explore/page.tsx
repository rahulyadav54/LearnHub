import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Explore the Curriculum</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Select your academic level or university to dive into course materials, notes, and past papers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        {categories?.map((cat) => (
          <Link key={cat.id} href={`/explore/${cat.slug}`}>
            <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group bg-background">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{cat.name}</CardTitle>
                <CardDescription>{cat.description || `Explore ${cat.name} resources`}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
