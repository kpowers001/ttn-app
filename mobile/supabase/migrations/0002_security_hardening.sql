-- Security hardening (Supabase security advisor findings, Jul 2026)

-- ── 1. Views bypassed RLS ────────────────────────────────────────────────────
-- Views default to running as their owner (postgres), which skips row level
-- security — anonymous visitors could read every student's username and
-- points. user_points and challenges_with_state behave identically as
-- invoker views. The leaderboards genuinely need cross-user aggregation, so
-- they become one security-definer function that only signed-in users can
-- execute (and it exposes only fields the leaderboard shows).

alter view user_points set (security_invoker = on);
alter view challenges_with_state set (security_invoker = on);

drop view weekly_leaderboard;
drop view alltime_leaderboard;

create function get_leaderboard(p_period text)
returns table (user_id uuid, username text, classification text, avatar text, points int, rank bigint)
language sql stable security definer set search_path = public as $$
  select p.id, p.username, p.classification, p.avatar,
         coalesce(sum(l.delta) filter (where l.delta > 0), 0)::int as points,
         rank() over (order by coalesce(sum(l.delta) filter (where l.delta > 0), 0) desc) as rank
  from profiles p
  left join points_ledger l
    on l.user_id = p.id
   and (p_period <> 'weekly' or l.created_at >= date_trunc('week', now()))
  group by p.id
$$;

revoke execute on function get_leaderboard(text) from public, anon;
grant execute on function get_leaderboard(text) to authenticated;

-- ── 2. The anon role needs nothing in this schema ────────────────────────────
-- Every read in the app requires a signed-in student; strip the default
-- grants so unauthenticated requests fail at the permission layer, not
-- just at RLS.
revoke all on all tables in schema public from anon;
revoke execute on all functions in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke execute on functions from anon;

-- ── 3. Trigger + PostGIS internals are not client API ────────────────────────
revoke execute on function handle_new_user() from public, authenticated;

do $$ begin
  revoke execute on function st_estimatedextent(text, text, text) from authenticated;
  revoke execute on function st_estimatedextent(text, text, text, boolean) from authenticated;
  revoke execute on function st_estimatedextent(text, text) from authenticated;
exception when undefined_function then null;
end $$;

-- ── 4. spatial_ref_sys (PostGIS system table, public reference data) ─────────
-- RLS can only be enabled by its owner (the extension), which managed
-- Postgres may not allow — revoking client access clears the exposure
-- either way.
do $$ begin
  revoke all on table spatial_ref_sys from anon, authenticated;
exception when others then null;
end $$;
do $$ begin
  alter table spatial_ref_sys enable row level security;
exception when others then null;
end $$;
