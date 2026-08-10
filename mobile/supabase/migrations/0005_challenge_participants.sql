-- Participant counts for challenge cards. challenge_accepts RLS is
-- own-rows-only, so counts come from a security-definer aggregate that
-- exposes numbers, never identities. Same access pattern as
-- get_leaderboard: authenticated only.

create function get_challenge_participants()
returns table (challenge_id uuid, participants bigint)
language sql stable security definer set search_path = public as $$
  select challenge_id, count(*) from challenge_accepts group by challenge_id
$$;

revoke execute on function get_challenge_participants() from public, anon;
grant execute on function get_challenge_participants() to authenticated;
