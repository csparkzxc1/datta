import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { type Child } from '@/lib/queries/children';
import { calculateAgeYears, resolveMilestones } from '@/lib/milestones';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type Props = {
  child: Child;
};

export function ChildCard({ child }: Props) {
  const router = useRouter();
  const birthdate = new Date(child.birthdate);
  const now = new Date();

  const upcoming = resolveMilestones(birthdate, {
    gender: child.gender ?? undefined,
    now,
  })
    .filter((r) => !r.passed && r.date)
    .sort((a, b) => (a.date!.getTime() - b.date!.getTime()))[0];

  const ageYears = calculateAgeYears(birthdate, now);
  const ageLabel = ageYears < 0 ? '태어나기 전' : ageYears === 0 ? `생후` : `만 ${ageYears}세`;

  return (
    <Card onPress={() => router.push(`/child/${child.id}`)}>
      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: fonts.hand,
              fontSize: sizes.xl,
              color: colors.inkWarm,
            }}>
            {child.name}
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.sm,
              color: colors.inkSoft,
            }}>
            {ageLabel}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.english,
            fontSize: sizes.sm,
            color: colors.inkSoft,
          }}>
          {formatBirthdate(birthdate)}
        </Text>
        {upcoming?.date ? (
          <View
            style={{
              flexDirection: 'row',
              gap: spacing.sm,
              marginTop: spacing.xs,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.peach,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.sm,
                color: colors.inkWarm,
              }}>
              다가오는 {upcoming.milestone.nameKr}
            </Text>
            <Text
              style={{
                fontFamily: fonts.english,
                fontSize: sizes.sm,
                color: colors.goldWarm,
              }}>
              D-{daysUntil(upcoming.date).toLocaleString()}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

function formatBirthdate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function daysUntil(target: Date): number {
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
