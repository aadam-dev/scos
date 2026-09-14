import Link from "next/link";
import { signIn, signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ArrowLeft, Shield, Users, FileText } from "lucide-react";

type LoginPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { message } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50">
      <div className="absolute left-4 top-4 z-10 md:left-6 md:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        <div className="gradient-hero pattern-diamond relative hidden flex-col justify-between p-12 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-500/15 via-transparent to-transparent" />

          <div className="relative">
            <BrandLogo href="/" size="lg" tone="dark" />
          </div>

          <div className="relative max-w-lg">
            <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-tight">
              Your committee workspace
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-brand-100/90">
              Sign in to manage meetings, log activities, and download reports for your roster.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-brand-200">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Roster access</p>
                  <p className="text-sm text-brand-100/70">Roles for members, chairs, and secretaries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-brand-200">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Meetings and minutes</p>
                  <p className="text-sm text-brand-100/70">Attendance, agendas, structured notes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-brand-200">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Private by default</p>
                  <p className="text-sm text-brand-100/70">Committee data scoped with row-level security</p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative text-sm text-brand-200/70">
            &copy; {new Date().getFullYear()} SCOS
          </p>
        </div>

        <div className="flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md border-ink-200 shadow-xl shadow-brand-900/5">
            <CardHeader className="space-y-1 pb-6">
              <div className="mb-4 flex justify-center lg:hidden">
                <BrandLogo href="/" size="md" showWordmark={false} />
              </div>
              <CardTitle className="text-center text-2xl font-semibold tracking-tight">
                Sign in
              </CardTitle>
              <CardDescription className="text-center">
                Use the Google account on your committee roster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {message ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {message}
                </div>
              ) : null}

              <form action={signInWithGoogle}>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-brand-600 text-white shadow-md hover:bg-brand-700"
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

              <div className="rounded-lg border border-brand-100 bg-brand-50/60 px-4 py-3">
                <p className="text-sm text-ink-600">
                  <span className="font-medium text-ink-900">Roster required.</span> If sign-in
                  fails, ask your chair or secretary to confirm your Gmail is listed.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-ink-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-ink-500">Or</span>
                </div>
              </div>

              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-ink-700 transition-colors hover:text-brand-700">
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
                      className="border-ink-300 focus-visible:ring-brand-500"
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
                      className="border-ink-300 focus-visible:ring-brand-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full border-ink-300 text-ink-700 hover:bg-brand-50"
                  >
                    Sign in
                  </Button>
                </form>
              </details>

              <div className="flex items-center justify-center gap-4 text-sm">
                <Link href="/help" className="text-ink-500 transition-colors hover:text-brand-700">
                  Help
                </Link>
                <span className="text-ink-300">|</span>
                <Link
                  href="/membership"
                  className="text-ink-500 transition-colors hover:text-brand-700"
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
