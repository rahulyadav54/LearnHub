import Link from "next/link"
import { BookOpen, ExternalLink, Share2, Play, Camera, MapPin, Mail } from "lucide-react"

const footerLinks = {
  platform: [
    { label: "Explore Resources", href: "/explore" },
    { label: "AI Tutor", href: "/tutor" },
    { label: "Mock Tests", href: "/mock-tests" },
    { label: "MCQ Practice", href: "/practice" },
    { label: "Scholarships", href: "/scholarships" },
  ],
  resources: [
    { label: "Study Notes", href: "/explore" },
    { label: "Question Papers", href: "/explore" },
    { label: "Blogs & Articles", href: "/blogs" },
    { label: "Career Guidance", href: "/blogs" },
  ],
  company: [
    { label: "About Us", href: "/" },
    { label: "Contact", href: "/" },
    { label: "Privacy Policy", href: "/" },
    { label: "Terms of Service", href: "/" },
  ],
}

const socialLinks = [
  { icon: Share2, href: "#", label: "Facebook" },
  { icon: ExternalLink, href: "#", label: "Twitter/X" },
  { icon: Play, href: "#", label: "YouTube" },
  { icon: Camera, href: "#", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                HamroLearning
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Nepal&apos;s most modern AI-powered education platform. Built for SEE, +2, Bachelors, and Loksewa aspirants.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Kathmandu, Nepal 🇳🇵</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>hello@hamrolearning.com.np</span>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HamroLearning Nepal. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with ❤️ in</span>
            <span className="font-semibold text-foreground">Nepal 🇳🇵</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
