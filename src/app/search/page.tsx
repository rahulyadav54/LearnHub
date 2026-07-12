import type { Metadata } from 'next'
import { globalSearch } from '@/app/actions/search-actions'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, GraduationCap, Building2, HelpCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const query = params.q || ''

  if (query) {
    return {
      title: `Search Results for "${query}" | HamroLearning Nepal`,
      description: `Search results for "${query}" on HamroLearning Nepal. Find study notes, question papers, blogs, and academic resources.`,
      robots: { index: false, follow: true },
    }
  }

  return {
    title: 'Search Study Materials | HamroLearning Nepal',
    description: 'Search thousands of free study notes, question papers, mock tests, scholarships, and blogs for Nepali students on HamroLearning.',
    keywords: ['search notes Nepal', 'search question papers Nepal', 'find study materials Nepal', 'Nepali education search'],
    alternates: {
      canonical: '/search',
    },
  }
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : ''
  const filterType = typeof params.type === 'string' ? params.type : 'all'

  // We reuse the globalSearch action but we could increase the limit for the dedicated page
  // For MVP, globalSearch limits to 15, we'll just use it directly.
  const allResults = await globalSearch(query, 50) 
  
  const filteredResults = filterType === 'all' 
    ? allResults 
    : allResults.filter(r => r.type.toLowerCase() === filterType.toLowerCase().replace('-', ' '))

  const getIcon = (type: string) => {
    switch (type) {
      case 'Note': return <FileText className="w-5 h-5 text-blue-500" />
      case 'Question Paper': return <HelpCircle className="w-5 h-5 text-orange-500" />
      case 'Subject': return <GraduationCap className="w-5 h-5 text-primary" />
      case 'University': return <Building2 className="w-5 h-5 text-purple-500" />
      case 'Blog': return <FileText className="w-5 h-5 text-green-500" />
      default: return <FileText className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results for &quot;{query}&quot;</h1>
        <p className="text-muted-foreground">Found {allResults.length} total results across the platform.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Filter by Type</h3>
          
          <Link href={`/search?q=${encodeURIComponent(query)}`} className="block">
            <Button variant={filterType === 'all' ? 'default' : 'ghost'} className="w-full justify-start">All Results</Button>
          </Link>
          <Link href={`/search?q=${encodeURIComponent(query)}&type=note`} className="block">
            <Button variant={filterType === 'note' ? 'default' : 'ghost'} className="w-full justify-start">Notes</Button>
          </Link>
          <Link href={`/search?q=${encodeURIComponent(query)}&type=question-paper`} className="block">
            <Button variant={filterType === 'question-paper' ? 'default' : 'ghost'} className="w-full justify-start">Question Papers</Button>
          </Link>
          <Link href={`/search?q=${encodeURIComponent(query)}&type=subject`} className="block">
            <Button variant={filterType === 'subject' ? 'default' : 'ghost'} className="w-full justify-start">Subjects</Button>
          </Link>
          <Link href={`/search?q=${encodeURIComponent(query)}&type=university`} className="block">
            <Button variant={filterType === 'university' ? 'default' : 'ghost'} className="w-full justify-start">Universities</Button>
          </Link>
          <Link href={`/search?q=${encodeURIComponent(query)}&type=blog`} className="block">
            <Button variant={filterType === 'blog' ? 'default' : 'ghost'} className="w-full justify-start">Blogs</Button>
          </Link>
        </div>

        {/* Results List */}
        <div className="flex-1 space-y-4">
          {filteredResults.length > 0 ? (
            filteredResults.map(res => (
              <Link key={`${res.type}-${res.id}`} href={res.href} className="block group">
                <Card className="group-hover:border-primary transition-colors">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="mt-1 bg-muted p-2 rounded-md">
                      {getIcon(res.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{res.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground border px-2 py-0.5 rounded bg-muted/50">
                          {res.type}
                        </span>
                        {res.subtitle && <span className="text-sm text-muted-foreground">{res.subtitle}</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="p-12 text-center border rounded-lg bg-muted/10">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold">No exact matches found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
