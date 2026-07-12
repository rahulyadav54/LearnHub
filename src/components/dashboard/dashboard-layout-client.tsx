"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Bookmark, Download, History,
  Brain, Trophy, Bell, Settings, Flame, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import { logout } from '@/app/actions/auth'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark },
  { label: 'Downloads', href: '/dashboard/downloads', icon: Download },
  { label: 'Assessments', href: '/dashboard/assessments', icon: History },
  { label: 'AI History', href: '/dashboard/ai', icon: Brain },
  { label: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const mobileNavItems = navItems.slice(0, 5)

interface Props {
  user: User
  profile: { full_name: string | null; avatar_url: string | null; current_streak: number | null } | null
  children: React.ReactNode
}

export function DashboardLayoutClient({ user, profile, children }: Props) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/20 hidden md:flex flex-col shrink-0">
        {/* User Profile Card */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md shadow-primary/30">
              {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {profile?.full_name || 'Student'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          {/* Streak Badge */}
          {(profile?.current_streak ?? 0) > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-orange-500">
              <Flame className="w-4 h-4" />
              <span>{profile?.current_streak} day streak</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </Link>
            )
          })}
          
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 cursor-pointer mt-4"
          >
            <LogOut className="w-4 h-4 shrink-0 text-red-500" />
            Log Out
          </button>
        </nav>

        {/* Bottom CTA */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-foreground mb-1">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground mb-3">Unlock AI Flashcards & offline downloads.</p>
            <Link href="/signup">
              <button className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Coming Soon
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto min-w-0">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border z-50 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
