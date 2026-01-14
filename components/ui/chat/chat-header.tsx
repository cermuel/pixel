import { View, Text, TouchableOpacity } from 'react-native';
import React, { Dispatch } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { logout as logoutFunc } from '@/services/authStateSlice';
import useAuth from '@/context/useAuth';
import { SCREEN_TYPE } from '@/components/screens/chat-screen';
import Avatar from './avatar';

const ChatHeader = ({
  screen,
  setScreen,
}: {
  screen: SCREEN_TYPE;
  setScreen: Dispatch<SCREEN_TYPE>;
}) => {
  const dispatch = useDispatch();
  const { setIsAuth, setUser, setToken, user } = useAuth();
  const insets = useSafeAreaInsets();

  const logout = () => {
    dispatch(logoutFunc());
    router.replace('/home');
    setIsAuth(false);
    setUser(null);
    setToken(null);
  };
  return (
    <View
      style={{ paddingTop: insets.top + 20, padding: 24 }}
      className="z-10 w-full flex-row items-center justify-between">
      <>
        <TouchableOpacity
          onPress={() => {
            router.replace('/profile');
          }}
          className={
            'h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#11111177]'
          }>
          <Avatar name={user?.name ?? ''} size={35} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Chat</Text>
        <TouchableOpacity
          onPress={logout}
          className={'h-10 w-10 items-center justify-center rounded-full'}>
          <MaterialCommunityIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </>
    </View>
  );
};

export default ChatHeader;
