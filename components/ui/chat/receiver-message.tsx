import { View, Text, Pressable } from 'react-native';
import React, { Dispatch, useRef } from 'react';
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
import { helpers } from '@/utils/helpers';

const ReceiverMessage = ({
  message,
  handleSwipe,
  name,
  onLongPress,
  isPreview = false,
  setMessageToView,
}: {
  message: NewMessage;
  handleSwipe?: () => void;
  name: string;
  onLongPress?: (messageId: number, x: number, y: number, width: number, height: number) => void;
  isPreview?: boolean;
  setMessageToView?: Dispatch<NewMessage | null>;
}) => {
  const messageRef = useRef<View>(null);
  const translateX = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const iconTranslateX = useSharedValue(-20);

  const showMenuHandler = () => {
    messageRef.current?.measureInWindow((x, y, width, height) => {
      onLongPress?.(message.id, x, y, width, height);
    });
  };

  const longPressGesture = Gesture.LongPress()
    .minDuration(400)
    .onStart(() => {
      runOnJS(showMenuHandler)();
    });

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = Math.min(e.translationX, 200);
        iconOpacity.value = Math.min(e.translationX / 100, 1);
        iconTranslateX.value = -20 + Math.min(e.translationX / 100, 1) * 30;
      }
    })
    .onEnd((e) => {
      if (e.translationX > 40) {
        if (handleSwipe) runOnJS(handleSwipe)();
      }
      translateX.value = withSpring(0);
      iconOpacity.value = withSpring(0);
      iconTranslateX.value = withSpring(-30);
    });

  const composedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ translateX: iconTranslateX.value }],
  }));

  return (
    <View
      className={`relative ${message.reactions?.length > 0 && !isPreview && 'pt-4'}`}
      ref={messageRef}>
      <View className="w-full">
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={animatedStyle} className={'w-full gap-1'}>
            <Pressable className="relative mr-auto max-w-[220px] rounded-r-xl rounded-t-xl bg-[#1D2022] p-2">
              {message.replyTo && (
                <ReplySection messageToReply={message.replyTo} name={name} mode="RECEIVER" />
              )}
              <Text className="px-2 pb-0 pt-1 text-white">{message.message}</Text>
              {message.reactions?.length > 0 && !isPreview && (
                <Pressable
                  onPress={() => {
                    if (setMessageToView) setMessageToView(message);
                  }}
                  className="absolute -top-4 left-4 flex-row gap-1 rounded-full bg-[#555] p-[3px] px-[5px]">
                  {message.reactions?.map((r) => (
                    <Text key={r.id}>{r.reaction}</Text>
                  ))}
                  {message.reactions?.length > 1 && (
                    <Text className="text-sm font-medium text-[#DDD]">
                      {message.reactions?.length}
                    </Text>
                  )}
                </Pressable>
              )}
            </Pressable>

            {!isPreview && (
              <Text className="mr-auto text-[10px] font-medium text-white">
                {helpers.formatChatTime(message.createdAt)}
              </Text>
            )}
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

export default ReceiverMessage;
