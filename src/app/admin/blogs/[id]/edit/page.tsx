import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveBlogDraft } from '@/app/actions/blog-actions'

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  // In MVP, if the blog ID doesn't exist we'd normally handle creation via a server action returning the new ID.
  // We assume the blog exists for this form.
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-2">Use Markdown for rich text formatting.</p>
      </div>

      <form action={saveBlogDraft.bind(null, resolvedParams.id)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input id="title" name="title" defaultValue={blog?.title || ''} required className="text-lg font-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" name="slug" defaultValue={blog?.slug || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
                <Textarea id="excerpt" name="excerpt" defaultValue={blog?.excerpt || ''} className="h-20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Markdown Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  defaultValue={blog?.content || ''} 
                  required 
                  className="min-h-[500px] font-mono text-sm leading-relaxed" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Supports GitHub Flavored Markdown (Headers, Lists, Code Blocks, Links, Images).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                 <Label>Status</Label>
                 <select name="published" defaultValue={blog?.published ? 'true' : 'false'} className="p-2 border rounded-md text-sm bg-background">
                   <option value="false">Draft</option>
                   <option value="true">Published</option>
                 </select>
               </div>
               <Button type="submit" className="w-full">Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input id="seo_title" name="seo_title" defaultValue={blog?.seo_title || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo_description">Meta Description</Label>
                <Textarea id="seo_description" name="seo_description" defaultValue={blog?.seo_description || ''} className="h-20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reading_time_minutes">Reading Time (mins)</Label>
                <Input id="reading_time_minutes" name="reading_time_minutes" type="number" defaultValue={blog?.reading_time_minutes || 5} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" name="tags" defaultValue={blog?.tags?.join(', ') || ''} placeholder="engineering, news, tips" />
              </div>
            </CardContent>
          </Card>
        </div>

      </form>
    </div>
  )
}
