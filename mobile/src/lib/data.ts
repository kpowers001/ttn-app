import { useCallback, useEffect, useState } from 'react';
import * as mock from './mock-data';
import { supabase } from './supabase';
import type {
  Badge,
  Challenge,
  LeaderboardEntry,
  LeaderboardPeriod,
  LedgerEntry,
  Profile,
  Reward,
  Trail,
  TrailKey,
  TrailLocation,
} from './types';

// Live data hooks. Each queries Supabase when the client is configured and
// falls back to the mock fixtures otherwise, returning the same UI types
// either way. On query errors the fallback (or last good data) is kept so
// screens never crash on a network hiccup.

export interface Loadable<T> {
  data: T;
  loading: boolean;
  refresh: () => void;
}

function useLive<T>(fetcher: () => Promise<T>, fallback: T): Loadable<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(supabase != null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    setLoading(true);
    fetcher()
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((err) => {
        console.warn('live data fetch failed, keeping fallback:', err?.message ?? err);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, refresh };
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase!.auth.getUser();
  const id = data.user?.id;
  if (!id) throw new Error('not signed in');
  return id;
}

// ── Catalog ──────────────────────────────────────────────────────────────────

export function useTrails(): Loadable<Trail[]> {
  return useLive(async () => {
    const { data, error } = await supabase!
      .from('trails')
      .select('id,name,icon,color')
      .order('sort_order');
    if (error) throw error;
    return data.map((t) => ({ key: t.id as TrailKey, name: t.name, icon: t.icon, color: t.color }));
  }, mock.TRAILS);
}

export function useLocations(): Loadable<TrailLocation[]> {
  return useLive(async () => {
    const [locs, visits] = await Promise.all([
      supabase!.from('locations').select('*').eq('active', true),
      supabase!.from('visits').select('location_id'),
    ]);
    if (locs.error) throw locs.error;
    if (visits.error) throw visits.error;
    const visited = new Set(visits.data.map((v) => v.location_id));
    return locs.data.map((l): TrailLocation => ({
      id: l.id,
      trailKey: l.trail_id as TrailKey,
      name: l.name,
      description: l.description,
      lat: l.lat,
      lng: l.lng,
      radiusM: l.radius_m,
      points: l.points,
      visited: visited.has(l.id),
      coordsUnverified: !l.coords_verified,
    }));
  }, mock.LOCATIONS);
}

function expiresLabel(iso: string): string {
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `${days} days`;
  return 'Next week';
}

export function useChallenges(): Loadable<Challenge[]> {
  return useLive(async () => {
    const { data, error } = await supabase!
      .from('challenges_with_state')
      .select('*')
      .order('starts_at');
    if (error) throw error;
    return data.map((c) => ({
      id: c.id,
      title: c.title,
      businessName: c.business_name,
      trailKey: c.trail_id as TrailKey,
      bonusPoints: c.bonus_points,
      // Active challenges count down to their end; upcoming ones to their start
      expiresLabel: expiresLabel(c.active ? c.ends_at : c.starts_at),
      icon: c.icon,
      badgeIcon: c.badge_icon,
      active: c.active,
    }));
  }, mock.CHALLENGES);
}

export function useRewards(): Loadable<Reward[]> {
  return useLive(async () => {
    const { data, error } = await supabase!
      .from('rewards')
      .select('*')
      .eq('active', true)
      .order('cost_points');
    if (error) throw error;
    return data.map((r) => ({
      id: r.id,
      name: r.name,
      partner: r.partner,
      costPoints: r.cost_points,
      icon: r.icon,
    }));
  }, mock.REWARDS);
}

// ── Per-user ─────────────────────────────────────────────────────────────────

export function useMe(): Loadable<Profile> {
  return useLive(async () => {
    const uid = await currentUserId();
    const [profile, points, rank] = await Promise.all([
      supabase!.from('profiles').select('username,classification,avatar').eq('id', uid).single(),
      supabase!.from('user_points').select('balance').eq('user_id', uid).maybeSingle(),
      supabase!.from('weekly_leaderboard').select('rank').eq('user_id', uid).maybeSingle(),
    ]);
    if (profile.error) throw profile.error;
    return {
      username: profile.data.username,
      displayName: profile.data.username,
      classification: profile.data.classification,
      avatar: profile.data.avatar,
      points: points.data?.balance ?? 0,
      weeklyRank: Number(rank.data?.rank ?? 0),
    };
  }, mock.ME);
}

export function useBadges(): Loadable<Badge[]> {
  return useLive(async () => {
    const uid = await currentUserId();
    const [badges, earned] = await Promise.all([
      supabase!.from('badges').select('id,name,icon').order('id'),
      supabase!.from('user_badges').select('badge_id').eq('user_id', uid),
    ]);
    if (badges.error) throw badges.error;
    if (earned.error) throw earned.error;
    const earnedIds = new Set(earned.data.map((u) => u.badge_id));
    return badges.data.map((b) => ({
      id: b.id,
      icon: b.icon,
      name: b.name,
      earned: earnedIds.has(b.id),
    }));
  }, mock.BADGES);
}

export function useLeaderboard(period: LeaderboardPeriod): Loadable<LeaderboardEntry[]> {
  const view = period === 'weekly' ? 'weekly_leaderboard' : 'alltime_leaderboard';
  const { data, loading, refresh } = useLive(async () => {
    const uid = await currentUserId();
    const [rows, badgeRows] = await Promise.all([
      supabase!.from(view).select('*').order('rank').order('username').limit(25),
      supabase!.from('user_badges').select('user_id'),
    ]);
    if (rows.error) throw rows.error;
    const badgeCounts = new Map<string, number>();
    for (const r of badgeRows.data ?? []) {
      badgeCounts.set(r.user_id, (badgeCounts.get(r.user_id) ?? 0) + 1);
    }
    return rows.data.map((r) => ({
      rank: Number(r.rank),
      name: r.username,
      points: r.points,
      badges: badgeCounts.get(r.user_id) ?? 0,
      avatar: r.avatar,
      isMe: r.user_id === uid,
      classification: r.classification,
    }));
  }, mock.LEADERBOARD[period]);
  // Refetch when the period flips between views
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);
  return { data, loading, refresh };
}

const LEDGER_ICONS: Record<string, string> = {
  visit: '📍',
  challenge: '🔥',
  redemption: '🎁',
};

function ledgerDateLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const days = Math.floor((today.getTime() - d.getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function useLedger(): Loadable<LedgerEntry[]> {
  return useLive(async () => {
    const { data, error } = await supabase!
      .from('points_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(15);
    if (error) throw error;
    return data.map((l) => ({
      id: String(l.id),
      activity: l.reason,
      points: l.delta,
      dateLabel: ledgerDateLabel(l.created_at),
      icon: LEDGER_ICONS[l.ref_type ?? ''] ?? '⭐',
    }));
  }, mock.LEDGER);
}
