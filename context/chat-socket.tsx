import { SocketContext } from '@/providers/SocketProvider';
import { useContext } from 'react';

const useSocket = () => {
  const context = useContext(SocketContext);

  if (context) return context;
  throw new Error('useSocket must be used withjin SopcketProvider');
};

export default useSocket;
