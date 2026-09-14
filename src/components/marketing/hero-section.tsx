"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const cycleWords = ["hours", "outreach", "continuity"];

export function HeroSection() {
  const reduce = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % cycleWords.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-paper">
      <div className="kente-divider absolute inset-x-0 top-0" />
      <div className="absolute inset-0 pattern-diamond opacity-60" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="max-w-xl">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-brand-700">
            Ghana Accra Student Committee
          </p>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-ink-950 md:text-5xl lg:text-6xl">
            Local IOU work,{" "}
            <span className="relative inline-block min-w-[8ch] text-brand-600">
              <AnimatePresence mode="wait">
                <motion.span
                  key={cycleWords[wordIndex]}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {cycleWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            in one system
          </h1>

          <p className="mt-6 max-w-[36ch] text-pretty text-lg leading-relaxed text-ink-600">
            SCOS is how the Accra SC plans meetings, logs community service, and hands work to the
            next generation without losing the trail.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="h-12 bg-brand-600 px-6 text-base text-white hover:bg-brand-700 active:scale-[0.98]"
              >
                Join Ghana SC
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="h-12 border-ink-300 px-6 text-base text-ink-800 hover:border-brand-400 hover:bg-brand-50"
              >
                Log service hours
              </Button>
            </Link>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-elevation-3">
            <div className="mb-5 flex items-center gap-3">
              <Image src="/brand/iou-logo.png" alt="" width={40} height={40} className="shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ink-900">Accra SC logbook</p>
                <p className="font-mono text-xs text-ink-500">Semester live</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Jummah booth, Madina", hours: "3.5h", status: "Logged" },
                { label: "Awareness Month flyer drop", hours: "2.0h", status: "Exported" },
                { label: "Student outreach call night", hours: "1.5h", status: "Pending" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between border-b border-ink-100 py-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-800">{row.label}</p>
                    <p className="font-mono text-xs text-ink-500">{row.hours}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-brand-800">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-end justify-between rounded-xl bg-ink-950 px-4 py-3 text-white">
              <span className="text-xs uppercase tracking-wider text-ink-400">Claimed total</span>
              <span className="font-mono text-2xl tabular-nums">11.25h</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
