import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CapsuleCard } from '@/components/capsule/capsule-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCapsules, type Capsule } from '@/lib/queries/capsules';
import { useChildren, type Child } from '@/lib/queries/children';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type Section = {
  key: 'drafting' | 'sealed' | 'opened';
  title: string;
  hint?: string;
  capsules: Capsule[];
};

export default function CapsulesScreen() {
  const router = useRouter();
  const { data: capsules, isLoading } = useCapsules();
  const { data: children } = useChildren();

  const childMap = useMemo(() => {
    const map = new Map<string, Child>();
    (children ?? []).forEach((c) => map.set(c.id, c));
    return map;
  }, [children]);

  const sections = useMemo<Section[]>(() => {
    const drafting: Capsule[] = [];
    const sealed: Capsule[] = [];
    const opened: Capsule[] = [];
    (capsules ?? []).forEach((c) => {
      if (c.is_delivered) opened.push(c);
      else if (c.is_sealed) sealed.push(c);
      else drafting.push(c);
    });
    const all: Section[] = [
      {
        key: 'drafting',
        title: '진행 중',
        hint: '봉인하기 전엔 언제든 수정할 수 있어요',
        capsules: drafting,
      },
      {
        key: 'sealed',
        title: '봉인됨',
        hint: '닿을 그날까지 기다립니다',
        capsules: sealed,
      },
      {
        key: 'opened',
        title: '열림',
        capsules: opened,
      },
    ];
    return all.filter((s) => s.capsules.length > 0);
  }, [capsules]);

  const hasAny = sections.length > 0;
  const nextSealed = sections.find((s) => s.key === 'sealed')?.capsules[0];

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
            캡슐
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.sm,
              color: colors.inkSoft,
            }}>
            오늘의 한 줄이, 그날의 평생이 됩니다.
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.peach} />
        ) : !hasAny ? (
          <Card>
            <View style={{ gap: spacing.md, alignItems: 'flex-start' }}>
              <Text
                style={{
                  fontFamily: fonts.serif,
                  fontSize: sizes.lg,
                  color: colors.inkWarm,
                }}>
                아직 봉인된 캡슐이 없어요
              </Text>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.base,
                  color: colors.inkSoft,
                  lineHeight: sizes.base * 1.7,
                }}>
                지금 떠오르는 한 마디가 평생 닿는 한 줄이 됩니다.
              </Text>
              <Button label="첫 캡슐 만들기" onPress={() => router.push('/capsule/new')} />
            </View>
          </Card>
        ) : (
          <>
            {nextSealed ? (
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
                  가장 먼저 닿는 캡슐
                </Text>
                <CapsuleCard capsule={nextSealed} child={childMap.get(nextSealed.child_id)} />
              </View>
            ) : null}

            {sections.map((section) => (
              <View key={section.key} style={{ gap: spacing.sm }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    paddingHorizontal: spacing.xs,
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.serif,
                      fontSize: sizes.lg,
                      color: colors.inkWarm,
                    }}>
                    {section.title}
                  </Text>
                  {section.hint ? (
                    <Text
                      style={{
                        fontFamily: fonts.body,
                        fontSize: sizes.xs,
                        color: colors.inkSoft,
                      }}>
                      {section.hint}
                    </Text>
                  ) : null}
                </View>
                <View style={{ gap: spacing.sm }}>
                  {section.capsules.map((c) => (
                    <CapsuleCard key={c.id} capsule={c} child={childMap.get(c.child_id)} />
                  ))}
                </View>
              </View>
            ))}

            <Button
              label="새 캡슐"
              variant="secondary"
              fullWidth
              onPress={() => router.push('/capsule/new')}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
