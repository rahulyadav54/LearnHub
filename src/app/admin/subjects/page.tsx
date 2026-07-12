import { createClient } from '@/utils/supabase/server'
import { SubjectsClient } from './subjects-client'

export default async function AdminSubjectsPage() {
  const supabase = await createClient()

  // Fetch subjects, categories, programs, semesters
  const [
    { data: subjects },
    { data: categories },
    { data: programs },
    { data: semesters }
  ] = await Promise.all([
    supabase.from('subjects').select('*, categories(name)').order('created_at', { ascending: false }),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('programs').select('id, name').order('name'),
    supabase.from('semesters').select('id, name, program_id').order('name')
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <p className="text-muted-foreground mt-1">Manage subjects, syllabus details, and align them with categories, programs, and semesters.</p>
      </div>

      <SubjectsClient
        initialSubjects={subjects || []}
        categories={categories || []}
        programs={programs || []}
        semesters={semesters || []}
      />
    </div>
  )
}
