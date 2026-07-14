import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scholarships Portal | HamroLearning Nepal',
  description: 'Discover scholarships for Nepali students. Browse government scholarships, private scholarships, and international opportunities for SEE, +2, Bachelors, Masters, TU, KU, CTEVT, and Loksewa aspirants.',
  keywords: ['scholarships Nepal', 'government scholarships Nepal', 'private scholarships Nepal', 'international scholarships Nepal', 'education grants Nepal', 'financial aid Nepal', 'free education Nepal', 'scholarship for SEE Nepal', 'scholarship for +2 Nepal', 'scholarship for Bachelor Nepal', 'TU scholarships', 'KU scholarships'],
  openGraph: {
    title: 'Scholarships Portal | HamroLearning Nepal',
    description: 'Find government and international scholarships for Nepali students. Get financial aid for SEE, +2, Bachelors, Masters, and Loksewa preparation.',
  },
  alternates: {
    canonical: '/scholarships',
  },
}

import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Calendar, Landmark, MapPin, Briefcase } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScholarshipBookmarkButton } from '@/components/scholarships/bookmark-button'
import { fallbackScholarships } from '@/utils/scholarship-fallback'

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : ''
  const typeFilter = typeof params.type === 'string' ? params.type : 'All'

  let scholarships: any[] = []
  let bookmarkedIds = new Set<string>()
  let user: any = null

  try {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user = currentUser

    // Base query
    let supabaseQuery = supabase.from('scholarships').select('*').order('created_at', { ascending: false })

    if (query) {
      supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
    }
    
    if (typeFilter && typeFilter !== 'All') {
      supabaseQuery = supabaseQuery.eq('scholarship_type', typeFilter)
    }

    const { data, error } = await supabaseQuery
    
    if (error || !data || data.length === 0) {
      // Filter fallback data
      scholarships = fallbackScholarships.filter(s => {
        const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase()) || 
                             s.provider.toLowerCase().includes(query.toLowerCase())
        const matchesType = typeFilter === 'All' || s.scholarship_type === typeFilter
        return matchesQuery && matchesType
      })
    } else {
      scholarships = data
    }

    // Fetch user bookmarks for optimistic UI
    if (user) {
      const { data: bookmarks } = await supabase
        .from('user_scholarship_bookmarks')
        .select('scholarship_id')
        .eq('user_id', user.id)
      
      if (bookmarks) {
        bookmarkedIds = new Set(bookmarks.map(b => b.scholarship_id))
      }
    }
  } catch (err) {
    console.error('Failed to fetch from Supabase, using fallback data:', err)
    scholarships = fallbackScholarships.filter(s => {
      const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase()) || 
                           s.provider.toLowerCase().includes(query.toLowerCase())
      const matchesType = typeFilter === 'All' || s.scholarship_type === typeFilter
      return matchesQuery && matchesType
    })
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Government': return <Landmark className="w-4 h-4 text-blue-500" />
      case 'International': return <MapPin className="w-4 h-4 text-green-500" />
      case 'Private': return <Briefcase className="w-4 h-4 text-purple-500" />
      default: return <Landmark className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto py-12 px-4 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Scholarship Portal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Find financial aid, government schemes, and international opportunities to fund your education.
          </p>
          
          <form className="mt-8 max-w-xl flex gap-2" method="GET">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input name="q" defaultValue={query} placeholder="Search scholarships by name..." className="pl-10 h-12 text-lg bg-background" />
            </div>
            <Button type="submit" size="lg" className="h-12">Search</Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Filter by Type</h3>
            <div className="space-y-2">
              <Link href={`/scholarships?q=${encodeURIComponent(query)}&type=All`} className="block">
                <Button variant={typeFilter === 'All' ? 'default' : 'ghost'} className="w-full justify-start">All Types</Button>
              </Link>
              <Link href={`/scholarships?q=${encodeURIComponent(query)}&type=Government`} className="block">
                <Button variant={typeFilter === 'Government' ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                  <Landmark className="w-4 h-4" /> Government
                </Button>
              </Link>
              <Link href={`/scholarships?q=${encodeURIComponent(query)}&type=Private`} className="block">
                <Button variant={typeFilter === 'Private' ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                  <Briefcase className="w-4 h-4" /> Private
                </Button>
              </Link>
              <Link href={`/scholarships?q=${encodeURIComponent(query)}&type=International`} className="block">
                <Button variant={typeFilter === 'International' ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                  <MapPin className="w-4 h-4" /> International
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 space-y-4">
          {scholarships && scholarships.length > 0 ? (
            scholarships.map((scholarship: any) => {
              const isBookmarked = bookmarkedIds.has(scholarship.id)
              const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null
              const isValidDeadline = deadline && !isNaN(deadline.getTime())
              const isExpired = isValidDeadline ? deadline < new Date() : false

              return (
                <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`} className="block group">
                  <Card className="hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded flex items-center gap-1">
                              {getIconForType(scholarship.scholarship_type)}
                              {scholarship.scholarship_type || 'General'}
                            </span>
                            {isExpired && (
                              <span className="text-xs font-bold uppercase tracking-wider bg-destructive/10 text-destructive px-2 py-1 rounded">
                                Expired
                              </span>
                            )}
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">{scholarship.title}</CardTitle>
                          <div className="text-sm font-medium text-muted-foreground mt-1">Provided by {scholarship.provider}</div>
                        </div>
                        <div>
                           {user && <ScholarshipBookmarkButton scholarshipId={scholarship.id} initialBookmarked={isBookmarked} />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{scholarship.description}</p>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-3 flex flex-wrap gap-6 text-sm">
                       {scholarship.amount && (
                         <div className="font-bold text-green-600 dark:text-green-500">{scholarship.amount}</div>
                       )}
                       {isValidDeadline && (
                         <div className="flex items-center gap-2 text-muted-foreground">
                           <Calendar className="w-4 h-4" /> 
                           Deadline: {deadline.toLocaleDateString()}
                         </div>
                       )}
                    </CardFooter>
                  </Card>
                </Link>
              )
            })
          ) : (
            <div className="py-20 text-center border rounded-lg bg-background">
              <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold">No scholarships found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
