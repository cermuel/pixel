import React, { useEffect } from 'react';
import useAuth from '@/context/useAuth';
import { router } from 'expo-router';
import GroupchatMessageScreenComponent from '@/components/screens/groupchat-message-screen';

const GroupchatMessageScreen = () => {
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) router.replace('/auth');
  }, []);

  return <GroupchatMessageScreenComponent />;
};

export default GroupchatMessageScreen;
