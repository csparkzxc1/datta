import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts } from '@/theme/tokens';

type Props = {
  size?: number;
  onDone?: () => void;
};

const DEFAULT_SIZE = 144;

export function SealAnimation({ size = DEFAULT_SIZE, onDone }: Props) {
  const translateY = useSharedValue(-size * 0.6);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const messageOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withSequence(
      withTiming(0, { duration: 350 }),
      withSpring(0, { damping: 8, stiffness: 180 })
    );
    scale.value = withSequence(
      withTiming(1.08, { duration: 350 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    messageOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));

    if (onDone) {
      const t = setTimeout(onDone, 2200);
      return () => clearTimeout(t);
    }
  }, [messageOpacity, onDone, opacity, scale, translateY]);

  const sealStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const messageStyle = useAnimatedStyle(() => ({ opacity: messageOpacity.value }));

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.paper,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.peach,
            alignItems: 'center',
            justifyContent: 'center',
          },
          sealStyle,
        ]}>
        <Text
          style={{
            fontFamily: fonts.hand,
            fontSize: size * 0.55,
            color: colors.paper,
            lineHeight: size * 0.6,
            includeFontPadding: false,
          }}>
          닿
        </Text>
      </Animated.View>
      <Animated.Text
        style={[
          {
            fontFamily: fonts.serif,
            fontSize: 20,
            color: colors.inkWarm,
            textAlign: 'center',
          },
          messageStyle,
        ]}>
        봉인되었습니다
      </Animated.Text>
    </View>
  );
}
