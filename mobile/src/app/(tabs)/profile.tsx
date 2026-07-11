import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Pill, ProgressBar } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { BADGES, LOCATIONS, ME, TRAILS, tierForPoints } from '@/lib/mock-data';
import { colors } from '@/lib/theme';

export default function ProfileScreen() {
  const { email, signOut } = useAuth();
  const tier = tierForPoints(ME.points);
  const visitedCount = LOCATIONS.filter((l) => l.visited).length;
  const earnedBadges = BADGES.filter((b) => b.earned).length;

  const stats: [string, string, string][] = [
    ['⭐', ME.points.toLocaleString(), 'Points'],
    ['🏅', String(earnedBadges), 'Badges'],
    ['📍', `${visitedCount}/${LOCATIONS.length}`, 'Visited'],
    ['🏆', `#${ME.weeklyRank}`, 'Rank'],
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 40 }}>{ME.avatar}</Text>
          </View>
          <Text style={styles.name}>{ME.displayName}</Text>
          <Text style={styles.username}>@{ME.username}</Text>
          <View style={styles.headerPills}>
            <Pill label={`🎓 ${ME.classification}`} bg={colors.bg} color={colors.inkSecondary} borderColor={colors.border} />
            <Pill label={`${tier.icon} ${tier.name} Tier`} />
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map(([icon, value, label]) => (
            <View key={label} style={styles.stat}>
              <Text style={{ fontSize: 18, marginBottom: 3 }}>{icon}</Text>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trail Progress</Text>
          {TRAILS.map((t) => {
            const locs = LOCATIONS.filter((l) => l.trailKey === t.key);
            const visited = locs.filter((l) => l.visited).length;
            const pct = locs.length ? Math.round((visited / locs.length) * 100) : 0;
            const complete = pct === 100;
            return (
              <View key={t.key} style={{ marginBottom: 14 }}>
                <View style={styles.trailRow}>
                  <Text style={styles.trailName}>
                    {t.icon} {t.name}
                  </Text>
                  <Text style={[styles.trailCount, complete && { color: colors.success }]}>
                    {visited}/{locs.length}
                    {complete ? ' ✓' : ''}
                  </Text>
                </View>
                <ProgressBar pct={pct} color={complete ? colors.success : t.color} height={5} />
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges 🏅</Text>
          <View style={styles.badgeGrid}>
            {BADGES.map((b) => (
              <View key={b.id} style={[styles.badgeCell, !b.earned && styles.badgeCellLocked]}>
                <Text style={[styles.badgeIcon, !b.earned && { opacity: 0.35 }]}>{b.icon}</Text>
                <Text style={[styles.badgeName, !b.earned && { color: colors.inkMuted }]}>
                  {b.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <SettingsRow icon="✉️" label="Email" value={email ?? '—'} />
            <SettingsRow icon="🔔" label="Notifications" value="On" />
            <SettingsRow icon="❓" label="Help & Support" />
            <SettingsRow icon="🚪" label="Sign Out" danger onPress={signOut} last />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  danger,
  last,
  onPress,
}: {
  icon: string;
  label: string;
  value?: string;
  danger?: boolean;
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.settingsRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
    >
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text style={[styles.settingsLabel, danger && { color: colors.crimson }]}>{label}</Text>
      {value ? <Text style={styles.settingsValue}>{value}</Text> : null}
      <Text style={{ color: colors.border, fontSize: 16 }}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingBottom: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.bg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  username: { fontSize: 13, color: colors.inkSecondary, marginTop: 2 },
  headerPills: { flexDirection: 'row', gap: 8, marginTop: 10 },
  statsRow: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '900', color: colors.crimson },
  statLabel: {
    fontSize: 9,
    color: colors.inkMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  trailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  trailName: { fontSize: 13, fontWeight: '700', color: colors.ink },
  trailCount: { fontSize: 13, fontWeight: '700', color: colors.inkMuted },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCell: {
    width: '22.5%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.gold}25`,
  },
  badgeCellLocked: { backgroundColor: '#F9F9F9', borderColor: colors.border, opacity: 0.6 },
  badgeIcon: { fontSize: 26, marginBottom: 5 },
  badgeName: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 11,
  },
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  settingsLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.ink },
  settingsValue: { fontSize: 12, color: colors.inkMuted },
});
