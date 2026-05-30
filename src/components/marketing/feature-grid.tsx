"use client";

import {
  CalendarDays,
  ClipboardList,
  Target,
  FileBarChart,
  Users,
  Shield,
} from "lucide-react";
import { FeatureCard } from "./feature-card";

const features = [
  {
    icon: CalendarDays,
    title: "Meeting Intelligence",
    description:
      "Schedule, track attendance, and generate structured minutes. Automated reminders ensure nothing falls through the cracks.",
  },
  {
    icon: ClipboardList,
    title: "Activity Tracking",
    description:
      "Log community service activities with evidence. Track hours toward degree requirements with transparent approval workflows.",
  },
  {
    icon: Target,
    title: "Strategic Planning",
    description:
      "Plan campaigns, track progress, and sync action items across meetings. Visual planning boards keep committees aligned.",
  },
  {
    icon: FileBarChart,
    title: "Report Generation",
    description:
      "Generate professional community service reports and committee logbooks. Export clean PDFs ready for IOU review.",
  },
  {
    icon: Users,
    title: "Member Analytics",
    description:
      "Monitor participation, track attendance rates, and identify engagement patterns. Data-driven insights for better governance.",
  },
  {
    icon: Shield,
    title: "IOU Integration",
    description:
      "Built specifically for the International Open University ecosystem. Google authentication, roster management, and secure access.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="caption text-clay-700 mb-3">Platform Capabilities</p>
          <h2 className="heading-2 text-ink-900 mb-4">
            Everything committees need to excel
          </h2>
          <p className="body-large text-ink-600">
            From planning to reporting, SCOS provides the tools for effective
            governance and community impact.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
