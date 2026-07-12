import { createClient } from '@/utils/supabase/server'
import { ScholarshipsClient } from './scholarships-client'

export default async function AdminScholarshipsPage() {
  const supabase = await createClient()
  const { data: scholarships } = await supabase
    .from('scholarships')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
        <p className="text-muted-foreground mt-1">Manage active scholarship portals, deadlines, and application links.</p>
      </div>

      <ScholarshipsClient initialScholarships={scholarships || []} />
    </div>
  )
}
