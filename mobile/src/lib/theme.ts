import { Platform, ViewStyle } from 'react-native';

// Brand tokens ported from the prototype (ttn-app/index.html + DESIGN.md)
export const colors = {
  crimson: '#D42020',
  crimsonDark: '#AA1818',
  gold: '#C8A415',
  goldLight: '#FEF9E7',
  goldText: '#9A7810',
  bg: '#F5F5F5',
  surface: '#FFFFFF',
  ink: '#1A1A1A',
  inkSecondary: '#717171',
  inkMuted: '#ADADAD',
  border: '#EBEBEB',
  success: '#2E7D32',
  successBg: '#E8F5E9',
  live: '#FF3B30',
  lockedBg: '#FFF3E0',
  lockedText: '#BF360C',
} as const;

// Trail palette is semantic, never used for global chrome (DESIGN.md)
export const trailColors = {
  food: '#D44000',
  history: '#8B1A1A',
  farm: '#2E7D32',
  arts: '#6A1B9A',
} as const;

export const tierColors = {
  Bronze: '#CD7F32',
  Silver: '#888888',
  Gold: '#C8A415',
  Platinum: '#5C9BD4',
  Legend: '#C8A415',
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 30,
} as const;

// RN has no box-shadow; approximate the prototype's card shadow per platform
export const cardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
  default: {},
})!;

export const ctaShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.crimson,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
  },
  android: { elevation: 4 },
  default: {},
})!;
