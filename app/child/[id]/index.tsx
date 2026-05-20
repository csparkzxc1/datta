import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/button';
import { MilestoneCard } from '@/components/ui/milestone-card';
import { formatAgeAtThen, resolveMilestones } from '@/lib/milestones';
import { useChildren, useDeleteChild } from '@/lib/queries/children';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: children, isLoading } = useChildren();
  const deleteChild = useDeleteChild();
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

  const confirmDelete = () => {
    Alert.alert(
      `${child.name}을 지울까요?`,
      '자녀를 지우면 이 자녀에게 보낼 모든 캡슐과 사진도 함께 사라집니다. 되돌릴 수 없어요.\n\n먼저 [나 → 영구 백업]에서 내보내기를 한 번 해두시는 걸 권해요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '지우기',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChild.mutateAsync(child.id);
              router.back();
            } catch {
              Alert.alert('잠시 멈췄어요', '다시 시도해보실까요.');
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: child.name,
          headerRight: () => (
            <Pressable
              onPress={() => router.push(`/child/${child.id}/edit`)}
              hitSlop={12}>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.sm,
                  color: colors.peach,
                }}>
                수정
              </Text>
            </Pressable>
          ),
        }}
      />
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

        <Button label={`${child.name} 지우기`} variant="tertiary" onPress={confirmDelete} />
      </ScrollView>
    </>
  );
}

function formatBirthdate(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`;
}
