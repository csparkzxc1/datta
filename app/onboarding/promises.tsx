import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

const PROMISES = [
  {
    title: '영원합니다',
    body: '회사가 사라져도 캡슐은 사라지지 않습니다. 6개월 동결 감지 시 모든 캡슐이 등록 이메일로 자동 발송됩니다.',
  },
  {
    title: '비공개입니다',
    body: '가족 외 누구도 보지 못합니다. 광고는 영원히 없습니다.',
  },
  {
    title: '언제든 가져갈 수 있습니다',
    body: '모든 캡슐을 즉시 PDF·ZIP으로 내보낼 수 있습니다. 영원히 무료입니다.',
  },
  {
    title: '자녀에게 닿습니다',
    body: '부모님이 사망하셔도 미리 지정한 가족이 인계받습니다.',
  },
];

export default function PromisesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={{ flex: 1, padding: spacing.lg, paddingTop: spacing.xl }}>
        <View style={{ gap: spacing.xs, marginBottom: spacing.xl }}>
          <Text
            style={{
              fontFamily: fonts.english,
              fontSize: sizes.sm,
              color: colors.goldWarm,
            }}>
            네 가지 약속
          </Text>
          <Text
            style={{
              fontFamily: fonts.serif,
              fontSize: sizes['2xl'],
              color: colors.inkWarm,
            }}>
            당신의 캡슐은
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: spacing.lg }}>
          {PROMISES.map((p) => (
            <View key={p.title} style={{ flexDirection: 'row', gap: spacing.md }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.peach,
                  marginTop: sizes.lg * 0.6,
                }}
              />
              <View style={{ flex: 1, gap: spacing.xs }}>
                <Text
                  style={{
                    fontFamily: fonts.serif,
                    fontSize: sizes.lg,
                    color: colors.inkWarm,
                  }}>
                  {p.title}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: sizes.base,
                    color: colors.inkSoft,
                    lineHeight: sizes.base * 1.7,
                  }}>
                  {p.body}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Button label="다음" fullWidth onPress={() => router.push('/onboarding/login')} />
      </View>
    </SafeAreaView>
  );
}
