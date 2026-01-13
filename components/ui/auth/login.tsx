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
import ToastManager from 'toastify-react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setToken, setIsAuth, setUser } = useAuth();
  const [login, { isLoading }] = useLoginMutation();
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const [showPassword, togglePassword] = useState(false);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!loginDetails.email || !loginDetails.password) return;
    try {
      const response = await login({
        password: loginDetails.password,
        email: emailRegex.test(loginDetails.email) ? loginDetails.email : undefined,
        phone: !emailRegex.test(loginDetails.email) ? loginDetails.email : undefined,
      }).unwrap();

      setToken(response.token);
      setUser(response.data);
      setIsAuth(true);
      Toast.success('Login successful');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'home' }],
        })
      );
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
          onChangeText={(text) => setLoginDetails({ ...loginDetails, email: text })}
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
