'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper function to check if the current user is an admin
async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const role = user.user_metadata?.role
  if (role !== 'admin') {
    throw new Error("Forbidden: Admin access required")
  }
  return supabase
}

// ==========================================
// 1. Users / Profiles Management
// ==========================================
export async function updateUserRole(userId: string, role: 'student' | 'teacher' | 'admin') {
  const supabase = await verifyAdmin()
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    
  if (error) throw error
  revalidatePath('/admin/users')
}

// ==========================================
// 2. Categories Management
// ==========================================
export async function saveCategory(id: string | null, data: { name: string; slug: string; description: string; icon_name: string }) {
  const supabase = await verifyAdmin()
  
  if (id) {
    const { error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('categories')
      .insert(data)
    if (error) throw error
  }

  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await verifyAdmin()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    
  if (error) throw error
  revalidatePath('/admin/categories')
}

// ==========================================
// 3. Subjects Management
// ==========================================
export async function saveSubject(id: string | null, data: {
  category_id: string
  name: string
  slug: string
  program_id?: string | null
  semester_id?: string | null
  syllabus_content?: string | null
}) {
  const supabase = await verifyAdmin()
  
  if (id) {
    const { error } = await supabase
      .from('subjects')
      .update(data)
      .eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('subjects')
      .insert(data)
    if (error) throw error
  }

  revalidatePath('/admin/subjects')
}

export async function deleteSubject(id: string) {
  const supabase = await verifyAdmin()
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
    
  if (error) throw error
  revalidatePath('/admin/subjects')
}

// ==========================================
// 4. Universities Management
// ==========================================
export async function saveUniversity(id: string | null, data: {
  name: string
  short_name?: string | null
  logo_url?: string | null
  website_url?: string | null
}) {
  const supabase = await verifyAdmin()
  
  if (id) {
    const { error } = await supabase
      .from('universities')
      .update(data)
      .eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('universities')
      .insert(data)
    if (error) throw error
  }

  revalidatePath('/admin/universities')
}

export async function deleteUniversity(id: string) {
  const supabase = await verifyAdmin()
  const { error } = await supabase
    .from('universities')
    .delete()
    .eq('id', id)
    
  if (error) throw error
  revalidatePath('/admin/universities')
}

// ==========================================
// 5. Notes & Question Papers (Content Items)
// ==========================================
export async function saveContentItem(id: string | null, data: {
  title: string
  description?: string | null
  content_type: 'note' | 'question_paper'
  subject_id: string
  file_url?: string | null
}) {
  const supabase = await verifyAdmin()
  
  if (id) {
    const { error } = await supabase
      .from('content_items')
      .update(data)
      .eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('content_items')
      .insert(data)
    if (error) throw error
  }

  revalidatePath(`/admin/${data.content_type === 'note' ? 'notes' : 'question-papers'}`)
}

export async function deleteContentItem(id: string, contentType: 'note' | 'question_paper') {
  const supabase = await verifyAdmin()
  const { error } = await supabase
    .from('content_items')
    .delete()
    .eq('id', id)
    
  if (error) throw error
  revalidatePath(`/admin/${contentType === 'note' ? 'notes' : 'question-papers'}`)
}

// ==========================================
// 6. Books Management
// ==========================================
export async function saveBook(id: string | null, data: {
  title: string
  author: string
  description?: string | null
  cover_image_url?: string | null
  file_url?: string | null
  subject_id?: string | null
  published_year?: number | null
}) {
  const supabase = await verifyAdmin()
  
  if (id) {
    const { error } = await supabase
      .from('books')
      .update(data)
      .eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('books')
      .insert(data)
    if (error) throw error
  }

  revalidatePath('/admin/books')
}

export async function deleteBook(id: string) {
  const supabase = await verifyAdmin()
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
    
  if (error) throw error
  revalidatePath('/admin/books')
}

// ==========================================
// 7. Scholarships Management
// ==========================================
export async function saveScholarship(id: string | null, data: {
  title: string
  provider: string
  amount?: string | null
  deadline?: string | null
  description?: string | null
  link_url?: string | null
}) {
  const supabase = await verifyAdmin()
  
  if (id) {
    const { error } = await supabase
      .from('scholarships')
      .update(data)
      .eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('scholarships')
      .insert(data)
    if (error) throw error
  }

  revalidatePath('/admin/scholarships')
}

export async function deleteScholarship(id: string) {
  const supabase = await verifyAdmin()
  const { error } = await supabase
    .from('scholarships')
    .delete()
    .eq('id', id)
    
  if (error) throw error
  revalidatePath('/admin/scholarships')
}
