import { NextResponse } from "next/server";
import { getMemberActivities } from "@/lib/data";
import { requireProfile } from "@/lib/profile";
import { buildIndividualLogbook } from "@/lib/export/logbook";

export async function GET() {
  const profile = await requireProfile();
  const activities = await getMemberActivities(profile.id);
  const workbook = await buildIndividualLogbook({ profile, activities });

  return new NextResponse(new Uint8Array(workbook as ArrayBuffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="scos-${profile.full_name.replaceAll(" ", "-").toLowerCase()}-logbook.xlsx"`,
    },
  });
}
