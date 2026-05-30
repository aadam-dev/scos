"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Member = {
  id: string;
  full_name: string;
};

export function MemberReportForm({ members }: { members: Member[] }) {
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="memberId">Member</Label>
        <Select id="memberId" value={memberId} onChange={(event) => setMemberId(event.target.value)}>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.full_name}
            </option>
          ))}
        </Select>
      </div>
      <a
        href={memberId ? `/api/reports/${memberId}` : "#"}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-10 items-center justify-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white hover:bg-blue-800"
      >
        Generate PDF
      </a>
    </div>
  );
}
