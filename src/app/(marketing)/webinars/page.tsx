import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Calendar, MapPin, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Webinars and events - Student Committees",
  description:
    "Upcoming webinars and events hosted by Student Committees, with join links and details.",
};

type WebinarRow = {
  id: string;
  title: string;
  summary: string;
  host_label: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  format: string;
  join_url: string;
  registration_url: string | null;
  location: string | null;
  audience: string | null;
  contact_email: string | null;
  committees: { name: string; location: string | null; region: string | null } | null;
};

function formatWhen(iso: string, timezone: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone || "Africa/Accra",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toUTCString();
  }
}

async function getPublishedWebinars(): Promise<WebinarRow[]> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const { data } = await supabase
      .from("sc_webinars")
      .select(
        "id, title, summary, host_label, starts_at, ends_at, timezone, format, join_url, registration_url, location, audience, contact_email, committees(name, location, region)",
      )
      .eq("published", true)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true });

    return (data as WebinarRow[] | null) ?? [];
  } catch {
    return [];
  }
}

export default async function WebinarsPage() {
  const webinars = await getPublishedWebinars();

  return (
    <div className="bg-paper">
      <div className="kente-divider" />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">Across SCs</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink-950 md:text-5xl">
          Who is hosting what, and how to join
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-600">
          Upcoming webinars and events from Student Committees. Each card shows the host SC, time,
          audience, and the join link.
        </p>

        <div className="mt-12 space-y-5">
          {webinars.length === 0 ? (
            <Card className="border-ink-200">
              <CardContent className="py-12 text-center">
                <p className="text-sm text-ink-600">
                  No upcoming published webinars yet. Committee chairs can post sessions from Admin
                  &gt; Webinars.
                </p>
              </CardContent>
            </Card>
          ) : (
            webinars.map((event) => {
              const host =
                event.host_label ||
                event.committees?.name ||
                "Student Committee";
              return (
                <Card key={event.id} className="border-ink-200 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-brand-50 text-brand-800 border-brand-200">
                        {event.format}
                      </Badge>
                      <Badge variant="outline" className="border-ink-200 text-ink-700">
                        {host}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-2xl">{event.title}</CardTitle>
                    <CardDescription className="text-base text-ink-600">
                      {event.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="grid gap-3 text-sm text-ink-700 sm:grid-cols-2">
                      <div className="flex gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                        <div>
                          <p className="font-medium text-ink-900">
                            {formatWhen(event.starts_at, event.timezone)}
                          </p>
                          <p className="text-xs text-ink-500">{event.timezone}</p>
                          {event.ends_at ? (
                            <p className="mt-1 text-xs text-ink-500">
                              Ends {formatWhen(event.ends_at, event.timezone)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      {event.location || event.audience ? (
                        <div className="space-y-2">
                          {event.location ? (
                            <div className="flex gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                              <span>{event.location}</span>
                            </div>
                          ) : null}
                          {event.audience ? (
                            <div className="flex gap-2">
                              <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                              <span>{event.audience}</span>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                      {event.contact_email ? (
                        <p className="sm:col-span-2 text-xs text-ink-500">
                          Contact: {event.contact_email}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                      <a href={event.join_url} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-brand-600 text-white hover:bg-brand-700">
                          Join link
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                      {event.registration_url ? (
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" className="w-full border-ink-300">
                            Register
                          </Button>
                        </a>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
