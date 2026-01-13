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
import { useRegisterMutation } from '@/services/auth/authSlice';
import { Toast } from 'toastify-react-native';
import { Error } from '@/types/slices/auth';
import { router } from 'expo-router';
import { z } from 'zod';

const signupSchema = z.object({
  phone: z
    .string('phone is required')
    .min(1, 'phone is required')
    .length(11, 'Phone number must be 11 characters')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  email: z.string().optional(),
  name: z.string('name is required').min(1, 'name is required'),
  password: z.string('password is required').min(1, 'password is required'),
});

const SignupScreen = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [signupDetails, setSignupDetails] = useState({
    phone: '',
    email: '',
    name: '',
    password: '',
  });
  const [showPassword, togglePassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async () => {
    try {
      const validatedData = signupSchema.parse({
        phone: signupDetails.phone,
        email: signupDetails.email || undefined,
        name: signupDetails.name,
        password: signupDetails.password,
      });

      setErrors({});

      const response = await register({
        phone: validatedData.phone,
        email: validatedData.email,
        name: validatedData.name,
        password: validatedData.password,
      }).unwrap();

      Toast.success('Signup successful');
      router.dismiss();
      setTimeout(() => {
        router.replace('/login');
      }, 50);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        Toast.error('Please check your input');
      } else {
        console.log({ error });
        let apiError = error as Error;
        Toast.error(apiError?.data?.message || 'Error signing up');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, gap: 16 }}>
        <Text className="text-center text-5xl font-bold text-white">Sign up</Text>
        <View>
          <TextInput
            className="w-full gap-2.5 rounded-xl border border-[#38383A] p-4 text-white"
            placeholder="Phone (11 digits)"
            placeholderTextColor={'white'}
            keyboardType="phone-pad"
            onChangeText={(text) => setSignupDetails({ ...signupDetails, phone: text })}
            value={signupDetails.phone}
          />
          {errors.phone && <Text className="mt-1 text-sm text-red-500">{errors.phone}</Text>}
        </View>
        <View>
          <TextInput
            className="w-full gap-2.5 rounded-xl border border-[#38383A] p-4 text-white"
            placeholder="Name"
            placeholderTextColor={'white'}
            onChangeText={(text) => setSignupDetails({ ...signupDetails, name: text })}
            value={signupDetails.name}
          />
          {errors.name && <Text className="mt-1 text-sm text-red-500">{errors.name}</Text>}
        </View>
        <View>
          <TextInput
            className="w-full gap-2.5 rounded-xl border border-[#38383A] p-4 text-white"
            placeholder="Email (optional)"
            placeholderTextColor={'white'}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setSignupDetails({ ...signupDetails, email: text })}
            value={signupDetails.email}
          />
          {errors.email && <Text className="mt-1 text-sm text-red-500">{errors.email}</Text>}
        </View>
        <View>
          <View className="relative w-full flex-row gap-2.5 rounded-xl border border-[#38383A] p-4">
            <TextInput
              className="flex-1 text-white"
              placeholder="Password"
              placeholderTextColor={'white'}
              secureTextEntry={!showPassword}
              onChangeText={(text) => setSignupDetails({ ...signupDetails, password: text })}
              value={signupDetails.password}
            />
            <Pressable className="ml-auto" onPress={() => togglePassword(!showPassword)}>
              {showPassword ? (
                <Ionicons name="eye" color={'white'} />
              ) : (
                <Ionicons name="eye-off" color={'white'} />
              )}
            </Pressable>
          </View>
          {errors.password && <Text className="mt-1 text-sm text-red-500">{errors.password}</Text>}
        </View>
        <Pressable
          disabled={isLoading}
          onPress={handleSignup}
          style={{ opacity: isLoading ? 0.6 : 1 }}
          className="mt-auto items-center justify-center gap-2.5 rounded-2xl bg-white py-4">
          {isLoading ? (
            <ActivityIndicator size={22} />
          ) : (
            <Text className="text-xl font-medium">Sign up</Text>
          )}
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default SignupScreen;
