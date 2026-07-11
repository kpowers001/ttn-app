import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Pill, PrimaryButton } from '@/components/ui';
import { trailByKey } from '@/lib/mock-data';
import { colors } from '@/lib/theme';
import type { Challenge } from '@/lib/types';

export function ChallengeCard({
  challenge,
  showAccept,
  onAccept,
}: {
  challenge: Challenge;
  showAccept?: boolean;
  onAccept?: () => void;
}) {
  const trail = trailByKey(challenge.trailKey);
  return (
    <Card>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: `${trail.color}15`, borderColor: `${trail.color}20` }]}>
          <Text style={styles.iconText}>{challenge.icon}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {challenge.title}
            </Text>
            {challenge.active && (
              <View style={styles.liveTag}>
                <Text style={styles.liveTagText}>LIVE</Text>
              </View>
            )}
          </View>
          <Text style={styles.business}>{challenge.businessName}</Text>
          <View style={styles.metaRow}>
            <Pill label={`+${challenge.bonusPoints} pts`} />
            <Text style={styles.expires}>⏰ {challenge.expiresLabel}</Text>
            <Text style={styles.badgeIcon}>{challenge.badgeIcon}</Text>
          </View>
        </View>
      </View>
      {showAccept && challenge.active && (
        <View style={{ marginTop: 14 }}>
          <PrimaryButton label="Accept Challenge →" onPress={onAccept ?? (() => {})} />
        </View>
      )}
    </Card>
  );
}

export function UpcomingChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <Pressable>
      <Card style={styles.upcomingCard}>
        <Text style={styles.upcomingIcon}>{challenge.icon}</Text>
        <Text style={styles.upcomingTitle} numberOfLines={2}>
          {challenge.title}
        </Text>
        <Text style={styles.upcomingExpires}>{challenge.expiresLabel}</Text>
        <Pill label={`+${challenge.bonusPoints} pts`} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 26 },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 15, fontWeight: '800', color: colors.ink, letterSpacing: -0.2, flex: 1 },
  liveTag: {
    backgroundColor: '#D4202015',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 6,
  },
  liveTagText: { color: colors.crimson, fontSize: 10, fontWeight: '800' },
  business: { fontSize: 12, color: colors.inkSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 9, alignItems: 'center', flexWrap: 'wrap' },
  expires: { fontSize: 11, color: colors.inkMuted },
  badgeIcon: { fontSize: 15 },
  upcomingCard: { width: 148, gap: 6 },
  upcomingIcon: { fontSize: 30 },
  upcomingTitle: { fontSize: 13, fontWeight: '700', color: colors.ink, lineHeight: 17 },
  upcomingExpires: { fontSize: 11, color: colors.inkSecondary },
});
