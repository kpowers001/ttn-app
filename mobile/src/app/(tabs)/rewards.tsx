import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Pill, ProgressBar } from '@/components/ui';
import { LEDGER, ME, nextTier, REWARDS, TIERS, tierForPoints } from '@/lib/mock-data';
import { colors, tierColors } from '@/lib/theme';

type SubTab = 'tiers' | 'redeem' | 'history';

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'tiers', label: '🏅 Tiers' },
  { key: 'redeem', label: '🎫 Redeem' },
  { key: 'history', label: '📋 History' },
];

export default function RewardsScreen() {
  const [subTab, setSubTab] = useState<SubTab>('tiers');
  const tier = tierForPoints(ME.points);
  const next = nextTier(tier);
  const pct = next ? Math.round(((ME.points - tier.min) / (next.min - tier.min)) * 100) : 100;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>{ME.points.toLocaleString()}</Text>
          <Text style={styles.balanceUnit}>points</Text>
        </View>
        <Pill label={`${tier.icon} ${tier.name} Tier`} />
        {next && (
          <View style={{ marginTop: 14 }}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressHint}>{tier.name}</Text>
              <Text style={styles.progressStrong}>
                {(next.min - ME.points).toLocaleString()} pts to {next.name}
              </Text>
              <Text style={styles.progressHint}>{next.name}</Text>
            </View>
            <ProgressBar pct={pct} height={5} />
          </View>
        )}
      </View>

      <View style={styles.subTabs}>
        {SUB_TABS.map((t) => {
          const on = subTab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setSubTab(t.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[styles.subTabButton, on && styles.subTabButtonOn]}
            >
              <Text style={[styles.subTabText, on && { color: colors.crimson }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {subTab === 'tiers' &&
          TIERS.map((t) => {
            const unlocked = ME.points >= t.min;
            const isCurrent = t.name === tier.name;
            const tierColor = tierColors[t.name];
            return (
              <Card
                key={t.name}
                style={{
                  ...(isCurrent ? { borderWidth: 1.5, borderColor: `${tierColor}40` } : {}),
                  ...(unlocked ? {} : { opacity: 0.55 }),
                }}
              >
                <View style={styles.tierTop}>
                  <View style={[styles.tierIcon, { backgroundColor: unlocked ? `${tierColor}18` : colors.bg }]}>
                    <Text style={{ fontSize: 24 }}>{t.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tierName, isCurrent && { color: tierColor }]}>
                      {t.name}
                      {isCurrent ? '  ← current' : ''}
                    </Text>
                    <Text style={styles.tierRange}>
                      {t.max === Infinity
                        ? `${t.min.toLocaleString()}+ pts`
                        : `${t.min.toLocaleString()} – ${t.max.toLocaleString()} pts`}
                    </Text>
                  </View>
                  {unlocked && <Text>✅</Text>}
                </View>
                <View style={styles.tierRewards}>
                  {t.rewards.map((r) => (
                    <View
                      key={r}
                      style={[styles.tierRewardTag, { backgroundColor: unlocked ? `${tierColor}12` : colors.bg }]}
                    >
                      <Text style={{ fontSize: 11, color: unlocked ? colors.ink : colors.inkMuted }}>{r}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            );
          })}

        {subTab === 'redeem' &&
          REWARDS.map((r) => {
            const affordable = ME.points >= r.costPoints;
            return (
              <Card key={r.id} style={styles.redeemRow}>
                <View style={styles.redeemIcon}>
                  <Text style={{ fontSize: 26 }}>{r.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.redeemName}>{r.name}</Text>
                  <Text style={styles.redeemPartner}>{r.partner}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Redeem ${r.name} for ${r.costPoints} points`}
                  disabled={!affordable}
                  style={[styles.redeemButton, !affordable && styles.redeemButtonDisabled]}
                >
                  <Text style={[styles.redeemButtonText, !affordable && { color: colors.inkMuted }]}>
                    {r.costPoints} pts
                  </Text>
                </Pressable>
              </Card>
            );
          })}

        {subTab === 'history' &&
          LEDGER.map((entry) => (
            <Card key={entry.id} style={styles.historyRow}>
              <Text style={{ fontSize: 22 }}>{entry.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyActivity}>{entry.activity}</Text>
                <Text style={styles.historyDate}>{entry.dateLabel}</Text>
              </View>
              <Text
                style={[
                  styles.historyPoints,
                  { color: entry.points > 0 ? colors.success : colors.crimson },
                ]}
              >
                {entry.points > 0 ? '+' : ''}
                {entry.points}
              </Text>
            </Card>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  balanceLabel: {
    fontSize: 11,
    color: colors.inkMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  balanceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 8 },
  balanceValue: { fontSize: 54, fontWeight: '900', color: colors.ink, letterSpacing: -2, lineHeight: 56 },
  balanceUnit: { fontSize: 15, color: colors.inkMuted, paddingBottom: 8 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressHint: { fontSize: 11, color: colors.inkMuted },
  progressStrong: { fontSize: 11, color: colors.inkSecondary, fontWeight: '600' },
  subTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  subTabButtonOn: { borderBottomColor: colors.crimson },
  subTabText: { fontSize: 12, fontWeight: '700', color: colors.inkMuted },
  list: { padding: 20, gap: 10, paddingBottom: 32 },
  tierTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  tierIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  tierName: { fontSize: 15, fontWeight: '800', color: colors.ink },
  tierRange: { fontSize: 11, color: colors.inkMuted },
  tierRewards: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tierRewardTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  redeemRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  redeemIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  redeemPartner: { fontSize: 12, color: colors.inkSecondary },
  redeemButton: {
    backgroundColor: colors.crimson,
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  redeemButtonDisabled: { backgroundColor: '#EEEEEE' },
  redeemButtonText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  historyActivity: { fontSize: 13, fontWeight: '600', color: colors.ink },
  historyDate: { fontSize: 11, color: colors.inkSecondary },
  historyPoints: { fontSize: 15, fontWeight: '900' },
});
