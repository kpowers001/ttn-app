-- Move PostGIS out of the public schema (advisor: extension_in_public,
-- rls_disabled_in_public on spatial_ref_sys, st_* function warnings).
-- Safe here: no geometry columns exist — check_in only calls ST_ functions
-- at runtime, and plpgsql resolves those through search_path.

drop extension postgis cascade;
create extension postgis with schema extensions;

alter function check_in(text, double precision, double precision)
  set search_path = public, extensions;

-- Client-API functions: strip the default PUBLIC execute grant (anon and
-- everything else inherit through PUBLIC) and grant back only what the app
-- needs. The functions themselves still gate on auth.uid().
revoke execute on function check_in(text, double precision, double precision) from public, anon;
grant execute on function check_in(text, double precision, double precision) to authenticated;

revoke execute on function redeem_reward(text) from public, anon;
grant execute on function redeem_reward(text) to authenticated;
