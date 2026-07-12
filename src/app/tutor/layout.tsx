import { ReactNode } from 'react'
import { getChatSessions } from '@/app/actions/chat-actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function TutorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?next=/tutor')
  }

  const sessions = await getChatSessions()

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/20 flex-col hidden md:flex">
        <div className="p-4 border-b">
          <Link href="/tutor" className="block w-full">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="w-4 h-4 mr-2" /> New Chat
            </Button>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map(session => (
            <Link 
              key={session.id} 
              href={`/tutor?session=${session.id}`}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate">{session.title}</span>
            </Link>
          ))}
          {sessions.length === 0 && (
            <div className="text-center text-sm text-muted-foreground p-4">
              No recent chats
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>
    </div>
  )
}
