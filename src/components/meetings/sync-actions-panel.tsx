import Link from "next/link";
import { syncMinuteActionsToPlanning } from "@/actions/minutes";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import type { StructuredMinutes } from "@/lib/meeting-minutes";
import { extractPlanningActionCandidates } from "@/lib/planning-sync";

type SyncActionsPanelProps = {
  meetingId: string;
  meetingTitle: string;
  published: boolean;
  actionsSyncedAt: string | null;
  structured: StructuredMinutes | null;
  existingSyncedOrders: number[];
};

export function SyncActionsPanel({
  meetingId,
  meetingTitle,
  published,
  actionsSyncedAt,
  structured,
  existingSyncedOrders,
}: SyncActionsPanelProps) {
  if (!published || !structured) return null;

  const candidates = extractPlanningActionCandidates(structured, meetingTitle);
  const pendingCount = candidates.filter(
    (item) => !existingSyncedOrders.includes(item.sourceAgendaOrder),
  ).length;

  if (!candidates.length) {
    return (
      <p className="text-sm text-slate-600">
        No action items in minutes yet. Add action items per agenda item before syncing to planning.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Sync to planning board</h3>
        <p className="text-xs text-slate-600">
          Creates planning items from minute action items. Already synced items are skipped.
        </p>
      </div>
      <ul className="list-inside list-disc text-xs text-slate-700">
        {candidates.map((item) => (
          <li key={item.sourceAgendaOrder}>
            Agenda {item.sourceAgendaOrder}: {item.title}
            {existingSyncedOrders.includes(item.sourceAgendaOrder) ? " (synced)" : ""}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <form action={syncMinuteActionsToPlanning}>
          <input type="hidden" name="meetingId" value={meetingId} />
          <FormSubmitButton pendingLabel="Syncing...">
            {pendingCount
              ? `Add ${pendingCount} item(s) to planning`
              : "All action items already synced"}
          </FormSubmitButton>
        </form>
        <Link
          href="/admin/planning"
          className="inline-flex h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-white"
        >
          Open planning board
        </Link>
      </div>
      {actionsSyncedAt ? (
        <p className="text-xs text-slate-500">
          Last synced {new Date(actionsSyncedAt).toLocaleString()}.
        </p>
      ) : null}
    </div>
  );
}
