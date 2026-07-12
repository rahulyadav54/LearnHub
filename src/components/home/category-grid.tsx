'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { Book, GraduationCap, Laptop, Lightbulb, PenTool, Microscope, Globe, Code } from 'lucide-react'

const getIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('science')) return <Microscope className="w-6 h-6" />
  if (n.includes('tech') || n.includes('computer')) return <Laptop className="w-6 h-6" />
  if (n.includes('art') || n.includes('design')) return <PenTool className="w-6 h-6" />
  if (n.includes('math')) return <Lightbulb className="w-6 h-6" />
  if (n.includes('language') || n.includes('global')) return <Globe className="w-6 h-6" />
  if (n.includes('code') || n.includes('program')) return <Code className="w-6 h-6" />
  if (n.includes('engineering')) return <GraduationCap className="w-6 h-6" />
  return <Book className="w-6 h-6" />
}

export function CategoryGrid({ categories }: { categories: any[] }) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Explore by Category</h2>
          <p className="text-muted-foreground text-lg">Browse our structured library of academic materials.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/explore/${cat.slug}`} className="block h-full group">
              <div className="h-full p-6 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors flex flex-col justify-between">
                <div>
                  <div className="text-primary mb-4">
                    {getIcon(cat.name)}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
