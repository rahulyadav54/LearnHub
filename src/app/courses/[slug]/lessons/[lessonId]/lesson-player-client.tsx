'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toggleLessonProgress } from '@/app/actions/course-actions'
import { CheckCircle, PlayCircle, ArrowLeft, ArrowRight, BookOpen, CheckSquare, Square, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Lesson {
  id: string
  title: string
  video_url: string
  order_index: number
  description: string | null
  duration_minutes: number
}

interface Course {
  id: string
  title: string
  slug: string
  description: string | null
}

interface Props {
  course: Course
  lessons: Lesson[]
  currentLesson: Lesson
  initialCompletedIds: string[]
  userId: string | null
}

export function LessonPlayerClient({
  course,
  lessons,
  currentLesson,
  initialCompletedIds,
  userId
}: Props) {
  const router = useRouter()
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedIds)
  const [isLoading, setIsLoading] = useState(false)

  // Sync complete IDs if they change from server props
  useEffect(() => {
    setCompletedIds(initialCompletedIds)
  }, [initialCompletedIds])

  const isCompleted = completedIds.includes(currentLesson.id)

  // Extract YouTube ID
  const getEmbedUrl = (url: string) => {
    let videoId = url
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search)
      videoId = urlParams.get('v') || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || ''
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
  }

  const handleToggleCompleted = async () => {
    if (!userId) {
      toast.error('You must be logged in to track progress.')
      router.push('/login')
      return
    }

    setIsLoading(true)
    const targetCompletedState = !isCompleted

    try {
      await toggleLessonProgress(course.id, currentLesson.id, targetCompletedState)
      
      if (targetCompletedState) {
        setCompletedIds(prev => [...prev, currentLesson.id])
        toast.success('Lesson marked as completed!')
        
        // Auto-advance to the next lesson
        const currentIndex = lessons.findIndex(l => l.id === currentLesson.id)
        if (currentIndex < lessons.length - 1) {
          const nextLesson = lessons[currentIndex + 1]
          router.push(`/courses/${course.slug}/lessons/${nextLesson.id}`)
        } else {
          toast.success('Congratulations! You completed the course!')
          router.push(`/courses/${course.slug}`)
        }
      } else {
        setCompletedIds(prev => prev.filter(id => id !== currentLesson.id))
        toast.success('Lesson marked as incomplete.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update progress.')
    } finally {
      setIsLoading(false)
    }
  }

  const currentIndex = lessons.findIndex(l => l.id === currentLesson.id)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Video Content Pane */}
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </Link>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            HamroLearning Classroom
          </span>
        </div>

        {/* Responsive Iframe Container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          <iframe
            src={getEmbedUrl(currentLesson.video_url)}
            title={currentLesson.title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Metadata / Detail */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{currentLesson.title}</h1>
            <p className="text-sm text-slate-400 mt-1 font-semibold">{currentLesson.duration_minutes || 10} minutes duration</p>
          </div>

          <Button
            onClick={handleToggleCompleted}
            disabled={isLoading}
            variant={isCompleted ? 'outline' : 'default'}
            className={cn(
              "rounded-xl font-bold h-12 px-6 shrink-0 transition-all cursor-pointer",
              isCompleted
                ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            )}
          >
            {isCompleted ? (
              <>
                <CheckSquare className="w-5 h-5 mr-2" /> Completed
              </>
            ) : (
              <>
                <Square className="w-5 h-5 mr-2" /> Mark as Completed
              </>
            )}
          </Button>
        </div>

        {/* Description Panel */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 mb-3">About this lesson</h3>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-semibold">
            {currentLesson.description || 'No description available for this lesson.'}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          {prevLesson ? (
            <Link href={`/courses/${course.slug}/lessons/${prevLesson.id}`}>
              <Button variant="outline" className="rounded-xl border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white h-11 px-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link href={`/courses/${course.slug}/lessons/${nextLesson.id}`}>
              <Button className="rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300 h-11 px-4">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Playlist Sidebar Pane */}
      <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-850">
          <h2 className="font-extrabold text-base truncate flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
            {course.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            {completedIds.length} of {lessons.length} completed
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-850/50 max-h-[400px] lg:max-h-none">
          {lessons.map((lesson) => {
            const isActive = lesson.id === currentLesson.id
            const isLessonCompleted = completedIds.includes(lesson.id)

            return (
              <Link key={lesson.id} href={`/courses/${course.slug}/lessons/${lesson.id}`}>
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 transition-colors",
                    isActive
                      ? "bg-indigo-500/10 border-l-4 border-indigo-500 text-indigo-400"
                      : "hover:bg-slate-800/40 text-slate-350 hover:text-slate-150"
                  )}
                >
                  {isLessonCompleted ? (
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <PlayCircle className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-snug line-clamp-2">{lesson.order_index}. {lesson.title}</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">{lesson.duration_minutes || 10} mins</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
