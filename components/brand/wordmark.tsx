import { View, Text, type ViewStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

type WordmarkProps = {
  size?: number;
  color?: string;
  dotColor?: string;
  style?: ViewStyle;
};

const DOT_RATIO = 0.12;
const DOT_TOP_OFFSET_RATIO = -0.05;

export function Wordmark({
  size = 32,
  color = colors.inkWarm,
  dotColor = colors.peach,
  style,
}: WordmarkProps) {
  const dotSize = Math.max(3, size * DOT_RATIO);

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start' }, style]}>
      <Text
        style={{
          fontFamily: fonts.serif,
          fontSize: size,
          color,
          lineHeight: size * 1.2,
        }}>
        닿다
      </Text>
      <View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: dotColor,
          marginLeft: dotSize * 0.6,
          marginTop: size * DOT_TOP_OFFSET_RATIO + dotSize / 2,
        }}
      />
    </View>
  );
}
