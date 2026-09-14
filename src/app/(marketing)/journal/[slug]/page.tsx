import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournalPost, journalPosts } from "@/content/journal/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return { title: "Journal" };
  return { title: `${post.title} - SCOS Journal`, description: post.summary };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  return (
    <article className="bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Link href="/journal" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          Back to journal
        </Link>
        <p className="mt-6 font-mono text-xs text-ink-500">{post.date}</p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink-950">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-ink-600">{post.summary}</p>
        <div className="mt-10 space-y-5 text-base leading-relaxed text-ink-800">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
