import Link from "next/link";
import { signIn, signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hexagon, ArrowLeft, Shield, Users, FileText } from "lucide-react";

 type LoginPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { message } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50">
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4 z-10 md:top-6 md:left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-clay-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        {/* Left Side - Brand Message */}
        <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 p-12 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-clay-800/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

          <div className="relative">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-clay-600 to-clay-500 text-white shadow-lg">
                <Hexagon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-400">
                  International Open University
                </p>
                <p className="text-lg font-semibold tracking-tight">SCOS</p>
              </div>
            </Link>
          </div>

          <div className="relative max-w-lg">
            <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-tight">
              Governance excellence for Student Committees
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-ink-400">
              Access your committee workspace, track activities, manage meetings, and generate
              professional reports.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-clay-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Committee Management</p>
                  <p className="text-sm text-ink-500">Rosters, roles, and member analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-clay-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Meeting Intelligence</p>
                  <p className="text-sm text-ink-500">Minutes, attendance, and reminders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-clay-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Secure & Private</p>
                  <p className="text-sm text-ink-500">Enterprise-grade data protection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <p className="text-sm text-ink-500">
              &copy; {new Date().getFullYear()} SCOS. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md border-ink-200 shadow-xl shadow-ink-900/5">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-clay-700 to-clay-600 text-white shadow-md">
                  <Hexagon className="h-6 w-6" strokeWidth={2.5} />
                </div>
              </div>
              <CardTitle className="text-center text-2xl font-semibold tracking-tight">
                Sign in to SCOS
              </CardTitle>
              <CardDescription className="text-center">
                Continue with your Google account to access your committee workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Message Banner */}
              {message ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {message}
                </div>
              ) : null}

              {/* Google Sign In */}
              <form action={signInWithGoogle}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-clay-700 text-white hover:bg-clay-800 shadow-md"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </form>

              {/* Info Box */}
              <div className="rounded-lg border border-ink-200 bg-ink-50/50 px-4 py-3">
                <p className="text-sm text-ink-600">
                  <span className="font-medium text-ink-900">Important:</span> Your Gmail must be
                  on your committee&apos;s roster. Contact your chair or secretary if you need
                  access.
                </p>
              </div>

              {/* Alternative Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-ink-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-ink-500">Or continue with</span>
                </div>
              </div>

              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-ink-700 transition-colors hover:text-clay-700">
                  <span>Email and password</span>
                  <svg
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <form action={signIn} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-ink-700">
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="border-ink-300 focus-visible:ring-clay-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-ink-700">
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="border-ink-300 focus-visible:ring-clay-600"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full border-ink-300 text-ink-700 hover:bg-ink-50"
                  >
                    Sign In
                  </Button>
                </form>
              </details>

              {/* Help Links */}
              <div className="flex items-center justify-center gap-4 text-sm">
                <Link
                  href="/help"
                  className="text-ink-500 transition-colors hover:text-clay-700"
                >
                  Need help?
                </Link>
                <span className="text-ink-300">|</span>
                <Link
                  href="/membership"
                  className="text-ink-500 transition-colors hover:text-clay-700"
                >
                  Request access
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
