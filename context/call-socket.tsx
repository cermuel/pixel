import { CallContext } from '@/providers/CallProvider';
import { useContext } from 'react';

const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within VideoCallProvider');
  }
  return context;
};

export default useCall;
