'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Toggles completion status of a lesson for the authenticated user.
 */
export async function toggleLessonProgress(
  courseId: string,
  lessonId: string,
  completed: boolean
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to track progress.')
  }

  if (completed) {
    const { error } = await supabase
      .from('user_course_progress')
      .upsert(
        {
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString()
        },
        { onConflict: 'user_id,lesson_id' }
      )

    if (error) {
      console.error('Error saving progress:', error)
      throw new Error(error.message)
    }
  } else {
    const { error } = await supabase
      .from('user_course_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)

    if (error) {
      console.error('Error removing progress:', error)
      throw new Error(error.message)
    }
  }

  revalidatePath(`/courses/[slug]/lessons/[lessonId]`)
  revalidatePath(`/courses/[slug]`)
  return { success: true }
}

/**
 * Validates course completion and generates a unique digital certificate.
 */
export async function generateCertificate(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to claim a certificate.')
  }

  // 1. Get all course lessons
  const { data: lessons, error: lError } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)

  if (lError || !lessons || lessons.length === 0) {
    throw new Error('No lessons found for this course.')
  }

  // 2. Get user's completed lessons for this course
  const { data: progress, error: pError } = await supabase
    .from('user_course_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if (pError) {
    throw new Error('Failed to retrieve progress records.')
  }

  const completedSet = new Set((progress || []).map(p => p.lesson_id))
  const allCompleted = lessons.every(l => completedSet.has(l.id))

  if (!allCompleted) {
    throw new Error('You must complete all lessons before claiming a certificate.')
  }

  // 3. Generate a unique certificate code
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  const certificateCode = `CERT-${courseId.substring(0, 4).toUpperCase()}-${randomSuffix}`

  // 4. Insert certificate
  const { data: cert, error: cError } = await supabase
    .from('certificates')
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        certificate_code: certificateCode,
        issued_at: new Date().toISOString()
      },
      { onConflict: 'user_id,course_id' }
    )
    .select('*')
    .single()

  if (cError) {
    console.error('Error generating certificate:', cError)
    throw new Error(cError.message)
  }

  revalidatePath(`/courses/[slug]`)
  return cert
}
