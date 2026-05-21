import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { useAuthStore } from '@/lib/auth-store';
import { colors, fonts, sizes } from '@/theme/tokens';

export default function TabLayout() {
  const session = useAuthStore((s) => s.session);
  const initializing = useAuthStore((s) => s.initializing);

  if (initializing) return null;
  if (!session) return <Redirect href="/onboarding/welcome" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.peach,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: `${colors.inkSoft}33`,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: sizes.xs,
          marginBottom: 4,
        },
        tabBarButton: HapticTab,
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.inkWarm,
        headerTitleStyle: {
          fontFamily: fonts.serif,
          fontSize: sizes.xl,
          color: colors.inkWarm,
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '캡슐',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="children"
        options={{
          title: '자녀',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '나',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
