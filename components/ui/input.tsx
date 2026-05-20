import { useState } from 'react';
import { Text, TextInput, type TextInputProps, View, type ViewStyle } from 'react-native';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'style' | 'placeholderTextColor'>;

const PLACEHOLDER_OPACITY = '4D';

export function Input({
  label,
  value,
  onChangeText,
  error,
  containerStyle,
  multiline,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.error : focused ? colors.peach : colors.inkSoft;
  const borderWidth = focused ? 1.5 : 1;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text
          style={{
            fontFamily: fonts.body,
            fontSize: sizes.sm,
            color: colors.inkSoft,
            marginBottom: spacing.xs,
          }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        placeholderTextColor={`${colors.inkSoft}${PLACEHOLDER_OPACITY}`}
        style={{
          fontFamily: fonts.body,
          fontSize: sizes.base,
          color: colors.inkWarm,
          borderBottomWidth: borderWidth,
          borderBottomColor: borderColor,
          paddingVertical: multiline ? spacing.sm : spacing.xs,
          minHeight: multiline ? 96 : undefined,
          textAlignVertical: multiline ? 'top' : 'auto',
        }}
        {...rest}
      />
      {error ? (
        <Text
          style={{
            fontFamily: fonts.body,
            fontSize: sizes.xs,
            color: colors.error,
            marginTop: spacing.xs,
          }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
