import { Label } from "@/components/ui/label";

type PlanningOption = {
  id: string;
  title: string;
  category: string;
  status: string;
  target_date: string | null;
};

type AgendaPlanningPickerProps = {
  items: PlanningOption[];
};

export function AgendaPlanningPicker({ items }: AgendaPlanningPickerProps) {
  if (!items.length) {
    return (
      <p className="text-xs text-slate-500">
        No open planning items yet. Add items on the Planning board first, or type agenda lines below.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Add from planning board</Label>
      <p className="text-xs text-slate-500">
        Selected items become agenda topics and are marked scheduled.
      </p>
      <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
        {items.map((item) => (
          <label key={item.id} className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="planningItemIds"
              value={item.id}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>
              <span className="font-medium text-slate-900">{item.title}</span>
              <span className="block text-xs text-slate-500">
                {item.category} / {item.status}
                {item.target_date ? ` / ${item.target_date}` : ""}
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
