import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { MilestoneCard } from '@/components/ui/milestone-card';
import {
  formatAgeAtThen,
  resolveMilestones,
} from '@/lib/milestones';
import { useChildren } from '@/lib/queries/children';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: children, isLoading } = useChildren();
  const child = children?.find((c) => c.id === id);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.peach} />
      </View>
    );
  }

  if (!child) {
    return (
      <View style={{ flex: 1, padding: spacing.lg, backgroundColor: colors.paper }}>
        <Text style={{ fontFamily: fonts.body, fontSize: sizes.base, color: colors.inkSoft }}>
          자녀를 찾을 수 없어요.
        </Text>
      </View>
    );
  }

  const birthdate = new Date(child.birthdate);
  const now = new Date();
  const resolved = resolveMilestones(birthdate, {
    gender: child.gender ?? undefined,
    now,
  });

  return (
    <>
      <Stack.Screen options={{ title: child.name }} />
      <ScrollView
        style={{ backgroundColor: colors.paper }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={{ fontFamily: fonts.hand, fontSize: sizes['3xl'], color: colors.inkWarm }}>
            {child.name}
          </Text>
          <Text style={{ fontFamily: fonts.english, fontSize: sizes.base, color: colors.inkSoft }}>
            {formatBirthdate(birthdate)} · {formatAgeAtThen(birthdate, now)}
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
            마일스톤
          </Text>
          <View style={{ gap: spacing.sm }}>
            {resolved.map((r) =>
              r.date ? (
                <MilestoneCard
                  key={r.milestone.key}
                  name={r.milestone.nameKr}
                  date={r.date}
                  ageAtThen={formatAgeAtThen(birthdate, r.date)}
                  passed={r.passed}
                />
              ) : null
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function formatBirthdate(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`;
}
