export type TrailKey = 'food' | 'history' | 'farm' | 'arts';

export interface Trail {
  key: TrailKey;
  name: string;
  icon: string;
  color: string;
}

export interface TrailLocation {
  id: string;
  trailKey: TrailKey;
  name: string;
  description: string;
  lat: number;
  lng: number;
  radiusM: number;
  points: number;
  visited: boolean;
  /** Dev-only flag: coordinates are placeholders until geocoded (see LOCATIONS.md) */
  coordsUnverified?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  businessName: string;
  trailKey: TrailKey;
  bonusPoints: number;
  expiresLabel: string;
  icon: string;
  badgeIcon: string;
  active: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badges: number;
  avatar: string;
  isMe: boolean;
  classification: string;
}

export type LeaderboardPeriod = 'weekly' | 'allTime';

export type TierName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Legend';

export interface Tier {
  name: TierName;
  min: number;
  max: number;
  icon: string;
  rewards: string[];
}

export interface Badge {
  id: string;
  icon: string;
  name: string;
  earned: boolean;
}

export interface Reward {
  id: string;
  name: string;
  partner: string;
  costPoints: number;
  icon: string;
}

export interface LedgerEntry {
  id: string;
  activity: string;
  points: number;
  dateLabel: string;
  icon: string;
}

export interface Profile {
  username: string;
  displayName: string;
  classification: string;
  avatar: string;
  points: number;
  weeklyRank: number;
}
