import Cookies from 'js-cookie';
import { auth, githubAuthProvider, googleAuthProvider } from '@config';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { signInWithPopup, signOut, User, type AuthProvider as Provider } from 'firebase/auth';
import useError from '@ui/contexts/error/useError';
import useAuthService from '@services/auth/useAuthService';

export type AuthContextType = {
  currentUser: User | null;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loginWithGoogle: async () => {},
  loginWithGithub: async () => {},
  logout: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { publishError } = useError();
  const { registerUser } = useAuthService();

  const loginWithProvider = async (provider: Provider) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      await registerUser(user.uid, { username: user.displayName!, email: user.email! });
      const token = await user.getIdToken();
      Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });
    } catch (e) {
      publishError(e as Error);
    }
  };

  const loginWithGoogle = () => loginWithProvider(googleAuthProvider);

  const loginWithGithub = () => loginWithProvider(githubAuthProvider);

  const logout = () => {
    Cookies.remove('token');
    return signOut(auth);
  };

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginWithGoogle,
        loginWithGithub,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
