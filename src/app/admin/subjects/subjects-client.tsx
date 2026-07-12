'use client'

import { useState } from 'react'
import { saveSubject, deleteSubject } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Subject {
  id: string
  name: string
  slug: string
  category_id: string
  program_id: string | null
  semester_id: string | null
  syllabus_content: string | null
  categories: { name: string } | null
}

interface DropdownItem {
  id: string
  name: string
  program_id?: string
}

interface Props {
  initialSubjects: Subject[]
  categories: DropdownItem[]
  programs: DropdownItem[]
  semesters: DropdownItem[]
}

export function SubjectsClient({ initialSubjects, categories, programs, semesters }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [programId, setProgramId] = useState('')
  const [semesterId, setSemesterId] = useState('')
  const [syllabusContent, setSyllabusContent] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase()) ||
    (s.categories?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  // Filter semesters based on selected program
  const filteredSemesters = semesters.filter(sem => !programId || sem.program_id === programId)

  const openCreateDialog = () => {
    setEditingSubject(null)
    setName('')
    setSlug('')
    setCategoryId(categories[0]?.id || '')
    setProgramId('')
    setSemesterId('')
    setSyllabusContent('')
    setIsDialogOpen(true)
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setName(subject.name)
    setSlug(subject.slug)
    setCategoryId(subject.category_id)
    setProgramId(subject.program_id || '')
    setSemesterId(subject.semester_id || '')
    setSyllabusContent(subject.syllabus_content || '')
    setIsDialogOpen(true)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingSubject) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug || !categoryId) {
      toast.error("Name, Slug, and Category are required")
      return
    }

    setIsLoading(true)
    try {
      const id = editingSubject ? editingSubject.id : null
      const payload = {
        category_id: categoryId,
        name,
        slug,
        program_id: programId || null,
        semester_id: semesterId || null,
        syllabus_content: syllabusContent || null,
      }
      await saveSubject(id, payload)
      toast.success(editingSubject ? "Subject updated successfully" : "Subject created successfully")
      window.location.reload()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save subject")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject? All associated notes, exams, and files will be deleted!")) return

    try {
      await deleteSubject(id)
      setSubjects(prev => prev.filter(s => s.id !== id))
      toast.success("Subject deleted successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to delete subject")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Subject
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((subject) => (
                <TableRow key={subject.id} className="hover:bg-muted/10">
                  <TableCell className="font-semibold">{subject.name}</TableCell>
                  <TableCell className="text-muted-foreground">{subject.slug}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {subject.categories?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(subject)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(subject.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No subjects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Create Subject'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="sub-name">Subject Name</Label>
              <Input
                id="sub-name"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Physics I"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-slug">Slug</Label>
              <Input
                id="sub-slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g. physics-1"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-category">Category</Label>
              <select
                id="sub-category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sub-program">Program (Optional)</Label>
                <select
                  id="sub-program"
                  value={programId}
                  onChange={e => {
                    setProgramId(e.target.value)
                    setSemesterId('')
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">None / All</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sub-semester">Semester (Optional)</Label>
                <select
                  id="sub-semester"
                  value={semesterId}
                  onChange={e => setSemesterId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={!programId}
                >
                  <option value="">None</option>
                  {filteredSemesters.map(sem => (
                    <option key={sem.id} value={sem.id}>{sem.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-syllabus">Syllabus Content (Markdown)</Label>
              <Textarea
                id="sub-syllabus"
                value={syllabusContent}
                onChange={e => setSyllabusContent(e.target.value)}
                placeholder="# Syllabus Overview..."
                rows={4}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingSubject ? 'Save Changes' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
