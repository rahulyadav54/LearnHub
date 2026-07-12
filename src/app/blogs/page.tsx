/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Clock, User } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | HamroLearning',
  description: 'Read the latest educational articles, tips, and news.',
}

export default async function BlogArchivePage() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from('blogs')
    .select(`
      id, title, slug, excerpt, cover_image_url, reading_time_minutes, created_at, tags,
      profiles (full_name, avatar_url)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">HamroLearning Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Insights, study tips, and educational news curated by experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog: any) => (
            <Link key={blog.id} href={`/blogs/${blog.slug}`} className="block group">
              <Card className="h-full flex flex-col overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg">
                {blog.cover_image_url ? (
                  <div 
                    className="h-48 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                    style={{ backgroundImage: `url(${blog.cover_image_url})` }}
                  />
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-primary font-bold opacity-50">HamroLearning</span>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {blog.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-3">{blog.excerpt}</p>
                </CardContent>
                
                <CardFooter className="border-t pt-4 text-xs text-muted-foreground flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {blog.profiles?.full_name || 'Anonymous'}
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {blog.reading_time_minutes} min read
                   </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No published blogs found. Check back soon!
          </div>
        )}
      </div>
    </div>
  )
}
