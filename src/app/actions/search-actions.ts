'use server'

import { createClient } from '@/utils/supabase/server'

export type SearchResult = {
  id: string
  title: string
  subtitle?: string
  type: 'Note' | 'Question Paper' | 'Subject' | 'University' | 'Blog' | 'Scholarship'
  href: string
}

export async function globalSearch(query: string, limit = 5): Promise<SearchResult[]> {
  if (!query || query.trim() === '') return []
  const supabase = await createClient()
  const q = `%${query}%`

  // Fetch all entity types concurrently
  const [contentRes, subjectsRes, uniRes, blogRes, scholarRes] = await Promise.all([
    supabase.from('content_items').select('id, title, content_type, slug').ilike('title', q).limit(limit),
    supabase.from('subjects').select('id, name, slug').ilike('name', q).limit(limit),
    supabase.from('universities').select('id, name, short_name').or(`name.ilike.${q},short_name.ilike.${q}`).limit(limit),
    supabase.from('blogs').select('id, title, slug').eq('published', true).ilike('title', q).limit(limit),
    supabase.from('scholarships').select('id, title, provider').or(`title.ilike.${q},provider.ilike.${q}`).limit(limit),
  ])

  const results: SearchResult[] = []

  if (contentRes.data) {
    contentRes.data.forEach(item => {
      const typeStr = item.content_type === 'note' ? 'Note' : 'Question Paper'
      results.push({
        id: item.id,
        title: item.title,
        type: typeStr,
        href: `/notes/${item.slug}`
      })
    })
  }

  if (subjectsRes.data) {
    subjectsRes.data.forEach(item => {
      results.push({
        id: item.id,
        title: item.name,
        type: 'Subject',
        href: `/explore/general/all/all/${item.slug}` // fallback routing
      })
    })
  }

  if (uniRes.data) {
    uniRes.data.forEach(item => {
      results.push({
        id: item.id,
        title: item.name,
        subtitle: item.short_name,
        type: 'University',
        href: `/explore` // Assuming we don't have deep uni pages yet, route to explore
      })
    })
  }

  if (blogRes.data) {
    blogRes.data.forEach(item => {
      results.push({
        id: item.id,
        title: item.title,
        type: 'Blog',
        href: `/blogs/${item.slug}`
      })
    })
  }

  if (scholarRes.data) {
    scholarRes.data.forEach(item => {
      results.push({
        id: item.id,
        title: item.title,
        subtitle: item.provider,
        type: 'Scholarship',
        href: `/scholarships/${item.id}`
      })
    })
  }

  // Sort by some arbitrary relevance or just return
  return results.slice(0, 15) // limit total results for quick dropdown
}

export async function logSearchQuery(query: string) {
  if (!query || query.trim() === '') return
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('search_history').insert({
    query_text: query.trim().toLowerCase(),
    user_id: user?.id || null
  })
}

export async function getRecentSearches() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Get distinct recent searches
  const { data } = await supabase
    .from('search_history')
    .select('query_text')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (!data) return []
  
  // Deduplicate manually since Supabase REST doesn't easily do SELECT DISTINCT on arbitrary columns natively without RPC
  const unique = Array.from(new Set(data.map(d => d.query_text)))
  return unique.slice(0, 5)
}

export async function getPopularSearches() {
  // We'll mock this for now to avoid writing complex RPC aggregation, 
  // or return a hardcoded list of trending subjects for the MVP.
  return ['IOE Entrance', 'CEE Preparation', 'Physics Notes', 'Engineering Mathematics']
}
