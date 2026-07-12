import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Flame, BookOpen, Clock, Activity } from 'lucide-react'
import Link from 'next/link'
import { updateDailyStreak } from '@/app/actions/dashboard-actions'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Trigger streak update silently
    await updateDailyStreak()
  }

  // Fetch profile for streak
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Fetch Continue Reading
  const { data: lastRead } = await supabase
    .from('reading_history')
    .select(`
      *,
      content_items (title, slug)
    `)
    .eq('user_id', user?.id)
    .order('last_read_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch recent AI Sessions
  const { data: recentAi } = await supabase
    .from('ai_chat_sessions')
    .select('id, title, updated_at')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })
    .limit(3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-muted-foreground">Here is what&apos;s happening with your studies.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
              <Flame className="w-4 h-4" /> Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-orange-600 dark:text-orange-500">{profile?.current_streak || 0}</div>
            <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">Days in a row</p>
          </CardContent>
        </Card>

        {lastRead && (
          <Card className="md:col-span-2 lg:col-span-3 border-primary/20 flex flex-col justify-between hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Continue Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold truncate mb-2">{lastRead.content_items?.title}</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Page {lastRead.current_page} of {lastRead.total_pages}</span>
              </div>
              <Link href={`/notes/${lastRead.content_items?.slug}`}>
                <div className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                  Resume reading &rarr;
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent AI Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" /> Recent AI Tutor Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAi && recentAi.length > 0 ? (
              <div className="space-y-4">
                {recentAi.map(session => (
                  <Link key={session.id} href="/tutor" className="block p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <div className="font-medium text-sm truncate">{session.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(session.updated_at).toLocaleDateString()}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You haven&apos;t chatted with the AI Tutor recently.</p>
            )}
          </CardContent>
        </Card>

        {/* Explore Links or Other quick actions could go here */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Jump straight to practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Link href="/practice" className="block p-4 border rounded-lg hover:border-primary transition-colors">
               <div className="font-bold">MCQ Practice Hub</div>
               <div className="text-sm text-muted-foreground mt-1">Topic-wise quizzes to sharpen your skills.</div>
             </Link>
             <Link href="/mock-tests" className="block p-4 border rounded-lg hover:border-primary transition-colors">
               <div className="font-bold">Full Mock Tests</div>
               <div className="text-sm text-muted-foreground mt-1">Simulate real exams with negative marking.</div>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
