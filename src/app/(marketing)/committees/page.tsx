import type { Metadata } from "next";
import { MapPin, Users, Calendar, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Participating Committees | SCOS",
  description:
    "Student Committees using SCOS for governance and operations management.",
};

const committees = [
  {
    name: "Accra Student Committee",
    location: "Accra, Ghana",
    country: "GH",
    members: "15+",
    established: "2024",
    activities: "Awareness campaigns, student support, community outreach",
    status: "active",
  },
];

export default function CommitteesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="caption text-brand-700 mb-4">Committees</p>
            <h1 className="heading-1 text-ink-900 mb-6">
              Committees using SCOS
            </h1>
            <p className="body-large text-ink-600">
              SCOS started with the Ghana Accra Student Committee. Other committees can request
              access through their chair or IT support.
            </p>
          </div>
        </div>
      </section>

      {/* Committee Grid */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {committees.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {committees.map((committee) => (
                <Card
                  key={committee.name}
                  className="group border-ink-200 bg-ink-50/30 transition-all hover:border-brand-300 hover:shadow-lg"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-600 text-white">
                        <span className="text-lg font-bold">
                          {committee.country}
                        </span>
                      </div>
                      <div className="flex h-6 items-center rounded-full bg-green-100 px-2.5 text-xs font-medium text-green-800">
                        Active
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="heading-3 text-ink-900 mb-2">
                      {committee.name}
                    </h3>
                    <div className="mb-4 flex items-center gap-1.5 text-sm text-ink-500">
                      <MapPin className="h-4 w-4" />
                      {committee.location}
                    </div>
                    <p className="body-small text-ink-600 mb-4">
                      {committee.activities}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-ink-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {committee.members} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Est. {committee.established}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-ink-500">Committee information loading...</p>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="heading-2 text-white mb-4">
                  Start your committee on SCOS
                </h2>
                <p className="body-large text-ink-400">
                  Ready to bring your Student Committee onto SCOS? We&apos;re onboarding
                  new committees as we expand. Contact us to learn more.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-white text-ink-900 hover:bg-ink-100"
                  >
                    Contact Us
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-ink-700 text-white hover:bg-ink-800"
                  >
                    Access Platform
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
