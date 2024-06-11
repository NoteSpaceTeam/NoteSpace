import { auth, githubAuthProvider, googleAuthProvider } from '@config';
import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { validateEmail, validatePassword, validateUsername } from '@ui/contexts/auth/utils';
import useError from '@ui/contexts/error/useError';
import useAuthService from '@services/auth/useAuthService';

export type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (user: User, profile: UserProfile) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  loginWithGithub: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

type UserProfile = {
  displayName?: string;
  photoURL?: string;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { publishError } = useError();
  const { registerUser, registerUserOAuth } = useAuthService();

  const handleAsyncAction = async (action: () => Promise<any>) => {
    try {
      return await action();
    } catch (e) {
      publishError(e as Error);
    }
  };

  const signup = (username: string, email: string, password: string) =>
    handleAsyncAction(async () => {
      validateUsername(username);
      validateEmail(email);
      validatePassword(password);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await registerUser(user.uid, { username, email });
    });

  const login = (email: string, password: string) =>
    handleAsyncAction(async () => {
      return signInWithEmailAndPassword(auth, email, password).catch(() => {
        throw new Error('Invalid credentials');
      });
    });

  const logout = () => handleAsyncAction(() => signOut(auth));

  const updateUserProfile = (user: User, profile: UserProfile) => updateProfile(user, profile);

  const loginWithGoogle = () =>
    handleAsyncAction(async () => {
      const { user } = await signInWithPopup(auth, googleAuthProvider);
      await registerUserOAuth(user.uid, { username: user.displayName!, email: user.email! });
    });

  const loginWithGithub = () =>
    handleAsyncAction(async () => {
      const { user } = await signInWithPopup(auth, githubAuthProvider);
      await registerUserOAuth(user.uid, { username: user.displayName!, email: user.email! });
    });

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
        login,
        loginWithGoogle,
        loginWithGithub,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
