import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { QuizClient } from '@/components/practice/quiz-client'
import { fetchQuestions } from '@/app/actions/mcq-actions'

export default async function QuizPage({
  params,
  searchParams
}: {
  params: Promise<{ subjectId: string }>
  searchParams: Promise<{ difficulty?: string }>
}) {
  const { subjectId } = await params
  const { difficulty = 'all' } = await searchParams

  const supabase = await createClient()
  
  // Verify subject exists
  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .single()

  if (!subject) {
    notFound()
  }

  // Fetch Questions using our server action
  const questions = await fetchQuestions(subjectId, difficulty, 10)

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">No Questions Available</h1>
        <p className="text-muted-foreground">There are no MCQs for this subject/difficulty yet.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{subject.name} - Quiz</h1>
        <p className="text-muted-foreground mt-2">
          {difficulty === 'all' ? 'Mixed Difficulty' : `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty`} • {questions.length} Questions
        </p>
      </div>

      <QuizClient subjectId={subjectId} questions={questions} />
    </div>
  )
}
