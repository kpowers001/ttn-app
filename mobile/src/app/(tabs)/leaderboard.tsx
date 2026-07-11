import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui';
import { LEADERBOARD } from '@/lib/mock-data';
import { colors } from '@/lib/theme';
import type { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types';

const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'allTime', label: 'All Time' },
];

const MEDAL_COLORS: Record<number, string> = { 1: colors.gold, 2: '#AAAAAA', 3: '#C27A3A' };

export default function LeaderboardScreen() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const data = LEADERBOARD[period];
  const podium = data.slice(0, 3);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard 🏆</Text>
        <Text style={styles.subtitle}>Compete with your peers</Text>
        <View style={styles.segment}>
          {PERIODS.map((p) => {
            const on = period === p.key;
            return (
              <Pressable
                key={p.key}
                onPress={() => setPeriod(p.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                style={[styles.segmentButton, on && styles.segmentButtonOn]}
              >
                <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{p.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {podium.length === 3 && (
          <View style={styles.podium}>
            <PodiumItem entry={podium[1]} height={76} />
            <PodiumItem entry={podium[0]} height={104} crown />
            <PodiumItem entry={podium[2]} height={60} />
          </View>
        )}

        <View style={styles.list}>
          {data.map((entry) => (
            <Card
              key={`${period}-${entry.rank}`}
              style={{
                ...styles.rowCard,
                ...(entry.isMe ? { backgroundColor: colors.goldLight, borderWidth: 1, borderColor: `${colors.gold}30` } : {}),
              }}
            >
              <View
                style={[
                  styles.rankBubble,
                  { backgroundColor: MEDAL_COLORS[entry.rank] ?? colors.bg },
                ]}
              >
                <Text
                  style={[
                    styles.rankText,
                    { color: entry.rank <= 3 ? '#FFF' : colors.inkSecondary },
                  ]}
                >
                  {entry.rank}
                </Text>
              </View>
              <View style={styles.avatarBubble}>
                <Text style={{ fontSize: 20 }}>{entry.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowName, entry.isMe && { color: colors.crimsonDark }]}>
                  {entry.name}
                  {entry.isMe ? ' (You)' : ''}
                </Text>
                <Text style={styles.rowClass}>{entry.classification}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.rowPoints, entry.isMe && { color: colors.crimsonDark }]}>
                  {entry.points.toLocaleString()}
                </Text>
                <Text style={styles.rowBadges}>{entry.badges} badges</Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PodiumItem({ entry, height, crown }: { entry: LeaderboardEntry; height: number; crown?: boolean }) {
  const columnColor = { 1: colors.gold, 2: '#BBBBBB', 3: '#C27A3A' }[entry.rank] ?? colors.border;
  return (
    <View style={styles.podiumItem}>
      {crown && <Text style={{ fontSize: 16 }}>👑</Text>}
      <Text style={{ fontSize: entry.rank === 1 ? 36 : 28, marginBottom: 3 }}>{entry.avatar}</Text>
      <Text
        style={[styles.podiumName, entry.isMe && { color: colors.crimsonDark }]}
        numberOfLines={1}
      >
        {entry.name}
      </Text>
      <View style={[styles.podiumColumn, { backgroundColor: columnColor, height }]}>
        <Text style={{ fontSize: entry.rank === 1 ? 22 : 17 }}>
          {['🥇', '🥈', '🥉'][entry.rank - 1]}
        </Text>
        <Text style={styles.podiumPoints}>{entry.points.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: colors.inkSecondary, marginTop: 2 },
  segment: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 14,
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  segmentButtonOn: { backgroundColor: colors.surface },
  segmentText: { fontSize: 12, fontWeight: '700', color: colors.inkSecondary },
  segmentTextOn: { color: colors.crimson },
  podium: {
    backgroundColor: colors.surface,
    paddingTop: 22,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  podiumItem: { flex: 1, alignItems: 'center' },
  podiumName: { fontSize: 10, fontWeight: '800', color: colors.ink, maxWidth: 76 },
  podiumColumn: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  podiumPoints: { fontSize: 10, fontWeight: '900', color: '#FFF' },
  list: { padding: 20, gap: 8, paddingBottom: 32 },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rankBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { fontSize: 13, fontWeight: '900' },
  avatarBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowName: { fontSize: 14, fontWeight: '800', color: colors.ink },
  rowClass: { fontSize: 11, color: colors.inkSecondary },
  rowPoints: { fontSize: 15, fontWeight: '900', color: colors.ink },
  rowBadges: { fontSize: 11, color: colors.inkMuted },
});
