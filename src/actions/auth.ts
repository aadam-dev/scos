"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfileState, isActiveMember } from "@/lib/profile";

const emailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const profileSchema = z.object({
  fullName: z.string().min(2),
  bio: z.string().optional(),
  joinedDate: z.string().min(1),
  programType: z.string().optional(),
  targetHours: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  preferredPositions: z.string().optional(),
});

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl()}/auth/callback`,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    return redirect("/login?message=Could not start Google sign-in.");
  }

  return redirect(data.url);
}

export async function signIn(formData: FormData) {
  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return redirect("/login?message=Enter a valid email and password.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return redirect("/login?message=Could not sign in. Check your credentials.");
  }

  return redirect("/");
}

/** Legacy email signup. Prefer Google sign-in after roster invite. */
export async function signUp(formData: FormData) {
  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return redirect("/login?message=Use a valid email and a password with 6 or more characters.");
  }

  const fullName = String(formData.get("fullName") || "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return redirect("/login?message=Could not create account.");
  }

  return redirect("/membership?message=Account created. Complete membership verification next.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}

export async function updateOnboardingProfile(formData: FormData) {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    bio: formData.get("bio"),
    joinedDate: formData.get("joinedDate"),
    programType: formData.get("programType") || undefined,
    targetHours: formData.get("targetHours") || undefined,
    location: formData.get("location") || undefined,
    phone: formData.get("phone") || undefined,
    preferredPositions: formData.get("preferredPositions") || undefined,
  });

  if (!parsed.success) {
    return redirect("/onboarding?message=Complete all required fields.");
  }

  const supabase = await createClient();
  const { profile } = await getAuthProfileState();

  if (!profile || !isActiveMember(profile)) {
    return redirect("/membership");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      bio: parsed.data.bio || null,
      joined_date: parsed.data.joinedDate,
      program_type: parsed.data.programType || null,
      target_hours: parsed.data.targetHours || null,
      location: parsed.data.location || null,
      phone: parsed.data.phone || null,
      preferred_positions: parsed.data.preferredPositions
        ? parsed.data.preferredPositions.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    })
    .eq("id", profile.id);

  if (error) {
    return redirect("/onboarding?message=Could not save profile.");
  }

  return redirect("/");
}

export async function completeOrientationChecklist(formData: FormData) {
  const acknowledged = formData.get("acknowledged") === "on";
  if (!acknowledged) {
    return redirect("/orientation?message=Confirm all checklist items before continuing.");
  }

  const supabase = await createClient();
  const { profile } = await getAuthProfileState();

  if (!profile || !isActiveMember(profile)) {
    return redirect("/membership");
  }

  await supabase
    .from("profiles")
    .update({ orientation_completed_at: new Date().toISOString() })
    .eq("id", profile.id);

  return redirect("/onboarding?message=Orientation complete. Finish your profile next.");
}
