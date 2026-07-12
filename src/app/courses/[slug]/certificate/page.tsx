import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Award, ShieldCheck, Printer, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CertificatePrintButton } from './print-button'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CertificatePage({ params }: Props) {
  const { slug } = await params
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

  // 2. Fetch authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    notFound()
  }

  // 3. Fetch user profile for their real name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  // 4. Fetch certificate entry
  const { data: cert } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  if (!cert) {
    notFound()
  }

  const fullName = profile?.full_name || 'Learner'
  const issueDate = new Date(cert.issued_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-12 px-4 print:p-0 print:bg-white flex flex-col items-center">
      {/* Top controls (hidden in print) */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 print:hidden">
        <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Course
        </Link>
        <CertificatePrintButton />
      </div>

      {/* Premium Certificate Border & Paper */}
      <div className="w-full max-w-4xl aspect-[1.414/1] bg-white border-[16px] border-double border-indigo-900 rounded-3xl p-8 md:p-12 shadow-2xl relative flex flex-col justify-between text-slate-800 font-sans print:shadow-none print:border-indigo-900 print:rounded-none">
        
        {/* Certificate Frame Accents */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border border-indigo-900/10 pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-200">
              <Award className="w-9 h-9 text-indigo-700" />
            </div>
          </div>
          <h2 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-indigo-900">
            Certificate of Completion
          </h2>
          <div className="h-[2px] w-20 bg-indigo-900/30 mx-auto" />
        </div>

        {/* Certificate Body */}
        <div className="text-center space-y-6 my-auto">
          <p className="font-serif italic text-base text-slate-500">
            This is proudly presented to
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-serif border-b-2 border-slate-100 max-w-lg mx-auto pb-2 italic">
            {fullName}
          </h1>
          <p className="font-serif italic text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            for successfully completing all curriculum requirements and video tutorials for the course
          </p>
          <h3 className="text-xl md:text-2xl font-black tracking-tight text-indigo-950">
            {course.title}
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Estimated Study Duration: {course.estimated_hours} Hours
          </p>
        </div>

        {/* Certificate Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-6">
          <div className="text-center md:text-left space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Issue</p>
            <p className="text-xs font-extrabold text-slate-800">{issueDate}</p>
          </div>

          <div className="flex items-center gap-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div className="text-[9px] font-semibold text-slate-500">
              <p className="font-bold text-slate-700">VERIFIED CERTIFICATE</p>
              <p className="mt-0.5 font-mono select-all uppercase">ID: {cert.certificate_code}</p>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorized Authority</p>
            <p className="text-xs font-extrabold text-slate-800 italic font-serif">HamroLearning Board</p>
          </div>
        </div>
      </div>
    </div>
  )
}
