import Link from "next/link"
import { BarChart3, Users, BookOpen, FileText, LayoutGrid, GraduationCap, Image as ImageIcon } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Analytics", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Categories", href: "/admin/categories", icon: LayoutGrid },
    { name: "Subjects", href: "/admin/subjects", icon: BookOpen },
    { name: "Universities", href: "/admin/universities", icon: GraduationCap },
    { name: "Notes", href: "/admin/notes", icon: FileText },
    { name: "Question Papers", href: "/admin/question-papers", icon: FileText },
    { name: "Books", href: "/admin/books", icon: BookOpen },
    { name: "Blogs", href: "/admin/blogs", icon: ImageIcon },
    { name: "Scholarships", href: "/admin/scholarships", icon: GraduationCap },
  ]

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed hidden w-64 flex-col border-r bg-background sm:flex min-h-screen z-10 pt-16">
        <div className="flex flex-col gap-2 p-4">
          <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-primary"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:pl-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
