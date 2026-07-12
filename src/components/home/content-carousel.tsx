"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, ArrowRight, FileText, BookOpen } from "lucide-react"

interface ContentItem {
  id: string
  title: string
  slug: string
  content_type: string
  views_count: number
  downloads_count: number
  created_at: string
  subjects?: { name: string }
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export function ContentCarousel({ title, items, viewAllHref = "/explore" }: {
  title: string
  items: ContentItem[]
  viewAllHref?: string
}) {
  if (!items || items.length === 0) return null

  return (
    <section className="section-padding bg-muted/20 border-y border-border">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
              {items[0]?.content_type === 'note' ? 'Study Materials' : 'Past Exams'}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
          </motion.div>
          <Link
            href={viewAllHref}
            className="hidden md:flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {items.map((contentItem) => {
            const isNote = contentItem.content_type === 'note'
            return (
              <motion.div key={contentItem.id} variants={item}>
                <Link href={`/notes/${contentItem.slug}`} className="block h-full group">
                  <div className="h-full p-5 rounded-2xl border border-border bg-card card-hover flex flex-col gap-4 relative overflow-hidden">
                    {/* Top gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${isNote ? 'bg-gradient-to-r from-primary to-violet-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`} />

                    <div className="flex items-start justify-between">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold ${isNote ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}
                      >
                        <span className="flex items-center gap-1">
                          {isNote ? <FileText className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                          {isNote ? 'Note' : 'Past Paper'}
                        </span>
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {contentItem.views_count || 0}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {contentItem.title}
                      </h3>
                      {contentItem.subjects && (
                        <p className="text-xs text-muted-foreground mt-1.5">{contentItem.subjects.name}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" /> {contentItem.downloads_count || 0}
                      </span>
                      <span>{new Date(contentItem.created_at).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="mt-6 text-center md:hidden">
          <Link href={viewAllHref} className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
