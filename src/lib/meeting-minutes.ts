export type AgendaItem = {
  order: number;
  topic: string;
};

export type StructuredMinuteItem = AgendaItem & {
  speaker?: string;
  time_noted?: string;
  discussion?: string;
  decisions?: string;
  action_items?: string;
};

export type StructuredMinutes = {
  closing_notes?: string;
  agenda_items: StructuredMinuteItem[];
};

export function parseAgendaLines(text: string): AgendaItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((topic, index) => ({ order: index + 1, topic }));
}

export function mergeAgendaWithMinutes(
  agenda: AgendaItem[],
  existing?: StructuredMinutes | null,
): StructuredMinuteItem[] {
  const byOrder = new Map(
    (existing?.agenda_items ?? []).map((item) => [item.order, item]),
  );

  return agenda.map((item) => {
    const saved = byOrder.get(item.order);
    return {
      order: item.order,
      topic: item.topic,
      speaker: saved?.speaker ?? "",
      time_noted: saved?.time_noted ?? "",
      discussion: saved?.discussion ?? "",
      decisions: saved?.decisions ?? "",
      action_items: saved?.action_items ?? "",
    };
  });
}

export function buildMinutesSummary(structured: StructuredMinutes): string {
  const sections = structured.agenda_items
    .filter((item) => item.discussion?.trim())
    .map(
      (item) =>
        `${item.order}. ${item.topic}\n${item.discussion}${item.speaker ? `\nSpeaker: ${item.speaker}` : ""}`,
    );

  if (structured.closing_notes?.trim()) {
    sections.push(`Closing notes\n${structured.closing_notes}`);
  }

  return sections.join("\n\n") || "Meeting minutes recorded.";
}

export function buildMinutesDecisions(structured: StructuredMinutes): string | null {
  const lines = structured.agenda_items
    .filter((item) => item.decisions?.trim())
    .map((item) => `${item.order}. ${item.topic}: ${item.decisions}`);

  return lines.length ? lines.join("\n") : null;
}

export function buildMinutesActionItems(structured: StructuredMinutes): string | null {
  const lines = structured.agenda_items
    .filter((item) => item.action_items?.trim())
    .map((item) => `${item.order}. ${item.topic}: ${item.action_items}`);

  return lines.length ? lines.join("\n") : null;
}

export function parseStructuredMinutesFromForm(
  formData: FormData,
  agenda: AgendaItem[],
): StructuredMinutes {
  const agenda_items = agenda.map((item) => {
    const i = item.order - 1;
    return {
      order: item.order,
      topic: String(formData.get(`topic-${i}`) || item.topic),
      speaker: String(formData.get(`speaker-${i}`) || "").trim() || undefined,
      time_noted: String(formData.get(`timeNoted-${i}`) || "").trim() || undefined,
      discussion: String(formData.get(`discussion-${i}`) || "").trim() || undefined,
      decisions: String(formData.get(`decisions-${i}`) || "").trim() || undefined,
      action_items: String(formData.get(`actionItems-${i}`) || "").trim() || undefined,
    };
  });

  const closing_notes = String(formData.get("closingNotes") || "").trim() || undefined;

  return { closing_notes, agenda_items };
}

export function parseAttendeeIds(formData: FormData): string[] {
  return formData
    .getAll("attendeesPresent")
    .map((value) => String(value))
    .filter((id) => id.length > 0);
}
