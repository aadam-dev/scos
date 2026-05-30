import type { Profile } from "@/lib/types";

export type ActiveProfile = Profile & {
  membership_status: "active";
  committee_id: string;
};

export function isActiveMember(profile: Profile | null): profile is ActiveProfile {
  return !!(
    profile &&
    profile.membership_status === "active" &&
    profile.committee_id
  );
}
