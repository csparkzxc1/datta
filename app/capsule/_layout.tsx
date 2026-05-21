import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/lib/auth-store';
import { colors, fonts, sizes } from '@/theme/tokens';

export default function CapsuleLayout() {
  const session = useAuthStore((s) => s.session);
  const initializing = useAuthStore((s) => s.initializing);

  if (initializing) return null;
  if (!session) return <Redirect href="/onboarding/welcome" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.inkWarm,
        headerTitleStyle: {
          fontFamily: fonts.serif,
          fontSize: sizes.lg,
          color: colors.inkWarm,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    />
  );
}
