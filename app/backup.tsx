import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { exportToPdf, exportToZip } from '@/lib/export';
import { useAuthStore } from '@/lib/auth-store';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function BackupScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const [busy, setBusy] = useState<'pdf' | 'zip' | 'zip-media' | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  if (!session) {
    router.replace('/onboarding/welcome');
    return null;
  }

  const runPdf = async () => {
    setBusy('pdf');
    try {
      await exportToPdf();
    } catch (e) {
      Alert.alert('잠시 멈췄어요', e instanceof Error ? e.message : '다시 시도해보실까요.');
    } finally {
      setBusy(null);
    }
  };

  const runZip = async (withMedia: boolean) => {
    setBusy(withMedia ? 'zip-media' : 'zip');
    setProgress(null);
    try {
      await exportToZip({
        includeMedia: withMedia,
        onProgress: (done, total) => setProgress({ done, total }),
      });
    } catch (e) {
      Alert.alert('잠시 멈췄어요', e instanceof Error ? e.message : '다시 시도해보실까요.');
    } finally {
      setBusy(null);
      setProgress(null);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '영구 백업',
          headerBackTitle: '뒤로',
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.inkWarm,
          headerTitleStyle: { fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm },
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
          <View style={{ gap: spacing.xs }}>
            <Text style={{ fontFamily: fonts.serif, fontSize: sizes['2xl'], color: colors.inkWarm }}>
              언제든, 영원히
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkSoft,
                lineHeight: sizes.base * 1.7,
              }}>
              회사가 사라져도, 앱을 더 쓰지 않게 되어도, 이 파일 하나로 모든 캡슐과 자녀 정보가
              보존됩니다.
            </Text>
          </View>

          <Card>
            <View style={{ gap: spacing.md }}>
              <View style={{ gap: spacing.xs }}>
                <Text style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
                  PDF로 받기
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: sizes.sm,
                    color: colors.inkSoft,
                    lineHeight: sizes.sm * 1.7,
                  }}>
                  자녀·캡슐을 사람이 읽기 좋은 형태로. 인쇄해서 책처럼 보관하셔도 좋아요.
                </Text>
              </View>
              <Button
                label={busy === 'pdf' ? '만들고 있어요…' : 'PDF 만들기'}
                fullWidth
                disabled={busy !== null}
                onPress={runPdf}
              />
            </View>
          </Card>

          <Card>
            <View style={{ gap: spacing.md }}>
              <View style={{ gap: spacing.xs }}>
                <Text style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
                  ZIP으로 받기
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: sizes.sm,
                    color: colors.inkSoft,
                    lineHeight: sizes.sm * 1.7,
                  }}>
                  자녀·캡슐·미디어 메타데이터를 JSON과 텍스트로. 다른 도구로 옮기실 때.
                </Text>
              </View>
              <Button
                label={busy === 'zip' ? '만들고 있어요…' : 'ZIP 만들기 (텍스트만)'}
                fullWidth
                variant="secondary"
                disabled={busy !== null}
                onPress={() => runZip(false)}
              />
              <Button
                label={
                  busy === 'zip-media'
                    ? progress
                      ? `사진 ${progress.done} / ${progress.total} 받는 중…`
                      : '준비 중…'
                    : 'ZIP 만들기 (사진 포함)'
                }
                fullWidth
                disabled={busy !== null}
                onPress={() => runZip(true)}
              />
            </View>
          </Card>

          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.xs,
              color: colors.inkSoft,
              textAlign: 'center',
              paddingHorizontal: spacing.md,
              lineHeight: sizes.xs * 1.7,
            }}>
            §10.1 신뢰 약속 — 영구 백업은 언제든, 영원히 무료입니다.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
