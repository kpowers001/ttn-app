-- TTN initial schema (PLAN.md §3)
-- Clients never write points directly: all point-awarding paths go through
-- security-definer functions; RLS keeps everything else read-mostly.

create extension if not exists postgis;

-- ── Profiles ────────────────────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (char_length(username) between 3 and 24),
  classification text not null check (classification in
    ('Freshman','Sophomore','Junior','Senior','Graduate Student')),
  avatar text not null default '😊',
  created_at timestamptz not null default now()
);

create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, username, classification)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'tiger_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data->>'classification', 'Freshman')
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Trails & locations ──────────────────────────────────────────────────────
create table trails (
  id text primary key,               -- 'food' | 'history' | 'farm' | 'arts'
  name text not null,
  icon text not null,
  color text not null,
  sort_order int not null default 0
);

create table locations (
  id text primary key,
  trail_id text not null references trails,
  name text not null,
  description text not null default '',
  lat double precision not null,
  lng double precision not null,
  radius_m int not null default 75,
  points int not null,
  active boolean not null default true,
  coords_verified boolean not null default false
);

-- ── Visits ──────────────────────────────────────────────────────────────────
create table visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  location_id text not null references locations,
  checked_in_at timestamptz not null default now(),
  lat double precision not null,
  lng double precision not null,
  unique (user_id, location_id)
);

-- ── Challenges ──────────────────────────────────────────────────────────────
create table challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  business_name text not null,
  location_id text references locations,
  trail_id text not null references trails,
  bonus_points int not null,
  icon text not null default '⚡',
  badge_icon text not null default '🏆',
  starts_at timestamptz not null,
  ends_at timestamptz not null
);

-- "active" is time-derived, so it lives in a view rather than a column
create view challenges_with_state as
select c.*, (c.starts_at <= now() and now() < c.ends_at) as active
from challenges c;

create table challenge_accepts (
  user_id uuid not null references profiles on delete cascade,
  challenge_id uuid not null references challenges on delete cascade,
  accepted_at timestamptz not null default now(),
  primary key (user_id, challenge_id)
);

create table challenge_completions (
  user_id uuid not null references profiles on delete cascade,
  challenge_id uuid not null references challenges on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, challenge_id)
);

-- ── Points ledger (append-only source of truth) ─────────────────────────────
create table points_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles on delete cascade,
  delta int not null,
  reason text not null,
  ref_type text,                     -- 'visit' | 'challenge' | 'redemption'
  ref_id text,
  created_at timestamptz not null default now()
);
create index points_ledger_user_created on points_ledger (user_id, created_at);

create view user_points as
select user_id,
       sum(delta)::int as balance,
       sum(delta) filter (where delta > 0)::int as lifetime_earned
from points_ledger
group by user_id;

create view weekly_leaderboard as
select p.id as user_id, p.username, p.classification, p.avatar,
       coalesce(sum(l.delta) filter (where l.delta > 0), 0)::int as points,
       rank() over (order by coalesce(sum(l.delta) filter (where l.delta > 0), 0) desc) as rank
from profiles p
left join points_ledger l
  on l.user_id = p.id and l.created_at >= date_trunc('week', now())
group by p.id;

create view alltime_leaderboard as
select p.id as user_id, p.username, p.classification, p.avatar,
       coalesce(sum(l.delta) filter (where l.delta > 0), 0)::int as points,
       rank() over (order by coalesce(sum(l.delta) filter (where l.delta > 0), 0) desc) as rank
from profiles p
left join points_ledger l on l.user_id = p.id
group by p.id;

-- ── Badges ──────────────────────────────────────────────────────────────────
create table badges (
  id text primary key,
  name text not null,
  icon text not null,
  rule_key text not null             -- interpreted by award logic in check_in()
);

create table user_badges (
  user_id uuid not null references profiles on delete cascade,
  badge_id text not null references badges,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ── Rewards & redemptions ───────────────────────────────────────────────────
create table rewards (
  id text primary key,
  name text not null,
  partner text not null,
  cost_points int not null,
  icon text not null default '🎁',
  active boolean not null default true
);

create table redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  reward_id text not null references rewards,
  code text not null default upper(substr(md5(random()::text), 1, 6)),
  status text not null default 'pending' check (status in ('pending','verified','expired')),
  created_at timestamptz not null default now()
);

-- ── check_in: the only path that awards visit/challenge points ──────────────
create function check_in(p_location_id text, p_lat double precision, p_lng double precision)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_loc locations%rowtype;
  v_distance double precision;
  v_points int := 0;
  v_challenge record;
  v_recent int;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  select * into v_loc from locations where id = p_location_id and active;
  if not found then
    raise exception 'unknown location';
  end if;

  -- Rate limit: at most 6 check-ins per hour
  select count(*) into v_recent from visits
   where user_id = v_user and checked_in_at > now() - interval '1 hour';
  if v_recent >= 6 then
    raise exception 'rate limited';
  end if;

  v_distance := ST_DistanceSphere(
    ST_MakePoint(p_lng, p_lat), ST_MakePoint(v_loc.lng, v_loc.lat));
  if v_distance > v_loc.radius_m then
    raise exception 'too far away (% m)', round(v_distance);
  end if;

  insert into visits (user_id, location_id, lat, lng)
  values (v_user, p_location_id, p_lat, p_lng);   -- unique constraint = one visit per location

  insert into points_ledger (user_id, delta, reason, ref_type, ref_id)
  values (v_user, v_loc.points, 'Visited ' || v_loc.name, 'visit', p_location_id);
  v_points := v_loc.points;

  -- Complete any accepted, live challenge tied to this location
  for v_challenge in
    select c.* from challenges c
    join challenge_accepts a on a.challenge_id = c.id and a.user_id = v_user
    where c.location_id = p_location_id
      and c.starts_at <= now() and now() < c.ends_at
      and not exists (select 1 from challenge_completions x
                      where x.user_id = v_user and x.challenge_id = c.id)
  loop
    insert into challenge_completions (user_id, challenge_id) values (v_user, v_challenge.id);
    insert into points_ledger (user_id, delta, reason, ref_type, ref_id)
    values (v_user, v_challenge.bonus_points, 'Completed ' || v_challenge.title,
            'challenge', v_challenge.id::text);
    v_points := v_points + v_challenge.bonus_points;
  end loop;

  -- First-check-in badge
  insert into user_badges (user_id, badge_id)
  select v_user, 'pioneer'
  where (select count(*) from visits where user_id = v_user) = 1
    and exists (select 1 from badges where id = 'pioneer')
  on conflict do nothing;

  return json_build_object('ok', true, 'points_awarded', v_points);
end $$;

-- ── redeem_reward ────────────────────────────────────────────────────────────
create function redeem_reward(p_reward_id text)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_reward rewards%rowtype;
  v_balance int;
  v_code text;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  select * into v_reward from rewards where id = p_reward_id and active;
  if not found then raise exception 'unknown reward'; end if;

  select coalesce(sum(delta), 0) into v_balance from points_ledger where user_id = v_user;
  if v_balance < v_reward.cost_points then raise exception 'insufficient points'; end if;

  insert into redemptions (user_id, reward_id) values (v_user, p_reward_id)
  returning code into v_code;
  insert into points_ledger (user_id, delta, reason, ref_type, ref_id)
  values (v_user, -v_reward.cost_points, 'Redeemed ' || v_reward.name, 'redemption', p_reward_id);

  return json_build_object('ok', true, 'code', v_code);
end $$;

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table trails enable row level security;
alter table locations enable row level security;
alter table visits enable row level security;
alter table challenges enable row level security;
alter table challenge_accepts enable row level security;
alter table challenge_completions enable row level security;
alter table points_ledger enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table rewards enable row level security;
alter table redemptions enable row level security;

-- Public catalog data: readable by any signed-in user
create policy "read trails" on trails for select to authenticated using (true);
create policy "read locations" on locations for select to authenticated using (true);
create policy "read challenges" on challenges for select to authenticated using (true);
create policy "read badges" on badges for select to authenticated using (true);
create policy "read rewards" on rewards for select to authenticated using (true);

-- Profiles: readable by all (leaderboard names), editable by owner
create policy "read profiles" on profiles for select to authenticated using (true);
create policy "update own profile" on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Personal rows: owner-read; user_badges/visits also feed public counts later if needed
create policy "read own visits" on visits for select to authenticated using (user_id = auth.uid());
create policy "read own ledger" on points_ledger for select to authenticated using (user_id = auth.uid());
create policy "read own redemptions" on redemptions for select to authenticated using (user_id = auth.uid());
create policy "read own completions" on challenge_completions for select to authenticated using (user_id = auth.uid());
create policy "read user badges" on user_badges for select to authenticated using (true);

-- Accepting a challenge is the one direct client write
create policy "accept challenges" on challenge_accepts for insert to authenticated
  with check (user_id = auth.uid());
create policy "read own accepts" on challenge_accepts for select to authenticated
  using (user_id = auth.uid());
