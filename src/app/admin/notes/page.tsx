import { createClient } from '@/utils/supabase/server'
import { NotesClient } from './notes-client'

export default async function NotesAdminPage() {
  const supabase = await createClient()

  // Fetch content_items of type 'note' and subject choices
  const [
    { data: notes },
    { data: subjects }
  ] = await Promise.all([
    supabase
      .from('content_items')
      .select('*, subjects(name)')
      .eq('content_type', 'note')
      .order('created_at', { ascending: false }),
    supabase.from('subjects').select('id, name').order('name')
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study Notes</h1>
        <p className="text-muted-foreground mt-1">Manage study materials and upload PDFs/Notes.</p>
      </div>

      <NotesClient initialNotes={notes || []} subjects={subjects || []} />
    </div>
  )
}
