/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'

export default async function AdminBlogsPage() {
  const supabase = await createClient()

  // Fetch blogs with stats
  const { data: blogs } = await supabase
    .from('blogs')
    .select(`
      id, title, published, created_at,
      profiles (full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Blogs</h1>
          <p className="text-muted-foreground mt-2">Create, edit, and publish blog articles.</p>
        </div>
        <Button className="gap-2">
           {/* In a real app, this would create a draft row and redirect to it */}
          <Plus className="w-4 h-4" /> New Blog Post
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-bold">Title</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Author</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {blogs && blogs.length > 0 ? (
                  blogs.map((blog: any) => (
                    <tr key={blog.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{blog.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          blog.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{blog.profiles?.full_name || 'Anonymous'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(blog.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/blogs/${blog.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit className="w-4 h-4" /> Edit
                            </Button>
                          </Link>
                          {blog.published && (
                            <Link href={`/blogs`} target="_blank">
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No blogs found. Create one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
