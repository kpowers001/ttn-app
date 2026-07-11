# TTN — Tuskegee Trail Network (mobile)

Expo (React Native + TypeScript) app. Product docs, plan, and location list live one directory up (`../PLAN.md`, `../LOCATIONS.md`).

## Run it

```bash
npm install
npx expo start        # then press i (iOS simulator), a (Android), or w (web)
```

Without a `.env` the app runs in **mock mode**: fixture data from `src/lib/mock-data.ts` and fake auth (any credentials sign you in; sign-up validates the `@tuskegee.edu` domain). This is intentional so screens can be built and demoed before the backend exists.

The Map tab renders `react-native-maps` on iOS/Android and a location-list fallback on web (`map.web.tsx`).

## Wiring up Supabase (when the project is created)

1. Create a project at supabase.com.
2. Run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql` (SQL editor or `supabase db push`).
3. Copy `.env.example` → `.env` and fill in the project URL + anon key.
4. Auth then goes through Supabase; screens still read mock data until each is wired to queries (next milestone).

**Before seeding for real:** replace placeholder coordinates (`coords_verified = false`) with geocoded values — see `../LOCATIONS.md` flags.

## Structure

```
src/
  app/              expo-router routes
    (auth)/         welcome, sign-in, sign-up (redirects to tabs when signed in)
    (tabs)/         home (index), map, challenges, leaderboard, rewards, profile
  components/       ui.tsx (Pill, Card, buttons, fields), challenge-card.tsx
  lib/              theme.ts (design tokens), types.ts, mock-data.ts,
                    supabase.ts (null in mock mode), auth-context.tsx
supabase/
  migrations/       0001_init.sql — schema, RLS, check_in() + redeem_reward()
  seed.sql          trails, 9 pilot partner locations, badges, rewards, sample challenges
```

## Key invariants

- Clients never insert into `points_ledger` — all point awards go through the `check_in()` / `redeem_reward()` Postgres functions (security definer, GPS-distance + rate-limit validated).
- Balances derive from the ledger (`user_points` view); leaderboards are the `weekly_leaderboard` / `alltime_leaderboard` views.
- Design tokens in `src/lib/theme.ts` mirror the prototype (`../index.html`) and `../DESIGN.md`.
