import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Wordmark } from '@/components/brand/wordmark';
import { colors, fonts } from '@/theme/tokens';

const MESSAGES = [
  '당신의 마음이 자녀에게 닿습니다',
  '오늘의 글은, 그날에 닿습니다',
  '마음은 묻혀 있어도 사라지지 않습니다',
  '기다림이 곧 사랑이 됩니다',
] as const;

function pickMessage(): (typeof MESSAGES)[number] {
  const index = Math.floor(Math.random() * MESSAGES.length);
  return MESSAGES[index] ?? MESSAGES[0];
}

export function DattaSplash() {
  const wordmarkOpacity = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const message = useMemo(pickMessage, []);

  useEffect(() => {
    wordmarkOpacity.value = withTiming(1, { duration: 600 });
    messageOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, [messageOpacity, wordmarkOpacity]);

  const wordmarkStyle = useAnimatedStyle(() => ({ opacity: wordmarkOpacity.value }));
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
      }}>
      <Animated.View style={wordmarkStyle}>
        <Wordmark size={48} />
      </Animated.View>
      <Animated.Text
        style={[
          {
            marginTop: 24,
            fontFamily: fonts.body,
            fontSize: 15,
            color: colors.inkSoft,
            textAlign: 'center',
            paddingHorizontal: 32,
          },
          messageStyle,
        ]}>
        {message}
      </Animated.Text>
    </View>
  );
}
