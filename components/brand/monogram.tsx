import { View, Text, type ViewStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

type MonogramProps = {
  size?: number;
  showDot?: boolean;
  style?: ViewStyle;
};

const CORNER_RATIO = 0.22;
const CHAR_RATIO = 0.58;
const DOT_RATIO = 0.1;
const DOT_INSET_RATIO = 0.1;

export function Monogram({ size = 64, showDot = true, style }: MonogramProps) {
  const cornerRadius = size * CORNER_RATIO;
  const charSize = size * CHAR_RATIO;
  const dotSize = size * DOT_RATIO;
  const dotInset = size * DOT_INSET_RATIO;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          position: 'relative',
        },
        style,
      ]}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: cornerRadius,
          backgroundColor: colors.paper,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: fonts.serif,
            fontSize: charSize,
            color: colors.inkWarm,
            lineHeight: charSize * 1.1,
            includeFontPadding: false,
          }}>
          닿
        </Text>
      </View>
      {showDot && (
        <View
          style={{
            position: 'absolute',
            top: dotInset,
            right: dotInset,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: colors.peach,
          }}
        />
      )}
    </View>
  );
}
