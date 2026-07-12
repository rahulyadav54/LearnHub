'use client'

import { useState } from 'react'
import { saveUniversity, deleteUniversity } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Loader2, GraduationCap, Globe } from 'lucide-react'
import { toast } from 'sonner'

interface University {
  id: string
  name: string
  short_name: string | null
  logo_url: string | null
  website_url: string | null
  created_at: string
}

export function UniversitiesClient({ initialUniversities }: { initialUniversities: University[] }) {
  const [universities, setUniversities] = useState<University[]>(initialUniversities)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const filtered = universities.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.short_name || '').toLowerCase().includes(search.toLowerCase())
  )

  const openCreateDialog = () => {
    setEditingUniversity(null)
    setName('')
    setShortName('')
    setLogoUrl('')
    setWebsiteUrl('')
    setIsDialogOpen(true)
  }

  const openEditDialog = (university: University) => {
    setEditingUniversity(university)
    setName(university.name)
    setShortName(university.short_name || '')
    setLogoUrl(university.logo_url || '')
    setWebsiteUrl(university.website_url || '')
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      toast.error("University name is required")
      return
    }

    setIsLoading(true)
    try {
      const id = editingUniversity ? editingUniversity.id : null
      const payload = {
        name,
        short_name: shortName || null,
        logo_url: logoUrl || null,
        website_url: websiteUrl || null,
      }
      await saveUniversity(id, payload)
      toast.success(editingUniversity ? "University updated successfully" : "University created successfully")
      window.location.reload()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save university")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return

    try {
      await deleteUniversity(id)
      setUniversities(prev => prev.filter(u => u.id !== id))
      toast.success("University deleted successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to delete university")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search universities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-card focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
          />
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shrink-0 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/10">
          <Plus className="w-4 h-4" /> Add University
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card overflow-hidden shadow-xl shadow-slate-100/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-slate-200/80 dark:border-slate-800/80">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 w-[100px]">Logo</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Name</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Abbreviation</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Website</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length > 0 ? (
                filtered.map((university) => (
                  <TableRow key={university.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="px-6 py-4">
                      {university.logo_url ? (
                        <img src={university.logo_url} alt={university.name} className="w-9 h-9 object-contain rounded-lg border border-slate-100 bg-white" />
                      ) : (
                        <div className="w-9 h-9 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-lg font-bold">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">{university.name}</TableCell>
                    <TableCell className="px-6 py-4 font-semibold text-muted-foreground">{university.short_name || 'N/A'}</TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {university.website_url ? (
                        <a href={university.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold">
                          <Globe className="w-3.5 h-3.5" /> Visit Site
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => openEditDialog(university)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleDelete(university.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No universities found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-slate-250 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingUniversity ? 'Edit University' : 'Create University'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="univ-name" className="font-semibold text-slate-700 dark:text-slate-300">University Name</Label>
              <Input
                id="univ-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Tribhuvan University"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="univ-short" className="font-semibold text-slate-700 dark:text-slate-300">Short Name / Abbreviation</Label>
              <Input
                id="univ-short"
                value={shortName}
                onChange={e => setShortName(e.target.value)}
                placeholder="e.g. TU"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="univ-logo" className="font-semibold text-slate-700 dark:text-slate-300">Logo URL</Label>
              <Input
                id="univ-logo"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="e.g. https://example.com/logo.png"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="univ-web" className="font-semibold text-slate-700 dark:text-slate-300">Website URL</Label>
              <Input
                id="univ-web"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="e.g. https://tu.edu.np"
                className="h-11 rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingUniversity ? 'Save Changes' : 'Create University'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
