import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { track } from '@/lib/analytics';
import { useAuthStore } from '@/lib/auth-store';
import { requestPushPermissionAndRegister } from '@/lib/push-tokens';
import { supabase } from '@/lib/supabase';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type PermState = 'unknown' | 'granted' | 'denied' | 'undetermined';

export default function NotificationsScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const [perm, setPerm] = useState<PermState>('unknown');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const raw = (await Notifications.getPermissionsAsync()) as {
      status: string;
      granted: boolean;
      canAskAgain: boolean;
    };
    if (raw.granted) setPerm('granted');
    else if (!raw.canAskAgain) setPerm('denied');
    else setPerm('undetermined');
  };

  useEffect(() => {
    refresh();
  }, []);

  if (!session) {
    router.replace('/onboarding/welcome');
    return null;
  }

  const handleEnable = async () => {
    setBusy(true);
    try {
      const granted = await requestPushPermissionAndRegister();
      if (granted) {
        track({ name: 'notifications_enabled' });
      } else {
        Alert.alert(
          '알림 권한이 꺼져 있어요',
          '설정 앱에서 닿다 알림을 켤 수 있습니다. 안 켜셔도 괜찮습니다.',
          [
            { text: '괜찮아요', style: 'cancel' },
            { text: '설정 열기', onPress: () => Linking.openSettings() },
          ]
        );
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from('push_tokens').delete().eq('user_id', userData.user.id);
      }
      track({ name: 'notifications_disabled' });
      Alert.alert(
        '알림이 꺼졌어요',
        '시스템 알림 권한은 그대로입니다. 완전히 끄시려면 설정 앱에서 권한도 꺼주세요.'
      );
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '알림',
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
              조용한 알림만
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkSoft,
                lineHeight: sizes.base * 1.7,
              }}>
              닿다는 기록을 안 했다고 알림을 보내지 않습니다. 자녀에게 캡슐이 도착하는
              날, 자녀의 생일·마일스톤이 다가오는 날에만 부드럽게 알려드립니다. 모두 끄셔도
              괜찮습니다.
            </Text>
          </View>

          <Card>
            <View style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    fontFamily: fonts.serif,
                    fontSize: sizes.lg,
                    color: colors.inkWarm,
                  }}>
                  현재 상태
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: sizes.base,
                    color: perm === 'granted' ? colors.sage : colors.inkSoft,
                  }}>
                  {labelForPerm(perm)}
                </Text>
              </View>

              {perm === 'granted' ? (
                <Button
                  label={busy ? '잠시만요…' : '알림 끄기'}
                  variant="secondary"
                  fullWidth
                  disabled={busy}
                  onPress={handleDisable}
                />
              ) : (
                <Button
                  label={busy ? '잠시만요…' : '알림 켜기'}
                  fullWidth
                  disabled={busy}
                  onPress={handleEnable}
                />
              )}
            </View>
          </Card>

          <View style={{ gap: spacing.sm }}>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.xs,
                color: colors.inkSoft,
                textTransform: 'uppercase',
                letterSpacing: 1,
                paddingHorizontal: spacing.xs,
              }}>
              알려드리는 때
            </Text>
            <Card padding={0}>
              <Row title="캡슐 도착" hint="작성하신 캡슐이 자녀에게 닿는 날" />
              <Row title="자녀 생일·마일스톤" hint="1주일 전 부드럽게 한 번" last />
            </Card>
          </View>

          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.xs,
              color: colors.inkSoft,
              textAlign: 'center',
              padding: spacing.md,
              lineHeight: sizes.xs * 1.7,
            }}>
            §7 anti-FOMO — &ldquo;기록 안 한 날 N일&rdquo; 같은 부재 강조 알림은 영원히 없습니다.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Row({ title, hint, last }: { title: string; hint: string; last?: boolean }) {
  return (
    <View
      style={{
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: last ? 0 : 0.5,
        borderBottomColor: `${colors.inkSoft}33`,
        gap: 4,
      }}>
      <Text style={{ fontFamily: fonts.body, fontSize: sizes.base, color: colors.inkWarm }}>
        {title}
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: sizes.xs, color: colors.inkSoft }}>
        {hint}
      </Text>
    </View>
  );
}

function labelForPerm(p: PermState): string {
  switch (p) {
    case 'granted':
      return '켜짐';
    case 'denied':
      return '시스템 권한 꺼짐';
    case 'undetermined':
      return '꺼짐';
    case 'unknown':
      return '확인 중…';
  }
}
