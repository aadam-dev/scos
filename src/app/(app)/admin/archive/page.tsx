import { requireAdminProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import {
  archiveCommitteeAsset,
  uploadCommitteeAsset,
} from "@/actions/public-tools";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

type Props = { searchParams: Promise<{ message?: string; category?: string; year?: string }> };

export default async function AdminArchivePage({ searchParams }: Props) {
  await requireAdminProfile();
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

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="heading-3 text-ink-900">Asset archive</h1>
          <p className="body-small mt-1 text-ink-600">
            Upload templates, project packs, and brand files for the next SC generation.
          </p>
        </div>
        <Link href="/archive" className="text-sm text-brand-700 underline">
          Member browse view
        </Link>
      </div>

      {params.message ? <Alert variant="success">{params.message}</Alert> : null}

      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Upload asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={uploadCommitteeAsset} className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Awareness Month 2025 pack" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" defaultValue="project">
                <option value="branding">branding</option>
                <option value="template">template</option>
                <option value="project">project</option>
                <option value="photo">photo</option>
                <option value="report">report</option>
                <option value="other">other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="yearTerm">Year / term</Label>
              <Input id="yearTerm" name="yearTerm" placeholder="2025-S2" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" placeholder="awareness, flyer, booth" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                name="file"
                type="file"
                required
                accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.pptx,.zip"
              />
              <p className="mt-1 text-xs text-ink-500">Max 20MB. PDF, images, docx, pptx, zip.</p>
            </div>
            <div className="md:col-span-2">
              <FormSubmitButton pendingLabel="Uploading...">Upload</FormSubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {(assets ?? []).map((asset) => (
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
              </div>
              <form action={archiveCommitteeAsset}>
                <input type="hidden" name="id" value={asset.id} />
                <FormSubmitButton pendingLabel="Archiving...">Archive</FormSubmitButton>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
