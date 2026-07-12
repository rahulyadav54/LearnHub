'use client'

import { useState } from 'react'
import { saveScholarship, deleteScholarship } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Scholarship {
  id: string
  title: string
  provider: string
  amount: string | null
  deadline: string | null
  description: string | null
  link_url: string | null
  created_at: string
}

export function ScholarshipsClient({ initialScholarships }: { initialScholarships: Scholarship[] }) {
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null)

  // Form fields
  const [title, setTitle] = useState('')
  const [provider, setProvider] = useState('')
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [linkUrl, setLinkUrl] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const filtered = scholarships.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.provider.toLowerCase().includes(search.toLowerCase())
  )

  const openCreateDialog = () => {
    setEditingScholarship(null)
    setTitle('')
    setProvider('')
    setAmount('')
    setDeadline('')
    setDescription('')
    setLinkUrl('')
    setIsDialogOpen(true)
  }

  const openEditDialog = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship)
    setTitle(scholarship.title)
    setProvider(scholarship.provider)
    setAmount(scholarship.amount || '')
    
    // Format deadline date for date-picker (YYYY-MM-DD)
    const formattedDeadline = scholarship.deadline 
      ? new Date(scholarship.deadline).toISOString().split('T')[0] 
      : ''
    setDeadline(formattedDeadline)
    
    setDescription(scholarship.description || '')
    setLinkUrl(scholarship.link_url || '')
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !provider) {
      toast.error("Title and Provider are required")
      return
    }

    setIsLoading(true)
    try {
      const id = editingScholarship ? editingScholarship.id : null
      const payload = {
        title,
        provider,
        amount: amount || null,
        deadline: deadline || null,
        description: description || null,
        link_url: linkUrl || null,
      }
      await saveScholarship(id, payload)
      toast.success(editingScholarship ? "Scholarship updated successfully" : "Scholarship created successfully")
      window.location.reload()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save scholarship")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return

    try {
      await deleteScholarship(id)
      setScholarships(prev => prev.filter(s => s.id !== id))
      toast.success("Scholarship deleted successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to delete scholarship")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search scholarships..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Scholarship
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/10">
                  <TableCell className="font-semibold">{s.title}</TableCell>
                  <TableCell className="text-muted-foreground">{s.provider}</TableCell>
                  <TableCell className="text-muted-foreground font-medium">{s.amount || 'Varies / N/A'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.deadline ? new Date(s.deadline).toLocaleDateString() : 'No Deadline'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(s)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No scholarships found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingScholarship ? 'Edit Scholarship' : 'Create Scholarship'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="schol-title">Scholarship Title</Label>
              <Input
                id="schol-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Nepal Government Merit Scholarship"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="schol-prov">Provider / Organization</Label>
              <Input
                id="schol-prov"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                placeholder="e.g. Ministry of Education"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="schol-amt">Amount</Label>
                <Input
                  id="schol-amt"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. NPR 50,000 / Full Tuition"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="schol-dl">Deadline</Label>
                <Input
                  id="schol-dl"
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="schol-link">Application / Details URL</Label>
              <Input
                id="schol-link"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="e.g. https://example.com/apply"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="schol-desc">Description & Eligibility</Label>
              <Textarea
                id="schol-desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Details about eligibility criteria, requirements..."
                rows={4}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingScholarship ? 'Save Changes' : 'Create Scholarship'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
