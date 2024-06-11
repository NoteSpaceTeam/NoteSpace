import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@ui/contexts/auth/AuthContext';

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
