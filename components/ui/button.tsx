import { Pressable, type PressableProps, Text, type ViewStyle } from 'react-native';
import { colors, fonts, radii, sizes } from '@/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
} & Pick<PressableProps, 'onPress' | 'onLongPress'>;

const PADDING_VERTICAL = 14;
const PADDING_HORIZONTAL = 32;

export function Button({
  label,
  variant = 'primary',
  fullWidth,
  disabled,
  style,
  onPress,
  onLongPress,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          borderRadius: radii.sm,
          paddingVertical: PADDING_VERTICAL,
          paddingHorizontal: variant === 'tertiary' ? 12 : PADDING_HORIZONTAL,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.45 : 1,
          ...containerStyle(variant, pressed),
        },
        style,
      ]}>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: sizes.base,
          color: labelColor(variant),
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

function containerStyle(variant: ButtonVariant, pressed: boolean): ViewStyle {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: colors.peach,
        opacity: pressed ? 0.85 : 1,
      };
    case 'secondary':
      return {
        backgroundColor: pressed ? colors.peachSoft : 'transparent',
        borderWidth: 1,
        borderColor: colors.inkWarm,
      };
    case 'tertiary':
      return {
        backgroundColor: pressed ? colors.peachSoft : 'transparent',
      };
  }
}

function labelColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return colors.paper;
    case 'secondary':
      return colors.inkWarm;
    case 'tertiary':
      return colors.peach;
  }
}
