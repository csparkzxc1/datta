import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/lib/auth-store';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type MenuItem = {
  label: string;
  hint?: string;
  onPress?: () => void;
  destructive?: boolean;
};

export default function MeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const confirmSignOut = () => {
    Alert.alert('로그아웃할까요?', '봉인된 캡슐은 그대로 남아 있어요.', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const sections: { section: string; items: MenuItem[] }[] = [
    {
      section: '신뢰',
      items: [
        {
          label: '영구 백업 — PDF·ZIP 내보내기',
          hint: '언제든, 영원히 무료',
          onPress: () => router.push('/backup'),
        },
        {
          label: '상속 관리자 지정',
          hint: '배우자 또는 지인 1명',
          onPress: () => router.push('/inheritance'),
        },
        {
          label: '회사 신뢰 페이지',
          hint: '분기별 transparency report',
          onPress: () => router.push('/transparency'),
        },
      ],
    },
    {
      section: '구독',
      items: [{ label: '플랜', hint: '무료 — 자녀 1명, 캡슐 1개' }],
    },
    {
      section: '설정',
      items: [
        { label: '알림', hint: '모두 끄셔도 괜찮습니다' },
        { label: '도움말 / 문의' },
        {
          label: '약관 / 개인정보처리방침',
          onPress: () => router.push('/legal'),
        },
      ],
    },
    {
      section: '계정',
      items: [
        { label: '로그아웃', onPress: confirmSignOut },
        { label: '계정 삭제', destructive: true },
      ],
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              fontFamily: fonts.serif,
              fontSize: sizes['3xl'],
              color: colors.inkWarm,
            }}>
            나
          </Text>
          {user?.email ? (
            <Text
              style={{
                fontFamily: fonts.english,
                fontSize: sizes.sm,
                color: colors.inkSoft,
              }}>
              {user.email}
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.sm,
                color: colors.inkSoft,
              }}>
              마음을 보내는 사람.
            </Text>
          )}
        </View>

        {sections.map(({ section, items }) => (
          <View key={section} style={{ gap: spacing.sm }}>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.xs,
                color: colors.inkSoft,
                textTransform: 'uppercase',
                letterSpacing: 1,
                paddingHorizontal: spacing.xs,
              }}>
              {section}
            </Text>
            <Card padding={0}>
              {items.map((item, idx) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                  style={({ pressed }) => ({
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.md,
                    borderBottomWidth: idx === items.length - 1 ? 0 : 0.5,
                    borderBottomColor: `${colors.inkSoft}33`,
                    gap: 4,
                    backgroundColor: pressed && item.onPress ? colors.peachSoft : 'transparent',
                  })}>
                  <Text
                    style={{
                      fontFamily: fonts.body,
                      fontSize: sizes.base,
                      color: item.destructive ? colors.error : colors.inkWarm,
                    }}>
                    {item.label}
                  </Text>
                  {item.hint ? (
                    <Text
                      style={{
                        fontFamily: fonts.body,
                        fontSize: sizes.xs,
                        color: colors.inkSoft,
                      }}>
                      {item.hint}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
