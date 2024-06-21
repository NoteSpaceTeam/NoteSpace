import { auth, githubAuthProvider, googleAuthProvider } from '@config';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { signInWithPopup, signOut, User, type AuthProvider as Provider, inMemoryPersistence } from 'firebase/auth';
import useError from '@/contexts/error/useError';
import useAuthService from '@services/auth/useAuthService';
import { useNavigate } from 'react-router-dom';

export type AuthContextType = {
  currentUser: User | null;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loginWithGoogle: async () => {},
  loginWithGithub: async () => {},
  logout: async () => {},
  deleteAccount: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { publishError } = useError();
  const { sessionLogin, sessionLogout } = useAuthService();
  const navigate = useNavigate();

  const loginWithProvider = async (provider: Provider) => {
    try {
      auth.setPersistence(inMemoryPersistence); // for httpOnly cookies, do not persist any state client side
      const { user } = await signInWithPopup(auth, provider);
      const idToken = await user.getIdToken();
      await sessionLogin(idToken);
    } catch (e) {
      publishError(e as Error);
    }
  };

  const loginWithGoogle = () => loginWithProvider(googleAuthProvider);

  const loginWithGithub = () => loginWithProvider(githubAuthProvider);

  const logout = async () => {
    await sessionLogout();
    await signOut(auth);
    navigate('/');
  };

  const deleteAccount = async () => {
    await sessionLogout();
    await currentUser?.delete();
    navigate('/');
  };

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginWithGoogle,
        loginWithGithub,
        logout,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
