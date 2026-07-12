import { resetPasswordForEmail } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-130px)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <form action={resetPasswordForEmail}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="student@example.com" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">Send Reset Link</Button>
            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
