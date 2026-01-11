import { View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const TypingIndicator = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
    dot2.value = withDelay(300, withRepeat(withTiming(1, { duration: 800 }), -1, true));
    dot3.value = withDelay(600, withRepeat(withTiming(1, { duration: 800 }), -1, true));
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: 0.3 + dot1.value * 0.7,
    transform: [{ translateY: -dot1.value * 4 }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: 0.3 + dot2.value * 0.7,
    transform: [{ translateY: -dot2.value * 4 }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: 0.3 + dot3.value * 0.7,
    transform: [{ translateY: -dot3.value * 4 }],
  }));

  return (
    <View className="p-4">
      <View className="flex-row items-center gap-1 self-start rounded-xl bg-[#1D2022] p-4">
        <Animated.View style={[dot1Style]} className="h-2 w-2 rounded-full bg-[#AAA]" />
        <Animated.View style={[dot2Style]} className="h-2 w-2 rounded-full bg-[#AAA]" />
        <Animated.View style={[dot3Style]} className="h-2 w-2 rounded-full bg-[#AAA]" />
      </View>
    </View>
  );
};

export default TypingIndicator;
