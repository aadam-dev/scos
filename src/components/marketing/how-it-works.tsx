"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const path = [
  {
    title: "Member logs",
    body: "You record the activity, minutes, and evidence inside SCOS.",
  },
  {
    title: "Chair exports",
    body: "Chair or secretary reviews claims and downloads the PDF or Excel logbook.",
  },
  {
    title: "IOU reviews",
    body: "Final community service approval happens with IOU outside this platform.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
            How hours reach IOU
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            SCOS is the local record. It does not replace IOU approval of service hours.
          </p>
        </div>

        <div className="mt-14 grid gap-0 md:grid-cols-3">
          {path.map((step, i) => (
            <div
              key={step.title}
              className="border-t border-ink-200 py-8 md:border-l md:border-t-0 md:px-8 md:first:border-l-0 md:first:pl-0"
            >
              <p className="font-mono text-xs text-brand-700">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-xl font-semibold text-ink-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{step.body}</p>
            </div>
          ))}
        </div>

        <Link
          href="/journal/how-hours-work"
          className="mt-10 inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          Read the hours guide
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
