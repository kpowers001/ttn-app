import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChallengeCard, UpcomingChallengeCard } from '@/components/challenge-card';
import { Pill, ProgressBar, SectionHeader } from '@/components/ui';
import { CHALLENGES, ME, nextTier, tierForPoints } from '@/lib/mock-data';
import { colors } from '@/lib/theme';

export default function HomeScreen() {
  const router = useRouter();
  const tier = tierForPoints(ME.points);
  const next = nextTier(tier);
  const pct = next ? Math.round(((ME.points - tier.min) / (next.min - tier.min)) * 100) : 100;
  const active = CHALLENGES.filter((c) => c.active);
  const upcoming = CHALLENGES.filter((c) => !c.active);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.name}>{ME.displayName} 🐯</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 22 }}>{ME.avatar}</Text>
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>
                {next ? `Progress to ${next.name}` : 'Top tier reached'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Pill label={`${tier.icon} ${tier.name}`} />
                <Pill label={`#${ME.weeklyRank} 🏆`} bg="#FFF0F0" color={colors.crimsonDark} />
              </View>
            </View>
            <ProgressBar pct={pct} />
            <View style={styles.progressBottom}>
              <Text style={styles.progressHint}>{tier.name}</Text>
              <Text style={styles.progressPoints}>
                {ME.points.toLocaleString()} pts
                {next ? ` · ${(next.min - ME.points).toLocaleString()} to ${next.name}` : ''}
              </Text>
              <Text style={styles.progressHint}>{next?.name ?? ''}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="🔥 Active Challenges"
            action="View all"
            onAction={() => router.push('/challenges')}
          />
          <View style={styles.cardStack}>
            {active.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </View>
        </View>

        <View style={[styles.section, { paddingBottom: 32 }]}>
          <SectionHeader title="Coming Up" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.upcomingRow}
          >
            {upcoming.map((c) => (
              <UpcomingChallengeCard key={c.id} challenge={c} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 8,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, color: colors.inkSecondary },
  name: { fontSize: 23, fontWeight: '900', color: colors.ink, letterSpacing: -0.4 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    marginTop: 16,
    backgroundColor: colors.bg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: { fontSize: 12, color: colors.inkSecondary, fontWeight: '600' },
  progressBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  progressHint: { fontSize: 11, color: colors.inkMuted },
  progressPoints: { fontSize: 11, color: colors.inkSecondary, fontWeight: '600' },
  section: { paddingTop: 22 },
  cardStack: { paddingHorizontal: 20, gap: 10 },
  upcomingRow: { paddingHorizontal: 20, gap: 10 },
});
