import { requireProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type Props = { searchParams: Promise<{ category?: string; year?: string }> };

export default async function ArchivePage({ searchParams }: Props) {
  await requireProfile();
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("committee_assets")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (params.category) query = query.eq("category", params.category);
  if (params.year) query = query.eq("year_term", params.year);

  const { data: assets } = await query;

  async function signedUrl(path: string) {
    const { data } = await supabase.storage.from("committee-assets").createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  }

  const withUrls = await Promise.all(
    (assets ?? []).map(async (asset) => ({
      ...asset,
      url: await signedUrl(asset.storage_path),
    })),
  );

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="heading-3 text-ink-900">Committee archive</h1>
        <p className="body-small mt-1 text-ink-600">
          Legacy projects, templates, and brand files so the next Accra SC can continue the work.
        </p>
      </div>

      <form className="flex flex-wrap gap-2">
        <Input name="category" placeholder="category" defaultValue={params.category ?? ""} className="w-40" />
        <Input name="year" placeholder="year/term" defaultValue={params.year ?? ""} className="w-40" />
        <button
          type="submit"
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm hover:bg-ink-50"
        >
          Filter
        </button>
        <Link href="/archive" className="rounded-lg px-3 py-2 text-sm text-brand-700 underline">
          Clear
        </Link>
      </form>

      <div className="space-y-3">
        {withUrls.length === 0 ? (
          <Card className="border-ink-200">
            <CardContent className="py-10 text-center text-sm text-ink-500">
              No assets yet. Chair or secretary can upload from Admin Archive.
            </CardContent>
          </Card>
        ) : (
          withUrls.map((asset) => (
            <Card key={asset.id} className="border-ink-200">
              <CardContent className="flex flex-wrap items-start justify-between gap-3 py-5">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{asset.category}</Badge>
                    {asset.year_term ? <Badge variant="outline">{asset.year_term}</Badge> : null}
                  </div>
                  <p className="mt-2 font-semibold text-ink-900">{asset.title}</p>
                  {asset.description ? (
                    <p className="mt-1 text-sm text-ink-600">{asset.description}</p>
                  ) : null}
                  {asset.tags?.length ? (
                    <p className="mt-2 font-mono text-xs text-ink-500">{asset.tags.join(" · ")}</p>
                  ) : null}
                </div>
                {asset.url ? (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-brand-700 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800"
                  >
                    Download
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
