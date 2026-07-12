/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ExamClient } from '@/components/mock-tests/exam-client'

export default async function MockTestEnginePage({
  params
}: {
  params: Promise<{ testId: string }>
}) {
  const { testId } = await params
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p>Please log in to take this mock test.</p>
      </div>
    )
  }

  // Fetch test
  const { data: test, error: testErr } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('id', testId)
    .single()

  if (testErr || !test) notFound()

  // Fetch questions
  const { data: questionLinks } = await supabase
    .from('mock_test_questions')
    .select(`
      id,
      order_index,
      mcqs (
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d
      )
    `)
    .eq('mock_test_id', testId)
    .order('order_index', { ascending: true })

  if (!questionLinks || questionLinks.length === 0) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">No Questions</h1>
        <p>This test has no questions assigned yet.</p>
      </div>
    )
  }

  const formattedQuestions = questionLinks.map((link: any) => ({
    mockTestQuestionId: link.id,
    mcqId: link.mcqs.id,
    question: link.mcqs.question,
    option_a: link.mcqs.option_a,
    option_b: link.mcqs.option_b,
    option_c: link.mcqs.option_c,
    option_d: link.mcqs.option_d,
  }))

  return (
    <div className="bg-muted/10 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <ExamClient 
          testId={testId}
          testTitle={test.title}
          durationMinutes={test.duration_minutes}
          questions={formattedQuestions}
        />
      </div>
    </div>
  )
}
