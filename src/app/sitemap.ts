import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use anon client for public API to avoid needing user context during build
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnhub.com.np'

  // 1. Static Routes
  const routes = [
    '',
    '/explore',
    '/practice',
    '/mock-tests',
    '/blogs',
    '/scholarships',
    '/login',
    '/signup'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Dynamic Blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at')
    .eq('status', 'PUBLISHED')

  const blogRoutes = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // 3. Dynamic Notes
  const { data: notes } = await supabase
    .from('notes')
    .select('slug, updated_at')

  const noteRoutes = (notes || []).map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: new Date(note.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // 4. Dynamic Scholarships
  const { data: scholarships } = await supabase
    .from('scholarships')
    .select('id, created_at')

  const scholarshipRoutes = (scholarships || []).map((sch) => ({
    url: `${baseUrl}/scholarships/${sch.id}`,
    lastModified: new Date(sch.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...blogRoutes, ...noteRoutes, ...scholarshipRoutes]
}
