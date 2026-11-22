-- Week 15 distribution events.
-- Extends the allowlist. Does not delete events, evaluations, or scenarios.

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
  'pricing_rejected',
  'launch_viewed',
  'asset_viewed',
  'product_cta_clicked',
  'share_clicked',
  'content_series_viewed'
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
    'other',
    'launch',
    'antes_de_comprar',
    'lo_que_comprometes',
    'comprar_vs_esperar',
    'carousel',
    'storyboard',
    'card',
    'product',
    'copy_link'
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
    'pricing_rejected',
    'launch_viewed',
    'asset_viewed',
    'product_cta_clicked',
    'share_clicked',
    'content_series_viewed'
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
    'other',
    'launch',
    'antes_de_comprar',
    'lo_que_comprometes',
    'comprar_vs_esperar',
    'carousel',
    'storyboard',
    'card',
    'product',
    'copy_link'
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
