import React, { useEffect } from 'react';
import AuthScreen from '@/components/screens/auth-screen';
import useAuth from '@/context/useAuth';
import { router } from 'expo-router';

const Auth = () => {
  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth) router.replace('/chat');
  }, []);

  return <AuthScreen />;
};

export default Auth;
