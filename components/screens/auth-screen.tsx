import { View, Text, Image, Pressable, Platform, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

const AuthScreen = () => {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) setIsVisible(true);
    return () => {
      setIsVisible(false);
    };
  }, []);

  const SelectMethod = () => (
    <View className="gap-4">
      {Platform.OS == 'ios' && (
        <Pressable className="flex-row items-center justify-center gap-2.5 rounded-2xl bg-white py-3">
          <Feather name="repeat" />
          <Text className="text-xl font-medium">Continue with Apple</Text>
        </Pressable>
      )}
      <Pressable className="flex-row items-center justify-center gap-2.5 rounded-2xl bg-[#7878803A] py-3">
        <Feather name="repeat" color={'white'} />
        <Text className="text-xl font-medium text-white">Continue with Google</Text>
      </Pressable>
      <Pressable
        onPress={() => router.replace('/signup')}
        className="flex-row items-center justify-center gap-2.5 rounded-2xl bg-[#7878803A] py-3">
        <Feather name="repeat" color={'white'} />
        <Text className="text-xl font-medium text-white">Sign up with Email</Text>
      </Pressable>
      <Pressable
        onPress={() => router.replace('/login')}
        className="flex-row items-center justify-center gap-2.5 rounded-2xl border border-[#38383A] bg-transparent py-3">
        <Text className="text-xl font-medium text-white">Log in</Text>
      </Pressable>
    </View>
  );

  return (
    <View className="flex-1">
      <Image
        source={require('@/assets/welcome1.png')}
        className="absolute h-full w-full "
        resizeMode="cover"
      />
      <BottomSheet
        snapPoints={[0.33]}
        isVisible={isVisible}
        style={{ backgroundColor: '#000', padding: 10 }}
        onClose={() => {
          setIsVisible(false);
          router.push('/home');
        }}
        isTransparent>
        <SelectMethod />
      </BottomSheet>
    </View>
  );
};

export default AuthScreen;
