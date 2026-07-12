import { createClient } from '@/utils/supabase/server'
import { UsersTable } from './users-table'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Fetch all profiles from public.profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching profiles:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground mt-1">Manage user permissions and elevate/revoke user roles.</p>
      </div>

      <UsersTable initialProfiles={profiles || []} />
    </div>
  )
}
