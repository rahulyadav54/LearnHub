import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Award, ShieldCheck, PlayCircle, CheckCircle } from 'lucide-react'
import { generateCertificate } from '@/app/actions/course-actions'
import { revalidatePath } from 'next/cache'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  
  // 1. Fetch course details
  const { data: course } = await supabase
    .from('courses')
    .select('*, categories(name)')
    .eq('slug', slug)
    .single()

  if (!course) {
    notFound()
  }

  // 2. Fetch lessons in order
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })

  // 3. Get user & progress
  const { data: { user } } = await supabase.auth.getUser()
  let completedLessonIds = new Set<string>()
  let hasCertificate = false
  let certificateData: any = null

  if (user) {
    const { data: progress } = await supabase
      .from('user_course_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)

    if (progress) {
      completedLessonIds = new Set(progress.map(p => p.lesson_id))
    }

    const { data: cert } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle()

    if (cert) {
      hasCertificate = true
      certificateData = cert
    }
  }

  const totalLessons = lessons?.length || 0
  const completedCount = completedLessonIds.size
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isFullyCompleted = totalLessons > 0 && completedCount === totalLessons

  // Action to issue certificate
  const handleClaimCertificate = async () => {
    'use server'
    try {
      await generateCertificate(course.id)
    } catch (err) {
      console.error(err)
    }
    revalidatePath(`/courses/${slug}`)
  }

  const firstLessonId = lessons && lessons.length > 0 ? lessons[0].id : null

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Course Banner */}
      <div className="relative bg-slate-900 overflow-hidden py-16 text-white border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="section-container relative max-w-5xl flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-full md:w-80 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 shrink-0 border border-slate-700/50">
            <img
              src={course.cover_image_url || `https://picsum.photos/400/300?random=${course.id}`}
              alt={course.title}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {course.categories?.name || 'General'}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {course.difficulty}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{course.title}</h1>
            <p className="text-slate-350 text-base md:text-lg mb-6 leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap gap-6 items-center text-sm font-bold text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-indigo-400" /> {totalLessons} Lessons
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-indigo-400" /> {course.estimated_hours} Hours Total
              </div>
            </div>

            {user ? (
              <div className="space-y-4 max-w-md">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Course Progress</span>
                  <span className="text-indigo-400">{progressPercent}% Completed ({completedCount}/{totalLessons})</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button size="lg" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-500/20">
                  Log in to track progress
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-container max-w-5xl py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800/80">
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="text-xl font-extrabold">Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {lessons && lessons.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {lessons.map((lesson) => {
                    const isCompleted = completedLessonIds.has(lesson.id)
                    return (
                      <Link key={lesson.id} href={`/courses/${slug}/lessons/${lesson.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-muted/10 transition-colors group">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {isCompleted ? (
                            <CheckCircle className="w-5.5 h-5.5 text-emerald-500 shrink-0" />
                          ) : (
                            <PlayCircle className="w-5.5 h-5.5 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {lesson.order_index}. {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground font-semibold mt-0.5">{lesson.duration_minutes || 10} minutes</p>
                          </div>
                        </div>
                        {isCompleted && (
                          <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                            Completed
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground font-semibold">
                  No lessons added to this course yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          {user && (
            <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800/80 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Course Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {firstLessonId && (
                  <Link href={`/courses/${slug}/lessons/${firstLessonId}`} className="block">
                    <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-500/10">
                      {completedCount > 0 ? 'Resume Course' : 'Start Course'}
                    </Button>
                  </Link>
                )}

                {hasCertificate ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="text-xs font-semibold">
                        <p className="font-bold">Certificate Issued!</p>
                        <p className="mt-0.5 opacity-90">Your verified certificate is ready to print.</p>
                      </div>
                    </div>
                    <Link href={`/courses/${slug}/certificate`} className="block">
                      <Button variant="outline" className="w-full rounded-xl border-emerald-600 hover:bg-emerald-50 text-emerald-600 font-bold h-12 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                        <Award className="w-4 h-4 mr-2" /> View Certificate
                      </Button>
                    </Link>
                  </div>
                ) : isFullyCompleted ? (
                  <div className="pt-2">
                    <form action={handleClaimCertificate}>
                      <Button type="submit" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-500/10">
                        <Award className="w-4 h-4 mr-2 animate-bounce" /> Claim Certificate
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="p-4 bg-muted/40 border border-border rounded-xl text-center text-xs font-semibold text-muted-foreground leading-normal">
                    Complete all {totalLessons} lessons to unlock your verified completion certificate!
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Certification Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs text-muted-foreground font-semibold leading-relaxed">
              <p>✓ Verified QR-code authentication link.</p>
              <p>✓ Showcases your full name, study hours, and date of completion.</p>
              <p>✓ Perfect for sharing on LinkedIn, resumes, and career portfolios.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
