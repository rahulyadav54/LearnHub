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
import { Plus, Edit2, Trash2, Search, Loader2, FileText } from 'lucide-react'
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
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Note
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>File Status</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((note) => (
                <TableRow key={note.id} className="hover:bg-muted/10">
                  <TableCell className="font-semibold">{note.title}</TableCell>
                  <TableCell className="text-muted-foreground">{note.subjects?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {note.file_url ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none">
                        PDF Attached
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-500/10 text-red-600 dark:text-red-400 border-none">
                        Missing File
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">{note.downloads_count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(note)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(note.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No notes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Study Note' : 'Create Study Note'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Physics Mechanics Chapter 1"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-subject">Subject</Label>
              <select
                id="note-subject"
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="" disabled>Select Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-file">File / PDF URL</Label>
              <Input
                id="note-file"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                placeholder="e.g. /pdfs/mechanics.pdf"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-desc">Description</Label>
              <Textarea
                id="note-desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief summary or description of the note..."
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
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
