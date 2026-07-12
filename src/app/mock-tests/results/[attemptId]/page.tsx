/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMockAttemptResult } from '@/app/actions/mock-actions'
import { notFound } from 'next/navigation'
import { ResultsClient } from '@/components/mock-tests/results-client'

export default async function MockTestResultsPage({
  params
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = await params
  const result = await getMockAttemptResult(attemptId)

  if (!result) {
    notFound()
  }

  const { attempt, answers, rank } = result

  const correctAnswers = answers.filter((a: any) => a.is_correct).length
  const wrongAnswers = answers.filter((a: any) => a.selected_option && !a.is_correct).length
  const skippedAnswers = answers.filter((a: any) => !a.selected_option).length

  // Construct chart data based on subject or topic if possible. Since we only have difficulty in mcqs, let's group by difficulty.
  // We need to pass serializable data to the client component.
  const chartData = [
    { name: 'Correct', value: correctAnswers, fill: 'var(--color-correct)' },
    { name: 'Incorrect', value: wrongAnswers, fill: 'var(--color-incorrect)' },
    { name: 'Skipped', value: skippedAnswers, fill: 'var(--color-skipped)' }
  ]

  // Formatted answers for review
  const formattedAnswers = answers.map((a: any) => ({
    id: a.id,
    isCorrect: a.is_correct,
    selectedOption: a.selected_option,
    marksAwarded: Number(a.marks_awarded),
    question: a.mock_test_questions.mcqs.question,
    correctOption: a.mock_test_questions.mcqs.correct_option,
    explanation: a.mock_test_questions.mcqs.explanation,
    options: {
      a: a.mock_test_questions.mcqs.option_a,
      b: a.mock_test_questions.mcqs.option_b,
      c: a.mock_test_questions.mcqs.option_c,
      d: a.mock_test_questions.mcqs.option_d,
    }
  }))

  return (
    <div className="bg-muted/5 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <ResultsClient 
          attemptId={attempt.id}
          testTitle={attempt.mock_tests?.title || 'Mock Test'}
          score={Number(attempt.score)}
          timeTaken={attempt.time_taken_seconds}
          rank={rank}
          totalQuestions={formattedAnswers.length}
          correctCount={correctAnswers}
          wrongCount={wrongAnswers}
          skippedCount={skippedAnswers}
          chartData={chartData}
          answers={formattedAnswers}
          positiveMarks={Number(attempt.mock_tests?.positive_marks || 1)}
          negativeMarks={Number(attempt.mock_tests?.negative_marks || 0)}
        />
      </div>
    </div>
  )
}
