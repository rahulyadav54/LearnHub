/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bell, Megaphone, BookOpen, FileText, Landmark, Bot, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Unauthorized</div>
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order('created_at', { ascending: false })

  const getIconForType = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT': return <Megaphone className="w-5 h-5 text-blue-500" />
      case 'NEW_NOTE': return <BookOpen className="w-5 h-5 text-green-500" />
      case 'NEW_PAPER': return <FileText className="w-5 h-5 text-orange-500" />
      case 'SCHOLARSHIP': return <Landmark className="w-5 h-5 text-purple-500" />
      case 'AI_MESSAGE': return <Bot className="w-5 h-5 text-primary" />
      case 'ADMIN': return <ShieldAlert className="w-5 h-5 text-destructive" />
      default: return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" /> Notifications
          </h1>
          <p className="text-muted-foreground mt-2">Stay updated on new study materials and announcements.</p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
            {unreadCount} Unread
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Your recent alerts and messages.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif: any) => (
                <div key={notif.id} className={`p-4 sm:p-6 flex gap-4 transition-colors ${!notif.is_read ? 'bg-muted/10' : 'hover:bg-muted/5'}`}>
                  <div className="mt-1 shrink-0">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className={`text-base sm:text-lg ${!notif.is_read ? 'font-bold' : 'font-medium'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-muted-foreground shrink-0 mt-1">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm ${!notif.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notif.message}
                    </p>
                    {notif.link_url && (
                      <Link href={notif.link_url} className="inline-block mt-3 text-sm font-bold text-primary hover:underline">
                        View Details →
                      </Link>
                    )}
                  </div>
                  {!notif.is_read && (
                    <div className="shrink-0 flex items-center">
                       <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                No notifications found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
