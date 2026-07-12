import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, BrainCircuit, Target, Clock, Activity } from 'lucide-react'

export default async function PracticeHub() {
  const supabase = await createClient()

  // Get subjects that have at least one MCQ
  // (In a real app, we'd use a view or count to filter, for now we fetch all subjects and left join mcqs to count)
  const { data: subjectsData } = await supabase
    .from('subjects')
    .select('id, name, description, mcqs(id)')
  
  const subjectsWithMcqs = (subjectsData || []).filter(s => s.mcqs && s.mcqs.length > 0).map(s => ({
    ...s,
    mcqCount: s.mcqs.length
  }))

  // Leaderboard (Top 5 users by total score)
  const { data: topAttempts } = await supabase
    .from('mcq_attempts')
    .select('user_id, score, profiles!inner(full_name)')
    .order('score', { ascending: false })
    .limit(5)

  // Aggregate leaderboard by user (simplified: just take top attempts)
  // Real world: group by user_id and sum score. For MVP, we show top attempts.
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Interactive Practice Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Test your knowledge with randomized quizzes, track your weak topics, and climb the global leaderboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            Available Subjects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectsWithMcqs.map((subject) => (
              <Card key={subject.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription>{subject.description || 'Practice MCQs for this subject'}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Target className="w-4 h-4" /> {subject.mcqCount} Questions
                  </div>
                  <Link href={`/practice/quiz/${subject.id}`}>
                    <Button>
                      Start Quiz
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}

            {subjectsWithMcqs.length === 0 && (
              <div className="col-span-full p-8 text-center border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">No MCQs available yet. Admin needs to add some!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>Top scoring attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAttempts && topAttempts.length > 0 ? (
                  topAttempts.map((attempt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-lg text-muted-foreground">#{i + 1}</div>
                        <div className="font-medium">
                          {/* @ts-expect-error profiles is an array in joined query */}
                          {attempt.profiles?.full_name || 'Anonymous User'}
                        </div>
                      </div>
                      <div className="font-bold text-primary">{attempt.score} pts</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No attempts yet. Be the first!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Activity className="w-5 h-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in and take quizzes to unlock your personalized weak-topics analysis and progress tracking graph.
              </p>
              <Link href="/dashboard" className="block w-full">
                <Button variant="outline" className="w-full">View Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
