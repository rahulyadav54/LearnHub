'use client'

import { useState } from 'react'
import { updateUserRole } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import { Search, ShieldAlert, GraduationCap, ShieldCheck, Mail, User } from 'lucide-react'
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Admin
          </span>
        )
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Teacher
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <GraduationCap className="w-3.5 h-3.5" /> Student
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input wrapper */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or User ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-card focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
          />
        </div>
        <div className="text-sm text-muted-foreground font-semibold">
          Showing {filteredProfiles.length} of {profiles.length} total users
        </div>
      </div>

      {/* Users Table Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card overflow-hidden shadow-xl shadow-slate-100/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-slate-200/80 dark:border-slate-800/80">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Avatar & Name</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">User ID</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Current Role</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Alter Access Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id} className="hover:bg-muted/20 transition-colors">
                    {/* Name & Avatar */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md shadow-indigo-500/20">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            profile.full_name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{profile.full_name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3" /> Registered User
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {/* User ID */}
                    <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {profile.id}
                    </TableCell>
                    {/* Role Badge */}
                    <TableCell className="px-6 py-4">
                      {getRoleBadge(profile.role)}
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="px-6 py-4 text-right">
                      <select
                        value={profile.role}
                        disabled={updatingId === profile.id}
                        onChange={e => handleRoleChange(profile.id, e.target.value as any)}
                        className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50 transition-all font-semibold"
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
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
