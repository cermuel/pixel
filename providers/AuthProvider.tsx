import { setCredentials } from '@/services/authStateSlice';
import { LoginResponse } from '@/types/slices/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, Dispatch, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface AuthProviderInterface {
  user: LoginResponse['data'] | null;
  setUser: Dispatch<LoginResponse['data'] | null>;
  token: string | null;
  setToken: Dispatch<string | null>;
  isAuth: boolean;
  setIsAuth: Dispatch<boolean>;
}
export const AuthContext = createContext<AuthProviderInterface | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<LoginResponse['data'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const loadStorage = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    const storedAuth = await AsyncStorage.getItem('isAuth');
    const storedUser = await AsyncStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedAuth) {
      setIsAuth(storedAuth === 'true');
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  useEffect(() => {
    loadStorage();
  }, []);

  useEffect(() => {
    const storeToken = async () => {
      if (!token) return;
      await AsyncStorage.setItem('token', token);
    };
    const storeUser = async () => {
      if (!user) return;
      await AsyncStorage.setItem('user', JSON.stringify(user));
    };

    if (token && user) {
      dispatch(setCredentials({ token, user }));
      storeToken();
      storeUser;
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [token, isAuth, user]);

  useEffect(() => {
    const storeAuth = async () => {
      await AsyncStorage.setItem('isAuth', isAuth.toString());
    };
    if (isAuth) storeAuth();
  }, [isAuth]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuth, setIsAuth, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
