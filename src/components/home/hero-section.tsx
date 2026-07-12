"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, BookOpen, Brain, GraduationCap, FileCheck, Compass } from "lucide-react"

export function HeroSection() {
  const categories = [
    {
      title: "Study Materials",
      desc: "Notes, Books, PDFs",
      icon: BookOpen,
      bg: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
      href: "/explore"
    },
    {
      title: "AI Tutor",
      desc: "Learn with AI",
      icon: Brain,
      bg: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
      href: "/tutor"
    },
    {
      title: "Mock Tests",
      desc: "Practice & Improve",
      icon: FileCheck,
      bg: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
      href: "/mock-tests"
    },
    {
      title: "Scholarships",
      desc: "Find & Apply",
      icon: GraduationCap,
      bg: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
      href: "/scholarships"
    },
    {
      title: "Career Guidance",
      desc: "Plan Your Future",
      icon: Compass,
      bg: "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
      href: "/blogs"
    }
  ]

  const avatars = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=100&h=100&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80"
  ]

  return (
    <div className="relative bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/40 to-background dark:from-background dark:to-background overflow-hidden border-b border-border">
      {/* Light background dot pattern or grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 dark:opacity-10 pointer-events-none" />

      {/* Glow backgrounds */}
      <div className="glow-bg absolute top-[-10%] right-[-10%] w-[600px] h-[600px]" />
      <div className="glow-bg absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/10" />

      <div className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl lg:text-[70px] font-extrabold tracking-tight text-[#0f172a] dark:text-white leading-[1.1] mb-6">
                Learn Today,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#7c3aed]">
                  Lead Tomorrow.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#475569] dark:text-[#94a3b8] mb-8 leading-relaxed font-medium">
                Hamro Learning is Nepal&apos;s all-in-one education platform for students preparing for SEE, +2, Bachelor, TU, KU, CTEVT and more.
              </p>

              {/* Input Search Box */}
              <div className="relative flex items-center bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] p-2 rounded-2xl md:rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none max-w-xl mb-8 group hover:border-[#cbd5e1] transition-all">
                <Search className="w-6 h-6 text-[#94a3b8] ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search notes, books, question papers..."
                  className="w-full bg-transparent px-3 py-3 outline-none text-[#0f172a] dark:text-white text-base placeholder:text-[#94a3b8]"
                />
                <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 md:px-8 py-3 rounded-xl md:rounded-2xl font-bold transition-all shadow-md shadow-blue-500/20 shrink-0">
                  Search
                </button>
              </div>

              {/* Trusted Students Stack */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3 overflow-hidden">
                  {avatars.map((url, i) => (
                    <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-background overflow-hidden relative bg-muted">
                      <Image
                        src={url}
                        alt="Student"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-[#475569] dark:text-[#94a3b8]">
                  Trusted by <span className="text-[#2563eb] font-bold">100K+</span> students across Nepal
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Vector Illustration Column */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative w-full max-w-[480px] aspect-square flex justify-center items-center"
            >
              <Image
                src="/logo.png"
                alt="Hamro Learning Illustration"
                width={480}
                height={480}
                className="object-contain"
                priority
                unoptimized
              />
            </motion.div>
          </div>
        </div>

        {/* Categories Bar Card Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/60 dark:shadow-none grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 divide-y md:divide-y-0 lg:divide-x divide-[#e2e8f0] dark:divide-[#334155]"
        >
          {categories.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center gap-4 pt-4 md:pt-0 lg:px-4 transition-all duration-300 first:pt-0"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a] dark:text-white group-hover:text-[#2563eb] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5 leading-tight">
                    {item.desc}
                  </p>
                </div>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
