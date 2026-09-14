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
    <Card className="group border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-600/5">
      <CardHeader className="pb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-gradient-to-br group-hover:from-brand-600 group-hover:to-brand-700 group-hover:text-white">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="heading-4 mb-2 text-ink-900">{title}</h3>
        <p className="body-small leading-relaxed text-ink-600">{description}</p>
      </CardContent>
    </Card>
  );
}
