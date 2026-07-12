/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronRight, Clock, Eye, Download, FileText, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InteractionButtons } from '@/components/notes/interaction-buttons'
import { CommentsSection } from '@/components/notes/comments-section'
import { PDFViewerWrapper } from '@/components/notes/pdf-viewer-wrapper'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data } = await supabase.from('content_items').select('title, description, created_at, slug, author').eq('slug', resolvedParams.slug).single()
  
  if (!data) return { title: 'Note Not Found' }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnhub.com.np'

  return {
    title: `${data.title} | HamroLearning Notes`,
    description: data.description || `Study material for ${data.title}`,
    openGraph: {
      title: data.title,
      description: data.description || `Study material for ${data.title}`,
      url: `${baseUrl}/notes/${data.slug}`,
      type: 'article',
      publishedTime: data.created_at,
      authors: [data.author || 'HamroLearning'],
    },
    twitter: {
      card: 'summary',
      title: data.title,
      description: data.description || `Study material for ${data.title}`,
    }
  }
}

export default async function NoteReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: note } = await supabase
    .from('content_items')
    .select('*, subjects(name, category_id), profiles(full_name)')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!note) return notFound()

  // Track view (in background)
  await supabase.rpc('increment_view', { item_id: note.id })

  // Get user info for interactions
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  // Check initial interaction states if logged in
  let isLiked = false
  let isBookmarked = false
  let initialPage = 1
  if (userId) {
    const [likeRes, bookmarkRes, historyRes] = await Promise.all([
      supabase.from('user_likes').select('user_id').eq('content_item_id', note.id).eq('user_id', userId).single(),
      supabase.from('user_bookmarks').select('user_id').eq('content_item_id', note.id).eq('user_id', userId).single(),
      supabase.from('reading_history').select('current_page').eq('content_item_id', note.id).eq('user_id', userId).single()
    ])
    isLiked = !!likeRes.data
    isBookmarked = !!bookmarkRes.data
    if (historyRes.data?.current_page) {
      initialPage = historyRes.data.current_page
    }
  }

  // Fetch related notes from same subject
  const { data: relatedNotes } = await supabase
    .from('content_items')
    .select('title, slug')
    .eq('subject_id', note.subject_id)
    .neq('id', note.id)
    .limit(3)

  // JSON-LD Schema
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnhub.com.np'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.title,
    description: note.description || 'Study material',
    datePublished: note.created_at,
    dateModified: note.updated_at || note.created_at,
    author: [{
      '@type': 'Person',
      name: (note.profiles as any)?.full_name || 'Anonymous Author',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'HamroLearning Nepal',
      logo: {
        '@type': 'ImageObject',
        url: 'https://learnhub.com.np/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/notes/${note.slug}`,
    },
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/explore" className="hover:text-primary">Explore</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{note.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">{note.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{(note.profiles as any)?.full_name || 'Anonymous Author'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{note.reading_time_minutes || 5} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{(note.views_count || 0) + 1} views</span>
              </div>
            </div>

            {note.file_url && (
              <div className="mb-12">
                <h3 className="font-semibold text-xl mb-4 flex items-center gap-2"><FileText className="text-primary w-6 h-6"/> Embedded PDF Viewer</h3>
                <PDFViewerWrapper url={note.file_url} noteId={note.id} initialPage={initialPage} />
              </div>
            )}

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.content_md || "No rich text content provided for this note."}
              </ReactMarkdown>
            </div>

            <InteractionButtons 
              noteId={note.id} 
              initialLikes={note.likes_count || 0}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              userId={userId}
            />

            <CommentsSection noteId={note.id} userId={userId} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-muted/30 p-6 rounded-xl border">
              <h3 className="font-semibold text-lg mb-4">About this Note</h3>
              <p className="text-sm text-muted-foreground mb-4">{note.description || 'No description provided.'}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="font-medium text-right">{(note.subjects as any)?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{new Date(note.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-medium">{note.downloads_count || 0}</span>
                </div>
              </div>
            </div>

            {relatedNotes && relatedNotes.length > 0 && (
              <div className="bg-muted/30 p-6 rounded-xl border">
                <h3 className="font-semibold text-lg mb-4">Related Notes</h3>
                <div className="space-y-4">
                  {relatedNotes.map((rel: any) => (
                    <Link key={rel.slug} href={`/notes/${rel.slug}`} className="block group">
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors">{rel.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Read now →</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
