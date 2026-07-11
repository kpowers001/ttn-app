# TTN — Build Plan

Tuskegee Trail Network mobile app. Target: pilot event, early August 2026 (~4.5 weeks from July 3).

---

## 1. Tech Stack Recommendation: Cross-Platform (React Native + Expo)

**Recommendation: React Native with Expo, in TypeScript.** Not native.

Why:

- **Both platforms, one codebase, one developer, 4.5 weeks.** Two native codebases is not feasible on this timeline.
- **Nothing in TTN needs deep native capability.** The feature set is maps, GPS check-ins, lists, auth, and push notifications — all first-class in the Expo ecosystem (`react-native-maps`, `expo-location`, `expo-notifications`). No AR, no background tracking, no heavy custom rendering.
- **The mockup is already React.** The components, design tokens, and screen structure in `index.html` translate almost 1:1 into React Native components.
- **Expo EAS** handles builds, code signing, TestFlight/Play Store submission — the highest-friction part of shipping mobile on a deadline.

Flutter would also work but throws away the React mockup. Native (Swift/Kotlin) is the right call only if the app later needs platform-specific depth — it can always be rewritten post-pilot if TTN outgrows this.

### Stack summary

| Layer | Choice | Notes |
|---|---|---|
| App | Expo (React Native) + TypeScript | Expo Router for navigation |
| Maps | `react-native-maps` | Apple Maps on iOS (free), Google Maps on Android (free tier is plenty for a pilot) |
| Location | `expo-location` | Foreground only — check-in on demand, no background tracking |
| Backend | Supabase | Postgres + Auth + Realtime + Edge Functions, generous free tier |
| Auth | Supabase Auth, email/password restricted to `@tuskegee.edu` for students | Business/admin accounts created manually for pilot |
| Push | `expo-notifications` | Nice-to-have; cut first if time is short |
| Admin | Supabase Studio + a tiny web dashboard (only if time allows) | See §5 |

**Why Supabase over Firebase:** the data is relational at its core — a points ledger, visits joined to locations joined to trails, leaderboards that are one SQL query. Postgres row-level security also gives server-side enforcement of "you can't award yourself points" without writing a custom API server.

---

## 2. Pilot Scope

The mockup shows the full vision. For an early-August pilot, build the loop that matters — **visit place → earn points → climb leaderboard → redeem reward** — and cut everything that doesn't feed it.

### In scope (v1 pilot)

| Feature | Notes |
|---|---|
| Splash, onboarding, student auth | `.edu` email validation; skip role-select screen (see cuts) |
| **Map tab** | Real map of Tuskegee, trail-colored pins, trail filter pills, location bottom sheet — the soul of the app |
| **Check-in** | GPS geofence: "Check in" button enabled within ~75m of a location; server validates coordinates + one check-in per location per user (see §4) |
| Points + points ledger | Every earn/spend is a ledger row; balances and history derive from it |
| **Challenges tab** | Time-boxed challenges tied to locations; accept → check in at the location during the window → bonus points |
| **Leaderboard tab** | Weekly + all-time, podium + list. Weekly is the pilot's competitive engine |
| **Rewards tab** | Tier display (Bronze→Legend) + redemption: student taps redeem, shows a 6-digit code screen to the business, business/staff verifies. No POS integration |
| **Profile tab** | Stats, trail progress bars, badge grid, settings, sign out |
| Badges | Auto-awarded on rules (first check-in, complete a trail, complete 3 challenges…). Fixed set of ~8 from the mockup |

### Cut from pilot (build later)

- **Business-owner mobile experience + role select.** PRODUCT.md says owners work from SkyLark and "their surface is minimal." For the pilot, challenges and locations are seeded by you via admin. Students-only app.
- **SkyLark integration.** Unless SkyLark has a public API and a live feed for Tuskegee businesses (confirm — see §7), pilot content is entered manually. Model the data so a SkyLark sync can be added later.
- **Stories.** Warm and on-brand, but it's a content pipeline (video/photo hosting, capture from owners) that doesn't feed the pilot loop. The home-screen story row can ship as static "meet the people" profile cards if content exists, else cut.
- **Friends / social graph.** Leaderboard "Friends" filter needs a friend system. Weekly leaderboard alone carries the pilot.
- **Monthly leaderboard** (weekly + all-time is enough), **push notifications** (nice-to-have), password reset flows beyond Supabase defaults.

---

## 3. Data Model (Supabase / Postgres)

```
profiles           id (=auth uid), username, classification, avatar, created_at
trails             id, name, icon, color, sort_order
locations          id, trail_id, name, description, lat, lng, radius_m, points, active
visits             id, user_id, location_id, checked_in_at, lat, lng   [unique (user_id, location_id)]
challenges         id, title, business_name, location_id, trail_id, bonus_points,
                   badge_id?, starts_at, ends_at, active
challenge_accepts  id, user_id, challenge_id, accepted_at
challenge_completions id, user_id, challenge_id, completed_at
points_ledger      id, user_id, delta, reason, ref_type, ref_id, created_at
badges             id, name, icon, rule_key
user_badges        user_id, badge_id, earned_at
rewards            id, name, partner, cost_points, active
redemptions        id, user_id, reward_id, code, status (pending/verified/expired), created_at
```

- **Balance = `sum(points_ledger.delta)`** per user. Never store a mutable balance.
- **Leaderboard = SQL view** over the ledger, windowed by week. Realtime subscription or pull-to-refresh.
- **Tier** derived from all-time earned points (thresholds from the mockup: 0/1k/2.5k/5k/10k).
- All writes that award points go through **Postgres functions / Edge Functions** — the client never inserts into `points_ledger` directly. RLS: users read broadly, write almost nothing.

---

## 4. Check-in Verification (key design decision)

**Recommendation: GPS geofence, validated server-side.**

Flow: student taps a pin → bottom sheet shows "Check in" → app sends current coordinates to an Edge Function → server checks distance to the location (within `radius_m`, default ~75m), uniqueness, and challenge windows → inserts `visits` + ledger rows + any badge/challenge completions atomically → app celebrates.

- GPS spoofing is possible but not worth defending against for a campus pilot; the deterrent is a visible leaderboard in a small community.
- **QR codes at each business** are the more fraud-proof alternative (scan-to-check-in) but require printing/placing/maintaining codes at every location before the event. Good post-pilot upgrade, or use QR only for the highest-value challenge check-ins at the pilot event itself.
- Rate-limit: max N check-ins per hour per user to stop drive-by sweeps.

---

## 5. Admin (pilot-grade)

You need to: add/edit locations, create challenges, verify redemptions, watch participation.

- **Week 1–3:** Supabase Studio (the built-in table editor) is the admin panel. Zero build cost.
- **Week 4, if time allows:** a single-page web dashboard (Next.js or plain Vite + Supabase JS) with challenge create/edit and a redemption-verify screen for business staff.
- Redemption verification for the pilot can be as simple as: staff sees the student's code screen (name + code + reward, with a live timestamp so screenshots are obvious), taps "mark verified" in the dashboard — or you verify manually at the event.

---

## 6. Timeline (July 3 → pilot early August)

**Week 0 — immediately (this week):**
- **Enroll in the Apple Developer Program today ($99/yr).** Enrollment/verification can take days; it gates everything on iOS. Create the Google Play Console account ($25) too.
- Confirm the pilot's real location list (names, coordinates, point values) and reward inventory with partners.

**Week 1 (Jul 6–10) — Foundation:**
- Expo project, TypeScript, Expo Router, design tokens from DESIGN.md, tab shell
- Supabase project, schema + RLS, seed trails/locations
- Auth: sign up / sign in / session persistence, `.edu` validation
- Map tab with real map, pins, filters, bottom sheet

**Week 2 (Jul 13–17) — The core loop:**
- Check-in Edge Function + client flow + celebration state
- Points ledger, home tab (greeting, tier progress, active challenges)
- Challenges tab: list, filters, accept, completion via check-in

**Week 3 (Jul 20–24) — Competition & rewards:**
- Leaderboard (weekly + all-time, podium, realtime or refresh)
- Rewards tab: tiers, redeem flow with codes, history
- Profile tab: stats, trail progress, badges; badge award rules
- **First TestFlight + Play internal build mid-week** — get it on your phone

**Week 4 (Jul 27–31) — Harden & pilot prep:**
- Real-device GPS testing *in Tuskegee* at the actual locations; tune radii
- Empty states, error states, offline behavior, accessibility labels (WCAG A per PRODUCT.md)
- Seed all pilot content; recruit 5–10 beta students via TestFlight
- Admin dashboard if time allows; push notifications if time allows

**Buffer (Aug 1–pilot):** bug fixes from beta feedback, event-day dry run.

### Distribution reality check (important)

- **Do not plan on public App Store / Play Store listings for the pilot.** Apple review adds days and rejection risk; Google requires new personal developer accounts to run a closed test with 12+ testers for 14 days before production access.
- **Pilot distribution: TestFlight (iOS) + Play Store closed/internal testing track (Android).** Both handle hundreds of testers via an invite link and are the standard way to run exactly this kind of pilot. Public store launch happens after the pilot, with pilot feedback baked in.

---

## 7. Open questions (need your answers)

1. **SkyLark** — API access unknown; Kendall following up (as of Jul 3). Plan assumes manual content entry for the pilot either way.
2. **Locations** — ✅ 9 partners confirmed (Jul 3): B&B Barbecue, New House of Stewarts, The Shed, Airmen Museum, Carver Museum, Legacy Museum, Shady Grove Blueberry Patch, Tuskegee Honey, Macon County Farmers Market. Details + open flags (The Shed address, Tuskegee Honey venue, Shady Grove season) in `LOCATIONS.md`.
3. **Rewards** — are the bookstore/dining rewards agreed with those partners, or should the pilot reward list be event-specific prizes?
4. **Pilot scale** — roughly how many students at the event? (Affects nothing architectural, but matters for the Google/Apple tester setup.)
5. **Accounts** — do you already have Apple Developer / Google Play accounts, and will this publish under you personally or an organization (LLC/university)? Org enrollment takes longer — decide now.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Apple Developer enrollment delay | Enroll immediately (Week 0) |
| GPS accuracy indoors (museums) | Generous radii, tune on-site in Week 4; QR fallback for problem locations |
| Partner content not confirmed in time | App works with any seeded content; lock the location list by Week 2 |
| Scope creep from the mockup | The cut list in §2 is the contract; everything cut is post-pilot |
| Single developer + fixed date | Buffer week + features ordered so anything unfinished in Week 4 (push, admin UI, stories) drops without breaking the loop |
