import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { type Capsule } from '@/lib/queries/capsules';
import { type Child } from '@/lib/queries/children';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type Props = {
  capsule: Capsule;
  child?: Child;
};

const SEAL_SIZE = 24;

export function CapsuleCard({ capsule, child }: Props) {
  const unlockAt = new Date(capsule.unlock_at);
  const dDay = calculateDDay(unlockAt);
  const sealed = capsule.is_sealed;
  const delivered = capsule.is_delivered;

  return (
    <Card>
      <View style={{ gap: spacing.xs, flexDirection: 'row' }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.xs,
              color: colors.inkSoft,
            }}>
            {child ? child.name : '자녀'}에게
          </Text>
          <Text
            style={{
              fontFamily: fonts.serif,
              fontSize: sizes.lg,
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
        {sealed ? (
          <View
            style={{
              width: SEAL_SIZE,
              height: SEAL_SIZE,
              borderRadius: SEAL_SIZE / 2,
              backgroundColor: colors.peach,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: fonts.hand,
                fontSize: sizes.xs,
                color: colors.paper,
                lineHeight: sizes.xs,
              }}>
              닿
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
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
