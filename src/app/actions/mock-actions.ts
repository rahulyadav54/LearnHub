'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function submitMockAttempt(
  mockTestId: string, 
  timeTaken: number, 
  answers: { mockTestQuestionId: string, mcqId: string, selectedOption: string | null, isCorrect: boolean }[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Fetch the mock test details for positive/negative marks
  const { data: mockTest, error: mockError } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('id', mockTestId)
    .single()

  if (mockError || !mockTest) throw new Error("Mock test not found")

  const posMarks = Number(mockTest.positive_marks)
  const negMarks = Number(mockTest.negative_marks)

  // Calculate final score natively on the server
  let finalScore = 0
  const answersData = answers.map(a => {
    let marksAwarded = 0
    if (a.selectedOption) {
      if (a.isCorrect) {
        marksAwarded = posMarks
        finalScore += posMarks
      } else {
        marksAwarded = -negMarks
        finalScore -= negMarks
      }
    }
    
    return {
      attempt_id: '', // Will be set after attempt insertion
      mock_test_question_id: a.mockTestQuestionId,
      selected_option: a.selectedOption,
      is_correct: a.isCorrect,
      marks_awarded: marksAwarded
    }
  })

  // Insert Attempt
  const { data: attempt, error: attemptError } = await supabase
    .from('mock_test_attempts')
    .insert({
      user_id: user.id,
      mock_test_id: mockTestId,
      score: finalScore,
      time_taken_seconds: timeTaken
    })
    .select()
    .single()

  if (attemptError || !attempt) throw attemptError

  // Update answers with attempt ID
  const finalAnswersData = answersData.map(a => ({
    ...a,
    attempt_id: attempt.id
  }))

  const { error: answersError } = await supabase
    .from('mock_test_answers')
    .insert(finalAnswersData)

  if (answersError) throw answersError

  revalidatePath(`/mock-tests`)
  revalidatePath(`/mock-tests/${mockTestId}`)
  
  return attempt.id
}

export async function getMockAttemptResult(attemptId: string) {
  const supabase = await createClient()
  
  const { data: attempt, error: attemptErr } = await supabase
    .from('mock_test_attempts')
    .select(`
      *,
      mock_tests (title, duration_minutes, positive_marks, negative_marks)
    `)
    .eq('id', attemptId)
    .single()

  if (attemptErr || !attempt) return null

  const { data: answers } = await supabase
    .from('mock_test_answers')
    .select(`
      *,
      mock_test_questions (
        mcqs (*)
      )
    `)
    .eq('attempt_id', attemptId)

  // Calculate Rank (Very basic query for MVP: count attempts with higher score)
  const { count } = await supabase
    .from('mock_test_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('mock_test_id', attempt.mock_test_id)
    .gt('score', attempt.score)
    
  const rank = (count || 0) + 1

  return { attempt, answers: answers || [], rank }
}

export async function getAiMockAnalysis(attemptId: string) {
  const supabase = await createClient()
  
  // Fetch detailed answers to send to Gemini
  const { data: answers } = await supabase
    .from('mock_test_answers')
    .select(`
      is_correct,
      selected_option,
      mock_test_questions (
        mcqs (question, correct_option, explanation)
      )
    `)
    .eq('attempt_id', attemptId)
    
  if (!answers || answers.length === 0) return "No data to analyze."

  // Filter wrong or skipped answers
  const mistakes = answers.filter(a => !a.is_correct || !a.selected_option).map(a => {
    // @ts-expect-error joined
    const q = a.mock_test_questions?.mcqs
    return `Question: ${q?.question}\nUser Answer: ${a.selected_option || 'Skipped'}\nCorrect: ${q?.correct_option}\n`
  })

  if (mistakes.length === 0) {
    return "Amazing job! You didn't make any mistakes in this mock test. Keep up the perfect work!"
  }

  const prompt = `You are an expert tutor analyzing a student's mock test performance. 
Here are the questions they got wrong or skipped:
${mistakes.slice(0, 10).join('\n')}
(Note: Showing up to 10 mistakes for brevity).

Please provide a short, encouraging 2-3 paragraph analysis of their weak points and give actionable advice on what topics they need to revise.`

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-pro'),
      prompt,
    })
    return text
  } catch (error) {
    console.error("AI Analysis failed:", error)
    return "The AI Study Assistant is currently overwhelmed. Please try analyzing your results later!"
  }
}
