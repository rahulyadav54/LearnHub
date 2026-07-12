import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'
import Image from 'next/image'

export function HeroSection() {
  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-sm font-medium mb-6">
              The Next Generation of Learning
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground leading-tight">
              Master your studies with precision.
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Access comprehensive notes, dynamic mock tests, and a dedicated AI Tutor. 
              Designed specifically for students who want a streamlined, focused academic experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/signup" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-12 px-8 font-semibold" })}>
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/explore" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto h-12 px-8 font-semibold" })}>
                <BookOpen className="mr-2 w-4 h-4" /> Browse Library
              </Link>
            </div>
          </div>

          <div className="hidden md:block relative w-full h-[450px] rounded-lg border border-border bg-card shadow-sm overflow-hidden">
             <Image 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                alt="Platform Preview" 
                fill
                className="object-cover"
                unoptimized
              />
          </div>
        </div>
      </div>
    </div>
  )
}
