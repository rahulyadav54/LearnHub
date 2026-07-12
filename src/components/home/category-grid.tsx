"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Microscope, Laptop, BookOpen, Lightbulb, Globe, Code,
  GraduationCap, Calculator, Briefcase, Building2, Scale, HeartPulse
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  content_count?: number
}

const getCategoryStyle = (name: string): { icon: React.ReactNode; colorClass: string } => {
  const n = name.toLowerCase()
  if (n.includes("science") || n.includes("physics") || n.includes("chemistry") || n.includes("bio"))
    return { icon: <Microscope className="w-6 h-6" />, colorClass: "cat-science" }
  if (n.includes("tech") || n.includes("computer") || n.includes("it") || n.includes("computing"))
    return { icon: <Laptop className="w-6 h-6" />, colorClass: "cat-it" }
  if (n.includes("math") || n.includes("calculus") || n.includes("algebra"))
    return { icon: <Calculator className="w-6 h-6" />, colorClass: "cat-science" }
  if (n.includes("language") || n.includes("english") || n.includes("nepali"))
    return { icon: <Globe className="w-6 h-6" />, colorClass: "cat-humanities" }
  if (n.includes("code") || n.includes("program") || n.includes("software"))
    return { icon: <Code className="w-6 h-6" />, colorClass: "cat-it" }
  if (n.includes("commerce") || n.includes("business") || n.includes("account") || n.includes("economics"))
    return { icon: <Briefcase className="w-6 h-6" />, colorClass: "cat-commerce" }
  if (n.includes("law") || n.includes("legal"))
    return { icon: <Scale className="w-6 h-6" />, colorClass: "cat-loksewa" }
  if (n.includes("engineering") || n.includes("civil") || n.includes("mechanical"))
    return { icon: <Building2 className="w-6 h-6" />, colorClass: "cat-science" }
  if (n.includes("medical") || n.includes("health") || n.includes("nursing"))
    return { icon: <HeartPulse className="w-6 h-6" />, colorClass: "cat-loksewa" }
  if (n.includes("loksewa") || n.includes("psc"))
    return { icon: <Lightbulb className="w-6 h-6" />, colorClass: "cat-loksewa" }
  return { icon: <GraduationCap className="w-6 h-6" />, colorClass: "cat-default" }
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) return null

  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-[#0f172a] dark:text-white">
            Explore Top Categories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Find materials for your class and university
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] mx-auto mt-4 rounded-full" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {categories.map((cat) => {
            const { icon, colorClass } = getCategoryStyle(cat.name)
            return (
              <motion.div key={cat.id} variants={item}>
                <Link href={`/explore/${cat.slug}`} className="block h-full group">
                  <div className="h-full p-5 rounded-2xl border border-border bg-card card-hover flex flex-col gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", colorClass)}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                      )}
                    </div>
                    <div className="mt-auto text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <BookOpen className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link href="/explore" className="text-sm font-semibold text-primary hover:underline">
            View all categories →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
