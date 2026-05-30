import type { Metadata } from "next";
import { Hexagon, Target, Shield, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About SCOS | Student Committee Operating System",
  description:
    "Learn about SCOS - the governance platform purpose-built for IOU Student Committees.",
};

const values = [
  {
    icon: Target,
    title: "Purpose-Built",
    description:
      "Designed specifically for the unique needs of Student Committee operations, not a generic tool retrofitted.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "Built on Supabase with Row-Level Security. Your committee data stays private and protected.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description:
      "Ready for Student Committees worldwide. From Ghana to wherever IOU reaches next.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-clay-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="caption text-clay-700 mb-4">About SCOS</p>
            <h1 className="heading-1 text-ink-900 mb-6">
              Governance excellence for educational communities
            </h1>
            <p className="body-large text-ink-600">
              SCOS (Student Committee Operating System) is a purpose-built platform for managing
              IOU Student Committee operations. From meeting minutes to community service
              tracking, we provide the infrastructure for effective governance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="caption text-clay-700 mb-4">Our Mission</p>
              <h2 className="heading-2 text-ink-900 mb-4">
                Empowering student leadership through technology
              </h2>
              <div className="space-y-4 text-ink-600 leading-relaxed">
                <p>
                  Student Committees are the backbone of local IOU engagement. They organize
                  awareness campaigns, support students, and represent the university in their
                  communities. Yet too often, committee operations rely on scattered spreadsheets,
                  WhatsApp groups, and manual record-keeping.
                </p>
                <p>
                  SCOS changes this. We provide a centralized, professional platform for
                  committee governance — from planning meetings to generating official reports
                  for IOU review.
                </p>
                <p>
                  Our mission is simple: let committees focus on impact while we handle the
                  operational complexity.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-clay-700 text-white">
                  <Hexagon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-semibold">SCOS</p>
                  <p className="text-sm text-ink-400">Built for IOU</p>
                </div>
              </div>
              <blockquote className="text-lg font-medium leading-relaxed text-ink-100">
                &ldquo;Technology should amplify human impact, not create administrative burden.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-ink-200 bg-ink-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="caption text-clay-700 mb-4">Our Values</p>
            <h2 className="heading-2 text-ink-900">
              Built on principles that matter
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <Card
                key={value.title}
                className="border-ink-200 bg-white"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-clay-100 to-clay-50 text-clay-700">
                    <value.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="heading-4 text-ink-900 mb-2">{value.title}</h3>
                  <p className="body-small text-ink-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* IOU Context */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="caption text-clay-700 mb-4">IOU Ecosystem</p>
            <h2 className="heading-2 text-ink-900 mb-4">
              Part of something larger
            </h2>
            <p className="body-large text-ink-600 mb-6">
              SCOS serves the International Open University community, supporting Student
              Committees that promote Islamic education, assist students, and organize community
              engagement activities.
            </p>
            <p className="text-ink-600">
              While deeply integrated with IOU processes, SCOS is designed to be globally
              deployable — ready for Student Committees wherever they emerge.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
