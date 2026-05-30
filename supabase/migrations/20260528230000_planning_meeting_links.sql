alter table public.meetings
  add column if not exists linked_planning_item_ids uuid[] not null default '{}',
  add column if not exists minutes_reminder_sent_at timestamptz;

alter table public.planning_items
  add column if not exists source_meeting_id uuid references public.meetings (id) on delete set null,
  add column if not exists source_agenda_order int,
  add column if not exists synced_from_minutes_at timestamptz;

alter table public.meeting_minutes
  add column if not exists actions_synced_at timestamptz;

create index if not exists idx_planning_items_source_meeting
  on public.planning_items (source_meeting_id)
  where source_meeting_id is not null;

comment on column public.meetings.linked_planning_item_ids is
  'Planning board items used to build this meeting agenda.';

comment on column public.planning_items.source_meeting_id is
  'Set when a planning item was created from published meeting minutes action items.';
