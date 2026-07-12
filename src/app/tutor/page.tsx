/* eslint-disable @typescript-eslint/no-explicit-any */
import { getChatMessages } from '@/app/actions/chat-actions'
import { ChatInterface } from '@/components/tutor/chat-interface'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Tutor - Personalized Learning Assistant | HamroLearning Nepal',
  description: 'Get instant academic help from our AI-powered tutor for SEE, +2, Bachelors, TU, KU, CTEVT, and Loksewa preparation. Bilingual support in English and Nepali. Available 24/7.',
  keywords: ['AI tutor Nepal', 'AI learning assistant', 'personalized learning Nepal', 'AI study helper', 'Nepali AI tutor', 'SEE AI tutor', '+2 AI tutor', 'Loksewa AI tutor', 'bilingual AI tutor', 'AI study Nepal', 'Gemini AI Nepal'],
  openGraph: {
    title: 'AI Tutor - Personalized Learning Assistant | HamroLearning Nepal',
    description: 'Get instant academic help from our AI-powered tutor. Bilingual support in English and Nepali for SEE, +2, Bachelors, TU, KU, CTEVT, and Loksewa.',
  },
  alternates: {
    canonical: '/tutor',
  },
}

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
