import type { Metadata } from "next";
import Link from "next/link";
import { journalPosts } from "@/content/journal/posts";

export const metadata: Metadata = {
  title: "Journal - Ghana Accra Student Committee",
  description: "Guidance on hours, outreach, and how Accra SC works.",
};

export default function JournalIndexPage() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">Journal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-950 md:text-5xl">
          Guidance for Accra SC
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-600">
          Short reads on hours, outreach, and committee practice. No filler.
        </p>

        <div className="mt-12 divide-y divide-ink-200 border-y border-ink-200">
          {journalPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="block py-8 transition-colors hover:bg-white/60"
            >
              <p className="font-mono text-xs text-ink-500">{post.date}</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink-950">{post.title}</h2>
              <p className="mt-2 text-ink-600">{post.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
