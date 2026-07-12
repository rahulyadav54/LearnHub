/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bookmark, FileText, ExternalLink } from 'lucide-react'

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookmarks } = await supabase
    .from('user_bookmarks')
    .select(`
      content_items (
        id,
        title,
        slug,
        type,
        categories (name)
      )
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const { data: scholarBookmarks } = await supabase
    .from('user_scholarship_bookmarks')
    .select(`
      scholarships (
        id,
        title,
        provider,
        amount
      )
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-primary" /> Bookmarks
        </h1>
        <p className="text-muted-foreground mt-2">All your saved notes, PDFs, and scholarships.</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">Study Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks && bookmarks.length > 0 ? (
              bookmarks.map((b: any, idx) => (
                <Card key={idx} className="flex flex-col">
              <CardHeader>
                <div className="text-xs font-bold text-primary uppercase mb-1">{b.content_items?.categories?.name || 'General'}</div>
                <CardTitle className="text-lg line-clamp-2">{b.content_items?.title}</CardTitle>
                <CardDescription className="uppercase text-xs tracking-wider font-mono">{b.content_items?.type}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <Link href={`/notes/${b.content_items?.slug}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" /> Open
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-12 text-center border rounded-lg bg-muted/20">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold">No saved notes</h3>
              <p className="text-muted-foreground">When you bookmark a note, it will appear here.</p>
            </div>
          )}
        </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Scholarships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarBookmarks && scholarBookmarks.length > 0 ? (
              scholarBookmarks.map((b: any, idx) => (
                <Card key={idx} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{b.scholarships?.title}</CardTitle>
                    <div className="text-sm font-medium text-muted-foreground mt-1">{b.scholarships?.provider}</div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {b.scholarships?.amount && <div className="text-green-600 font-bold">{b.scholarships.amount}</div>}
                  </CardContent>
                  <CardContent className="mt-auto">
                    <Link href={`/scholarships/${b.scholarships?.id}`}>
                      <Button variant="outline" className="w-full gap-2">
                        <ExternalLink className="w-4 h-4" /> View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full p-12 text-center border rounded-lg bg-muted/20">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold">No saved scholarships</h3>
                <p className="text-muted-foreground">Scholarships you bookmark will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
