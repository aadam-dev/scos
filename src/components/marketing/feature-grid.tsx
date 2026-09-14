"use client";

import Link from "next/link";
import { roles } from "@/content/academy/roles";

export function FeatureGrid() {
  const preview = roles.slice(0, 4);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
              Eight positions. One Accra SC.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              Learn what each role owns before you join. Members go deeper in the academy with a
              short quiz.
            </p>
          </div>
          <Link
            href="/roles"
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            See all roles
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {preview.map((role, i) => (
            <article
              key={role.slug}
              className={`rounded-2xl border border-ink-200 p-6 ${
                i === 0 ? "bg-ink-950 text-white md:row-span-2 md:flex md:flex-col md:justify-between" : "bg-paper"
              }`}
            >
              <div>
                <p
                  className={`font-mono text-xs uppercase tracking-[0.16em] ${
                    i === 0 ? "text-brand-300" : "text-brand-700"
                  }`}
                >
                  {role.shortTitle}
                </p>
                <h3
                  className={`mt-3 text-xl font-semibold ${i === 0 ? "text-white" : "text-ink-950"}`}
                >
                  {role.title}
                </h3>
                <p className={`mt-3 text-sm leading-relaxed ${i === 0 ? "text-ink-300" : "text-ink-600"}`}>
                  {role.purpose}
                </p>
              </div>
              {i === 0 ? (
                <p className="mt-8 font-mono text-xs text-ink-400">Primary leadership seat</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
