import { signup, signInWithGoogle } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'

export default function SignupPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-4 bg-[#f8fafc] dark:bg-slate-950 overflow-hidden">
      {/* Background abstract grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 dark:opacity-10 pointer-events-none" />

      {/* Decorative gradient glow orbs */}
      <div className="glow-bg absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 pointer-events-none" />
      <div className="glow-bg absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-violet-500/10 to-pink-500/10 pointer-events-none" />

      {/* Signup Card */}
      <div className="w-full max-w-[460px] p-8 md:p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[32px] shadow-2xl shadow-slate-100 dark:shadow-none relative z-10">
        <form action={signup}>
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="relative w-14 h-14 flex items-center justify-center animate-float">
              <Image
                src="/logo.png"
                alt="Hamro Learning Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Join Nepal&apos;s most modern AI learning platform.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Ram Bahadur"
                required
                className="h-11 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@example.com"
                required
                className="h-11 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="h-11 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                I am a...
              </Label>
              <select
                id="role"
                name="role"
                className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="student" className="bg-background text-slate-900 dark:text-white">Student</option>
                <option value="teacher" className="bg-background text-slate-900 dark:text-white">Teacher</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5"
            >
              Sign Up
            </Button>

            <Button
              formAction={signInWithGoogle}
              variant="outline"
              className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
            >
              <svg className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Footer redirects */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-[#2563eb] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
