alter table public.meetings
  add column if not exists agenda_items jsonb not null default '[]'::jsonb;

alter table public.meeting_minutes
  add column if not exists structured_minutes jsonb not null default '{}'::jsonb,
  add column if not exists attendees_present uuid[] not null default '{}';

comment on column public.meetings.agenda_items is
  'Ordered agenda topics set before the meeting. Example: [{"order":1,"topic":"Opening"}]';

comment on column public.meeting_minutes.structured_minutes is
  'Structured minutes by agenda item: discussion, speaker, decisions, action items.';
