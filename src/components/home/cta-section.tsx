"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-violet-500/5 to-pink-500/10 dark:from-primary/20 dark:via-violet-500/10 dark:to-pink-500/15" />
      <div className="glow-bg top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            Free to get started
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Start learning smarter{" "}
            <span className="text-gradient">today.</span>
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Join over 50,000 Nepali students already using HamroLearning to ace their exams, find scholarships, and build their future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className={buttonVariants({
                size: "lg",
                className: "h-13 px-10 font-bold text-base shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-shadow animate-pulse-glow"
              })}
            >
              Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/explore"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-13 px-10 font-bold text-base glass-card"
              })}
            >
              Browse Resources
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            No credit card required. 100% free for all basic features.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
