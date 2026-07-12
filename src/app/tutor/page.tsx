/* eslint-disable @typescript-eslint/no-explicit-any */
import { getChatMessages } from '@/app/actions/chat-actions'
import { ChatInterface } from '@/components/tutor/chat-interface'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function TutorPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const resolvedParams = await searchParams
  const sessionId = resolvedParams.session
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/tutor')

  let initialMessages: any[] = []
  if (sessionId) {
    initialMessages = await getChatMessages(sessionId)
  }

  return <ChatInterface initialSessionId={sessionId} initialMessages={initialMessages} />
}
