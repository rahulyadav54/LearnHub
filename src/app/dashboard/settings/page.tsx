import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, User } from 'lucide-react'
import { updateProfile } from '@/app/actions/dashboard-actions'
import { logout } from '@/app/actions/auth'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and profile details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile Information</CardTitle>
            <CardDescription>Update your public display name.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL (Optional)</Label>
                <Input id="avatar_url" name="avatar_url" type="url" defaultValue={profile?.avatar_url || ''} />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Read-only information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ''} readOnly className="bg-muted text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={profile?.role || 'STUDENT'} readOnly className="bg-muted text-muted-foreground uppercase font-mono" />
              </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-500">Sign Out</CardTitle>
            <CardDescription>Sign out of your session on this device.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={logout}>
              <Button variant="destructive" type="submit" className="w-full sm:w-auto">
                Log Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
