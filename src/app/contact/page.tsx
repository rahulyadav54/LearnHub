import type { Metadata } from "next"
import { createClient } from '@/utils/supabase/server'
import Link from "next/link"
import { ArrowLeft, Mail, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitContactMessage } from "@/app/actions/contact-actions"

export const metadata: Metadata = {
  title: "Contact Us | HamroLearning Nepal",
  description: "Contact HamroLearning Nepal for support, partnerships, or general inquiries. Reach our team in Kathmandu, Nepal.",
  keywords: ["contact HamroLearning", "HamroLearning Nepal support", "Nepal education support", "HamroLearning email", "HamroLearning address"],
  alternates: {
    canonical: "/contact",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hamrolearning.com" },
    { "@type": "ListItem", position: 2, name: "Contact Us", item: "https://www.hamrolearning.com/contact" },
  ],
}

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="section-padding">
        <div className="section-container max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                  Contact Us
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Have a question, need support, or want to partner with us? We&apos;d love to hear from you.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Email</p>
                      <p className="text-sm text-muted-foreground">support@hamrolearning.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Address</p>
                      <p className="text-sm text-muted-foreground">Lazimpat, Kathmandu<br/>Nepal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Response Time:</strong> We typically respond within 24–48 hours. For urgent issues, please email us directly.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={submitContactMessage} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" name="subject" placeholder="How can we help?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" name="message" placeholder="Tell us more..." rows={6} required />
                    </div>
                    <Button type="submit" size="lg" className="w-full gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
