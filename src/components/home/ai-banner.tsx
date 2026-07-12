"use client"

import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { Bot, CheckCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function AIBanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 border-y border-border" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" /> Core Feature
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              AI-Powered <br/> <span className="text-gradient">Academic Assistant</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Experience personalized learning with our integrated AI Tutor. Built on Gemini infrastructure, it provides immediate, contextual help for your exact coursework.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                "Available 24/7 for instant Q&A.",
                "Bilingual support (English & Nepali).",
                "Automatic flashcard and summary generation."
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <Link href="/tutor" className={buttonVariants({ size: "lg", className: "h-12 px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" })}>
              <Bot className="mr-2 w-5 h-5" /> Launch AI Tutor
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
              Simulation
            </div>
            
            <div className="flex flex-col gap-6 mt-4 relative z-10">
              <div className="bg-background/80 backdrop-blur-sm border border-border text-foreground p-4 rounded-xl self-end max-w-[85%] text-sm shadow-sm">
                Can you explain how Dijkstra&apos;s algorithm works in simple terms?
              </div>
              
              <div className="bg-primary/10 border border-primary/20 text-foreground p-4 rounded-xl self-start max-w-[90%] text-sm leading-relaxed shadow-sm">
                <strong>Dijkstra&apos;s Algorithm</strong> finds the shortest path between nodes in a graph. Imagine you&apos;re looking for the quickest route on a map...
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
