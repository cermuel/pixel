import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import useAuth from '@/context/useAuth';
import { router } from 'expo-router';
import ChatScreenComponent from '@/components/screens/chat-screen';

const ChatScreen = () => {
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) router.replace('/auth');
  }, []);

  return <ChatScreenComponent />;
};

export default ChatScreen;
