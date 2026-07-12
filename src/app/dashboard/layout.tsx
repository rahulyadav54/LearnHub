import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Bookmark, Download, History, Brain, Trophy, Bell, Settings } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: <Bookmark className="w-5 h-5" /> },
    { label: 'Downloads', href: '/dashboard/downloads', icon: <Download className="w-5 h-5" /> },
    { label: 'Assessments', href: '/dashboard/assessments', icon: <History className="w-5 h-5" /> },
    { label: 'AI History', href: '/dashboard/ai', icon: <Brain className="w-5 h-5" /> },
    { label: 'Achievements', href: '/dashboard/achievements', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell className="w-5 h-5" /> },
    { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-muted/20 hidden md:block">
        <div className="p-6">
          <h2 className="text-lg font-bold mb-6">Student Dashboard</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
