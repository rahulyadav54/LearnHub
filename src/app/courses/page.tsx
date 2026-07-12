import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, Award, Compass, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Free Online Courses & Certificates | HamroLearning',
  description: 'Boost your skills with 100% free video courses. Complete structured modules and claim your verified digital certificates.',
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; difficulty?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const diffFilter = params.difficulty || 'All'

  const supabase = await createClient()

  // Base query
  let supabaseQuery = supabase
    .from('courses')
    .select('*, categories(name), lessons(id)')

  if (query) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
  }

  if (diffFilter && diffFilter !== 'All') {
    supabaseQuery = supabaseQuery.eq('difficulty', diffFilter)
  }

  const { data: courses } = await supabaseQuery.order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Premium Hero Banner */}
      <div className="relative bg-slate-900 overflow-hidden py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="section-container relative max-w-6xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" /> 100% Free Certificates
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Free Video Courses
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
            Upgrade your resume with structured video tutorials aggregated from top teachers, track your learning progress, and claim completion certificates.
          </p>

          <form className="max-w-xl flex gap-2" method="GET">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search courses (e.g. Python, Javascript...)"
                className="pl-12 h-13 text-base bg-slate-800/80 border-slate-700/80 text-white placeholder:text-slate-400 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Button type="submit" size="lg" className="h-13 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="section-container max-w-6xl py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-60 shrink-0 space-y-6">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Difficulty</h3>
            <div className="space-y-1.5">
              <Link href={`/courses?q=${encodeURIComponent(query)}&difficulty=All`} className="block">
                <Button variant={diffFilter === 'All' ? 'default' : 'ghost'} className="w-full justify-start rounded-xl font-bold h-11">
                  All Levels
                </Button>
              </Link>
              <Link href={`/courses?q=${encodeURIComponent(query)}&difficulty=Beginner`} className="block">
                <Button variant={diffFilter === 'Beginner' ? 'default' : 'ghost'} className="w-full justify-start rounded-xl font-bold h-11">
                  Beginner
                </Button>
              </Link>
              <Link href={`/courses?q=${encodeURIComponent(query)}&difficulty=Intermediate`} className="block">
                <Button variant={diffFilter === 'Intermediate' ? 'default' : 'ghost'} className="w-full justify-start rounded-xl font-bold h-11">
                  Intermediate
                </Button>
              </Link>
              <Link href={`/courses?q=${encodeURIComponent(query)}&difficulty=Advanced`} className="block">
                <Button variant={diffFilter === 'Advanced' ? 'default' : 'ghost'} className="w-full justify-start rounded-xl font-bold h-11">
                  Advanced
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Courses Grid */}
        <main className="flex-1">
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="block group">
                  <Card className="h-full rounded-2xl overflow-hidden border-slate-200/80 dark:border-slate-800/80 bg-card hover:shadow-xl hover:border-indigo-500/30 transition-all flex flex-col">
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img
                        src={course.cover_image_url || `https://picsum.photos/400/225?random=${course.id}`}
                        alt={course.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-350"
                      />
                    </div>
                    <CardHeader className="p-5 flex-1">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          {course.categories?.name || 'General'}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {course.difficulty}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-4 pt-0">
                      <p className="text-muted-foreground text-xs font-semibold line-clamp-2 leading-relaxed">
                        {course.description || 'Explore syllabus and learn the core skills.'}
                      </p>
                    </CardContent>
                    <CardFooter className="px-5 py-4 border-t border-slate-100 dark:border-slate-850/80 flex items-center justify-between text-xs text-muted-foreground font-bold bg-muted/20">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.lessons?.length || 0} Lessons
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {course.estimated_hours} Hours
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-card">
              <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold">No courses found</h3>
              <p className="text-muted-foreground mt-2 font-semibold">Try adjusting your filters or search query.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
