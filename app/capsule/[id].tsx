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
import { Card } from '@/components/ui/card';
import {
  useCapsule,
  useDeleteCapsule,
  useSealCapsule,
} from '@/lib/queries/capsules';
import { useCapsuleMedia } from '@/lib/queries/capsule-media';
import { useChildren } from '@/lib/queries/children';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

const SEAL_HOLD_MS = 1000;

export default function CapsuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: capsule, isLoading } = useCapsule(id);
  const { data: children } = useChildren();
  const { data: media } = useCapsuleMedia(id);
  const deleteCapsule = useDeleteCapsule();
  const sealCapsule = useSealCapsule();

  const child = children?.find((c) => c.id === capsule?.child_id);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.peach} />
      </View>
    );
  }

  if (!capsule) {
    return (
      <View style={{ flex: 1, padding: spacing.lg, backgroundColor: colors.paper }}>
        <Text style={{ fontFamily: fonts.body, fontSize: sizes.base, color: colors.inkSoft }}>
          캡슐을 찾을 수 없어요.
        </Text>
      </View>
    );
  }

  const unlockAt = new Date(capsule.unlock_at);
  const sealed = capsule.is_sealed;
  const delivered = capsule.is_delivered;
  const dDay = calculateDDay(unlockAt);

  const confirmDelete = () => {
    Alert.alert(
      '이 캡슐을 지울까요?',
      sealed
        ? '봉인된 캡슐은 지울 수 없습니다.'
        : '아직 봉인되지 않은 캡슐이라 되돌릴 수 없게 사라집니다.',
      sealed
        ? [{ text: '확인' }]
        : [
            { text: '취소', style: 'cancel' },
            {
              text: '지우기',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteCapsule.mutateAsync(capsule.id);
                  router.back();
                } catch {
                  Alert.alert('잠시 멈췄어요', '다시 시도해보실까요.');
                }
              },
            },
          ]
    );
  };

  const handleSealNow = async () => {
    try {
      await sealCapsule.mutateAsync(capsule.id);
      router.back();
    } catch {
      Alert.alert('잠시 멈췄어요', '다시 시도해보실까요.');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '캡슐',
          headerBackTitle: '뒤로',
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.paper }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text
            style={{ fontFamily: fonts.body, fontSize: sizes.sm, color: colors.inkSoft }}>
            {child ? `${child.name}에게` : '자녀에게'}
          </Text>
          <Text
            style={{
              fontFamily: fonts.serif,
              fontSize: sizes['2xl'],
              color: colors.inkWarm,
            }}>
            {capsule.title?.trim() || (sealed ? '봉인된 캡슐' : '작성 중인 캡슐')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: spacing.sm,
              marginTop: spacing.xs,
            }}>
            <Text
              style={{
                fontFamily: fonts.english,
                fontSize: sizes.sm,
                color: colors.inkSoft,
              }}>
              {formatDate(unlockAt)}
            </Text>
            <Text
              style={{
                fontFamily: fonts.english,
                fontSize: sizes.sm,
                color: delivered ? colors.sage : colors.goldWarm,
              }}>
              {delivered ? '도착함' : dDay}
            </Text>
          </View>
        </View>

        {!sealed ? (
          // 봉인 전: 본문 표시 + 봉인/삭제 액션
          <>
            <Card>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.base,
                  color: colors.inkWarm,
                  lineHeight: sizes.base * 1.8,
                }}>
                {capsule.body || '아직 본문이 비어 있어요.'}
              </Text>
            </Card>

            {media && media.length > 0 ? (
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
                  사진 {media.length}장
                </Text>
              </View>
            ) : null}

            <Card style={{ backgroundColor: colors.peachSoft, borderColor: colors.peach }}>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.sm,
                  color: colors.inkWarm,
                  lineHeight: sizes.sm * 1.7,
                }}>
                아직 봉인되지 않았어요. 봉인하면 더는 수정·삭제할 수 없습니다.
              </Text>
            </Card>

            <Pressable
              onLongPress={handleSealNow}
              delayLongPress={SEAL_HOLD_MS}
              disabled={sealCapsule.isPending}
              style={({ pressed }) => ({
                backgroundColor: colors.peach,
                borderRadius: 4,
                paddingVertical: 14,
                alignItems: 'center',
                opacity: sealCapsule.isPending ? 0.45 : pressed ? 0.7 : 1,
              })}>
              <Text
                style={{ fontFamily: fonts.body, fontSize: sizes.base, color: colors.paper }}>
                {sealCapsule.isPending ? '봉인 중…' : '길게 눌러 봉인'}
              </Text>
            </Pressable>

            <Button label="이 캡슐 지우기" variant="tertiary" onPress={confirmDelete} />
          </>
        ) : !delivered ? (
          // 봉인 후 발송 전: 제목·발송일만. 본문 X (§7.2)
          <>
            <Card>
              <View style={{ gap: spacing.sm, alignItems: 'flex-start' }}>
                <Text
                  style={{
                    fontFamily: fonts.serif,
                    fontSize: sizes.lg,
                    color: colors.inkWarm,
                  }}>
                  봉인되었습니다
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: sizes.base,
                    color: colors.inkSoft,
                    lineHeight: sizes.base * 1.7,
                  }}>
                  닿을 그날까지 기다립니다. 작성자도 본문을 다시 볼 수 없어요.
                  그게 약속의 무게입니다.
                </Text>
                {capsule.sealed_at ? (
                  <Text
                    style={{
                      fontFamily: fonts.english,
                      fontSize: sizes.xs,
                      color: colors.inkSoft,
                    }}>
                    봉인 · {formatDate(new Date(capsule.sealed_at))}
                  </Text>
                ) : null}
              </View>
            </Card>
          </>
        ) : (
          // 발송 완료: 전체 표시 (자녀와 함께 보는 의례)
          <>
            <Card>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.base,
                  color: colors.inkWarm,
                  lineHeight: sizes.base * 1.8,
                }}>
                {capsule.body}
              </Text>
            </Card>

            {media && media.length > 0 ? (
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
                  사진 {media.length}장
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: sizes.xs,
                    color: colors.inkSoft,
                  }}>
                  미디어 signed URL 발급은 다음 단계에서 wiring됩니다.
                </Text>
              </View>
            ) : null}

            {capsule.delivered_at ? (
              <Text
                style={{
                  fontFamily: fonts.english,
                  fontSize: sizes.xs,
                  color: colors.sage,
                  textAlign: 'center',
                }}>
                도착 · {formatDate(new Date(capsule.delivered_at))}
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </>
  );
}

function calculateDDay(target: Date): string {
  const days = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'D-day';
  if (days > 0) return `D-${days.toLocaleString()}`;
  return `${Math.abs(days).toLocaleString()}일 지남`;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`;
}
