create table responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  view_order text[] not null,
  screener text not null,
  ratings jsonb not null,
  open_ended jsonb,
  trust_pick text,
  trust_why text,
  one_change text
);

alter table responses enable row level security;

-- Respondents may only write. No select, update, or delete policies exist
-- for the anon role, so submitted data cannot be read back from the client.
create policy "anonymous insert only" on responses
  for insert to anon with check (true);
