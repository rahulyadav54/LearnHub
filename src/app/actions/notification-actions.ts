'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/dashboard/notifications')
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) throw error
  revalidatePath('/dashboard/notifications')
}

// Admin / System function to create a notification (mocking external API triggers)
export async function triggerSystemNotification(
  userId: string | null, 
  type: string, 
  title: string, 
  message: string, 
  link_url?: string
) {
  const supabase = await createClient()
  
  // 1. Insert into database for Realtime in-app delivery
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    message,
    link_url
  })

  // 2. Mock Email API Trigger
  console.log(`[EMAIL API MOCK] Sent email to user ${userId || 'ALL'} for ${title}`)

  // 3. Mock Push Notification Trigger
  console.log(`[PUSH API MOCK] Sent push payload to user ${userId || 'ALL'} for ${title}`)
}
