import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLoginMutation } from '@/services/auth/authSlice';
import { Toast } from 'toastify-react-native';
import { Error } from '@/types/slices/auth';
import useAuth from '@/context/useAuth';
import { router } from 'expo-router';
import ToastManager from 'toastify-react-native';

const LoginScreen = () => {
  const { setToken, setIsAuth, setUser } = useAuth();
  const [login, { isLoading }] = useLoginMutation();
  const [loginDetails, setLoginDetails] = useState({ emailOrPhone: '', password: '' });
  const [showPassword, togglePassword] = useState(false);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const handleLogin = async () => {
    if (!loginDetails.emailOrPhone || !loginDetails.password) return;
    try {
      const response = await login({
        password: loginDetails.password,
        email: emailRegex.test(loginDetails.emailOrPhone) ? loginDetails.emailOrPhone : undefined,
        phone: !emailRegex.test(loginDetails.emailOrPhone) ? loginDetails.emailOrPhone : undefined,
      }).unwrap();

      setToken(response.token);
      setUser(response.data);
      setIsAuth(true);
      Toast.success('Login successful');
      router.dismiss();
      setTimeout(() => {
        router.replace('/home');
      }, 50);
    } catch (initError) {
      console.log({ initError });
      let error = initError as Error;
      Toast.error(error?.data?.message || 'Error loggin in');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, gap: 16 }}>
        <Text className="text-center text-5xl font-bold text-white">Login</Text>
        <TextInput
          className="w-full gap-2.5 rounded-xl border border-[#38383A] p-4 text-white"
          placeholder="Email or Username"
          placeholderTextColor={'white'}
          onChangeText={(text) => setLoginDetails({ ...loginDetails, emailOrPhone: text })}
        />
        <View className="relative w-full flex-row gap-2.5 rounded-xl border border-[#38383A] p-4">
          <TextInput
            className="flex-1 text-white"
            placeholder="Password"
            placeholderTextColor={'white'}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setLoginDetails({ ...loginDetails, password: text })}
          />
          <Pressable className="ml-auto" onPress={() => togglePassword(!showPassword)}>
            {showPassword ? (
              <Ionicons name="eye" color={'white'} />
            ) : (
              <Ionicons name="eye-off" color={'white'} />
            )}
          </Pressable>
        </View>
        <Pressable
          disabled={isLoading}
          onPress={handleLogin}
          style={{ opacity: isLoading ? 0.6 : 1 }}
          className="mt-auto items-center justify-center gap-2.5 rounded-2xl bg-white py-4">
          {isLoading ? (
            <ActivityIndicator size={22} />
          ) : (
            <Text className="text-xl font-medium">Login</Text>
          )}
        </Pressable>

        <ToastManager theme="dark" />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default LoginScreen;
