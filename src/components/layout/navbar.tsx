import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { GlobalSearch } from "@/components/global-search"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { createClient } from "@/utils/supabase/server"
import { UserCircle } from "lucide-react"

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl hidden sm:inline-block">HamroLearning</span>
        </Link>
        <div className="flex flex-1 items-center space-x-4 justify-end md:justify-between">
          <div className="w-full max-w-lg hidden md:block">
            <GlobalSearch />
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <NotificationBell userId={user.id} />
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <UserCircle className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
