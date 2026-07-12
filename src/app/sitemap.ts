import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnhub.com.np'

  // 1. Static Routes
  const routes = [
    '',
    '/explore',
    '/practice',
    '/mock-tests',
    '/blogs',
    '/scholarships',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/login',
    '/signup'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: ['', '/about', '/contact', '/explore', '/mock-tests', '/practice', '/blogs', '/scholarships', '/login', '/signup', '/privacy-policy', '/terms-of-service'][['', '/about', '/contact', '/explore', '/mock-tests', '/practice', '/blogs', '/scholarships', '/login', '/signup', '/privacy-policy', '/terms-of-service'].indexOf(route)] === '' ? 1 : 0.8,
  }))

  if (!supabaseUrl || !supabaseKey) {
    return routes
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

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
    .from('content_items')
    .select('slug, updated_at')
    .eq('content_type', 'note')

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
