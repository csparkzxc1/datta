import { Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function SunsetPolicyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '회사가 사라지면' }} />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
          <View style={{ gap: spacing.xs }}>
            <Text style={{ fontFamily: fonts.serif, fontSize: sizes['2xl'], color: colors.inkWarm }}>
              회사가 사라져도 캡슐은 사라지지 않습니다
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkSoft,
                lineHeight: sizes.base * 1.7,
              }}>
              §10.3 — 닿다의 가장 중요한 약속.
            </Text>
          </View>

          <Card style={{ backgroundColor: colors.peachSoft, borderColor: colors.peach }}>
            <View style={{ gap: spacing.sm }}>
              <Text
                style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
                자동 발송 약정
              </Text>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.base,
                  color: colors.inkWarm,
                  lineHeight: sizes.base * 1.8,
                }}>
                닿다가 6개월간 정상 서비스를 유지하지 못할 경우:{'\n\n'}
                1. 모든 봉인된 캡슐이 작성자의 등록 이메일로 자동 발송됩니다 (PDF + ZIP).{'\n\n'}
                2. 발송 비용은 회사 청산금에서 우선 차감됩니다.{'\n\n'}
                3. 이 약정은 법률 자문을 거쳐 명문화되어 있습니다.
              </Text>
            </View>
          </Card>

          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
              3겹의 안전망
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkWarm,
                lineHeight: sizes.base * 1.8,
              }}>
              (1) 언제든 내보내기 — 모든 데이터를 PDF·ZIP으로 즉시 다운로드할 수 있습니다.
              회사가 어떻게 되든, 당신은 이미 모든 캡슐의 사본을 갖고 있습니다.{'\n\n'}
              (2) 회사 해산 자동 발송 — 위의 자동 발송 약정.{'\n\n'}
              (3) 상속 관리자 — 당신에게 만약의 일이 일어나도, 미리 지정한 가족이 캡슐을
              이어받습니다.
            </Text>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
              앞으로의 약속
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkWarm,
                lineHeight: sizes.base * 1.8,
              }}>
              V2에서 제3자 에스크로(변호사 또는 은행에 데이터 사본 보관 + 자동 발송 트리거)를
              도입합니다. 회사가 통제하지 못하는 곳에 또 한 겹의 복제본을 두기 위함입니다.
            </Text>
          </View>

          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.xs,
              color: colors.inkSoft,
              textAlign: 'center',
              paddingTop: spacing.md,
              lineHeight: sizes.xs * 1.7,
            }}>
            초안 — 정식 법무 검토 후 갱신됩니다.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
