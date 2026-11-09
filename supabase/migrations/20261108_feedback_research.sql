-- Week 13 feedback and founder research log.
-- Does not alter public.evaluations.
-- Research rows are not readable by the public.

create table if not exists public.comparison_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  anonymous_session_id text not null,
  confusing_part text,
  would_return text,
  created_at timestamptz not null default now(),
  constraint comparison_feedback_session_chk check (anonymous_session_id ~ '^[A-Za-z0-9_-]{16,64}$'),
  constraint comparison_feedback_comment_chk check (
    confusing_part is null or char_length(confusing_part) <= 400
  ),
  constraint comparison_feedback_return_chk check (
    would_return is null or would_return in ('yes', 'maybe', 'no')
  ),
  constraint comparison_feedback_content_chk check (
    (confusing_part is not null and char_length(btrim(confusing_part)) > 0)
    or would_return is not null
  )
);

create index if not exists comparison_feedback_session_created_idx
  on public.comparison_feedback (anonymous_session_id, created_at desc);

alter table public.comparison_feedback enable row level security;

revoke all on table public.comparison_feedback from anon, authenticated;
grant select on table public.comparison_feedback to authenticated;

drop policy if exists "comparison_feedback_founder_select" on public.comparison_feedback;
create policy "comparison_feedback_founder_select"
  on public.comparison_feedback
  for select
  to authenticated
  using (public.is_founder());

create or replace function public.submit_comparison_feedback(
  p_session text,
  p_comment text,
  p_would_return text,
  p_trap text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  recent integer;
  comment text := nullif(btrim(coalesce(p_comment, '')), '');
  choice text := nullif(p_would_return, '');
  uid uuid := auth.uid();
begin
  if coalesce(p_trap, '') <> '' then
    return jsonb_build_object('ok', false, 'code', 'rejected');
  end if;

  if p_session is null or p_session !~ '^[A-Za-z0-9_-]{16,64}$' then
    return jsonb_build_object('ok', false, 'code', 'bad_session');
  end if;

  if comment is not null and char_length(comment) > 400 then
    return jsonb_build_object('ok', false, 'code', 'too_long');
  end if;

  if comment is not null and comment ~* '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}' then
    return jsonb_build_object('ok', false, 'code', 'contact');
  end if;

  if choice is not null and choice not in ('yes', 'maybe', 'no') then
    return jsonb_build_object('ok', false, 'code', 'bad_choice');
  end if;

  if comment is null and choice is null then
    return jsonb_build_object('ok', false, 'code', 'empty');
  end if;

  if exists (
    select 1
    from public.comparison_feedback
    where anonymous_session_id = p_session
      and created_at > now() - interval '20 seconds'
  ) then
    return jsonb_build_object('ok', false, 'code', 'rate_limited');
  end if;

  select count(*) into recent
  from public.comparison_feedback
  where anonymous_session_id = p_session
    and created_at > now() - interval '24 hours';

  if recent >= 5 then
    return jsonb_build_object('ok', false, 'code', 'rate_limited');
  end if;

  insert into public.comparison_feedback (
    user_id,
    anonymous_session_id,
    confusing_part,
    would_return
  ) values (uid, p_session, comment, choice);

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.submit_comparison_feedback(text, text, text, text) from public;
grant execute on function public.submit_comparison_feedback(text, text, text, text) to anon, authenticated;

create table if not exists public.research_sessions (
  id uuid primary key default gen_random_uuid(),
  session_code text not null,
  participant_role text not null,
  relationship text not null,
  session_date date not null,
  task_attempted text not null,
  observed_difficulty text not null,
  verbatim_quote text not null,
  severity text not null,
  evidence_ref text not null,
  consent_recorded boolean not null,
  verification_status text not null default 'unverified',
  is_demo boolean not null default false,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  constraint research_sessions_code_chk check (session_code ~ '^[A-Za-z0-9_-]{2,40}$'),
  constraint research_sessions_relationship_chk check (relationship in ('unknown', 'known')),
  constraint research_sessions_severity_chk check (severity in ('low', 'medium', 'high', 'critical')),
  constraint research_sessions_verification_chk check (verification_status in ('unverified', 'verified')),
  constraint research_sessions_consent_chk check (consent_recorded = true),
  constraint research_sessions_quote_chk check (char_length(verbatim_quote) between 1 and 1000),
  constraint research_sessions_role_chk check (char_length(participant_role) between 3 and 120)
);

alter table public.research_sessions enable row level security;

revoke all on table public.research_sessions from anon, authenticated;
grant select, insert, update, delete on table public.research_sessions to authenticated;

drop policy if exists "research_sessions_founder_all" on public.research_sessions;
create policy "research_sessions_founder_all"
  on public.research_sessions
  for all
  to authenticated
  using (public.is_founder())
  with check (public.is_founder() and created_by = auth.uid());

create table if not exists public.research_priorities (
  id uuid primary key default gen_random_uuid(),
  rank smallint not null,
  title text not null,
  summary text not null,
  is_demo boolean not null default false,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  constraint research_priorities_rank_chk check (rank between 1 and 3),
  constraint research_priorities_title_chk check (char_length(title) between 3 and 160),
  constraint research_priorities_summary_chk check (char_length(summary) between 3 and 800),
  constraint research_priorities_rank_unique unique (rank)
);

alter table public.research_priorities enable row level security;

revoke all on table public.research_priorities from anon, authenticated;
grant select, insert, update, delete on table public.research_priorities to authenticated;

drop policy if exists "research_priorities_founder_all" on public.research_priorities;
create policy "research_priorities_founder_all"
  on public.research_priorities
  for all
  to authenticated
  using (public.is_founder())
  with check (public.is_founder() and created_by = auth.uid());

create or replace function public.guard_research_priority()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  verified_real integer;
begin
  if new.is_demo then
    return new;
  end if;

  select count(*) into verified_real
  from public.research_sessions
  where is_demo = false
    and verification_status = 'verified';

  if verified_real < 5 then
    raise exception 'priority_requires_five_verified_sessions';
  end if;

  return new;
end;
$$;

drop trigger if exists research_priorities_require_sessions on public.research_priorities;
create trigger research_priorities_require_sessions
  before insert or update on public.research_priorities
  for each row
  execute function public.guard_research_priority();
