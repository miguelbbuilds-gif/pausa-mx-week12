-- Week 13 privacy-conscious product events.
-- Does not store amounts, names, emails, passwords, or tokens.
-- Does not alter public.evaluations.

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;

revoke all on table public.app_admins from anon, authenticated;

create or replace function public.is_founder()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_founder() from public, anon;
grant execute on function public.is_founder() to authenticated;

insert into public.app_admins (user_id)
select id
from auth.users
where email = 'miguelb.builds@gmail.com'
on conflict (user_id) do nothing;

create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  anonymous_session_id text not null,
  event_name text not null,
  detail_code text,
  created_at timestamptz not null default now(),
  constraint product_events_session_chk check (anonymous_session_id ~ '^[A-Za-z0-9_-]{16,64}$'),
  constraint product_events_name_chk check (event_name in (
    'evaluation_started',
    'validation_error',
    'comparison_viewed',
    'save_attempted',
    'evaluation_saved',
    'feedback_submitted'
  )),
  constraint product_events_detail_chk check (
    detail_code is null
    or detail_code in (
      'availablemoney',
      'essentialexpenses',
      'committedpayments',
      'purchaseprice',
      'paymentmethod',
      'downpayment',
      'installmentcount',
      'installmentamount',
      'form',
      'full',
      'installments',
      'unauthenticated',
      'unconfigured',
      'invalid',
      'error',
      'saved',
      'ok',
      'rate_limited'
    )
  )
);

create index if not exists product_events_session_created_idx
  on public.product_events (anonymous_session_id, created_at desc);

alter table public.product_events enable row level security;

revoke all on table public.product_events from anon, authenticated;
grant select on table public.product_events to authenticated;

drop policy if exists "product_events_founder_select" on public.product_events;
create policy "product_events_founder_select"
  on public.product_events
  for select
  to authenticated
  using (public.is_founder());

create or replace function public.record_product_event(
  p_session text,
  p_event text,
  p_detail text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  recent integer;
  uid uuid := auth.uid();
  detail text := nullif(p_detail, '');
begin
  if p_session is null or p_session !~ '^[A-Za-z0-9_-]{16,64}$' then
    return jsonb_build_object('ok', false, 'code', 'bad_session');
  end if;

  if p_event not in (
    'evaluation_started',
    'validation_error',
    'comparison_viewed',
    'save_attempted',
    'evaluation_saved',
    'feedback_submitted'
  ) then
    return jsonb_build_object('ok', false, 'code', 'bad_event');
  end if;

  if detail is not null and detail not in (
    'availablemoney',
    'essentialexpenses',
    'committedpayments',
    'purchaseprice',
    'paymentmethod',
    'downpayment',
    'installmentcount',
    'installmentamount',
    'form',
    'full',
    'installments',
    'unauthenticated',
    'unconfigured',
    'invalid',
    'error',
    'saved',
    'ok',
    'rate_limited'
  ) then
    return jsonb_build_object('ok', false, 'code', 'bad_detail');
  end if;

  select count(*) into recent
  from public.product_events
  where anonymous_session_id = p_session
    and created_at > now() - interval '1 hour';

  if recent >= 40 then
    return jsonb_build_object('ok', false, 'code', 'rate_limited');
  end if;

  insert into public.product_events (user_id, anonymous_session_id, event_name, detail_code)
  values (uid, p_session, p_event, detail);

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.record_product_event(text, text, text) from public;
grant execute on function public.record_product_event(text, text, text) to anon, authenticated;
