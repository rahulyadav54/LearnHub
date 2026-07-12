'use client'

import { useState } from 'react'
import { saveSubject, deleteSubject } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Loader2, BookOpen } from 'lucide-react'
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-card focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
          />
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shrink-0 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/10">
          <Plus className="w-4 h-4" /> Add Subject
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card overflow-hidden shadow-xl shadow-slate-100/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-slate-200/80 dark:border-slate-800/80">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Name</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Slug</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Category</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length > 0 ? (
                filtered.map((subject) => (
                  <TableRow key={subject.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      {subject.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">{subject.slug}</TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {subject.categories?.name || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => openEditDialog(subject)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleDelete(subject.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No subjects found.
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
            <DialogTitle className="text-xl font-bold">{editingSubject ? 'Edit Subject' : 'Create Subject'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="sub-name" className="font-semibold text-slate-700 dark:text-slate-300">Subject Name</Label>
              <Input
                id="sub-name"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Physics I"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-slug" className="font-semibold text-slate-700 dark:text-slate-300">Slug</Label>
              <Input
                id="sub-slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g. physics-1"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-category" className="font-semibold text-slate-700 dark:text-slate-300">Category</Label>
              <select
                id="sub-category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                <Label htmlFor="sub-program" className="font-semibold text-slate-700 dark:text-slate-300">Program (Optional)</Label>
                <select
                  id="sub-program"
                  value={programId}
                  onChange={e => {
                    setProgramId(e.target.value)
                    setSemesterId('')
                  }}
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none"
                >
                  <option value="">None / All</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sub-semester" className="font-semibold text-slate-700 dark:text-slate-300">Semester (Optional)</Label>
                <select
                  id="sub-semester"
                  value={semesterId}
                  onChange={e => setSemesterId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none"
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
              <Label htmlFor="sub-syllabus" className="font-semibold text-slate-700 dark:text-slate-300">Syllabus Content (Markdown)</Label>
              <Textarea
                id="sub-syllabus"
                value={syllabusContent}
                onChange={e => setSyllabusContent(e.target.value)}
                placeholder="# Syllabus Overview..."
                className="rounded-xl"
                rows={4}
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
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
