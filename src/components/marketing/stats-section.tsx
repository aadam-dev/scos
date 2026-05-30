"use client";

import { Separator } from "@/components/ui/separator";

const stats = [
  {
    value: "3+",
    label: "Active Committees",
    description: "Across Ghana and beyond",
  },
  {
    value: "500+",
    label: "Activities Tracked",
    description: "Community service hours logged",
  },
  {
    value: "100%",
    label: "IOU Integration",
    description: "Purpose-built for the ecosystem",
  },
];

export function StatsSection() {
  return (
    <section className="border-y border-ink-200 bg-ink-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-6">
              <div className="flex-1">
                <p className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-clay-700">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-ink-500">{stat.description}</p>
              </div>
              {index < stats.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="hidden h-16 bg-ink-300 md:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
