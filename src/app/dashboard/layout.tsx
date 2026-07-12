import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, current_streak')
    .eq('id', user.id)
    .single()

  return (
    <DashboardLayoutClient user={user} profile={profile}>
      {children}
    </DashboardLayoutClient>
  )
}
