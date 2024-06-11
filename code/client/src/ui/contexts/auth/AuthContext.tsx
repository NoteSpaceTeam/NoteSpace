import { auth, googleAuthProvider, githubAuthProvider } from '@config';
import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';

export type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithGithub: () => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserProfile: (user: User, profile: UserProfile) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => ({}) as UserCredential,
  loginWithGoogle: async () => ({}) as UserCredential,
  loginWithGithub: async () => ({}) as UserCredential,
  signup: async () => ({}) as UserCredential,
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

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function updateUserProfile(user: User, profile: UserProfile) {
    return updateProfile(user, profile);
  }

  function loginWithGoogle() {
    return signInWithPopup(auth, googleAuthProvider);
  }

  function loginWithGithub() {
    return signInWithPopup(auth, githubAuthProvider);
  }

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
