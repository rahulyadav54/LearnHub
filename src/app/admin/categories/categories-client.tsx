'use client'

import { useState } from 'react'
import { saveCategory, deleteCategory } from '@/app/actions/admin-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react'
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
      
      // Simulating list reload. Since we revalidated on the server, let's refresh or reload
      // But for a fast, reactive UI, we can just update local state or reload page
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
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/10">
                  <TableCell className="font-mono text-xs text-muted-foreground">{category.icon_name || 'BookOpen'}</TableCell>
                  <TableCell className="font-semibold">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">{category.description || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(category)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Category Name</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Science"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g. science"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-icon">Icon Name (Lucide Icon)</Label>
              <Input
                id="cat-icon"
                value={iconName}
                onChange={e => setIconName(e.target.value)}
                placeholder="e.g. BookOpen, Brain, FlaskConical"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of the category..."
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
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
