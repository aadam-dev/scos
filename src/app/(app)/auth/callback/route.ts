import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error_description");

  if (authError) {
    return NextResponse.redirect(
      new URL(`/login?message=${encodeURIComponent(authError)}`, request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?message=Missing auth code.", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?message=Could not complete sign-in.", request.url),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_status, committee_id, orientation_completed_at, full_name, joined_date")
    .eq("id", user.id)
    .single();

  if (!profile || profile.membership_status !== "active" || !profile.committee_id) {
    return NextResponse.redirect(new URL("/membership", request.url));
  }

  if (!profile.orientation_completed_at) {
    return NextResponse.redirect(new URL("/orientation", request.url));
  }

  if (!profile.full_name || !profile.joined_date) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}
