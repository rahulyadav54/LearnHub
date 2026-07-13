"use client"

import { motion } from "framer-motion"
import { Sparkles, Bot, Brain, Trophy, ClipboardList, ArrowRight, MessageSquare, Check, Zap } from "lucide-react"

export function AIZayaAd() {
  const features = [
    {
      icon: Bot,
      title: "AI Chat Assistant",
      desc: "Ask any academic question and get step-by-step explanations instantly, 24/7.",
      color: "text-blue-500 bg-blue-500/10"
    },
    {
      icon: Sparkles,
      title: "Smart Study Tools",
      desc: "Generate customized flashcards, practice quizzes, and summaries from your text.",
      color: "text-violet-500 bg-violet-500/10"
    },
    {
      icon: Brain,
      title: "Cognitive Brain Games",
      desc: "Train your memory, speed, math, and logical thinking with engaging mini-games.",
      color: "text-pink-500 bg-pink-500/10"
    },
    {
      icon: ClipboardList,
      title: "Productivity Suite",
      desc: "Create AI notes, track assignments, and summarize long reading documents.",
      color: "text-emerald-500 bg-emerald-500/10"
    }
  ]

  // Conversation for the phone screen simulation
  const chatMessages = [
    { sender: "user", text: "Help me factor: x² - 5x + 6 = 0" },
    { sender: "zaya", text: "We find two numbers that multiply to 6 and add to -5. Those are -2 and -3!\n\nSo: (x - 2)(x - 3) = 0\nRoots: x = 2, 3 ✨" },
    { sender: "user", text: "Awesome! Let's do a quick Biology quiz" },
    { sender: "zaya", text: "Which organelle is known as the powerhouse of the cell?\n\n1. Nucleus\n2. Mitochondria\n3. Ribosome" }
  ]

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Text & Features */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> NEW MOBILE APP
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">AI ZAYA</span> <br />
                on your phone
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Take Nepal's smartest AI companion wherever you go. Study smarter, train your brain, and boost your daily productivity.
              </p>
            </motion.div>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex gap-4 p-4 rounded-2xl border border-border bg-card/50 hover:bg-card hover:shadow-md hover:border-indigo-500/20 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feat.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base group-hover:text-indigo-500 transition-colors duration-300">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-normal">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Google Play Store Download CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-6 pt-4"
            >
              <a
                id="ai-zaya-playstore-btn"
                href="https://play.google.com/store/apps/details?id=com.zayaai.app&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-zinc-950 dark:bg-zinc-900 hover:bg-zinc-900 dark:hover:bg-zinc-800 text-white px-8 py-4 rounded-2xl border border-zinc-800 transition-all shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 duration-300"
              >
                {/* Custom Google Play Logo SVG */}
                <svg className="w-7 h-7 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M2.86 3.5c-.22.13-.36.38-.36.65v15.7c0 .27.14.52.36.65L13.72 11.25 2.86 3.5z"/>
                  <path fill="#EA4335" d="M17.52 11.25L4.1 3.5c-.38-.22-.86-.22-1.24 0L13.72 14.36l3.8-3.11z"/>
                  <path fill="#FBBC05" d="M21.32 11.25a1.5 1.5 0 0 1 0 1.5l-3.8 1.9-3.8-3.4 3.8-3.4 3.8 3.4z"/>
                  <path fill="#34A853" d="M17.52 12.75l-3.8 3.11L2.86 20.5c.38.22.86.22 1.24 0l13.42-7.75z"/>
                </svg>
                <div className="text-left leading-none">
                  <span className="text-[10px] text-zinc-400 block font-medium uppercase tracking-wider mb-0.5">GET IT ON</span>
                  <span className="text-lg font-bold font-heading block">Google Play</span>
                </div>
              </a>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>4.8+ Rating on Play Store</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Premium Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
              className="relative w-full max-w-[320px] aspect-[9/18.5] bg-zinc-950 dark:bg-zinc-900 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-zinc-800/80 group perspective-1000"
            >
              {/* Phone Inner Shell */}
              <div className="relative w-full h-full bg-slate-950 rounded-[38px] overflow-hidden border border-zinc-900 flex flex-col">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <div className="w-8 h-1 bg-zinc-900 rounded-full" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                </div>

                {/* Simulated StatusBar */}
                <div className="h-9 px-6 pt-2.5 flex justify-between items-center text-[10px] font-semibold text-zinc-400 z-20 shrink-0">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c3.9 3.89 10.21 3.89 14.1 0l1.39-1.39C21.26 16.47 22 14.32 22 12c0-4.97-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 5H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-1 9H4v-2h12v2zm0-4H4V8h12v2z"/></svg>
                  </div>
                </div>

                {/* App Custom Header */}
                <div className="px-4 py-2 border-b border-zinc-900 bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                      Z
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none">AI ZAYA</h4>
                      <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-0.5 mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping inline-block" /> Online
                      </span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />
                  </div>
                </div>

                {/* Simulated Conversation Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none flex flex-col justify-end">
                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + idx * 0.4 }}
                      className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white self-end rounded-br-none"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-200 self-start rounded-bl-none font-medium"
                      }`}
                    >
                      {msg.text.split("\n").map((line, lIdx) => (
                        <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                          {line}
                        </p>
                      ))}
                    </motion.div>
                  ))}
                </div>

                {/* Simulated Footer/Input Bar */}
                <div className="p-3 border-t border-zinc-900 bg-slate-950 shrink-0">
                  <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3 py-2">
                    <span className="text-[10px] text-zinc-500 flex-1">Ask Zaya anything...</span>
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Widgets Outside Phone Frame for Aesthetic Depth */}
              {/* Brain Games Widget */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 12, delay: 1.2 }}
                className="absolute top-1/4 -right-10 bg-zinc-900/90 dark:bg-slate-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-3.5 shadow-xl w-36 hidden sm:block pointer-events-none"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] font-bold text-zinc-400">MATH BLITZ</span>
                </div>
                <div className="text-xs font-bold text-white">7 x 8 = 56</div>
                <div className="flex items-center gap-1 mt-2 text-[9px] text-emerald-400 font-semibold">
                  <Check className="w-3 h-3" /> Correct! +10xp
                </div>
              </motion.div>

              {/* Flashcard Widget */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 12, delay: 1.5 }}
                className="absolute bottom-1/4 -left-10 bg-zinc-900/90 dark:bg-slate-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-3.5 shadow-xl w-40 hidden sm:block pointer-events-none"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] font-bold text-purple-400 uppercase">Flashcard</span>
                </div>
                <div className="text-[11px] font-bold text-white leading-tight">Mitochondria</div>
                <div className="text-[10px] text-zinc-400 mt-1 leading-normal">
                  The primary organelle responsible for ATP generation.
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
