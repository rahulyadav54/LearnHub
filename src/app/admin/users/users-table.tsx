'use client'

import { useState } from 'react'
import { updateUserRole } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import { Search, ShieldAlert, GraduationCap, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

export function UsersTable({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredProfiles = profiles.filter(p => 
    (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  )

  const handleRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
    setUpdatingId(userId)
    try {
      await updateUserRole(userId, newRole)
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p))
      toast.success("User role updated successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to update role")
    } finally {
      setUpdatingId(null)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
      case 'teacher':
        return <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
      default:
        return <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <TableRow key={profile.id} className="hover:bg-muted/10">
                  <TableCell className="font-mono text-xs max-w-[120px] truncate">{profile.id}</TableCell>
                  <TableCell className="font-semibold">{profile.full_name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 capitalize">
                      {getRoleIcon(profile.role)}
                      <span>{profile.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <select
                      value={profile.role}
                      disabled={updatingId === profile.id}
                      onChange={e => handleRoleChange(profile.id, e.target.value as any)}
                      className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
