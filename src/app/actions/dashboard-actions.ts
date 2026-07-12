'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateDailyStreak() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_streak, longest_streak, last_active_date')
    .eq('id', user.id)
    .single()

  if (!profile) return

  const today = new Date().toISOString().split('T')[0]
  const lastActive = profile.last_active_date

  let newStreak = profile.current_streak
  let newLongest = profile.longest_streak

  if (!lastActive) {
    // First time
    newStreak = 1
    newLongest = 1
  } else if (lastActive === today) {
    // Already active today
    return
  } else {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastActive === yesterdayStr) {
      newStreak += 1
      if (newStreak > newLongest) newLongest = newStreak
    } else {
      newStreak = 1
    }
  }

  await supabase
    .from('profiles')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_date: today
    })
    .eq('id', user.id)
}

export async function trackDownload(contentItemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('user_downloads')
    .insert({
      user_id: user.id,
      content_item_id: contentItemId
    })
    
  revalidatePath('/dashboard/downloads')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const full_name = formData.get('full_name') as string
  const avatar_url = formData.get('avatar_url') as string

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, avatar_url })
    .eq('id', user.id)

  if (error) throw error
  revalidatePath('/dashboard/settings')
}
