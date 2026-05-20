import { Stack } from 'expo-router';
import { colors, fonts, sizes } from '@/theme/tokens';

export default function LegalLayout() {
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
