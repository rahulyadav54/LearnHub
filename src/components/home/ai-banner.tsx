import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { Bot, CheckCircle } from 'lucide-react'

export function AIBanner() {
  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">AI-Powered Academic Assistant</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience personalized learning with our integrated AI Tutor. Built on Gemini infrastructure, it provides immediate, contextual help for your exact coursework.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Available 24/7 for instant Q&A.</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Bilingual support (English & Nepali).</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Automatic flashcard and summary generation.</span>
              </li>
            </ul>

            <Link href="/tutor" className={buttonVariants({ size: "lg", className: "h-12 px-8 font-semibold" })}>
              <Bot className="mr-2 w-5 h-5" /> Launch AI Tutor
            </Link>
          </div>
          
          <div className="border border-border bg-background rounded-lg p-6 shadow-sm flex flex-col gap-4 relative">
            <div className="absolute -top-3 left-6 bg-background px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Simulation</div>
            
            <div className="bg-muted text-muted-foreground p-4 rounded-md self-end max-w-[85%] text-sm">
              Can you explain how Dijkstra&apos;s algorithm works in simple terms?
            </div>
            
            <div className="bg-primary/5 border border-primary/10 text-foreground p-4 rounded-md self-start max-w-[90%] text-sm leading-relaxed">
              <strong>Dijkstra&apos;s Algorithm</strong> finds the shortest path between nodes in a graph. Imagine you&apos;re looking for the quickest route on a map...
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
