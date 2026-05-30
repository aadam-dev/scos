import { describe, expect, it } from "vitest";
import {
  extractPlanningActionCandidates,
  mergeAgendaFromPlanningAndText,
} from "@/lib/planning-sync";

describe("mergeAgendaFromPlanningAndText", () => {
  it("merges planning titles and manual lines without duplicates", () => {
    const agenda = mergeAgendaFromPlanningAndText(
      ["Awareness Month", "Opening"],
      "Opening\nMember outreach",
    );

    expect(agenda.map((item) => item.topic)).toEqual([
      "Awareness Month",
      "Opening",
      "Member outreach",
    ]);
  });
});

describe("extractPlanningActionCandidates", () => {
  it("returns candidates only for agenda items with action text", () => {
    const candidates = extractPlanningActionCandidates(
      {
        agenda_items: [
          { order: 1, topic: "Opening", action_items: "Secretary to circulate list" },
          { order: 2, topic: "Planning", discussion: "Discussed dates" },
        ],
      },
      "Monthly SC Meeting",
    );

    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.title).toContain("Opening");
    expect(candidates[0]?.description).toContain("Secretary to circulate list");
  });
});
