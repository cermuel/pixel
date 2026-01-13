import { View, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import SignupScreen from '@/components/ui/auth/signup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Signup= () => {
  const insets = useSafeAreaInsets();
   useEffect(() => {
      return () => {
        Keyboard.dismiss();
      };
    }, []);
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
        paddingLeft: insets.left,
        backgroundColor: '#000',
      }}>
      <View style={{ padding: 20, paddingBottom: 40, gap: 14 }} className="flex-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className={'mb h-10 w-10 items-center justify-center rounded-full bg-white'}>
          <Ionicons name="chevron-back" size={20} color="black" />
        </TouchableOpacity>
        <SignupScreen />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
