import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { NewMessage } from '@/types/chat-socket';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import ReplySection from './reply-section';
import Ionicons from '@expo/vector-icons/Ionicons';

const SenderMessage = ({
  message,
  showTimestamp,
  currentTime,
  handleSwipe,
  name,
}: {
  message: NewMessage;
  showTimestamp: boolean;
  currentTime: string;
  handleSwipe: () => void;
  name: string;
}) => {
  const translateX = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const iconTranslateX = useSharedValue(-20);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = Math.min(e.translationX, 100);
        iconOpacity.value = Math.min(e.translationX / 100, 1);
        iconTranslateX.value = -20 + Math.min(e.translationX / 100, 1) * 30;
      }
    })
    .onEnd((e) => {
      if (e.translationX > 40) {
        runOnJS(handleSwipe)();
      }
      translateX.value = withSpring(0);
      iconOpacity.value = withSpring(0);
      iconTranslateX.value = withSpring(-30);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ translateX: iconTranslateX.value }],
  }));

  return (
    <View className="relative">
      <View className="w-full">
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle} className={'w-full gap-1'}>
            <Pressable className="ml-auto max-w-[220px] rounded-l-xl rounded-t-xl bg-[#2A2D2F] p-2 pr-2.5">
              {message.replyTo && (
                <ReplySection messageToReply={message.replyTo} name={name} mode="SENDER" />
              )}
              <Text className="px-2 pb-0 pt-1 text-sm text-white">{message.message}</Text>
              <View className="absolute bottom-1 right-1">
                {message.status == 'PENDING' ? (
                  <Ionicons name="time-outline" size={11} color={'#CCC'} />
                ) : message.status == 'SENT' ? (
                  <Ionicons name="checkmark" size={12} color={'#CCC'} />
                ) : message.status == 'READ' ? (
                  <Ionicons name="checkmark-done" size={12} color={'#FFA07A'} />
                ) : null}
              </View>
            </Pressable>

            <Text className="ml-auto text-[10px] font-medium text-white">{currentTime}</Text>
          </Animated.View>
        </GestureDetector>
      </View>

      <Animated.View
        style={iconStyle}
        className="absolute left-0 top-2 aspect-square w-8 items-center justify-center rounded-full bg-[#444]">
        <FontAwesome6 name="reply" size={16} color="#EEE" />
      </Animated.View>
    </View>
  );
};

export default SenderMessage;
