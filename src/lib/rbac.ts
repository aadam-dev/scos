import type { CommitteeRole } from "@/lib/types";

export function isCommitteeAdmin(role: CommitteeRole) {
  return role === "chair" || role === "secretary";
}
