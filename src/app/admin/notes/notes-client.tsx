'use client'

import { useState } from 'react'
import { saveContentItem, deleteContentItem } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2, Search, Loader2, FileText, Download } from 'lucide-react'
import { toast } from 'sonner'

interface Note {
  id: string
  title: string
  description: string | null
  file_url: string | null
  subject_id: string
  downloads_count: number
  created_at: string
  subjects: { name: string } | null
}

interface SubjectItem {
  id: string
  name: string
}

interface Props {
  initialNotes: any[]
  subjects: SubjectItem[]
}

export function NotesClient({ initialNotes, subjects }: Props) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.subjects?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const openCreateDialog = () => {
    setEditingNote(null)
    setTitle('')
    setDescription('')
    setSubjectId(subjects[0]?.id || '')
    setFileUrl('')
    setIsDialogOpen(true)
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setTitle(note.title)
    setDescription(note.description || '')
    setSubjectId(note.subject_id)
    setFileUrl(note.file_url || '')
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !subjectId) {
      toast.error("Title and Subject are required")
      return
    }

    setIsLoading(true)
    try {
      const id = editingNote ? editingNote.id : null
      const payload = {
        title,
        description: description || null,
        content_type: 'note' as const,
        subject_id: subjectId,
        file_url: fileUrl || null,
      }
      await saveContentItem(id, payload)
      toast.success(editingNote ? "Note updated successfully" : "Note created successfully")
      window.location.reload()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save note")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      await deleteContentItem(id, 'note')
      setNotes(prev => prev.filter(n => n.id !== id))
      toast.success("Note deleted successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to delete note")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search study notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-card focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
          />
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shrink-0 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/10">
          <Plus className="w-4 h-4" /> Add Study Note
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card overflow-hidden shadow-xl shadow-slate-100/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-slate-200/80 dark:border-slate-800/80">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Title</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Subject</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">File Status</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Downloads</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length > 0 ? (
                filtered.map((note) => (
                  <TableRow key={note.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{note.title}</p>
                        <p className="text-xs text-muted-foreground font-medium truncate max-w-[250px]">{note.description || 'No description'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground font-semibold">
                      {note.subjects?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {note.file_url ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          PDF Attached
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Missing File
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-1 text-muted-foreground font-bold text-xs">
                        <Download className="w-3.5 h-3.5" /> {note.downloads_count}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => openEditDialog(note)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleDelete(note.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No notes found.
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
            <DialogTitle className="text-xl font-bold">{editingNote ? 'Edit Study Note' : 'Create Study Note'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="note-title" className="font-semibold text-slate-700 dark:text-slate-300">Title</Label>
              <Input
                id="note-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Physics Mechanics Chapter 1"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-subject" className="font-semibold text-slate-700 dark:text-slate-300">Subject</Label>
              <select
                id="note-subject"
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Select Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-file" className="font-semibold text-slate-700 dark:text-slate-300">File / PDF URL</Label>
              <Input
                id="note-file"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                placeholder="e.g. /pdfs/mechanics.pdf"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-desc" className="font-semibold text-slate-700 dark:text-slate-300">Description</Label>
              <Textarea
                id="note-desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief summary or description of the note..."
                className="rounded-xl"
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingNote ? 'Save Changes' : 'Create Note'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
