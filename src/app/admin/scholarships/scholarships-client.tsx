'use client'

import { useState } from 'react'
import { saveScholarship, deleteScholarship } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Loader2, Award, Calendar } from 'lucide-react'
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search scholarships..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-card focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
          />
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shrink-0 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/10">
          <Plus className="w-4 h-4" /> Add Scholarship
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card overflow-hidden shadow-xl shadow-slate-100/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-slate-200/80 dark:border-slate-800/80">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Title</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Provider</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Amount</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Deadline</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{s.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">{s.description || 'No description'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{s.provider}</TableCell>
                    <TableCell className="px-6 py-4 font-bold text-green-600 dark:text-green-400">{s.amount || 'Varies / N/A'}</TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground font-semibold">
                      {s.deadline ? (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(s.deadline).toLocaleDateString()}
                        </span>
                      ) : (
                        'No Deadline'
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => openEditDialog(s)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No scholarships found.
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
            <DialogTitle className="text-xl font-bold">{editingScholarship ? 'Edit Scholarship' : 'Create Scholarship'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="schol-title" className="font-semibold text-slate-700 dark:text-slate-300">Scholarship Title</Label>
              <Input
                id="schol-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Nepal Government Merit Scholarship"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="schol-prov" className="font-semibold text-slate-700 dark:text-slate-300">Provider / Organization</Label>
              <Input
                id="schol-prov"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                placeholder="e.g. Ministry of Education"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="schol-amt" className="font-semibold text-slate-700 dark:text-slate-300">Amount</Label>
                <Input
                  id="schol-amt"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. NPR 50,000 / Full Tuition"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="schol-dl" className="font-semibold text-slate-700 dark:text-slate-300">Deadline</Label>
                <Input
                  id="schol-dl"
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="schol-link" className="font-semibold text-slate-700 dark:text-slate-300">Application / Details URL</Label>
              <Input
                id="schol-link"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="e.g. https://example.com/apply"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="schol-desc" className="font-semibold text-slate-700 dark:text-slate-300">Description & Eligibility</Label>
              <Textarea
                id="schol-desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Details about eligibility criteria, requirements..."
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
                {editingScholarship ? 'Save Changes' : 'Create Scholarship'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
