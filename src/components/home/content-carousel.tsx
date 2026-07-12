'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Download, Eye } from 'lucide-react'

export function ContentCarousel({ title, items }: { title: string, items: any[] }) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-16 bg-muted/20 border-t border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <Link href="/explore" className="text-sm font-medium text-primary hover:underline hidden md:block">View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/notes/${item.slug}`} className="block h-full">
              <Card className="h-full overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="font-normal">
                      {item.content_type === 'note' ? 'Note' : 'Past Paper'}
                    </Badge>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views_count || 0}</span>
                      <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {item.downloads_count || 0}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-base mb-1 line-clamp-2">{item.title}</h3>
                  {item.subjects && <p className="text-sm text-muted-foreground mb-4">{item.subjects.name}</p>}
                  
                  <div className="mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 text-center md:hidden">
           <Link href="/explore" className="text-sm font-medium text-primary hover:underline">View All</Link>
        </div>
      </div>
    </section>
  )
}
