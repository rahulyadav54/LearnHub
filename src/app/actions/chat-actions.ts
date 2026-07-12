'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createChatSession(title: string = 'New Conversation') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('ai_chat_sessions')
    .insert({ user_id: user.id, title })
    .select()
    .single()

  if (error) throw error
  revalidatePath('/tutor')
  return data
}

export async function getChatSessions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('ai_chat_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getChatMessages(sessionId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('ai_chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  return data || []
}
