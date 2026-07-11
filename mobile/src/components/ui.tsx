import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { cardShadow, colors, ctaShadow, radius } from '@/lib/theme';

export function Pill({
  label,
  bg = colors.goldLight,
  color = colors.goldText,
  borderColor,
}: {
  label: string;
  bg?: string;
  color?: string;
  borderColor?: string;
}) {
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: bg },
        borderColor ? { borderWidth: 1, borderColor } : null,
      ]}
    >
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, cardShadow, style]}>{children}</View>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ProgressBar({ pct, color, height = 6 }: { pct: number; color?: string; height?: number }) {
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, pct))}%`,
          borderRadius: height / 2,
          backgroundColor: color ?? colors.crimson,
        }}
      />
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.primaryButton,
        ctaShadow,
        disabled ? styles.primaryButtonDisabled : null,
        pressed ? { transform: [{ scale: 0.98 }] } : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={styles.primaryButtonText}>{label}</Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  ...inputProps
}: { label: string } & TextInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, focused && { color: colors.crimson }]}>{label}</Text>
      <TextInput
        {...inputProps}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor="#C0C0C0"
        style={[styles.fieldInput, focused && { borderColor: colors.crimson }]}
        accessibilityLabel={label}
      />
    </View>
  );
}

export function FilterPill({
  label,
  active,
  color = colors.crimson,
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.filterPill,
        {
          borderColor: active ? color : colors.border,
          backgroundColor: active ? `${color}15` : colors.surface,
        },
      ]}
    >
      <Text style={[styles.filterPillText, { color: active ? color : colors.inkSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  pillText: { fontSize: 11, fontWeight: '700' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, letterSpacing: -0.2 },
  sectionAction: { fontSize: 13, color: colors.crimson, fontWeight: '600' },
  track: { backgroundColor: colors.border, overflow: 'hidden' },
  primaryButton: {
    backgroundColor: colors.crimson,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: { backgroundColor: '#DDA5A5' },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  fieldInput: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.ink,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterPillText: { fontSize: 12, fontWeight: '700' },
});
