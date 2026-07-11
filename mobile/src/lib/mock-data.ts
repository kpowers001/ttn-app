import { trailColors } from './theme';
import type {
  Badge,
  Challenge,
  LeaderboardEntry,
  LeaderboardPeriod,
  LedgerEntry,
  Profile,
  Reward,
  Tier,
  Trail,
  TrailLocation,
} from './types';

// Dev fixture data. Locations are the 9 confirmed pilot partners (LOCATIONS.md).
// Coordinates marked coordsUnverified are placeholders — replace with geocoded
// values before seeding the real database.

export const TRAILS: Trail[] = [
  { key: 'food', name: 'Food Trail', icon: '🍽️', color: trailColors.food },
  { key: 'history', name: 'History Trail', icon: '🏛️', color: trailColors.history },
  { key: 'farm', name: 'Farm & Nature Trail', icon: '🌾', color: trailColors.farm },
  { key: 'arts', name: 'Arts & Culture Trail', icon: '🎨', color: trailColors.arts },
];

export const trailByKey = (key: string) => TRAILS.find((t) => t.key === key)!;

export const LOCATIONS: TrailLocation[] = [
  // Food
  {
    id: 'bb-barbecue', trailKey: 'food', name: 'B&B Barbecue',
    description: 'Local barbecue · 405 Fonville St',
    lat: 32.431, lng: -85.696, radiusM: 60, points: 50, visited: true, coordsUnverified: true,
  },
  {
    id: 'house-of-stewarts', trailKey: 'food', name: 'The New House of Stewarts',
    description: 'Restaurant & event venue · 2801 W MLK Hwy',
    lat: 32.4222, lng: -85.736, radiusM: 80, points: 50, visited: false, coordsUnverified: true,
  },
  // History
  {
    id: 'airmen-museum', trailKey: 'history', name: 'Tuskegee Airmen Museum',
    description: 'National Historic Site at Moton Field',
    lat: 32.4557, lng: -85.6785, radiusM: 120, points: 75, visited: false, coordsUnverified: true,
  },
  {
    id: 'carver-museum', trailKey: 'history', name: 'G.W. Carver Museum',
    description: 'Science & legacy · Tuskegee Institute NHS',
    lat: 32.4287, lng: -85.7062, radiusM: 100, points: 75, visited: true, coordsUnverified: true,
  },
  // Arts & Culture
  {
    id: 'legacy-museum', trailKey: 'arts', name: 'Legacy Museum',
    description: 'University art collections & bioethics exhibits',
    lat: 32.43, lng: -85.7078, radiusM: 100, points: 65, visited: false, coordsUnverified: true,
  },
  // Farm & Nature
  {
    id: 'farmers-market', trailKey: 'farm', name: 'Macon County Farmers Market',
    description: 'Local produce · Elm & Spring St · Wed & Sat',
    lat: 32.4247, lng: -85.6905, radiusM: 60, points: 60, visited: true, coordsUnverified: true,
  },
  {
    id: 'shady-grove', trailKey: 'farm', name: 'Shady Grove Blueberry Patch',
    description: 'U-pick blueberries · 690 County Rd 81',
    lat: 32.39, lng: -85.64, radiusM: 150, points: 60, visited: false, coordsUnverified: true,
  },
  {
    id: 'tuskegee-honey', trailKey: 'farm', name: 'Tuskegee Honey',
    description: 'Raw wildflower honey from local hives',
    lat: 32.42, lng: -85.68, radiusM: 100, points: 60, visited: false, coordsUnverified: true,
  },
  {
    id: 'the-shed', trailKey: 'farm', name: 'The Shed (Reptile House)',
    description: 'Reptile education & conservation',
    lat: 32.44, lng: -85.66, radiusM: 100, points: 60, visited: false, coordsUnverified: true,
  },
];

// Center of the pilot map: Tuskegee University / downtown
export const MAP_REGION = {
  latitude: 32.431,
  longitude: -85.693,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};

export const CHALLENGES: Challenge[] = [
  {
    id: 'c1', title: 'Friday Night Flavors', businessName: 'B&B Barbecue',
    trailKey: 'food', bonusPoints: 150, expiresLabel: '2 days', icon: '🍖', badgeIcon: '🔥', active: true,
  },
  {
    id: 'c2', title: 'Market Morning Run', businessName: 'Macon County Farmers Market',
    trailKey: 'farm', bonusPoints: 200, expiresLabel: 'Saturday', icon: '🥗', badgeIcon: '🌱', active: true,
  },
  {
    id: 'c3', title: 'Meet the Reptiles', businessName: 'The Shed',
    trailKey: 'farm', bonusPoints: 175, expiresLabel: 'Tomorrow', icon: '🦎', badgeIcon: '🐍', active: true,
  },
  {
    id: 'c4', title: 'Airmen History Day', businessName: 'Tuskegee Airmen Museum',
    trailKey: 'history', bonusPoints: 250, expiresLabel: 'Next week', icon: '✈️', badgeIcon: '📚', active: false,
  },
  {
    id: 'c5', title: 'Blueberry Season Finale', businessName: 'Shady Grove Blueberry Patch',
    trailKey: 'farm', bonusPoints: 300, expiresLabel: 'Next week', icon: '🫐', badgeIcon: '🏆', active: false,
  },
];

export const LEADERBOARD: Record<LeaderboardPeriod, LeaderboardEntry[]> = {
  weekly: [
    { rank: 1, name: 'Jasmine T.', points: 1850, badges: 8, avatar: '👩🏾', isMe: false, classification: 'Senior' },
    { rank: 2, name: 'Marcus W.', points: 1720, badges: 7, avatar: '👨🏿', isMe: false, classification: 'Junior' },
    { rank: 3, name: 'You', points: 1540, badges: 6, avatar: '😊', isMe: true, classification: 'Sophomore' },
    { rank: 4, name: 'Aaliyah M.', points: 1420, badges: 5, avatar: '👩🏽', isMe: false, classification: 'Freshman' },
    { rank: 5, name: 'Devon K.', points: 1280, badges: 5, avatar: '👨🏾', isMe: false, classification: 'Senior' },
    { rank: 6, name: 'Priya S.', points: 1150, badges: 4, avatar: '👩🏽', isMe: false, classification: 'Junior' },
    { rank: 7, name: 'Kai J.', points: 980, badges: 4, avatar: '👤', isMe: false, classification: 'Sophomore' },
    { rank: 8, name: 'Zara B.', points: 870, badges: 3, avatar: '👩🏿', isMe: false, classification: 'Freshman' },
  ],
  allTime: [
    { rank: 1, name: 'Marcus W.', points: 24680, badges: 18, avatar: '👨🏿', isMe: false, classification: 'Junior' },
    { rank: 2, name: 'Jasmine T.', points: 22150, badges: 16, avatar: '👩🏾', isMe: false, classification: 'Senior' },
    { rank: 3, name: 'Devon K.', points: 19870, badges: 15, avatar: '👨🏾', isMe: false, classification: 'Senior' },
    { rank: 4, name: 'Zara B.', points: 18420, badges: 14, avatar: '👩🏿', isMe: false, classification: 'Freshman' },
    { rank: 5, name: 'You', points: 16950, badges: 13, avatar: '😊', isMe: true, classification: 'Sophomore' },
  ],
};

export const TIERS: Tier[] = [
  { name: 'Bronze', min: 0, max: 999, icon: '🥉', rewards: ['10% off Bookstore', 'Free Campus Coffee'] },
  { name: 'Silver', min: 1000, max: 2499, icon: '🥈', rewards: ['20% off Bookstore', 'Free Campus Meal', '$5 Campus Voucher'] },
  { name: 'Gold', min: 2500, max: 4999, icon: '🥇', rewards: ['30% off Bookstore', '$10 Restaurant Card', 'VIP Event Access'] },
  { name: 'Platinum', min: 5000, max: 9999, icon: '💎', rewards: ['40% off Bookstore', '$25 Restaurant Card', 'Exclusive Campus Gear'] },
  { name: 'Legend', min: 10000, max: Infinity, icon: '👑', rewards: ['50% off Bookstore', 'Scholarship Entry', 'Campus Ambassador'] },
];

export const BADGES: Badge[] = [
  { id: 'food-explorer', icon: '🍽️', name: 'Food Explorer', earned: true },
  { id: 'art-lover', icon: '🎨', name: 'Art Lover', earned: true },
  { id: 'farm-fresh', icon: '🌾', name: 'Farm Fresh', earned: true },
  { id: 'historian', icon: '🏛️', name: 'Historian', earned: false },
  { id: 'pioneer', icon: '👣', name: 'Pioneer', earned: false },
  { id: 'grand-explorer', icon: '🗺️', name: 'Grand Explorer', earned: false },
  { id: 'challenge-king', icon: '🔥', name: 'Challenge King', earned: false },
  { id: 'social-tiger', icon: '👥', name: 'Social Tiger', earned: false },
];

export const REWARDS: Reward[] = [
  { id: 'r1', name: 'Bookstore Discount (20%)', partner: 'TU Bookstore', costPoints: 500, icon: '📚' },
  { id: 'r2', name: 'Free Campus Meal', partner: 'Tiger Dining', costPoints: 300, icon: '🍽️' },
  { id: 'r3', name: 'BBQ Plate', partner: 'B&B Barbecue', costPoints: 800, icon: '🍖' },
  { id: 'r4', name: 'Local Honey Jar', partner: 'Tuskegee Honey', costPoints: 700, icon: '🍯' },
];

export const LEDGER: LedgerEntry[] = [
  { id: 'l1', activity: 'Visited B&B Barbecue', points: 50, dateLabel: 'Today', icon: '🍖' },
  { id: 'l2', activity: 'Completed Food Challenge', points: 150, dateLabel: 'Yesterday', icon: '🔥' },
  { id: 'l3', activity: 'Visited Farmers Market', points: 60, dateLabel: 'Jun 28', icon: '🌾' },
  { id: 'l4', activity: 'Redeemed Bookstore Discount', points: -300, dateLabel: 'Jun 27', icon: '📚' },
  { id: 'l5', activity: 'Visited Carver Museum', points: 75, dateLabel: 'Jun 26', icon: '🏛️' },
];

export const ME: Profile = {
  username: 'tigerexplorer',
  displayName: 'Tiger Explorer',
  classification: 'Sophomore',
  avatar: '😊',
  points: 1540,
  weeklyRank: 3,
};

export const tierForPoints = (points: number): Tier =>
  TIERS.find((t) => points >= t.min && points <= t.max) ?? TIERS[0];

export const nextTier = (tier: Tier): Tier | undefined =>
  TIERS[TIERS.indexOf(tier) + 1];
