"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-clay-50 via-white to-ink-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-clay-200/30 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-clay-200 bg-white px-4 py-1.5 text-sm font-medium text-clay-800 mb-6 shadow-sm">
          <Sparkles className="h-4 w-4 text-clay-600" />
          Ready to streamline your committee?
        </div>

        {/* Heading */}
        <h2 className="heading-1 text-ink-900 mb-4">
          Start governing with excellence
        </h2>
        <p className="body-large text-ink-600 mb-8 max-w-2xl mx-auto">
          Join committees already using SCOS to manage operations, track activities, and generate reports with ease.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-clay-700 text-white hover:bg-clay-800 shadow-lg shadow-clay-700/20 h-12 px-8 text-base"
            >
              Access Platform
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="border-ink-300 text-ink-700 hover:bg-ink-50 h-12 px-8 text-base"
            >
              Request Information
            </Button>
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-sm text-ink-500">
          Already a member?{" "}
          <Link href="/login" className="text-clay-700 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
