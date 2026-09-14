"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-brand-700 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="kente-divider absolute inset-x-0 top-0 opacity-80" />
      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Get involved with Ghana SC
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-brand-100">
              Apply for a local internship interest slot, join an outreach shift for service hours,
              or sign in if you are already on the Accra roster.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <Link href="/internships">
              <Button
                size="lg"
                className="h-12 w-full border-0 bg-white px-6 text-base text-brand-800 hover:bg-brand-50"
              >
                Internship interest
              </Button>
            </Link>
            <Link href="/webinars">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-brand-300 bg-transparent px-6 text-base text-white hover:bg-brand-600"
              >
                SC webinars board
              </Button>
            </Link>
            <Link href="/outreach">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-brand-300 bg-transparent px-6 text-base text-white hover:bg-brand-600"
              >
                Outreach openings
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="ghost"
                className="h-12 w-full px-6 text-base text-white hover:bg-brand-600"
              >
                Member sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
