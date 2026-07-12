/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Clock } from 'lucide-react'

export default async function DownloadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: downloads } = await supabase
    .from('user_downloads')
    .select(`
      downloaded_at,
      content_items (
        id,
        title,
        slug,
        type,
        file_url
      )
    `)
    .eq('user_id', user?.id)
    .order('downloaded_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Download className="w-8 h-8 text-primary" /> Download History
        </h1>
        <p className="text-muted-foreground mt-2">Track and redownload files you have requested for offline use.</p>
      </div>

      <div className="space-y-4">
        {downloads && downloads.length > 0 ? (
          downloads.map((d: any, idx) => (
            <Card key={idx}>
              <CardHeader className="py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">{d.content_items?.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" /> {new Date(d.downloaded_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/notes/${d.content_items?.slug}`}>
                      <Button variant="outline" size="sm">View Note</Button>
                    </Link>
                    {d.content_items?.file_url && (
                      <a href={d.content_items.file_url} download target="_blank" rel="noreferrer">
                        <Button size="sm" className="gap-2"><Download className="w-4 h-4" /> Redownload</Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="p-12 text-center border rounded-lg bg-muted/20">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold">No downloads yet</h3>
            <p className="text-muted-foreground">Files you download will be logged here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
