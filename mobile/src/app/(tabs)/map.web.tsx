// Web fallback: react-native-maps is native-only. The web build (used for quick
// previews) renders the location list instead of the map canvas.
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, FilterPill, Pill, ProgressBar } from '@/components/ui';
import { LOCATIONS, TRAILS, trailByKey } from '@/lib/mock-data';
import { colors } from '@/lib/theme';
import type { TrailKey } from '@/lib/types';

export default function MapScreenWeb() {
  const [trailFilter, setTrailFilter] = useState<TrailKey | 'all'>('all');
  const shown = useMemo(
    () => (trailFilter === 'all' ? LOCATIONS : LOCATIONS.filter((l) => l.trailKey === trailFilter)),
    [trailFilter],
  );
  const visitedCount = LOCATIONS.filter((l) => l.visited).length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore 🗺️</Text>
        <Text style={styles.subtitle}>
          {visitedCount}/{LOCATIONS.length} locations discovered · map renders on device
        </Text>
        <View style={{ marginTop: 10 }}>
          <ProgressBar pct={(visitedCount / LOCATIONS.length) * 100} height={5} />
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <FilterPill label="🗺️ All" active={trailFilter === 'all'} onPress={() => setTrailFilter('all')} />
          {TRAILS.map((t) => (
            <FilterPill
              key={t.key}
              label={`${t.icon} ${t.name.replace(/ Trail| & Nature| & Culture/g, '')}`}
              active={trailFilter === t.key}
              color={t.color}
              onPress={() => setTrailFilter(t.key)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {shown.map((loc) => {
          const trail = trailByKey(loc.trailKey);
          return (
            <Pressable key={loc.id}>
              <Card>
                <View style={styles.locRow}>
                  <View style={[styles.locIcon, { backgroundColor: `${trail.color}15` }]}>
                    <Text style={{ fontSize: 22 }}>{loc.visited ? trail.icon : '🔒'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.locName}>{loc.name}</Text>
                    <Text style={styles.locDesc}>{loc.description}</Text>
                  </View>
                  {loc.visited ? (
                    <Pill label="✓" bg={colors.successBg} color={colors.success} />
                  ) : (
                    <Pill label={`+${loc.points}`} />
                  )}
                </View>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: 8,
    backgroundColor: colors.surface,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: colors.inkSecondary, marginTop: 2 },
  filterBar: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterRow: { paddingHorizontal: 14, paddingVertical: 10 },
  list: { padding: 20, gap: 10 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  locIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  locDesc: { fontSize: 12, color: colors.inkSecondary, marginTop: 1 },
});
