"use client";

import { Calendar, CheckCircle, FileCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Calendar,
    title: "Plan",
    description:
      "Set up meetings, create planning boards, and define campaign objectives. Invite members and establish agendas.",
  },
  {
    number: "02",
    icon: CheckCircle,
    title: "Execute",
    description:
      "Run meetings with structured minutes, log activities with evidence, and track attendance automatically.",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Report",
    description:
      "Generate clean reports for IOU review, export member logbooks, and maintain institutional records.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-ink-900 py-20 lg:py-28 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-clay-900/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="caption text-clay-400 mb-3">How It Works</p>
          <h2 className="heading-2 text-white mb-4">
            Simple, structured, effective
          </h2>
          <p className="body-large text-ink-400">
            SCOS streamlines the entire committee lifecycle from planning through reporting.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-clay-700/50 to-transparent" />
              )}

              {/* Step Number & Icon */}
              <div className="relative mb-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-clay-700 to-clay-800 text-white shadow-xl shadow-clay-900/50">
                  <step.icon className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-xs font-bold text-clay-400 border border-ink-700">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="heading-3 text-white mb-2">{step.title}</h3>
              <p className="body-small text-ink-400 max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
