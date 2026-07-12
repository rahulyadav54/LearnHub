"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { GlobalSearch } from "@/components/global-search"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/notifications/notification-bell"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  UserCircle,
  Menu,
  GraduationCap,
  FlaskConical,
  Brain,
  Award,
  Newspaper,
  BookOpen,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"
import { useState } from "react"

const navLinks = [
  { label: "Explore", href: "/explore", icon: GraduationCap },
  { label: "Mock Tests", href: "/mock-tests", icon: FlaskConical },
  { label: "AI Tutor", href: "/tutor", icon: Brain },
  { label: "Scholarships", href: "/scholarships", icon: Award },
  { label: "Blogs", href: "/blogs", icon: Newspaper },
]

export function NavbarClient({ user }: { user: User | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:block" style={{ fontFamily: "var(--font-heading)" }}>
            HamroLearning
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 mr-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Search + Actions */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden md:block w-full max-w-xs lg:max-w-sm">
            <GlobalSearch />
          </div>

          <ModeToggle />

          {user ? (
            <div className="flex items-center gap-1">
              <NotificationBell userId={user.id} />
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-sm font-medium shadow-md shadow-primary/25">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 border-b border-border">
                  <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                      HamroLearning
                    </span>
                  </Link>
                </div>

                {/* Mobile Search */}
                <div className="p-4 border-b border-border">
                  <GlobalSearch />
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Home className="w-4 h-4" /> Home
                  </Link>
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile Auth */}
                <div className="p-4 border-t border-border space-y-2">
                  {user ? (
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      <Button className="w-full" variant="outline">
                        <UserCircle className="w-4 h-4 mr-2" /> My Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button className="w-full" variant="outline">Log In</Button>
                      </Link>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        <Button className="w-full">Get Started Free</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
