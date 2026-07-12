"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Users, BookOpen, FlaskConical, Award } from "lucide-react"

const stats = [
  { label: "Active Students", value: 50000, suffix: "+", icon: Users, color: "text-blue-500" },
  { label: "Study Notes", value: 2000, suffix: "+", icon: BookOpen, color: "text-violet-500" },
  { label: "Mock Tests", value: 500, suffix: "+", icon: FlaskConical, color: "text-emerald-500" },
  { label: "Scholarships", value: 100, suffix: "+", icon: Award, color: "text-amber-500" },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsBar() {
  return (
    <section className="py-10 border-y border-border bg-muted/20">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 md:gap-4"
              >
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-foreground leading-none">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
