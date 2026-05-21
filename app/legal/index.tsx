import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type Doc = { href: string; title: string; hint: string };

const DOCS: Doc[] = [
  { href: '/legal/terms', title: '서비스 이용약관', hint: '닿다와 사용자 사이의 약속' },
  { href: '/legal/privacy', title: '개인정보처리방침', hint: '어떤 정보를 어떻게 다루는지' },
  { href: '/legal/sunset-policy', title: '회사가 사라지면 (§10.3)', hint: '자동 발송 약정' },
];

export default function LegalIndexScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: '약관' }} />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
          {DOCS.map((d) => (
            <Pressable key={d.href} onPress={() => router.push(d.href as never)}>
              <Card>
                <Text
                  style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
                  {d.title}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: sizes.sm,
                    color: colors.inkSoft,
                    marginTop: 4,
                  }}>
                  {d.hint}
                </Text>
              </Card>
            </Pressable>
          ))}

          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.xs,
              color: colors.inkSoft,
              textAlign: 'center',
              padding: spacing.md,
              lineHeight: sizes.xs * 1.7,
            }}>
            정식 법무 검토 전 초안입니다. 출시 전 변호사 검토 후 갱신됩니다.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
