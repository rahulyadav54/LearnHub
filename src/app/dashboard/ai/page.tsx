/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, MessageSquare } from 'lucide-react'

export default async function AIHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sessions } = await supabase
    .from('ai_chat_sessions')
    .select(`
      *,
      ai_chat_messages (count)
    `)
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="w-8 h-8 text-purple-500" /> AI Tutor History
        </h1>
        <p className="text-muted-foreground mt-2">Resume past conversations with your personal AI tutor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions && sessions.length > 0 ? (
          sessions.map((session: any) => (
            <Card key={session.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg truncate">{session.title}</CardTitle>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> {session.ai_chat_messages[0]?.count || 0} messages
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="text-xs text-muted-foreground mb-4">
                  Last updated: {new Date(session.updated_at).toLocaleDateString()}
                </div>
                <Link href={`/tutor`}>
                  <Button variant="outline" className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Open Tutor Hub
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-12 text-center border rounded-lg bg-muted/20">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold">No AI Sessions</h3>
            <p className="text-muted-foreground mb-4">You haven&apos;t talked to the AI Tutor yet.</p>
            <Link href="/tutor">
              <Button>Start Chatting</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
