'use client'

import { useState } from 'react'
import { saveCategory, deleteCategory } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Loader2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon_name: string | null
  created_at: string
}

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  // Form fields
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [iconName, setIconName] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const openCreateDialog = () => {
    setEditingCategory(null)
    setName('')
    setSlug('')
    setDescription('')
    setIconName('BookOpen')
    setIsDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setSlug(category.slug)
    setDescription(category.description || '')
    setIconName(category.icon_name || 'BookOpen')
    setIsDialogOpen(true)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) {
      toast.error("Name and Slug are required")
      return
    }

    setIsLoading(true)
    try {
      const id = editingCategory ? editingCategory.id : null
      await saveCategory(id, { name, slug, description, icon_name: iconName })
      
      toast.success(editingCategory ? "Category updated successfully" : "Category created successfully")
      window.location.reload()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This will delete all connected courses/subjects!")) return

    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success("Category deleted successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to delete category")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-card focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all"
          />
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shrink-0 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-500/10">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card overflow-hidden shadow-xl shadow-slate-100/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-slate-200/80 dark:border-slate-800/80">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 w-[120px]">Icon</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Name</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Slug</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Description</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length > 0 ? (
                filtered.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <BookOpen className="w-4 h-4" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">{category.name}</TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="px-6 py-4 max-w-md truncate text-muted-foreground">{category.description || 'N/A'}</TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => openEditDialog(category)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleDelete(category.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No categories found.
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
            <DialogTitle className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="font-semibold text-slate-700 dark:text-slate-300">Category Name</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Science"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-slug" className="font-semibold text-slate-700 dark:text-slate-300">Slug</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g. science"
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-icon" className="font-semibold text-slate-700 dark:text-slate-300">Icon Name (Lucide Icon)</Label>
              <Input
                id="cat-icon"
                value={iconName}
                onChange={e => setIconName(e.target.value)}
                placeholder="e.g. BookOpen, Brain, FlaskConical"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="font-semibold text-slate-700 dark:text-slate-300">Description</Label>
              <Textarea
                id="cat-desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of the category..."
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
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
