import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Wordmark } from '@/components/brand/wordmark';
import { Button } from '@/components/ui/button';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={{ flex: 1, padding: spacing['2xl'], justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.xl }}>
          <Wordmark size={56} />
          <View style={{ gap: spacing.md, paddingHorizontal: spacing.md }}>
            <Text
              style={{
                fontFamily: fonts.serif,
                fontSize: sizes['2xl'],
                color: colors.inkWarm,
                textAlign: 'center',
                lineHeight: sizes['2xl'] * 1.5,
              }}>
              닿다는{'\n'}당신과 자녀의 약속입니다
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkSoft,
                textAlign: 'center',
                lineHeight: sizes.base * 1.8,
              }}>
              오늘의 한 줄이, 자녀가 자라난{'\n'}그날의 평생이 됩니다.
            </Text>
          </View>
        </View>
        <Button label="시작하기" fullWidth onPress={() => router.push('/onboarding/promises')} />
      </View>
    </SafeAreaView>
  );
}
