import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import useAuth from '@/context/useAuth';
import { router } from 'expo-router';
import MessageScreenComponent from '@/components/screens/message-screen';

const MessageScreen = () => {
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) router.replace('/auth');
  }, []);

  return <MessageScreenComponent />;
};

export default MessageScreen;
