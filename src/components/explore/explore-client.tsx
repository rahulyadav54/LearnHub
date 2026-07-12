"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Microscope, Laptop, BookOpen, GraduationCap, Scale, Calculator, Globe, Lightbulb, Code
} from "lucide-react"
import { cn } from "@/lib/utils"

const levels = ["All", "SEE", "+2 Science", "+2 Management", "Bachelors", "Masters", "Loksewa"]

const getIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes("science") || n.includes("bio")) return <Microscope className="w-7 h-7" />
  if (n.includes("tech") || n.includes("computer") || n.includes("it")) return <Laptop className="w-7 h-7" />
  if (n.includes("math") || n.includes("calculus")) return <Calculator className="w-7 h-7" />
  if (n.includes("language") || n.includes("english")) return <Globe className="w-7 h-7" />
  if (n.includes("law") || n.includes("loksewa")) return <Scale className="w-7 h-7" />
  if (n.includes("code") || n.includes("program")) return <Code className="w-7 h-7" />
  if (n.includes("engineering")) return <GraduationCap className="w-7 h-7" />
  if (n.includes("commerce") || n.includes("business")) return <Lightbulb className="w-7 h-7" />
  return <BookOpen className="w-7 h-7" />
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export function ExploreClient({ categories }: { categories: Category[] }) {
  const [activeLevel, setActiveLevel] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <>
      {/* Level Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border",
              activeLevel === level
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                : "bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full md:w-72 h-10 pl-4 pr-4 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
        />
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLevel + search}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {filtered.length > 0 ? filtered.map((cat) => (
            <Link key={cat.id} href={`/explore/${cat.slug}`}>
              <div className="h-full p-6 rounded-2xl border border-border bg-card card-hover flex flex-col gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {getIcon(cat.name)}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cat.description || `Explore ${cat.name} resources`}
                  </p>
                </div>
                <div className="mt-auto text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Browse resources →
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-4 py-20 text-center text-muted-foreground">
              No categories found for &quot;{search}&quot;
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
