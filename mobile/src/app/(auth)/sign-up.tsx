import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Field, PrimaryButton } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { colors, radius } from '@/lib/theme';

const CLASSIFICATIONS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate Student'];

export default function SignUp() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [classification, setClassification] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    const err = await signUp(email.trim(), password, username.trim(), classification);
    setBusy(false);
    if (err) setError(err);
    else router.replace('/');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.kicker}>Student Portal</Text>
          <Text style={styles.title}>Create account</Text>
          <Field
            label="Username"
            placeholder="@tigerexplorer"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.pickerLabel}>Classification</Text>
          <View style={styles.pickerRow}>
            {CLASSIFICATIONS.map((c) => {
              const on = classification === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setClassification(c)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[styles.pickerChip, on && styles.pickerChipOn]}
                >
                  <Text style={[styles.pickerChipText, on && styles.pickerChipTextOn]}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
          <Field
            label="School Email"
            placeholder="your.name@tuskegee.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            label="Password"
            placeholder="At least 8 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton label="Create account →" onPress={submit} loading={busy} />
          <Text style={styles.switchLink} onPress={() => router.replace('/sign-in')}>
            Already have an account? <Text style={styles.switchLinkStrong}>Sign in</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 24, paddingTop: 32 },
  kicker: {
    fontSize: 11,
    color: colors.inkMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: { fontSize: 28, fontWeight: '900', color: colors.ink, letterSpacing: -0.5, marginBottom: 24 },
  pickerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  pickerChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  pickerChipOn: { borderColor: colors.crimson, backgroundColor: '#D4202015' },
  pickerChipText: { fontSize: 13, fontWeight: '600', color: colors.inkSecondary },
  pickerChipTextOn: { color: colors.crimson },
  error: { color: colors.crimson, fontSize: 13, marginBottom: 12 },
  switchLink: { textAlign: 'center', marginTop: 16, fontSize: 14, color: colors.inkSecondary },
  switchLinkStrong: { color: colors.crimson, fontWeight: '700' },
});
