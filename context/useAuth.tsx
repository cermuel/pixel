import { AuthContext } from '@/providers/AuthProvider';
import { useContext } from 'react';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context) return context;
  throw new Error('useAuth must be used within AuthProvider');
};

export default useAuth;
