import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function TermsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '서비스 이용약관' }} />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
          <Section title="제1조 약속">
            닿다는 부모가 자녀에게 미래의 어느 날 닿게 될 편지·사진을 봉인하는 앱입니다.
            한 번 봉인한 캡슐은 지정한 그날 자녀에게 도달합니다.
          </Section>

          <Section title="제2조 봉인의 불가역성">
            봉인된 캡슐은 작성자도 수정·삭제할 수 없습니다. 이는 약속의 무게를 지키기
            위한 의도된 마찰입니다.
          </Section>

          <Section title="제3조 영구 보관">
            (1) 닿다는 모든 봉인된 캡슐을 지정된 unlock 일시까지 안전하게 보관합니다.
            {'\n'}(2) 회사가 정상 서비스를 6개월간 유지하지 못할 경우, 모든 봉인된 캡슐이
            작성자의 등록 이메일로 자동 발송됩니다. 자세한 내용은 [회사가 사라지면]을
            보십시오.
          </Section>

          <Section title="제4조 데이터 내보내기">
            사용자는 언제든 자신의 모든 데이터를 PDF·ZIP으로 무료 내보낼 수 있습니다. 이
            권리는 영원히 무료입니다(§10.1).
          </Section>

          <Section title="제5조 자녀 데이터의 신성성">
            (1) 자녀의 이름·생일·캡슐 콘텐츠는 어떤 분석·학습·외부 공유에도 사용되지 않습니다.
            {'\n'}(2) 닿다는 광고를 포함하지 않으며, 향후에도 광고 모델로 전환하지 않습니다.
          </Section>

          <Section title="제6조 무료 캡슐 보장">
            무료 사용자가 만든 1개의 캡슐은 결제 여부와 무관하게 영원히 보장됩니다.
          </Section>

          <Section title="제7조 환불">
            (1) 월간/연간 구독은 첫 결제 후 24시간 내 100% 환불 가능합니다.
            {'\n'}(2) 평생 플랜은 30일 환불 보장.
          </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
        {title}
      </Text>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: sizes.base,
          color: colors.inkWarm,
          lineHeight: sizes.base * 1.8,
        }}>
        {children}
      </Text>
    </View>
  );
}
