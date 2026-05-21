import { Pressable, Text, View } from 'react-native';
import { colors, fonts, radii, sizes, spacing } from '@/theme/tokens';

export type ChoiceOption<T extends string> = {
  value: T;
  label: string;
};

type ChoiceProps<T extends string> = {
  value: T | null;
  options: ChoiceOption<T>[];
  onChange: (v: T) => void;
};

export function Choice<T extends string>({ value, options, onChange }: ChoiceProps<T>) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => ({
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radii.pill,
              borderWidth: 1,
              borderColor: selected ? colors.peach : colors.inkSoft,
              backgroundColor: selected
                ? colors.peachSoft
                : pressed
                  ? colors.peachSoft
                  : 'transparent',
            })}>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.sm,
                color: selected ? colors.inkWarm : colors.inkSoft,
              }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
