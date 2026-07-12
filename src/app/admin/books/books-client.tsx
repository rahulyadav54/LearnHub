'use client'

import { useState } from 'react'
import { saveBook, deleteBook } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2, Search, Loader2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

interface Book {
  id: string
  title: string
  author: string
  description: string | null
  cover_image_url: string | null
  file_url: string | null
  subject_id: string | null
  published_year: number | null
  created_at: string
  subjects: { name: string } | null
}

interface SubjectItem {
  id: string
  name: string
}

interface Props {
  initialBooks: any[]
  subjects: SubjectItem[]
}

export function BooksClient({ initialBooks, subjects }: Props) {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  // Form fields
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [publishedYear, setPublishedYear] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const { createClient } = await import('@/utils/supabase/client')
      const supabase = createClient()
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `books/${fileName}`

      const { error } = await supabase.storage
        .from('materials')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(filePath)

      setFileUrl(publicUrl)
      toast.success("Book PDF uploaded successfully!")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    (b.subjects?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const openCreateDialog = () => {
    setEditingBook(null)
    setTitle('')
    setAuthor('')
    setDescription('')
    setCoverImageUrl('')
    setFileUrl('')
    setSubjectId('')
    setPublishedYear('')
    setIsDialogOpen(true)
  }

  const openEditDialog = (book: Book) => {
    setEditingBook(book)
    setTitle(book.title)
    setAuthor(book.author)
    setDescription(book.description || '')
    setCoverImageUrl(book.cover_image_url || '')
    setFileUrl(book.file_url || '')
    setSubjectId(book.subject_id || '')
    setPublishedYear(book.published_year ? String(book.published_year) : '')
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !author) {
      toast.error("Title and Author are required")
      return
    }

    setIsLoading(true)
    try {
      const id = editingBook ? editingBook.id : null
      const payload = {
        title,
        author,
        description: description || null,
        cover_image_url: coverImageUrl || null,
        file_url: fileUrl || null,
        subject_id: subjectId || null,
        published_year: publishedYear ? parseInt(publishedYear) : null,
      }
      await saveBook(id, payload)
      toast.success(editingBook ? "Book updated successfully" : "Book created successfully")
      window.location.reload()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save book")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      await deleteBook(id)
      setBooks(prev => prev.filter(b => b.id !== id))
      toast.success("Book deleted successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to delete book")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-card focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
          />
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shrink-0 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/10">
          <Plus className="w-4 h-4" /> Add Textbook
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card overflow-hidden shadow-xl shadow-slate-100/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-slate-200/80 dark:border-slate-800/80">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 w-[80px]">Cover</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Title</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Author</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Subject</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">File Status</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length > 0 ? (
                filtered.map((book) => (
                  <TableRow key={book.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="px-6 py-4">
                      {book.cover_image_url ? (
                        <img src={book.cover_image_url} alt={book.title} className="w-10 h-14 object-cover border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm bg-muted" />
                      ) : (
                        <div className="w-10 h-14 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center rounded-lg font-bold text-[10px] text-center p-1 leading-tight">
                          <BookOpen className="w-4 h-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">{book.title}</TableCell>
                    <TableCell className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{book.author}</TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground font-semibold">{book.subjects?.name || 'General'}</TableCell>
                    <TableCell className="px-6 py-4">
                      {book.file_url ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          PDF Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Missing File
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => openEditDialog(book)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleDelete(book.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No books found.
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
            <DialogTitle className="text-xl font-bold">{editingBook ? 'Edit Textbook' : 'Create Textbook'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="book-title" className="font-semibold text-slate-700 dark:text-slate-300">Title</Label>
                <Input
                  id="book-title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Calculus & Analytical Geometry"
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="book-author" className="font-semibold text-slate-700 dark:text-slate-300">Author</Label>
                <Input
                  id="book-author"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="e.g. George B. Thomas"
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="book-year" className="font-semibold text-slate-700 dark:text-slate-300">Published Year</Label>
                <Input
                  id="book-year"
                  type="number"
                  value={publishedYear}
                  onChange={e => setPublishedYear(e.target.value)}
                  placeholder="e.g. 2021"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="book-subject" className="font-semibold text-slate-700 dark:text-slate-300">Subject (Optional)</Label>
              <select
                id="book-subject"
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">None / Not Tied to Specific Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="book-cover" className="font-semibold text-slate-700 dark:text-slate-300">Cover Image URL</Label>
              <Input
                id="book-cover"
                value={coverImageUrl}
                onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="e.g. https://example.com/cover.jpg"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-slate-700 dark:text-slate-300">Upload PDF File</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="h-11 rounded-xl cursor-pointer file:font-semibold file:text-indigo-600 file:bg-indigo-50 file:border-0 file:rounded-lg file:px-2.5 file:py-0.5 hover:file:bg-indigo-100"
                />
              </div>
              {isUploading && <p className="text-xs text-indigo-500 font-bold animate-pulse">Uploading file to storage...</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="book-file" className="font-semibold text-slate-700 dark:text-slate-300">PDF File URL</Label>
              <Input
                id="book-file"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                placeholder="e.g. /pdfs/books/calculus.pdf"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="book-desc" className="font-semibold text-slate-700 dark:text-slate-300">Description</Label>
              <Textarea
                id="book-desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief summary or description of the textbook..."
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
                {editingBook ? 'Save Changes' : 'Create Book'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
