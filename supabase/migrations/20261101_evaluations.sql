-- PAUSA MX evaluations. Run in the Supabase SQL editor or CLI.
-- Service role is never used by the Next.js browser bundle.

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  inputs jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evaluations_user_id_created_at_idx
  on public.evaluations (user_id, created_at desc);

alter table public.evaluations enable row level security;

drop policy if exists "evaluations_select_own" on public.evaluations;
create policy "evaluations_select_own"
  on public.evaluations
  for select
  using (auth.uid() = user_id);

drop policy if exists "evaluations_insert_own" on public.evaluations;
create policy "evaluations_insert_own"
  on public.evaluations
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "evaluations_update_own" on public.evaluations;
create policy "evaluations_update_own"
  on public.evaluations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "evaluations_delete_own" on public.evaluations;
create policy "evaluations_delete_own"
  on public.evaluations
  for delete
  using (auth.uid() = user_id);
