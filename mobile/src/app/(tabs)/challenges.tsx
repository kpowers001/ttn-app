import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChallengeCard } from '@/components/challenge-card';
import { Card, FilterPill } from '@/components/ui';
import { useChallenges, useTrails } from '@/lib/data';
import { colors } from '@/lib/theme';
import type { TrailKey } from '@/lib/types';

export default function ChallengesScreen() {
  const [filter, setFilter] = useState<TrailKey | 'all'>('all');
  const { data: challenges } = useChallenges();
  const { data: trails } = useTrails();
  const shown = useMemo(
    () => (filter === 'all' ? challenges : challenges.filter((c) => c.trailKey === filter)),
    [filter, challenges],
  );
  const activeChallenges = challenges.filter((c) => c.active);
  const activeCount = activeChallenges.length;
  const maxBonus = activeChallenges.length
    ? Math.max(...activeChallenges.map((c) => c.bonusPoints))
    : 0;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges ⚡</Text>
        <Text style={styles.subtitle}>Complete to earn points & badges</Text>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <FilterPill label="⚡ All" active={filter === 'all'} onPress={() => setFilter('all')} />
          {trails.map((t) => (
            <FilterPill
              key={t.key}
              label={`${t.icon} ${t.name.replace(/ Trail| & Nature| & Culture/g, '')}`}
              active={filter === t.key}
              color={t.color}
              onPress={() => setFilter(t.key)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={{ fontSize: 22 }}>⚡</Text>
          </View>
          <View>
            <Text style={styles.summaryTitle}>{activeCount} Active Challenges</Text>
            <Text style={styles.summarySub}>Earn up to {maxBonus} bonus pts this week</Text>
          </View>
        </Card>
        {shown.map((c) => (
          <ChallengeCard key={c.id} challenge={c} showAccept />
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
    paddingBottom: 14,
    paddingTop: 8,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: colors.inkSecondary, marginTop: 2 },
  filterBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  filterRow: { paddingHorizontal: 14, paddingVertical: 10 },
  list: { padding: 20, gap: 12, paddingBottom: 32 },
  summaryCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4202018',
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#D4202015',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  summarySub: { fontSize: 12, color: colors.inkSecondary },
});
