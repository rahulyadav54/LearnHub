import { createClient } from '@/utils/supabase/server'
import { QuestionPapersClient } from './question-papers-client'

export default async function AdminQuestionPapersPage() {
  const supabase = await createClient()

  // Fetch content_items where content_type is 'question_paper'
  const [
    { data: papers },
    { data: subjects }
  ] = await Promise.all([
    supabase
      .from('content_items')
      .select('*, subjects(name)')
      .eq('content_type', 'question_paper')
      .order('created_at', { ascending: false }),
    supabase.from('subjects').select('id, name').order('name')
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Question Papers</h1>
        <p className="text-muted-foreground mt-1">Manage, upload, and update previous years exam papers.</p>
      </div>

      <QuestionPapersClient initialPapers={papers || []} subjects={subjects || []} />
    </div>
  )
}
