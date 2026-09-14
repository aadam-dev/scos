"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const stacks = [
  {
    title: "Plan",
    body: "Campaigns and meeting agendas live on one board so Accra SC knows what is next.",
  },
  {
    title: "Meet",
    body: "Attendance, structured minutes, and reminders keep the weekly rhythm honest.",
  },
  {
    title: "Log hours",
    body: "Members claim service with evidence. The logbook builds toward IOU review.",
  },
  {
    title: "Hand over",
    body: "Templates, photos, and legacy projects stay in the archive for the next SC.",
  },
];

export function StickyStackSection() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !wrap.current) return;
    // CSS sticky stack: no GSAP dependency. Cards pin via sticky top.
  }, [reduce]);

  if (reduce) {
    return (
      <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-6">
          {stacks.map((item) => (
            <div key={item.title} className="rounded-2xl border border-ink-200 bg-white p-8">
              <h3 className="text-2xl font-semibold text-ink-950">{item.title}</h3>
              <p className="mt-3 text-ink-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={wrap} className="relative bg-paper px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {stacks.map((item, i) => (
          <div
            key={item.title}
            className="sticky top-20 flex min-h-[70dvh] items-center py-10"
            style={{ zIndex: i + 1 }}
          >
            <div
              className="w-full rounded-2xl border border-ink-200 bg-white p-8 shadow-elevation-3 md:p-12"
              style={{
                transform: `scale(${1 - (stacks.length - 1 - i) * 0.02})`,
              }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
                {item.title}
              </h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-600">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
