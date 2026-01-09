import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, Pressable, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  SlideOutUp,
  SlideInUp,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import { BlurView } from 'expo-blur';
// import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NotificationProps {
  content: ReactNode;
  visible: boolean;
  onHide: () => void;
  expandedContent: ReactNode;
  className?: string;
  expandedHeight?: number;
  hideDuration?: number;
}

export default function IOSExpandableNotification({
  expandedContent,
  content,
  visible,
  onHide,
  className = '',
  expandedHeight = 280,
  hideDuration = 5000,
}: NotificationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const notificationHeight = useSharedValue(80);
  const backdropOpacity = useSharedValue(0);
  const startY = useSharedValue(0);
  const startTime = useSharedValue(0);
  const hasExpanded = useSharedValue(false);

  const triggerHaptic = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const expand = () => {
    'worklet';
    hasExpanded.value = true;
    runOnJS(setIsExpanded)(true);
    runOnJS(triggerHaptic)();

    translateY.value = withSpring(SCREEN_HEIGHT / 2 - 200, {
      damping: 30,
      stiffness: 400,
    });
    scale.value = withSpring(1, {
      damping: 30,
      stiffness: 400,
    });
    notificationHeight.value = withSpring(expandedHeight, {
      damping: 30,
      stiffness: 400,
    });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  };

  const collapse = () => {
    'worklet';
    runOnJS(setIsExpanded)(false);
    runOnJS(triggerHaptic)();

    translateY.value = withSpring(0, {
      damping: 50,
      stiffness: 600,
    });
    scale.value = withSpring(1, {
      damping: 30,
      stiffness: 400,
    });
    notificationHeight.value = withSpring(80, {
      damping: 80,
      stiffness: 600,
    });
    backdropOpacity.value = withTiming(0, { duration: 250 });
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startY.value = translateY.value;
      startTime.value = Date.now();
      hasExpanded.value = false;
    })
    .onChange((event) => {
      if (!isExpanded) {
        if (event.translationY > 0) {
          translateY.value = event.translationY;

          if (event.translationY > 150 && !hasExpanded.value) {
            expand();
          }
        } else if (event.translationY < -150) {
          translateY.value = event.translationY;
        }
      }
    })
    .onEnd((event) => {
      if (!isExpanded) {
        if (event.translationY < -50) {
          runOnJS(onHide)();
        } else if (translateY.value > 0 && translateY.value < 150) {
          translateY.value = withSpring(0, {
            damping: 30,
            stiffness: 400,
          });
        } else if (translateY.value < 0 && translateY.value > -150) {
          translateY.value = withSpring(0, {
            damping: 30,
            stiffness: 400,
          });
        }
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(400)
    .onStart(() => {
      if (!isExpanded) {
        expand();
      }
    });

  const combinedGesture = Gesture.Race(panGesture, longPressGesture);

  const notificationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    height: notificationHeight.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: backdropOpacity.value > 0 ? 'auto' : 'none',
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: notificationHeight.value > 100 ? 1 : 0.85,
  }));

  useEffect(() => {
    if (!visible) {
      setIsExpanded(false);
      return;
    }
    if (!isExpanded) {
      const timer = setTimeout(() => {
        onHide();
      }, hideDuration);
      return () => clearTimeout(timer);
    }
  }, [visible, isExpanded, hideDuration, onHide]);

  return (
    <>
      {visible && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]} pointerEvents="box-none">
          {isExpanded && (
            <Animated.View style={[styles.backdrop, backdropStyle]}>
              <Pressable style={styles.backdropPressable} onPress={collapse}>
                {/* <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} /> */}
              </Pressable>
            </Animated.View>
          )}
          <Animated.View
            entering={SlideInUp.duration(1000)}
            exiting={SlideOutUp.duration(500)}
            className={'z-[11]'}>
            <GestureDetector gesture={combinedGesture}>
              <Animated.View style={[styles.notification, notificationStyle]} className={className}>
                {isExpanded ? (
                  expandedContent
                ) : (
                  <Animated.View style={contentStyle}>{content}</Animated.View>
                )}
              </Animated.View>
            </GestureDetector>
          </Animated.View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
  backdropPressable: {
    flex: 1,
  },
  notification: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    overflow: 'hidden',
  },
});
