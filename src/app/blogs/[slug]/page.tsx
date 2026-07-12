/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { Clock, Calendar, User, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: blog } = await supabase
    .from('blogs')
    .select('title, seo_title, seo_description, excerpt, cover_image_url, created_at, slug, author')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!blog) return { title: 'Not Found' }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hamrolearning.com'

  return {
    title: blog.seo_title || `${blog.title} | HamroLearning Blog`,
    description: blog.seo_description || blog.excerpt,
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      url: `${baseUrl}/blogs/${blog.slug}`,
      type: 'article',
      publishedTime: blog.created_at,
      authors: [blog.author || 'HamroLearning Team'],
      images: blog.cover_image_url ? [blog.cover_image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      images: blog.cover_image_url ? [blog.cover_image_url] : [],
    }
  }
}

export default async function SingleBlogPage({
  params,
}: Props) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: blog } = await supabase
    .from('blogs')
    .select(`
      *,
      profiles (full_name, avatar_url, role)
    `)
    .eq('slug', resolvedParams.slug)
    .eq('published', true)
    .single()

  if (!blog) notFound()

  // Fetch comments
  const { data: comments } = await supabase
    .from('blog_comments')
    .select(`
      id, content, created_at,
      profiles (full_name, avatar_url)
    `)
    .eq('blog_id', blog.id)
    .order('created_at', { ascending: false })

  // Fetch related blogs
  const { data: related } = await supabase
    .from('blogs')
    .select('id, title, slug, cover_image_url, reading_time_minutes')
    .eq('published', true)
    .neq('id', blog.id)
    .limit(3)

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.cover_image_url ? [blog.cover_image_url] : [],
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: [{
      '@type': 'Person',
      name: blog.author || 'HamroLearning Team',
    }]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="w-full bg-muted border-b">
          <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="flex justify-center gap-2 flex-wrap mb-6">
              {blog.tags?.map((tag: string) => (
                <span key={tag} className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{blog.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{blog.excerpt}</p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-foreground">{blog.profiles?.full_name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {blog.reading_time_minutes} min read
              </div>
            </div>
          </div>
        </div>

        {blog.cover_image_url && (
          <div className="container mx-auto px-4 max-w-5xl -mt-8 relative h-[400px]">
             <Image 
                src={blog.cover_image_url}
                alt={blog.title}
                fill
                priority
                className="rounded-xl overflow-hidden shadow-2xl object-cover" 
             />
          </div>
        )}

        <div className="container mx-auto px-4 py-16 max-w-3xl">
          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <ReactMarkdown
              components={{
                img: ({...props}) => (
                  <span className="block relative w-full h-96 my-8">
                    <Image 
                      src={(props.src as string) || ''} 
                      alt={props.alt || ''}
                      fill
                      className="object-contain"
                    />
                  </span>
                )
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          <hr className="mb-16" />

          {/* Comments Section */}
          <section id="comments" className="mb-20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
               <MessageCircle className="w-6 h-6" /> Comments ({comments?.length || 0})
            </h3>
            
            <Card className="mb-8 bg-muted/20">
               <CardContent className="p-6 text-center text-muted-foreground">
                  Please log in to leave a comment.
               </CardContent>
            </Card>

            <div className="space-y-6">
              {comments && comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 overflow-hidden relative">
                     {comment.profiles?.avatar_url ? (
                       <Image src={comment.profiles.avatar_url} alt="" fill className="object-cover" />
                     ) : null}
                  </div>
                  <div className="flex-1 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold">{comment.profiles?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Posts */}
          {related && related.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {related.map(rel => (
                   <Link key={rel.id} href={`/blogs/${rel.slug}`} className="group block">
                     <Card className="h-full overflow-hidden hover:border-primary transition-colors">
                       {rel.cover_image_url && (
                          <div className="w-full h-32 relative">
                            <Image src={rel.cover_image_url} alt="" fill className="object-cover" />
                          </div>
                       )}
                       <CardContent className="p-4">
                          <h4 className="font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">{rel.title}</h4>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {rel.reading_time_minutes} min read
                          </div>
                       </CardContent>
                     </Card>
                   </Link>
                 ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  )
}
