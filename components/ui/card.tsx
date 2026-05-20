import { type ReactNode } from 'react';
import { Pressable, type PressableProps, View, type ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';

type CardProps = {
  children: ReactNode;
  selected?: boolean;
  padding?: number;
  style?: ViewStyle;
} & Pick<PressableProps, 'onPress' | 'onLongPress'>;

export function Card({
  children,
  selected,
  padding = spacing.md,
  style,
  onPress,
  onLongPress,
}: CardProps) {
  const baseStyle: ViewStyle = {
    backgroundColor: selected ? colors.peachSoft : colors.paper,
    borderWidth: 0.5,
    borderColor: colors.inkSoft,
    borderRadius: radii.lg,
    padding,
  };

  if (!onPress && !onLongPress) {
    return <View style={[baseStyle, style]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        baseStyle,
        pressed && { opacity: 0.85 },
        style,
      ]}>
      {children}
    </Pressable>
  );
}
