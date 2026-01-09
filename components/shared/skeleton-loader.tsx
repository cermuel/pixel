import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
  className?: string;
  style?: object;
  variant?: 'light' | 'dark';
  duration?: number;
  width?: number
}


const Skeleton = ({ className = '', style, variant = 'light', duration = 2000, width = Dimensions.get('window').width }: SkeletonProps) => {
  const translateX = useRef(new Animated.Value(-1)).current;


  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    ).start();
  }, [translateX]);

  const animatedStyle = {
    transform: [
      {
        translateX: translateX.interpolate({
          inputRange: [-1, 1],
          outputRange: [-width, width],
        }),
      },
    ],
  };

  const backgroundColor = variant === 'dark' ? '#2d2d2d' : '#e5e7eb';
  const shimmerColors =
    variant === 'dark'
      ? ['transparent', 'rgba(255,255,255,0.1)', 'transparent']
      : ['transparent', 'rgba(255,255,255,0.5)', 'transparent'];

  return (
    <View
      className={`relative overflow-hidden rounded-md ${className}`}
      style={[{ backgroundColor }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          //@ts-ignore
          colors={shimmerColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export default Skeleton;
