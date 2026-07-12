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
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react'
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
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Textbook
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>File Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((book) => (
                <TableRow key={book.id} className="hover:bg-muted/10">
                  <TableCell>
                    {book.cover_image_url ? (
                      <img src={book.cover_image_url} alt={book.title} className="w-10 h-14 object-cover border rounded shadow-sm" />
                    ) : (
                      <div className="w-10 h-14 bg-muted border flex items-center justify-center rounded text-[8px] text-center p-1 text-muted-foreground font-bold">
                        No Cover
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">{book.title}</TableCell>
                  <TableCell className="text-muted-foreground">{book.author}</TableCell>
                  <TableCell className="text-muted-foreground">{book.subjects?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {book.file_url ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none">
                        PDF Available
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-500/10 text-red-600 dark:text-red-400 border-none">
                        Missing File
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(book)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(book.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Textbook' : 'Create Textbook'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="book-title">Title</Label>
                <Input
                  id="book-title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Calculus & Analytical Geometry"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="book-author">Author</Label>
                <Input
                  id="book-author"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="e.g. George B. Thomas"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="book-year">Published Year</Label>
                <Input
                  id="book-year"
                  type="number"
                  value={publishedYear}
                  onChange={e => setPublishedYear(e.target.value)}
                  placeholder="e.g. 2021"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="book-subject">Subject (Optional)</Label>
              <select
                id="book-subject"
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">None / Not Tied to Specific Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="book-cover">Cover Image URL</Label>
              <Input
                id="book-cover"
                value={coverImageUrl}
                onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="e.g. https://example.com/cover.jpg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="book-file">PDF File URL</Label>
              <Input
                id="book-file"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                placeholder="e.g. /pdfs/books/calculus.pdf"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="book-desc">Description</Label>
              <Textarea
                id="book-desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief summary or description of the textbook..."
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
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
