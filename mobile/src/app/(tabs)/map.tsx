import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, FilterPill, Pill, ProgressBar } from '@/components/ui';
import { LOCATIONS, MAP_REGION, TRAILS, trailByKey } from '@/lib/mock-data';
import { cardShadow, colors } from '@/lib/theme';
import type { TrailKey, TrailLocation } from '@/lib/types';

export default function MapScreen() {
  const [trailFilter, setTrailFilter] = useState<TrailKey | 'all'>('all');
  const [selected, setSelected] = useState<TrailLocation | null>(null);

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
          {visitedCount}/{LOCATIONS.length} locations discovered
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

      <View style={styles.mapWrap}>
        <MapView style={StyleSheet.absoluteFill} initialRegion={MAP_REGION}>
          {shown.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{ latitude: loc.lat, longitude: loc.lng }}
              onPress={() => setSelected(loc)}
              pinColor={loc.visited ? trailByKey(loc.trailKey).color : '#888888'}
            />
          ))}
        </MapView>

        {selected && (
          <Card style={{ ...styles.sheet, ...cardShadow }}>
            <View style={styles.sheetRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.sheetTitleRow}>
                  <Text style={{ fontSize: 20 }}>{trailByKey(selected.trailKey).icon}</Text>
                  <Text style={styles.sheetTitle}>{selected.name}</Text>
                </View>
                <Text style={styles.sheetDesc}>{selected.description}</Text>
                <View style={styles.sheetPills}>
                  {selected.visited ? (
                    <>
                      <Pill label="✓ Visited" bg={colors.successBg} color={colors.success} />
                      <Pill label={`+${selected.points} pts earned`} />
                    </>
                  ) : (
                    <Pill
                      label={`Visit to unlock · +${selected.points} pts`}
                      bg={colors.lockedBg}
                      color={colors.lockedText}
                    />
                  )}
                </View>
              </View>
              <Pressable
                onPress={() => setSelected(null)}
                style={styles.sheetClose}
                accessibilityRole="button"
                accessibilityLabel="Close location details"
              >
                <Text style={{ color: colors.inkSecondary, fontSize: 13 }}>✕</Text>
              </Pressable>
            </View>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  header: { paddingHorizontal: 20, paddingBottom: 14, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: '900', color: colors.ink, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: colors.inkSecondary, marginTop: 2 },
  filterBar: { borderBottomWidth: 1, borderTopWidth: 1, borderColor: colors.border },
  filterRow: { paddingHorizontal: 14, paddingVertical: 10 },
  mapWrap: { flex: 1 },
  sheet: { position: 'absolute', bottom: 14, left: 14, right: 14, borderRadius: 22, padding: 18 },
  sheetRow: { flexDirection: 'row', alignItems: 'flex-start' },
  sheetTitleRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, flex: 1 },
  sheetDesc: { fontSize: 13, color: colors.inkSecondary },
  sheetPills: { marginTop: 10, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  sheetClose: {
    backgroundColor: colors.bg,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
