import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, FileText, LayoutGrid, BookOpen, GraduationCap, ArrowRight, ShieldCheck, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: usersCount },
    { count: categoriesCount },
    { count: notesCount },
    { count: booksCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('content_items').select('*', { count: 'exact', head: true }).eq('content_type', 'note'),
    supabase.from('books').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { name: 'Total Users', value: usersCount || 0, icon: Users, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/10' },
    { name: 'Categories', value: categoriesCount || 0, icon: LayoutGrid, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/10' },
    { name: 'Total Notes', value: notesCount || 0, icon: FileText, color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/10' },
    { name: 'Books Available', value: booksCount || 0, icon: BookOpen, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/10' },
  ]

  const quickLinks = [
    { name: 'Manage Users', href: '/admin/users', icon: Users, desc: 'Elevate roles and configure access' },
    { name: 'Create Category', href: '/admin/categories', icon: LayoutGrid, desc: 'Add new educational categories' },
    { name: 'Upload Study Notes', href: '/admin/notes', icon: FileText, desc: 'Upload PDFs and reference sheets' },
    { name: 'Add Scholarships', href: '/admin/scholarships', icon: GraduationCap, desc: 'Publish active student grants' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Admin Header Hero */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-10 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Admin Panel
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Welcome to the Console
            </h1>
            <p className="text-slate-400 max-w-xl text-sm md:text-base">
              Monitor statistics, manage content categories, add educational items, and grant permission levels to teachers and students.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">System Status</p>
              <p className="text-sm font-bold text-emerald-400">Fully Operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name} className={`overflow-hidden border border-slate-200/80 dark:border-slate-800/80 rounded-2xl transition-all duration-350 hover:-translate-y-1 hover:shadow-xl ${stat.shadow}`}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.name}</p>
                  <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Access & Modules */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Quick Links Column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">Direct links to primary management pages.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.name} href={link.href} className="group block">
                  <div className="p-5 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-card hover:bg-muted/30 transition-all duration-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="font-bold text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
                        {link.name}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">{link.desc}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Info Column */}
        <Card className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Server & Environment parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Next.js Version</span>
              <span className="font-semibold font-mono">15.5.20</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-semibold font-mono">Turbopack</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Database Provider</span>
              <span className="font-semibold">Supabase</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Environment</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Production</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
