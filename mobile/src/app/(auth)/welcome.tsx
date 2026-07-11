import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui';
import { colors } from '@/lib/theme';

export default function Welcome() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🗺️</Text>
        <Text style={styles.kicker}>Welcome to</Text>
        <Text style={styles.title}>Tuskegee{'\n'}Trail Network</Text>
        <Text style={styles.tagline}>Explore · Discover · Connect</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Create account" onPress={() => router.push('/sign-up')} />
        <Text style={styles.signInLink} onPress={() => router.push('/sign-in')}>
          Already have an account? <Text style={styles.signInLinkStrong}>Sign in</Text>
        </Text>
      </View>
      <Text style={styles.footer}>TUSKEGEE UNIVERSITY · EST. 1881</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface, padding: 24 },
  hero: { flex: 1, justifyContent: 'center' },
  heroEmoji: { fontSize: 64, marginBottom: 18 },
  kicker: {
    fontSize: 12,
    color: colors.inkMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.ink,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  tagline: { fontSize: 13, color: colors.inkSecondary, marginTop: 12, letterSpacing: 2 },
  actions: { gap: 16, marginBottom: 24 },
  signInLink: { textAlign: 'center', fontSize: 14, color: colors.inkSecondary },
  signInLinkStrong: { color: colors.crimson, fontWeight: '700' },
  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.inkMuted,
    letterSpacing: 2,
    marginBottom: 8,
  },
});
