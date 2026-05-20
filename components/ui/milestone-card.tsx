import { View, Text } from 'react-native';
import { Card } from '@/components/ui/card';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type MilestoneCardProps = {
  name: string;
  date: Date;
  ageAtThen?: string;
  selected?: boolean;
  passed?: boolean;
  hasCapsule?: boolean;
  onPress?: () => void;
};

const SEAL_SIZE = 18;

export function MilestoneCard({
  name,
  date,
  ageAtThen,
  selected,
  passed,
  hasCapsule,
  onPress,
}: MilestoneCardProps) {
  const dDay = calculateDDay(date);
  const dimmed = passed && !selected;

  return (
    <Card selected={selected} onPress={passed ? undefined : onPress}>
      <View style={{ opacity: dimmed ? 0.45 : 1, gap: spacing.xs }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: fonts.serif,
              fontSize: sizes.lg,
              color: colors.inkWarm,
              flex: 1,
            }}>
            {name}
          </Text>
          {hasCapsule ? (
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
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm }}>
          <Text style={{ fontFamily: fonts.english, fontSize: sizes.sm, color: colors.inkSoft }}>
            {formatDate(date)}
          </Text>
          <Text style={{ fontFamily: fonts.english, fontSize: sizes.sm, color: colors.goldWarm }}>
            {dDay}
          </Text>
        </View>
        {ageAtThen ? (
          <Text style={{ fontFamily: fonts.body, fontSize: sizes.xs, color: colors.inkSoft }}>
            그때 {ageAtThen}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

function calculateDDay(target: Date): string {
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'D-day';
  if (days > 0) return `D-${days.toLocaleString()}`;
  return `지남`;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}
