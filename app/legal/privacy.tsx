import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function PrivacyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '개인정보처리방침' }} />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
          <Section title="우리가 받는 것">
            (1) 로그인용 이메일·이름{'\n'}
            (2) 자녀 정보: 이름·생일·성별·관계{'\n'}
            (3) 캡슐: 제목·본문·사진·발송 일정
          </Section>

          <Section title="자녀 데이터는 신성합니다">
            (1) 자녀의 이름·생일·캡슐 내용은 외부 SDK(Mixpanel, Sentry 등)로 전송되지 않습니다.
            {'\n'}(2) 분석 이벤트는 익명 사용 패턴(예: &quot;캡슐 봉인 이벤트 발생&quot;)만 포함하며,
            콘텐츠는 포함하지 않습니다.{'\n'}(3) 광고는 영원히 없습니다.
          </Section>

          <Section title="저장 위치">
            (1) 텍스트·메타데이터: Supabase (PostgreSQL, AWS Seoul region){'\n'}
            (2) 사진·동영상: Cloudflare R2 (signed URL로만 접근, 만료 토큰){'\n'}
            (3) 로그인 토큰: 사용자 기기의 SecureStore (KeyChain/Keystore)
          </Section>

          <Section title="누가 볼 수 있나">
            (1) 가족 외 누구도 볼 수 없습니다.{'\n'}
            (2) 닿다 직원은 기술적 운영 목적이 아닌 한 콘텐츠에 접근하지 않으며, 접근 시
            모든 액세스 기록이 남습니다.{'\n'}
            (3) E2E 암호화는 V2에 도입 예정으로, 그 후엔 닿다도 볼 수 없게 됩니다.
          </Section>

          <Section title="사용자의 권리">
            (1) 언제든 모든 데이터를 PDF·ZIP으로 내보낼 수 있습니다.{'\n'}
            (2) 계정 삭제 시 모든 데이터가 영구 삭제됩니다(상속 관리자 지정이 있는 경우 예외).{'\n'}
            (3) 알림은 모두 끌 수 있습니다.
          </Section>

          <Section title="문의">
            개인정보 관련 문의: privacy@datta.app (예정)
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
