"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const stats = [
  { label: "Active member bar", value: 10, suffix: "h", detail: "service hours per semester" },
  { label: "Attendance bar", value: 60, suffix: "%", detail: "meeting presence target" },
  { label: "SC positions", value: 8, suffix: "", detail: "roles that keep Accra SC running" },
];

function useCountUp(target: number, active: boolean, reduce: boolean | null) {
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const duration = 1200;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduce, target]);

  return value;
}

function StatCard({
  label,
  value,
  suffix,
  detail,
  active,
  reduce,
}: {
  label: string;
  value: number;
  suffix: string;
  detail: string;
  active: boolean;
  reduce: boolean | null;
}) {
  const n = useCountUp(value, active, reduce);
  return (
    <div className="border-t border-ink-200 pt-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-500">{label}</p>
      <p className="mt-3 font-mono text-5xl tabular-nums tracking-tight text-ink-950">
        {n}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-ink-600">{detail}</p>
    </div>
  );
}

export function StatsSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-ink-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} active={active} reduce={reduce} />
        ))}
      </div>
    </section>
  );
}
