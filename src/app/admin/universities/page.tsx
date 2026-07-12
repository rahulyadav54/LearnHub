import { createClient } from '@/utils/supabase/server'
import { UniversitiesClient } from './universities-client'

export default async function AdminUniversitiesPage() {
  const supabase = await createClient()
  const { data: universities } = await supabase
    .from('universities')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
        <p className="text-muted-foreground mt-1">Manage partner and local universities in Nepal.</p>
      </div>

      <UniversitiesClient initialUniversities={universities || []} />
    </div>
  )
}
