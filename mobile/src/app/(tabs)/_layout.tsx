import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/lib/theme';

function EmojiIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 19, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>;
}

const TAB_SCREENS = [
  { name: 'index', title: 'Home', emoji: '🏠' },
  { name: 'map', title: 'Map', emoji: '🗺️' },
  { name: 'challenges', title: 'Quests', emoji: '⚡' },
  { name: 'leaderboard', title: 'Ranks', emoji: '🏆' },
  { name: 'rewards', title: 'Rewards', emoji: '🎁' },
  { name: 'profile', title: 'Profile', emoji: '👤' },
] as const;

export default function TabsLayout() {
  const { ready, signedIn } = useAuth();
  if (ready && !signedIn) return <Redirect href="/welcome" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.crimson,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarLabelStyle: { fontSize: 9, fontWeight: '700', letterSpacing: 0.2 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      {TAB_SCREENS.map((s) => (
        <Tabs.Screen
          key={s.name}
          name={s.name}
          options={{
            title: s.title,
            tabBarIcon: ({ focused }) => <EmojiIcon emoji={s.emoji} focused={focused} />,
          }}
        />
      ))}
    </Tabs>
  );
}
