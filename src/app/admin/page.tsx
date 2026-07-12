import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, LayoutGrid, BookOpen } from 'lucide-react'

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
    { name: 'Total Users', value: usersCount || 0, icon: Users },
    { name: 'Categories', value: categoriesCount || 0, icon: LayoutGrid },
    { name: 'Total Notes', value: notesCount || 0, icon: FileText },
    { name: 'Books', value: booksCount || 0, icon: BookOpen },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to the HamroLearning Admin Panel.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
