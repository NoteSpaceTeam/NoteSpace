import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/auth/AuthContext';

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
