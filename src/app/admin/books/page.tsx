import { createClient } from '@/utils/supabase/server'
import { BooksClient } from './books-client'

export default async function AdminBooksPage() {
  const supabase = await createClient()

  // Fetch books and subject choices
  const [
    { data: books },
    { data: subjects }
  ] = await Promise.all([
    supabase
      .from('books')
      .select('*, subjects(name)')
      .order('created_at', { ascending: false }),
    supabase.from('subjects').select('id, name').order('name')
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Textbooks</h1>
        <p className="text-muted-foreground mt-1">Manage curricular textbooks, cover images, and reference materials.</p>
      </div>

      <BooksClient initialBooks={books || []} subjects={subjects || []} />
    </div>
  )
}
