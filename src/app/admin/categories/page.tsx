import { createClient } from '@/utils/supabase/server'
import { CategoriesClient } from './categories-client'

export default async function CategoriesAdminPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-1">Manage educational categories for courses and resources.</p>
      </div>

      <CategoriesClient initialCategories={categories || []} />
    </div>
  )
}
