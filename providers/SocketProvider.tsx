import React, { createContext, Dispatch, ReactNode, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '@/context/useAuth';

interface SocketProviderInterface {
  socket: Socket | null;
  socketError: Error | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketProviderInterface | undefined>(undefined);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketError, setSocketError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
    const SOCKET_URL =
      // 'https://pixel-server-pule.onrender.com';

      Platform.select({
        ios: 'http://192.168.100.152:4444',
        android: 'http://10.0.2.2:4444',
        default: 'http://192.168.100.152:4444',
      });

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 10000,
      auth: { token },
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected!', socketInstance.id);
      setSocket(socketInstance);
      setSocketError(null);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      setSocketError(error);
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => setSocketError(error));

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setSocketError(null);
      setIsConnected(false);
    };
  }, [token]);

  // useEffect(() => {
  //   if (socketError) {
  //     console.log('Socket Error Details:', {
  //       message: socketError.message,
  //       type: socketError.name,
  //     });
  //   }
  // }, [socketError]);

  return (
    <SocketContext.Provider value={{ socket, socketError, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
