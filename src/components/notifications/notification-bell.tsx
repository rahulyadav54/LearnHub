'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { markNotificationAsRead } from '@/app/actions/notification-actions'

export function NotificationBell({ userId }: { userId: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    // 1. Fetch initial unread notifications
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.is_read).length)
      }
    }
    fetchNotifications()

    // 2. Subscribe to realtime inserts
    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          // Filter doesn't fully support OR yet in Realtime v1 strictly on client side like this, 
          // so we receive all and filter locally for safety/accuracy in this simplified mockup.
        },
        (payload) => {
          const newNotif = payload.new
          if (newNotif.user_id === userId || newNotif.user_id === null) {
            setNotifications(prev => [newNotif, ...prev].slice(0, 5))
            setUnreadCount(prev => prev + 1)
            
            // Mock OS Push Notification API (HTML5 Notification)
            if (Notification.permission === "granted") {
              new Notification(newNotif.title, { body: newNotif.message })
            }
          }
        }
      )
      .subscribe()

    // Request HTML5 Notification permission for the mock push
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission()
    }

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const handleRead = async (id: string, link: string | null) => {
    // Optimistic
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    await markNotificationAsRead(id)
    
    if (link) {
      window.location.href = link
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notif) => (
              <DropdownMenuItem 
                key={notif.id} 
                className={`flex flex-col items-start p-3 cursor-pointer ${!notif.is_read ? 'bg-muted/30 font-medium' : 'text-muted-foreground'}`}
                onClick={() => handleRead(notif.id, notif.link_url)}
              >
                <div className="flex justify-between w-full mb-1">
                  <span className="text-sm font-bold">{notif.title}</span>
                  {!notif.is_read && <span className="w-2 h-2 bg-primary rounded-full mt-1.5" />}
                </div>
                <p className="text-xs line-clamp-2 w-[90%]">{notif.message}</p>
                <span className="text-[10px] opacity-50 mt-2">{new Date(notif.created_at).toLocaleDateString()}</span>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            You&apos;re all caught up!
          </div>
        )}
        
        <DropdownMenuSeparator />
        <Link href="/dashboard/notifications" className="w-full block">
          <DropdownMenuItem className="cursor-pointer justify-center text-primary font-medium w-full">
            View All Notifications
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
