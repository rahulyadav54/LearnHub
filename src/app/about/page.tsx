import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Users, Sparkles, Award, Globe, Heart, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us | HamroLearning Nepal",
  description: "Learn about HamroLearning Nepal — Nepal's most modern AI-powered education platform built for SEE, +2, Bachelors, Masters, and Loksewa aspirants.",
  keywords: ["about HamroLearning", "HamroLearning Nepal story", "Nepal education platform", "AI education Nepal", "Nepali edtech company"],
  alternates: {
    canonical: "/about",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hamrolearning.com" },
    { "@type": "ListItem", position: 2, name: "About Us", item: "https://www.hamrolearning.com/about" },
  ],
}

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About HamroLearning Nepal",
  description: "HamroLearning Nepal is Nepal's most modern AI-powered education platform for SEE, +2, Bachelors, Masters, and Loksewa aspirants.",
  url: "https://www.hamrolearning.com/about",
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />

      <div className="section-padding">
        <div className="section-container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            About HamroLearning Nepal
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            Nepal&apos;s most modern AI-powered education platform, built to transform the way students in Nepal learn, practice, and succeed.
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" /> Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At HamroLearning Nepal, our mission is to democratize access to quality education across Nepal. We believe every student — whether in a remote village of Karnali or a bustling school in Kathmandu — deserves access to world-class study materials, intelligent tutoring, and exam preparation tools. We bridge the gap between traditional classroom learning and modern digital education by providing free, comprehensive academic resources tailored to the Nepali curriculum.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" /> Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We envision a Nepal where every student has the tools to reach their full potential — regardless of their geographic location, socioeconomic background, or the resources available at their school. By 2030, we aim to become the largest digital education ecosystem in South Asia, serving over 1 million students with AI-driven personalized learning experiences.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary" /> What We Offer
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                <li><strong>Free Study Materials</strong> — Thousands of notes, past question papers, and recommended books for SEE, +2, Bachelors, Masters, TU, KU, CTEVT, and Loksewa exams.</li>
                <li><strong>AI-Powered Tutor</strong> — An intelligent, bilingual (English & Nepali) AI assistant available 24/7 to answer questions, explain concepts, and generate study summaries.</li>
                <li><strong>Mock Tests & Online Exams</strong> — Realistic test simulations with strict timers, negative marking, and competitive global rankings.</li>
                <li><strong>Interactive MCQ Practice</strong> — Thousands of practice questions with instant feedback, progress tracking, and leaderboard competition.</li>
                <li><strong>Scholarship Portal</strong> — A comprehensive database of government, private, and international scholarships for Nepali students.</li>
                <li><strong>Career Guidance</strong> — Expert blog articles, study tips, career counseling, and educational news curated for Nepali students.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Globe className="w-8 h-8 text-primary" /> Our Impact
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Since our inception, HamroLearning Nepal has reached students across all 77 districts of Nepal. Our platform has helped thousands of students achieve better results in their SEE, +2, and entrance examinations.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Active Students", value: "50,000+", icon: Users },
                  { label: "Study Notes", value: "2,000+", icon: BookOpen },
                  { label: "Mock Tests Taken", value: "500+", icon: Award },
                  { label: "Districts Covered", value: "77", icon: Globe },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="p-4 rounded-xl border border-border bg-muted/20 text-center">
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-extrabold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" /> Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-muted/20">
                  <h3 className="font-bold text-lg mb-2">Accessibility First</h3>
                  <p className="text-sm text-muted-foreground">Quality education should not be a luxury. Our core platform features are free for all Nepali students.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-muted/20">
                  <h3 className="font-bold text-lg mb-2">Innovation Driven</h3>
                  <p className="text-sm text-muted-foreground">We leverage cutting-edge AI and technology to create learning experiences that are engaging, personalized, and effective.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-muted/20">
                  <h3 className="font-bold text-lg mb-2">Community Centered</h3>
                  <p className="text-sm text-muted-foreground">We listen to our students, educators, and parents to build features that genuinely help the Nepali education community.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-muted/20">
                  <h3 className="font-bold text-lg mb-2">Integrity & Trust</h3>
                  <p className="text-sm text-muted-foreground">We maintain the highest standards of data privacy, content quality, and honest communication with our users.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                HamroLearning Nepal was born from a simple observation: Nepali students lack a centralized, modern platform to access quality study materials for their exams. Despite the abundance of knowledge available online, finding reliable, curriculum-aligned content for Nepali academic levels (SEE, +2, Bachelors, TU, KU, CTEVT) remained a challenge.
                Founded in Kathmandu, our team of educators, engineers, and designers set out to build a platform that combines the best of traditional Nepali education with modern technology. Today, HamroLearning serves students across Nepal with AI-powered tools, comprehensive study libraries, and a supportive community — all for free.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Code2 className="w-8 h-8 text-primary" /> Zaya Code Hub
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                HamroLearning is proudly designed, built, and maintained by <strong>Zaya Code Hub</strong>, the parent technology company. Zaya Code Hub is the driving force behind this platform, focusing on creating advanced digital solutions that foster learning, growth, and educational accessibility. By bridging modern technology with custom curriculum needs, Zaya Code Hub remains committed to empowering the next generation of learners in Nepal.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                Have questions, suggestions, or partnership opportunities? We&apos;d love to hear from you.
              </p>
              <div className="mt-4 p-6 rounded-xl border border-border bg-muted/20">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Email:</strong> support@hamrolearning.com
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Location:</strong> Kathmandu, Nepal
                </p>
                <Link href="/contact" className="inline-block mt-4">
                  <Button>Send us a Message</Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
