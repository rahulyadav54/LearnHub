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
  ChevronDown,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import Image from "next/image"

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Study Materials", href: "/explore", icon: BookOpen, hasDropdown: true },
  { label: "AI Tutor", href: "/tutor", icon: Brain },
  { label: "Mock Tests", href: "/mock-tests", icon: FlaskConical },
  { label: "Scholarships", href: "/scholarships", icon: Award },
  { label: "Blog", href: "/blogs", icon: Newspaper },
  { label: "More", href: "#", icon: ChevronDown, hasDropdown: true },
]

export function NavbarClient({ user }: { user: User | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-background">
      <div className="container mx-auto flex h-20 items-center px-4 md:px-6 max-w-7xl justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image 
            src="/logo.png" 
            alt="Hamro Learning Logo" 
            width={48} 
            height={48} 
            className="object-contain"
            unoptimized
          />
          <div className="text-xl font-bold flex items-center tracking-tight">
            <span className="text-[#0f172a] dark:text-white">Hamro</span>
            <span className="text-[#2563eb] dark:text-[#3b82f6] ml-1">Learning</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1 text-[#334155] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-white",
                  isActive && "text-[#2563eb] dark:text-white"
                )}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-4 h-4 opacity-70" />}
                {isActive && link.href === "/" && (
                  <span className="absolute bottom-[-18px] left-4 right-4 h-[3px] bg-[#2563eb] rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side: Search, Theme, Auth */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <button className="p-2 rounded-full hover:bg-muted text-[#475569] dark:text-[#94a3b8] transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <ModeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              <NotificationBell userId={user.id} />
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="rounded-xl border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb]/5 px-6 font-semibold h-11"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  className="rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 font-semibold shadow-md shadow-blue-500/20 h-11"
                >
                  Sign Up
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
