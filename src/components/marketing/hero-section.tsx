"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Hexagon, Calendar, Users, FileText, BarChart3 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-clay-100/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23cbd5e1%22%20fill-opacity%3D%220.2%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-clay-200 bg-clay-50 px-3 py-1 text-xs font-medium text-clay-800 mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-clay-600" />
              Built for IOU Student Committees
            </div>

            {/* Headline */}
            <h1 className="heading-hero text-ink-900 mb-6">
              Governance{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay-700 to-clay-500">
                Excellence
              </span>{" "}
              for Student Committees
            </h1>

            {/* Subtitle */}
            <p className="body-large text-ink-600 mb-8 max-w-xl">
              SCOS streamlines committee operations, from meeting management to activity tracking and report generation. Purpose-built for the International Open University ecosystem.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-clay-700 text-white hover:bg-clay-800 shadow-lg shadow-clay-700/20 h-12 px-6 text-base"
                >
                  Access Platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-ink-300 text-ink-700 hover:bg-ink-50 h-12 px-6 text-base"
                >
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 text-sm text-ink-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-clay-100 text-xs font-medium text-clay-800 border-2 border-white">
                    AC
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-200 text-xs font-medium text-ink-800 border-2 border-white">
                    +3
                  </div>
                </div>
                <span>Active committees</span>
              </div>
              <div className="h-4 w-px bg-ink-300" />
              <span>Globally scalable</span>
            </div>
          </div>

          {/* Right Content - Feature Preview */}
          <div className="relative lg:pl-8">
            <div className="relative rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-1 shadow-2xl shadow-ink-900/20">
              <div className="rounded-xl bg-white p-6">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-clay-700 to-clay-600 text-white">
                      <Hexagon className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">Accra Student Committee</p>
                      <p className="text-xs text-ink-500">Active Member</p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-clay-600" />
                      <span className="text-xs font-medium text-ink-500 uppercase tracking-wide">
                        Meetings
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-ink-900">12</p>
                    <p className="text-xs text-ink-500 mt-1">This semester</p>
                  </div>
                  <div className="rounded-lg border border-ink-200 bg-ink-50/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-clay-600" />
                      <span className="text-xs font-medium text-ink-500 uppercase tracking-wide">
                        Attendance
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-ink-900">85%</p>
                    <p className="text-xs text-green-600 mt-1">Above threshold</p>
                  </div>
                </div>

                {/* Activity Preview */}
                <div className="rounded-lg border border-ink-200 bg-ink-50/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-clay-600" />
                      <span className="text-xs font-medium text-ink-500 uppercase tracking-wide">
                        Recent Activity
                      </span>
                    </div>
                    <span className="text-xs text-clay-700 font-medium">View all</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-ink-200/50">
                      <span className="text-sm text-ink-700">Awareness Month Campaign</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">Approved</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-ink-700">Community Workshop</span>
                      <span className="text-xs text-ink-500 bg-ink-100 px-2 py-0.5 rounded">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-clay-200/50 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-ink-200/50 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
