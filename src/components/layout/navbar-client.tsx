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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
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
  PlayCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import Image from "next/image"

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Courses", href: "/courses", icon: PlayCircle },
  { label: "Study Materials", href: "/explore", icon: BookOpen, hasDropdown: true },
  { label: "AI Tutor", href: "/tutor", icon: Brain },
  { label: "Mock Tests", href: "/mock-tests", icon: FlaskConical },
  { label: "Scholarships", href: "/scholarships", icon: Award },
  { label: "Blog", href: "/blogs", icon: Newspaper },
]

const dropdownItems: Record<string, { label: string; href: string }[]> = {
  "Study Materials": [
    { label: "SEE", href: "/explore?level=SEE" },
    { label: "+2 Science", href: "/explore?level=%2B2%20Science" },
    { label: "+2 Management", href: "/explore?level=%2B2%20Management" },
    { label: "Bachelors", href: "/explore?level=Bachelors" },
    { label: "Masters", href: "/explore?level=Masters" },
    { label: "Loksewa", href: "/explore?level=Loksewa" },
  ],
  "More": [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
  ]
}

const seeProvinces = [
  { label: "Koshi Province", href: "/explore?level=SEE&province=Koshi" },
  { label: "Madhesh Province", href: "/explore?level=SEE&province=Madhesh" },
  { label: "Bagmati Province", href: "/explore?level=SEE&province=Bagmati" },
  { label: "Gandaki Province", href: "/explore?level=SEE&province=Gandaki" },
  { label: "Lumbini Province", href: "/explore?level=SEE&province=Lumbini" },
  { label: "Karnali Province", href: "/explore?level=SEE&province=Karnali" },
  { label: "Sudurpashchim Province", href: "/explore?level=SEE&province=Sudurpashchim" },
]

export function NavbarClient({ user }: { user: User | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mobileStudyOpen, setMobileStudyOpen] = useState(false)
  const [mobileSeeOpen, setMobileSeeOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6 max-w-7xl justify-between">
        {/* Left side: Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Hamro Learning Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
              Hamro <span className="text-[#2563eb]">Learning</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              const items = dropdownItems[link.label]

              if (link.hasDropdown && items) {
                return (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger
                      className={cn(
                        "relative px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1 text-[#334155] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-white outline-hidden cursor-pointer",
                        isActive && "text-[#2563eb] dark:text-white"
                      )}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-card border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xl">
                      {items.map((item) => {
                        if (item.label === "SEE") {
                          return (
                            <DropdownMenuSub key={item.label}>
                              <DropdownMenuSubTrigger className="cursor-pointer px-3 py-2 text-sm font-semibold rounded-lg hover:bg-muted text-foreground transition-all flex items-center justify-between w-full">
                                {item.label}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-56 bg-card border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xl">
                                {seeProvinces.map((prov) => (
                                  <Link key={prov.label} href={prov.href} className="w-full">
                                    <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm font-semibold rounded-lg hover:bg-muted text-foreground transition-all">
                                      {prov.label}
                                    </DropdownMenuItem>
                                  </Link>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          )
                        }

                        return (
                          <Link key={item.label} href={item.href} className="w-full">
                            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm font-semibold rounded-lg hover:bg-muted text-foreground transition-all">
                              {item.label}
                            </DropdownMenuItem>
                          </Link>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

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
                  {isActive && link.href === "/" && (
                    <span className="absolute bottom-[-18px] left-4 right-4 h-[3px] bg-[#2563eb] rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

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
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden" />
              }
            >
              <Menu className="w-5 h-5" />
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
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)

                    if (link.hasDropdown && link.label === "Study Materials") {
                      const items = dropdownItems[link.label]
                      return (
                        <div key={link.label} className="space-y-1">
                          <button
                            onClick={() => setMobileStudyOpen(!mobileStudyOpen)}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer",
                              mobileStudyOpen && "bg-muted text-foreground"
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <Icon className="w-4 h-4" />
                              {link.label}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", mobileStudyOpen && "rotate-180")} />
                          </button>

                          {mobileStudyOpen && items && (
                            <div className="pl-6 space-y-1 mt-1 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                              {items.map((item) => {
                                if (item.label === "SEE") {
                                  return (
                                    <div key={item.label} className="space-y-1">
                                      <button
                                        onClick={() => setMobileSeeOpen(!mobileSeeOpen)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-[#334155] dark:text-[#94a3b8] hover:bg-muted/50 hover:text-foreground cursor-pointer",
                                          mobileSeeOpen && "text-primary dark:text-white"
                                        )}
                                      >
                                        <span>{item.label}</span>
                                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", mobileSeeOpen && "rotate-180")} />
                                      </button>

                                      {mobileSeeOpen && (
                                        <div className="pl-4 space-y-1 mt-1 border-l border-slate-100 dark:border-slate-800 ml-4">
                                          {seeProvinces.map((prov) => (
                                            <Link
                                              key={prov.label}
                                              href={prov.href}
                                              onClick={() => {
                                                setOpen(false)
                                                setMobileStudyOpen(false)
                                                setMobileSeeOpen(false)
                                              }}
                                              className="block px-4 py-2 rounded-md text-xs font-semibold text-[#475569] dark:text-[#94a3b8] hover:bg-muted hover:text-foreground transition-all"
                                            >
                                              {prov.label}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )
                                }

                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => {
                                      setOpen(false)
                                      setMobileStudyOpen(false)
                                    }}
                                    className="block px-4 py-2 rounded-lg text-sm font-semibold text-[#334155] dark:text-[#94a3b8] hover:bg-muted/50 hover:text-foreground transition-all"
                                  >
                                    {item.label}
                                  </Link>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={link.label}
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
