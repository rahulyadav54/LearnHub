'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBlogComment(blogId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('blog_comments')
    .insert({
      blog_id: blogId,
      user_id: user.id,
      content
    })
    
  if (error) throw error
  revalidatePath(`/blogs/[slug]`, 'page')
}

export async function deleteBlogComment(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('blog_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id) // Ensure they own it

  if (error) throw error
  revalidatePath(`/blogs/[slug]`, 'page')
}

export async function saveBlogDraft(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const seo_title = formData.get('seo_title') as string
  const seo_description = formData.get('seo_description') as string
  const reading_time_minutes = parseInt(formData.get('reading_time_minutes') as string || '5')
  
  // Tags arrive as a comma separated string
  const tagsString = formData.get('tags') as string
  const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : []
  
  const published = formData.get('published') === 'true'

  const updates = {
    title,
    slug,
    excerpt,
    content,
    seo_title,
    seo_description,
    reading_time_minutes,
    tags,
    published
  }

  const { error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')
  revalidatePath(`/blogs/${slug}`)
}
