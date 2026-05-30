import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

type QueueCommitteeEmailInput = {
  committeeId: string;
  subject: string;
  template: string;
  payload?: Record<string, unknown>;
};

export async function queueCommitteeEmail({
  committeeId,
  subject,
  template,
  payload = {},
}: QueueCommitteeEmailInput) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const supabase = createAdminClient();
  const { data: members } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("committee_id", committeeId);

  if (!members?.length) return;

  await supabase.from("email_events").insert(
    members.map((member) => ({
      committee_id: committeeId,
      recipient_id: member.id,
      to_email: member.email,
      subject,
      template,
      payload,
      status: "queued",
    })),
  );
}

export async function sendEmailEvent(eventId: string) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new Error("Resend is not configured.");
  }

  const supabase = createAdminClient();
  const { data: event } = await supabase
    .from("email_events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (!event || event.status !== "queued") return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: event.to_email,
    subject: event.subject,
    text: renderPlainTextEmail(event.template, event.payload as Record<string, unknown>),
  });

  await supabase
    .from("email_events")
    .update({
      status: result.error ? "failed" : "sent",
      resend_message_id: result.data?.id ?? null,
      error_message: result.error?.message ?? null,
      sent_at: result.error ? null : new Date().toISOString(),
    })
    .eq("id", eventId);
}

function renderPlainTextEmail(template: string, payload: Record<string, unknown>) {
  if (template === "planned_activity_created") {
    return `Assalamu alaikum,

A new Student Committee activity has been planned.

Title: ${String(payload.title ?? "Planned activity")}
Date: ${String(payload.date ?? "To be confirmed")}
Location: ${String(payload.location ?? "To be confirmed")}

Please check SCOS for details.`;
  }

  if (template === "meeting_minutes_reminder") {
    return `Assalamu alaikum,

Meeting minutes are still pending publication.

Meeting: ${String(payload.title ?? "Committee meeting")}
Link: ${String(payload.href ?? "/admin/meetings")}

Please sign in to SCOS and publish structured minutes for the committee record.`;
  }

  return `Assalamu alaikum,

You have a new SCOS notification.

Please sign in to SCOS for details.`;
}
