/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { History, FileText, Target, Activity } from 'lucide-react'

export default async function AssessmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch MCQ attempts
  const { data: mcqAttempts } = await supabase
    .from('mcq_attempts')
    .select(`
      id, score, total_questions, created_at,
      subjects (name)
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch Mock attempts
  const { data: mockAttempts } = await supabase
    .from('mock_test_attempts')
    .select(`
      id, score, created_at,
      mock_tests (title, positive_marks)
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <History className="w-8 h-8 text-primary" /> Assessment History
        </h1>
        <p className="text-muted-foreground mt-2">Track your scores across Practice Quizzes and Mock Tests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-blue-500" /> Practice Quizzes</CardTitle>
            <CardDescription>Recent MCQ Practice attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {mcqAttempts && mcqAttempts.length > 0 ? (
              <div className="space-y-4">
                {mcqAttempts.map((attempt: any) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-bold">{attempt.subjects?.name}</div>
                      <div className="text-sm text-muted-foreground">{new Date(attempt.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-primary">{attempt.score} / {attempt.total_questions}</div>
                      <Link href={`/practice/results/${attempt.id}`}>
                         <Button variant="outline" size="sm">Details</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-muted-foreground text-center py-4">No practice attempts yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-orange-500" /> Mock Tests</CardTitle>
            <CardDescription>Recent full-length Mock Exams</CardDescription>
          </CardHeader>
          <CardContent>
             {mockAttempts && mockAttempts.length > 0 ? (
              <div className="space-y-4">
                {mockAttempts.map((attempt: any) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-bold">{attempt.mock_tests?.title}</div>
                      <div className="text-sm text-muted-foreground">{new Date(attempt.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-primary">Score: {attempt.score}</div>
                      <Link href={`/mock-tests/results/${attempt.id}`}>
                         <Button variant="outline" size="sm">Details</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-muted-foreground text-center py-4">No mock test attempts yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
