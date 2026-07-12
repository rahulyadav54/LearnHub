'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleScholarshipBookmark(scholarshipId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check if exists
  const { data: existing } = await supabase
    .from('user_scholarship_bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('scholarship_id', scholarshipId)
    .single()

  if (existing) {
    // Delete
    await supabase.from('user_scholarship_bookmarks').delete().eq('id', existing.id)
  } else {
    // Insert
    await supabase.from('user_scholarship_bookmarks').insert({
      user_id: user.id,
      scholarship_id: scholarshipId
    })
  }

  revalidatePath('/scholarships')
  revalidatePath(`/scholarships/${scholarshipId}`)
  revalidatePath('/dashboard/bookmarks')
}

export async function checkScholarshipBookmark(scholarshipId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: existing } = await supabase
    .from('user_scholarship_bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('scholarship_id', scholarshipId)
    .single()

  return !!existing
}
