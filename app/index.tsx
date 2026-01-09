import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Home = () => {
  const router = useRouter();
  return (
    <View className="flex-1">
      <Image
        source={require('@/assets/welcome1.png')}
        className="absolute h-full w-full "
        resizeMode="cover"
      />
      <Animated.View className="flex-1" entering={FadeInDown.duration(700)}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
          style={{
            position: 'absolute',
            bottom: 0,
            height: '65%',
            width: '100%',
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
        <View className="flex-1 items-center justify-end gap-2 p-5 pb-14">
          <Animated.Text
            entering={FadeInDown.delay(700).springify()}
            className="text-[60px] font-bold">
            Pixels
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(800).springify()}
            className="mb-2 text-lg font-medium">
            Every Pixel tells a story
          </Animated.Text>
          <AnimatedTouchableOpacity
            onPress={() => {
              router.push('/home');
            }}
            entering={FadeInDown.delay(900)}
            className="items-center rounded-[10px] bg-yellow-950 px-32 py-5">
            <Text className="text-xl font-semibold text-white">Explore</Text>
          </AnimatedTouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Home;
