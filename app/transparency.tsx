import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/lib/auth-store';
import { useTransparencyReports } from '@/lib/queries/transparency';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function TransparencyScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const { data: reports, isLoading } = useTransparencyReports();

  if (!session) {
    router.replace('/onboarding/welcome');
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '회사 신뢰',
          headerBackTitle: '뒤로',
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.inkWarm,
          headerTitleStyle: {
            fontFamily: fonts.serif,
            fontSize: sizes.lg,
            color: colors.inkWarm,
          },
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
          <View style={{ gap: spacing.xs }}>
            <Text
              style={{ fontFamily: fonts.serif, fontSize: sizes['2xl'], color: colors.inkWarm }}>
              숨길 게 없습니다
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkSoft,
                lineHeight: sizes.base * 1.7,
              }}>
              가입자 수, 보관 캡슐 수, 저장 용량, 운영 비용, 현금 보유, 런웨이 — 모두
              분기마다 공개합니다. 투명함이 신뢰가 됩니다.
            </Text>
          </View>

          {isLoading ? (
            <ActivityIndicator color={colors.peach} />
          ) : !reports || reports.length === 0 ? (
            <Card>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.base,
                  color: colors.inkSoft,
                  lineHeight: sizes.base * 1.7,
                }}>
                첫 분기 리포트는 출시 후 첫 분기 종료 시 게시됩니다. 그때까지 잠시만
                기다려주세요.
              </Text>
            </Card>
          ) : (
            reports.map((r) => (
              <Card key={r.id}>
                <View style={{ gap: spacing.sm }}>
                  <Text
                    style={{
                      fontFamily: fonts.serif,
                      fontSize: sizes.lg,
                      color: colors.inkWarm,
                    }}>
                    {r.quarter}
                  </Text>
                  <Row label="가입자" value={`${r.total_users.toLocaleString()}명`} />
                  <Row label="봉인된 캡슐" value={`${r.total_capsules.toLocaleString()}개`} />
                  <Row label="저장 미디어" value={`${r.total_storage_gb} GB`} />
                  {r.monthly_burn_krw !== null ? (
                    <Row
                      label="월간 운영 비용"
                      value={`₩${r.monthly_burn_krw.toLocaleString()}`}
                    />
                  ) : null}
                  {r.runway_months !== null ? (
                    <Row label="런웨이" value={`${r.runway_months}개월`} />
                  ) : null}
                </View>
              </Card>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Text style={{ fontFamily: fonts.body, fontSize: sizes.sm, color: colors.inkSoft }}>
        {label}
      </Text>
      <Text style={{ fontFamily: fonts.english, fontSize: sizes.base, color: colors.inkWarm }}>
        {value}
      </Text>
    </View>
  );
}
