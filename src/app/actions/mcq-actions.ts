'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function fetchQuestions(subjectId: string, difficulty: string, limit: number = 10) {
  const supabase = await createClient()
  
  let query = supabase.from('mcqs').select('*').eq('subject_id', subjectId)
  if (difficulty !== 'all') {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query
  if (error || !data) return []

  // Shuffle and pick limit
  const shuffled = data.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, limit)
}

export async function submitAttempt(
  subjectId: string, 
  timeTaken: number, 
  answers: { mcqId: string, selectedOption: string | null, isCorrect: boolean }[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const score = answers.filter(a => a.isCorrect).length
  const totalQuestions = answers.length

  const { data: attempt, error: attemptError } = await supabase
    .from('mcq_attempts')
    .insert({
      user_id: user.id,
      subject_id: subjectId,
      score,
      total_questions: totalQuestions,
      time_taken_seconds: timeTaken
    })
    .select()
    .single()

  if (attemptError || !attempt) throw attemptError

  const answersData = answers.map(a => ({
    attempt_id: attempt.id,
    mcq_id: a.mcqId,
    selected_option: a.selectedOption,
    is_correct: a.isCorrect
  }))

  const { error: answersError } = await supabase
    .from('mcq_answers')
    .insert(answersData)

  if (answersError) throw answersError

  revalidatePath('/practice')
  return attempt.id
}

export async function getAttemptResult(attemptId: string) {
  const supabase = await createClient()
  
  const { data: attempt, error: attemptErr } = await supabase
    .from('mcq_attempts')
    .select(`
      *,
      subjects (name)
    `)
    .eq('id', attemptId)
    .single()

  if (attemptErr || !attempt) return null

  const { data: answers } = await supabase
    .from('mcq_answers')
    .select(`
      *,
      mcqs (*)
    `)
    .eq('attempt_id', attemptId)

  return { attempt, answers: answers || [] }
}
