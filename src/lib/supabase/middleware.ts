import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/auth/callback",
  "/about",
  "/features",
  "/committees",
  "/contact",
  "/help",
  "/privacy",
  "/terms",
];
const MEMBERSHIP_PATHS = ["/membership"];
const ONBOARDING_PATHS = ["/orientation", "/onboarding"];

function isActiveMember(profile: {
  membership_status?: string | null;
  committee_id?: string | null;
}) {
  return profile.membership_status === "active" && Boolean(profile.committee_id);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isMembershipPath = MEMBERSHIP_PATHS.some((path) => pathname.startsWith(path));
  const isOnboardingPath = ONBOARDING_PATHS.some((path) => pathname.startsWith(path));
  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");
  const isApiRoute = pathname.startsWith("/api/");

  if (!user && !isPublicPath && !isAsset) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_status, committee_id, orientation_completed_at, full_name, joined_date")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    if (!profile || !isActiveMember(profile)) {
      url.pathname = "/membership";
    } else if (!profile.orientation_completed_at) {
      url.pathname = "/orientation";
    } else if (!profile.full_name || !profile.joined_date) {
      url.pathname = "/onboarding";
    } else {
      url.pathname = "/dashboard";
    }
    return NextResponse.redirect(url);
  }

  if (user && !isAsset && !isApiRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_status, committee_id, orientation_completed_at, full_name, joined_date")
      .eq("id", user.id)
      .single();

    if (!profile || !isActiveMember(profile)) {
      if (!isPublicPath && !isMembershipPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/membership";
        return NextResponse.redirect(url);
      }
      return response;
    }

    if (!profile.orientation_completed_at && !pathname.startsWith("/orientation")) {
      const url = request.nextUrl.clone();
      url.pathname = "/orientation";
      return NextResponse.redirect(url);
    }

    if (
      profile.orientation_completed_at &&
      (!profile.full_name || !profile.joined_date) &&
      !pathname.startsWith("/onboarding")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    if (isOnboardingPath || isMembershipPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
