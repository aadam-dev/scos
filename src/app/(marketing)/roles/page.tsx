import type { Metadata } from "next";
import Link from "next/link";
import { roles } from "@/content/academy/roles";

export const metadata: Metadata = {
  title: "SC Roles - Ghana Accra Student Committee",
  description: "Learn the eight Accra SC positions and what each one owns week to week.",
};

export default function RolesPage() {
  return (
    <div className="bg-paper">
      <div className="kente-divider" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">Roles</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-950 md:text-5xl">
            Eight seats that keep Accra SC moving
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            Public explainers for every position. Active members continue into the academy quiz
            inside SCOS.
          </p>
        </div>

        <div className="mt-14 grid gap-6">
          {roles.map((role) => (
            <article
              key={role.slug}
              id={role.slug}
              className="grid gap-6 rounded-2xl border border-ink-200 bg-white p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand-700">
                  {role.shortTitle}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-ink-950">{role.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{role.purpose}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Weekly work
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                    {role.weeklyWork.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    In SCOS
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                    {role.touchesScos.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Watch for
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                    {role.commonMistakes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-ink-950 px-6 py-8 text-white md:px-8">
          <h2 className="text-xl font-semibold">Already on the Accra roster?</h2>
          <p className="mt-2 max-w-xl text-sm text-ink-300">
            Sign in to complete the role academy quiz and unlock the rest of the operating system.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            Sign in to academy
          </Link>
        </div>
      </div>
    </div>
  );
}
