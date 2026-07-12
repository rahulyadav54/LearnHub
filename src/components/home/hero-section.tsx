"use client"

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <div className="relative bg-background border-b border-border overflow-hidden">
      {/* Background Glows */}
      <div className="glow-bg absolute top-0 left-1/4 w-[500px] h-[500px]" />
      <div className="glow-bg absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 delay-1000" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4" /> The Next Generation of Learning
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Master your studies with <span className="text-gradient">precision.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Access comprehensive notes, dynamic mock tests, and a dedicated AI Tutor. 
              Designed specifically for students who want a streamlined, focused academic experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/signup" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-12 px-8 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" })}>
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/explore" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto h-12 px-8 font-semibold glass-card" })}>
                <BookOpen className="mr-2 w-4 h-4" /> Browse Library
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden md:block relative w-full h-[500px] rounded-2xl glass p-2 overflow-hidden shadow-2xl"
            style={{ perspective: "1000px" }}
          >
             <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 bg-black/40">
               <Image 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                  alt="Platform Preview" 
                  fill
                  className="object-cover opacity-80 mix-blend-overlay hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card p-6 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">AI Tutor Active</div>
                      <div className="text-sm text-muted-foreground">Ready to help you study</div>
                    </div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
