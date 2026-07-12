'use client'

import { useState } from 'react'
import { saveUniversity, deleteUniversity } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react'
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
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search universities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add University
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((university) => (
                <TableRow key={university.id} className="hover:bg-muted/10">
                  <TableCell>
                    {university.logo_url ? (
                      <img src={university.logo_url} alt={university.name} className="w-8 h-8 object-contain rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-muted flex items-center justify-center rounded text-[10px] font-bold">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">{university.name}</TableCell>
                  <TableCell className="text-muted-foreground">{university.short_name || 'N/A'}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {university.website_url ? (
                      <a href={university.website_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {university.website_url}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(university)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(university.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No universities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUniversity ? 'Edit University' : 'Create University'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="univ-name">University Name</Label>
              <Input
                id="univ-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Tribhuvan University"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="univ-short">Short Name / Abbreviation</Label>
              <Input
                id="univ-short"
                value={shortName}
                onChange={e => setShortName(e.target.value)}
                placeholder="e.g. TU"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="univ-logo">Logo URL</Label>
              <Input
                id="univ-logo"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="e.g. https://example.com/logo.png"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="univ-web">Website URL</Label>
              <Input
                id="univ-web"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="e.g. https://tu.edu.np"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
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
