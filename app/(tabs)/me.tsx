import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type MenuItem = {
  label: string;
  hint?: string;
};

const MENU: { section: string; items: MenuItem[] }[] = [
  {
    section: '신뢰',
    items: [
      { label: '영구 백업 — PDF·ZIP 내보내기', hint: '언제든, 영원히 무료' },
      { label: '상속 관리자 지정', hint: '배우자 또는 지인 1명' },
      { label: '회사 신뢰 페이지', hint: '분기별 transparency report' },
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
      { label: '약관 / 개인정보처리방침' },
    ],
  },
  {
    section: '계정',
    items: [{ label: '로그아웃' }, { label: '계정 삭제' }],
  },
];

export default function MeScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.lg,
        }}>
        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              fontFamily: fonts.serif,
              fontSize: sizes['3xl'],
              color: colors.inkWarm,
            }}>
            나
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.sm,
              color: colors.inkSoft,
            }}>
            마음을 보내는 사람.
          </Text>
        </View>

        {MENU.map(({ section, items }) => (
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
                <View
                  key={item.label}
                  style={{
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.md,
                    borderBottomWidth: idx === items.length - 1 ? 0 : 0.5,
                    borderBottomColor: `${colors.inkSoft}33`,
                    gap: 4,
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.body,
                      fontSize: sizes.base,
                      color: colors.inkWarm,
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
                </View>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
