"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group border-ink-200 bg-white transition-all duration-300 hover:border-clay-300 hover:shadow-lg hover:shadow-clay-700/5 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-clay-100 to-clay-50 text-clay-700 transition-colors group-hover:from-clay-700 group-hover:to-clay-600 group-hover:text-white">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="heading-4 text-ink-900 mb-2">{title}</h3>
        <p className="body-small text-ink-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
