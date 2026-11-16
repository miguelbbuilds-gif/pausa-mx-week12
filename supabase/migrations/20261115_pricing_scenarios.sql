-- Week 14 pricing scenarios and pricing event names.
-- Does not alter evaluations. Does not delete existing events.

alter table public.product_events drop constraint if exists product_events_name_chk;
alter table public.product_events add constraint product_events_name_chk check (event_name in (
  'evaluation_started',
  'validation_error',
  'comparison_viewed',
  'save_attempted',
  'evaluation_saved',
  'feedback_submitted',
  'pricing_viewed',
  'tier_selected',
  'simulator_started',
  'simulator_completed',
  'scenario_saved',
  'pricing_interest',
  'pricing_rejected'
));

alter table public.product_events drop constraint if exists product_events_detail_chk;
alter table public.product_events add constraint product_events_detail_chk check (
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
    'rate_limited',
    'free',
    'reuse',
    'pausa_plus',
    'consumer',
    'sponsor',
    'too_expensive',
    'not_useful_enough',
    'use_too_infrequently',
    'free_alternative',
    'prefer_one_time_payment',
    'prefer_employer_to_pay',
    'other'
  )
);

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
    'feedback_submitted',
    'pricing_viewed',
    'tier_selected',
    'simulator_started',
    'simulator_completed',
    'scenario_saved',
    'pricing_interest',
    'pricing_rejected'
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
    'rate_limited',
    'free',
    'reuse',
    'pausa_plus',
    'consumer',
    'sponsor',
    'too_expensive',
    'not_useful_enough',
    'use_too_infrequently',
    'free_alternative',
    'prefer_one_time_payment',
    'prefer_employer_to_pay',
    'other'
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

create table if not exists public.pricing_scenarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  segment text not null,
  users integer not null,
  conversion_rate numeric not null,
  monthly_price numeric not null,
  annual_price numeric,
  b2b_accounts integer not null default 0,
  employees_per_account integer not null default 0,
  price_per_employee numeric not null default 0,
  cac numeric not null default 0,
  onboarding_cost numeric not null default 0,
  support_cost numeric not null default 0,
  infrastructure_cost numeric not null default 0,
  payment_processing numeric not null default 0,
  review_cost numeric not null default 0,
  correction_cost numeric not null default 0,
  exception_cost numeric not null default 0,
  churn_assumption numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pricing_scenarios_name_chk check (char_length(name) between 1 and 80),
  constraint pricing_scenarios_segment_chk check (segment in ('consumer', 'sponsor')),
  constraint pricing_scenarios_users_chk check (users >= 0 and users <= 1000000000),
  constraint pricing_scenarios_conversion_chk check (conversion_rate >= 0 and conversion_rate <= 100),
  constraint pricing_scenarios_price_chk check (monthly_price >= 0 and monthly_price <= 1000000),
  constraint pricing_scenarios_counts_chk check (
    b2b_accounts >= 0 and b2b_accounts <= 1000000000
    and employees_per_account >= 0 and employees_per_account <= 1000000000
  )
);

create index if not exists pricing_scenarios_user_updated_idx
  on public.pricing_scenarios (user_id, updated_at desc);

alter table public.pricing_scenarios enable row level security;

revoke all on table public.pricing_scenarios from anon, authenticated;
grant select, insert, update, delete on table public.pricing_scenarios to authenticated;

drop policy if exists "pricing_scenarios_select_own" on public.pricing_scenarios;
create policy "pricing_scenarios_select_own"
  on public.pricing_scenarios
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "pricing_scenarios_insert_own" on public.pricing_scenarios;
create policy "pricing_scenarios_insert_own"
  on public.pricing_scenarios
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "pricing_scenarios_update_own" on public.pricing_scenarios;
create policy "pricing_scenarios_update_own"
  on public.pricing_scenarios
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "pricing_scenarios_delete_own" on public.pricing_scenarios;
create policy "pricing_scenarios_delete_own"
  on public.pricing_scenarios
  for delete
  to authenticated
  using (user_id = auth.uid());
