/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, User, ArrowRight, Tag } from 'lucide-react'
import { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest educational articles, study tips, career guidance, and news from HamroLearning.',
}

export default async function BlogArchivePage() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from('blogs')
    .select(`id, title, slug, excerpt, cover_image_url, reading_time_minutes, created_at, tags, profiles (full_name, avatar_url)`)
    .eq('published', true)
    .order('created_at', { ascending: false })

  const featured = blogs?.[0]
  const rest = blogs?.slice(1) || []

  return (
    <div className="section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Knowledge Hub</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">HamroLearning Blog</h1>
          <p className="text-muted-foreground text-lg">
            Insights, study tips, career guidance, and educational news — curated for Nepali students.
          </p>
        </div>

        {blogs && blogs.length > 0 ? (
          <div className="space-y-14">
            {/* Featured Post */}
            {featured && (
              <Link href={`/blogs/${featured.slug}`} className="block group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8 rounded-3xl border border-border bg-card card-hover overflow-hidden">
                  {/* Image */}
                  <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden bg-muted">
                    {featured.cover_image_url ? (
                      <Image
                        src={featured.cover_image_url}
                        alt={featured.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-violet-500/20 flex items-center justify-center">
                        <span className="text-4xl font-extrabold text-primary/30">HL</span>
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex flex-col justify-center gap-4">
                    <Badge className="w-fit bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      Featured
                    </Badge>
                    <div className="flex gap-2 flex-wrap">
                      {(featured as any).tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-xs font-bold uppercase tracking-wider bg-muted px-2 py-1 rounded-full text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold leading-snug group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {(featured as any).profiles?.full_name || 'HamroLearning'}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {featured.reading_time_minutes} min read</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                      Read article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining Posts Grid */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-6">More Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((blog: any) => (
                    <Link key={blog.id} href={`/blogs/${blog.slug}`} className="block group">
                      <div className="h-full flex flex-col rounded-2xl border border-border bg-card card-hover overflow-hidden">
                        {/* Thumbnail */}
                        <div className="relative h-44 overflow-hidden bg-muted shrink-0">
                          {blog.cover_image_url ? (
                            <Image
                              src={blog.cover_image_url}
                              alt={blog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center">
                              <span className="text-2xl font-extrabold text-primary/30">HL</span>
                            </div>
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex flex-col flex-1 p-5 gap-3">
                          <div className="flex gap-1.5 flex-wrap">
                            {blog.tags?.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                <Tag className="w-2.5 h-2.5" /> {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{blog.excerpt}</p>
                          <div className="flex items-center gap-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.profiles?.full_name || 'HamroLearning'}</span>
                            <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" /> {blog.reading_time_minutes} min</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Articles Yet</h3>
            <p className="text-muted-foreground">Check back soon — our team is writing amazing content for you.</p>
          </div>
        )}
      </div>
    </div>
  )
}
