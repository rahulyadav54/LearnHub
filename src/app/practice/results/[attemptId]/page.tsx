/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAttemptResult } from '@/app/actions/mcq-actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Clock, XCircle, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react'

export default async function QuizResultsPage({
  params
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = await params
  const result = await getAttemptResult(attemptId)

  if (!result) {
    notFound()
  }

  const { attempt, answers } = result
  
  // Calculate analytics
  const percentage = Math.round((attempt.score / attempt.total_questions) * 100)
  
  // Basic weak topics logic: count wrong answers by difficulty
  // (In a highly advanced app, we'd use tags from the MCQs, here we use difficulty as a proxy for topic complexity)
  const weakDifficulties = ['easy', 'medium', 'hard'].filter(diff => {
    const wrongInDiff = answers.filter((a: any) => !a.is_correct && a.mcqs.difficulty === diff).length
    const totalInDiff = answers.filter((a: any) => a.mcqs.difficulty === diff).length
    // If they got more than 50% wrong in this difficulty, flag it
    if (totalInDiff === 0) return false
    return (wrongInDiff / totalInDiff) >= 0.5
  })

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="mb-8">
        <Link href="/practice">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Practice Hub
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Quiz Results</h1>
        <p className="text-muted-foreground">{attempt.subjects?.name} Practice</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Final Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-primary">{attempt.score}</span>
              <span className="text-xl text-muted-foreground">/ {attempt.total_questions}</span>
            </div>
            <p className="text-sm text-primary font-medium mt-2">
              {percentage}% Accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Clock className="w-4 h-4" /> Time Taken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {Math.floor(attempt.time_taken_seconds / 60)}m {attempt.time_taken_seconds % 60}s
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Avg {Math.round(attempt.time_taken_seconds / attempt.total_questions)}s per question
            </p>
          </CardContent>
        </Card>

        <Card className={weakDifficulties.length > 0 ? "border-orange-500/50 bg-orange-500/5" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Weak Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakDifficulties.length > 0 ? (
              <div>
                <p className="text-sm mb-2">You struggled with:</p>
                <div className="flex flex-wrap gap-2">
                  {weakDifficulties.map(d => (
                    <span key={d} className="px-2 py-1 bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded text-xs font-bold uppercase">
                      {d} Questions
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                <Trophy className="w-5 h-5" /> Excellent performance across the board!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Answer Review</h2>
      <div className="space-y-6">
        {answers.map((answer: any, index: number) => {
          const q = answer.mcqs
          const isCorrect = answer.is_correct
          
          return (
            <Card key={answer.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <CardDescription className="text-base text-foreground mt-2 font-medium">
                      {q.question}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="ml-10">
                <div className="space-y-3">
                  {['a', 'b', 'c', 'd'].map(opt => {
                    const isSelected = answer.selected_option === opt
                    const isActualCorrect = q.correct_option === opt
                    
                    let bgClass = "bg-muted/30"
                    let borderClass = "border-transparent"
                    
                    if (isActualCorrect) {
                      bgClass = "bg-green-500/10"
                      borderClass = "border-green-500/50"
                    } else if (isSelected && !isCorrect) {
                      bgClass = "bg-red-500/10"
                      borderClass = "border-red-500/50"
                    }

                    return (
                      <div key={opt} className={`p-3 rounded-md border ${bgClass} ${borderClass} flex items-center justify-between`}>
                        <div>
                          <span className="font-bold uppercase mr-3 opacity-50">{opt}.</span>
                          {q[`option_${opt}`]}
                        </div>
                        {isActualCorrect && <span className="text-xs font-bold text-green-600 dark:text-green-400">CORRECT ANSWER</span>}
                        {isSelected && !isCorrect && <span className="text-xs font-bold text-red-600 dark:text-red-400">YOUR ANSWER</span>}
                      </div>
                    )
                  })}
                </div>

                {q.explanation && (
                  <div className="mt-4 p-4 rounded-md bg-primary/5 text-sm">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
