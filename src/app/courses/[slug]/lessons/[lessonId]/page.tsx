import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { LessonPlayerClient } from './lesson-player-client'

interface Props {
  params: Promise<{ slug: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params
  const supabase = await createClient()

  // 1. Fetch course details
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!course) {
    notFound()
  }

  // 2. Fetch all lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })

  if (!lessons || lessons.length === 0) {
    notFound()
  }

  // 3. Find current lesson
  const currentLesson = lessons.find(l => l.id === lessonId)
  if (!currentLesson) {
    notFound()
  }

  // 4. Fetch user details & progress
  const { data: { user } } = await supabase.auth.getUser()
  let completedLessonIds: string[] = []

  if (user) {
    const { data: progress } = await supabase
      .from('user_course_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)

    if (progress) {
      completedLessonIds = progress.map(p => p.lesson_id)
    }
  }

  return (
    <LessonPlayerClient
      course={course}
      lessons={lessons}
      currentLesson={currentLesson}
      initialCompletedIds={completedLessonIds}
      userId={user?.id || null}
    />
  )
}
