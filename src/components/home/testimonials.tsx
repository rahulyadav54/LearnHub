"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SEE Student, Kathmandu",
    quote: "HamroLearning changed how I study. The AI Tutor explains concepts in Nepali and English which makes it so much easier to understand.",
    rating: 5,
    initials: "PS",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Bikash Thapa",
    role: "+2 Science, Pokhara",
    quote: "The mock tests are incredibly realistic. I scored 85% on my board exams after practicing here every day for 2 months.",
    rating: 5,
    initials: "BT",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Sita Adhikari",
    role: "BBS Student, Bhaktapur",
    quote: "I found 3 scholarship opportunities through HamroLearning that I never would have known about otherwise. My application was successful!",
    rating: 5,
    initials: "SA",
    color: "from-emerald-500 to-teal-400",
  },
  {
    name: "Roshan KC",
    role: "Loksewa Aspirant, Lalitpur",
    quote: "The quality of notes and question papers is exceptional. This platform is exactly what Nepal's students needed.",
    rating: 5,
    initials: "RK",
    color: "from-amber-500 to-orange-500",
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function Testimonials() {
  return (
    <section className="section-padding bg-background">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Student Stories</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Loved by students across Nepal
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thousands of students are achieving their academic goals with HamroLearning every day.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={item}>
              <div className="h-full p-6 rounded-2xl border border-border bg-card flex flex-col gap-4 card-hover relative overflow-hidden">
                {/* Quote icon */}
                <Quote className="w-6 h-6 text-primary/20 absolute top-4 right-4" />

                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
