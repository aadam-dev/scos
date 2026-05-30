import type { StructuredMinuteItem, StructuredMinutes } from "@/lib/meeting-minutes";
import type { AgendaItem } from "@/lib/meeting-minutes";

export type PlanningActionCandidate = {
  title: string;
  description: string;
  category: string;
  sourceAgendaOrder: number;
  meetingTitle: string;
};

export function mergeAgendaFromPlanningAndText(
  planningTitles: string[],
  manualAgendaText: string,
): AgendaItem[] {
  const manual = manualAgendaText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const topics = [...planningTitles, ...manual];
  const unique: string[] = [];
  for (const topic of topics) {
    if (!unique.some((existing) => existing.toLowerCase() === topic.toLowerCase())) {
      unique.push(topic);
    }
  }

  if (!unique.length) {
    return [{ order: 1, topic: "General business" }];
  }

  return unique.map((topic, index) => ({ order: index + 1, topic }));
}

export function extractPlanningActionCandidates(
  structured: StructuredMinutes,
  meetingTitle: string,
): PlanningActionCandidate[] {
  return structured.agenda_items
    .filter((item) => item.action_items?.trim())
    .map((item) => actionItemToPlanningCandidate(item, meetingTitle));
}

function actionItemToPlanningCandidate(
  item: StructuredMinuteItem,
  meetingTitle: string,
): PlanningActionCandidate {
  const actionText = item.action_items!.trim();
  return {
    title: `${item.topic}: follow-up`,
    description: `From meeting "${meetingTitle}" (agenda ${item.order}).\n\nAction: ${actionText}${
      item.decisions?.trim() ? `\n\nDecision: ${item.decisions.trim()}` : ""
    }`,
    category: "Meeting",
    sourceAgendaOrder: item.order,
    meetingTitle,
  };
}

export function parsePlanningItemIds(formData: FormData): string[] {
  return formData
    .getAll("planningItemIds")
    .map((value) => String(value))
    .filter((id) => id.length > 0);
}
