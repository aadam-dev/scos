import {
  publishStructuredMeetingMinutes,
  saveMeetingMinutesDraft,
} from "@/actions/minutes";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  mergeAgendaWithMinutes,
  type AgendaItem,
  type StructuredMinutes,
} from "@/lib/meeting-minutes";

type MemberOption = {
  id: string;
  full_name: string;
};

type StructuredMinutesFormProps = {
  meetingId: string;
  agenda: AgendaItem[];
  existing?: StructuredMinutes | null;
  attendeesPresent?: string[];
  members: MemberOption[];
  published: boolean;
};

export function StructuredMinutesForm({
  meetingId,
  agenda,
  existing,
  attendeesPresent = [],
  members,
  published,
}: StructuredMinutesFormProps) {
  const items = mergeAgendaWithMinutes(agenda, existing);

  return (
    <form className="space-y-6">
      <input type="hidden" name="meetingId" value={meetingId} />

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">Attendees present</h2>
        <p className="mb-3 text-xs text-slate-600">Select members who attended this meeting.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {members.map((member) => (
            <label key={member.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="attendeesPresent"
                value={member.id}
                defaultChecked={attendeesPresent.includes(member.id)}
                className="h-4 w-4 rounded border-slate-300"
              />
              {member.full_name}
            </label>
          ))}
        </div>
      </section>

      {items.map((item, index) => (
        <section
          key={item.order}
          className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            {item.order}. {item.topic}
          </h2>
          <input type="hidden" name={`topic-${index}`} value={item.topic} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`speaker-${index}`}>Who spoke / led</Label>
              <Input
                id={`speaker-${index}`}
                name={`speaker-${index}`}
                defaultValue={item.speaker ?? ""}
                placeholder="Name or role"
              />
            </div>
            <div>
              <Label htmlFor={`timeNoted-${index}`}>Time noted</Label>
              <Input
                id={`timeNoted-${index}`}
                name={`timeNoted-${index}`}
                defaultValue={item.time_noted ?? ""}
                placeholder="e.g. 19:30"
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`discussion-${index}`}>Discussion</Label>
            <Textarea
              id={`discussion-${index}`}
              name={`discussion-${index}`}
              defaultValue={item.discussion ?? ""}
              placeholder="What was said on this agenda item"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor={`decisions-${index}`}>Decisions</Label>
            <Textarea
              id={`decisions-${index}`}
              name={`decisions-${index}`}
              defaultValue={item.decisions ?? ""}
              placeholder="Decisions made"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor={`actionItems-${index}`}>Action items</Label>
            <Textarea
              id={`actionItems-${index}`}
              name={`actionItems-${index}`}
              defaultValue={item.action_items ?? ""}
              placeholder="Owners and next steps"
              rows={2}
            />
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <Label htmlFor="closingNotes">Closing notes</Label>
        <Textarea
          id="closingNotes"
          name="closingNotes"
          defaultValue={existing?.closing_notes ?? ""}
          placeholder="Any final remarks or next meeting date"
          rows={3}
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <FormSubmitButton formAction={saveMeetingMinutesDraft} variant="outline" pendingLabel="Saving...">
          Save draft
        </FormSubmitButton>
        <FormSubmitButton formAction={publishStructuredMeetingMinutes} pendingLabel="Publishing...">
          {published ? "Update published minutes" : "Publish minutes"}
        </FormSubmitButton>
      </div>
    </form>
  );
}
