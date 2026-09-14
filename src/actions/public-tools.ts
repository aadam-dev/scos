"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile, requireProfile } from "@/lib/profile";
import { academyQuiz, QUIZ_PASS_PERCENT } from "@/content/academy/quiz";
import { Resend } from "resend";

async function notifyCommitteeAdmins(committeeId: string, subject: string, body: string) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return;
  const supabase = createAdminClient();
  const { data: admins } = await supabase
    .from("profiles")
    .select("email")
    .eq("committee_id", committeeId)
    .in("role", ["chair", "secretary"]);

  if (!admins?.length) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: admins.map((a) => a.email).filter(Boolean),
    subject,
    text: body,
  });
}

const internshipSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  schoolProgram: z.string().optional(),
  track: z.enum(["local_internship", "volunteer"]),
  availability: z.string().optional(),
  motivation: z.string().min(20),
  website: z.string().optional(), // honeypot
});

export async function submitInternshipApplication(formData: FormData) {
  const parsed = internshipSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    schoolProgram: formData.get("schoolProgram") || undefined,
    track: formData.get("track") || "local_internship",
    availability: formData.get("availability") || undefined,
    motivation: formData.get("motivation"),
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    return redirect("/internships?message=Check the form and try again.");
  }
  if (parsed.data.website) {
    return redirect("/internships?message=Thanks. We received your interest.");
  }

  const supabase = createAdminClient();
  const { data: committee } = await supabase
    .from("committees")
    .select("id, name")
    .or("slug.eq.accra,name.ilike.%Accra%")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (!committee) {
    return redirect("/internships?message=Committee is not ready to receive applications yet.");
  }

  const { error } = await supabase.from("internship_applications").insert({
    committee_id: committee.id,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    school_program: parsed.data.schoolProgram || null,
    track: parsed.data.track,
    availability: parsed.data.availability || null,
    motivation: parsed.data.motivation,
  });

  if (error) {
    return redirect("/internships?message=Could not submit. Please try again shortly.");
  }

  await notifyCommitteeAdmins(
    committee.id,
    `New internship interest: ${parsed.data.fullName}`,
    `A new internship/volunteer interest form was submitted for ${committee.name}.

Name: ${parsed.data.fullName}
Email: ${parsed.data.email}
Track: ${parsed.data.track}

Review it in SCOS Admin > Intake.`,
  );

  return redirect("/internships?message=Thanks. Accra SC will review your interest.");
}

const outreachSignupSchema = z.object({
  opportunityId: z.string().uuid(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  note: z.string().optional(),
  website: z.string().optional(),
});

export async function submitOutreachSignup(formData: FormData) {
  const parsed = outreachSignupSchema.safeParse({
    opportunityId: formData.get("opportunityId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    note: formData.get("note") || undefined,
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    return redirect("/outreach?message=Check the form and try again.");
  }
  if (parsed.data.website) {
    return redirect("/outreach?message=Thanks. We received your signup.");
  }

  const supabase = createAdminClient();
  const { data: opportunity } = await supabase
    .from("outreach_opportunities")
    .select("id, committee_id, title, published")
    .eq("id", parsed.data.opportunityId)
    .eq("published", true)
    .single();

  if (!opportunity) {
    return redirect("/outreach?message=That opportunity is no longer open.");
  }

  const { error } = await supabase.from("outreach_signups").insert({
    opportunity_id: opportunity.id,
    committee_id: opportunity.committee_id,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    note: parsed.data.note || null,
  });

  if (error) {
    return redirect("/outreach?message=Could not submit signup. Try again shortly.");
  }

  await notifyCommitteeAdmins(
    opportunity.committee_id,
    `Outreach signup: ${opportunity.title}`,
    `${parsed.data.fullName} (${parsed.data.email}) signed up for ${opportunity.title}.

Review in SCOS Admin > Intake.`,
  );

  return redirect("/outreach?message=Thanks. The committee will contact you about next steps.");
}

export async function submitAcademyQuiz(formData: FormData) {
  const profile = await requireProfile();
  let correct = 0;
  for (const question of academyQuiz) {
    const answer = Number(formData.get(question.id));
    if (answer === question.correctIndex) correct += 1;
  }
  const score = Math.round((correct / academyQuiz.length) * 100);
  const passed = score >= QUIZ_PASS_PERCENT;

  const supabase = await createClient();
  if (passed) {
    await supabase
      .from("profiles")
      .update({
        academy_quiz_passed_at: new Date().toISOString(),
        academy_quiz_score: score,
      })
      .eq("id", profile.id);
    return redirect(`/academy?message=Passed with ${score}%. Roles unlocked.`);
  }

  await supabase
    .from("profiles")
    .update({ academy_quiz_score: score })
    .eq("id", profile.id);

  return redirect(
    `/academy?message=Score ${score}%. You need ${QUIZ_PASS_PERCENT}% to pass. Review the roles and retry.`,
  );
}

export async function updateIntakeStatus(formData: FormData) {
  await requireAdminProfile();
  const kind = String(formData.get("kind") || "");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!["new", "contacted", "accepted", "declined"].includes(status)) {
    return redirect("/admin/intake?message=Invalid status.");
  }

  const supabase = await createClient();
  const table = kind === "internship" ? "internship_applications" : "outreach_signups";
  const { error } = await supabase.from(table).update({ status }).eq("id", id);
  if (error) return redirect("/admin/intake?message=Could not update status.");
  return redirect("/admin/intake?message=Status updated.");
}

const outreachOpportunitySchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  location: z.string().optional(),
  hoursEstimate: z.coerce.number().optional(),
  startsOn: z.string().optional(),
  endsOn: z.string().optional(),
  published: z.boolean(),
});

export async function upsertOutreachOpportunity(formData: FormData) {
  const profile = await requireAdminProfile();
  const parsed = outreachOpportunitySchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    location: formData.get("location") || undefined,
    hoursEstimate: formData.get("hoursEstimate") || undefined,
    startsOn: formData.get("startsOn") || undefined,
    endsOn: formData.get("endsOn") || undefined,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return redirect("/admin/outreach?message=Check the opportunity fields.");
  }

  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const payload = {
    committee_id: profile.committee_id,
    title: parsed.data.title,
    summary: parsed.data.summary,
    location: parsed.data.location || null,
    hours_estimate: parsed.data.hoursEstimate ?? null,
    starts_on: parsed.data.startsOn || null,
    ends_on: parsed.data.endsOn || null,
    published: parsed.data.published,
    created_by: profile.id,
  };

  const { error } = id
    ? await supabase.from("outreach_opportunities").update(payload).eq("id", id)
    : await supabase.from("outreach_opportunities").insert(payload);

  if (error) return redirect("/admin/outreach?message=Could not save opportunity.");
  return redirect("/admin/outreach?message=Opportunity saved.");
}

const webinarSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  hostLabel: z.string().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  timezone: z.string().default("Africa/Accra"),
  format: z.string().default("webinar"),
  joinUrl: z.string().url(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  audience: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  published: z.boolean(),
});

export async function upsertWebinar(formData: FormData) {
  const profile = await requireAdminProfile();
  const parsed = webinarSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    hostLabel: formData.get("hostLabel") || undefined,
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    timezone: formData.get("timezone") || "Africa/Accra",
    format: formData.get("format") || "webinar",
    joinUrl: formData.get("joinUrl"),
    registrationUrl: formData.get("registrationUrl") || "",
    location: formData.get("location") || undefined,
    audience: formData.get("audience") || undefined,
    contactEmail: formData.get("contactEmail") || "",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return redirect("/admin/webinars?message=Check webinar fields and join link.");
  }

  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const payload = {
    committee_id: profile.committee_id,
    title: parsed.data.title,
    summary: parsed.data.summary,
    host_label: parsed.data.hostLabel || null,
    starts_at: new Date(parsed.data.startsAt).toISOString(),
    ends_at: parsed.data.endsAt ? new Date(parsed.data.endsAt).toISOString() : null,
    timezone: parsed.data.timezone,
    format: parsed.data.format,
    join_url: parsed.data.joinUrl,
    registration_url: parsed.data.registrationUrl || null,
    location: parsed.data.location || null,
    audience: parsed.data.audience || null,
    contact_email: parsed.data.contactEmail || null,
    published: parsed.data.published,
    created_by: profile.id,
  };

  const { error } = id
    ? await supabase.from("sc_webinars").update(payload).eq("id", id)
    : await supabase.from("sc_webinars").insert(payload);

  if (error) return redirect("/admin/webinars?message=Could not save webinar.");
  return redirect("/admin/webinars?message=Webinar saved.");
}

export async function deleteWebinar(formData: FormData) {
  await requireAdminProfile();
  const id = String(formData.get("id") || "");
  const supabase = await createClient();
  await supabase.from("sc_webinars").delete().eq("id", id);
  return redirect("/admin/webinars?message=Webinar removed.");
}

const assetSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(["branding", "template", "project", "photo", "report", "other"]),
  yearTerm: z.string().optional(),
  tags: z.string().optional(),
});

export async function uploadCommitteeAsset(formData: FormData) {
  const profile = await requireAdminProfile();
  const parsed = assetSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    category: formData.get("category") || "other",
    yearTerm: formData.get("yearTerm") || undefined,
    tags: formData.get("tags") || undefined,
  });
  const file = formData.get("file");
  if (!parsed.success || !(file instanceof File) || file.size === 0) {
    return redirect("/admin/archive?message=Title and file are required.");
  }
  if (file.size > 20 * 1024 * 1024) {
    return redirect("/admin/archive?message=File must be 20MB or smaller.");
  }

  const allowed = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/zip",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  if (file.type && !allowed.includes(file.type)) {
    return redirect("/admin/archive?message=Unsupported file type.");
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${profile.committee_id}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("committee-assets")
    .upload(path, buffer, { contentType: file.type || "application/octet-stream" });

  if (uploadError) {
    return redirect("/admin/archive?message=Upload failed.");
  }

  const { error } = await supabase.from("committee_assets").insert({
    committee_id: profile.committee_id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    category: parsed.data.category,
    year_term: parsed.data.yearTerm || null,
    tags: parsed.data.tags
      ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    storage_path: path,
    mime_type: file.type || null,
    file_size: file.size,
    uploaded_by: profile.id,
  });

  if (error) return redirect("/admin/archive?message=Could not save asset record.");
  return redirect("/admin/archive?message=Asset uploaded.");
}

export async function archiveCommitteeAsset(formData: FormData) {
  await requireAdminProfile();
  const id = String(formData.get("id") || "");
  const supabase = await createClient();
  await supabase.from("committee_assets").update({ archived: true }).eq("id", id);
  return redirect("/admin/archive?message=Asset archived.");
}
