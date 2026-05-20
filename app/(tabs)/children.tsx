import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function ChildrenScreen() {
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
            자녀
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.sm,
              color: colors.inkSoft,
            }}>
            닿게 할 마음의 받는 사람.
          </Text>
        </View>

        <Card>
          <View style={{ gap: spacing.md, alignItems: 'flex-start' }}>
            <Text
              style={{
                fontFamily: fonts.serif,
                fontSize: sizes.lg,
                color: colors.inkWarm,
              }}>
              자녀를 등록해보실까요
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkSoft,
                lineHeight: sizes.base * 1.7,
              }}>
              자녀의 생일을 알려주시면, 백일·돌·입학·성년식 같은 한국의
              마일스톤을 자동으로 안내해드립니다.
            </Text>
            <Button label="자녀 등록하기" />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
