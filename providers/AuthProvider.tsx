import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, Dispatch, ReactNode, useEffect, useState } from 'react';

interface AuthProviderInterface {
  user: unknown;
  setUser: Dispatch<unknown>;
  token: string | null;
  setToken: Dispatch<string | null>;
  isAuth: boolean;
  setIsAuth: Dispatch<boolean>;
}
export const AuthContext = createContext<AuthProviderInterface | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<unknown>();
  const [token, setToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const loadStorage = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    const storedAuth = await AsyncStorage.getItem('isAuth');

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedAuth) {
      setIsAuth(storedAuth === 'true');
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
    const storeAuth = async () => {
      await AsyncStorage.setItem('isAuth', isAuth.toString());
    };

    if (token) storeToken();
    if (isAuth) storeAuth();
  }, [token, isAuth]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuth, setIsAuth, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
