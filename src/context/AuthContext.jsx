import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, ADMIN_EMAIL } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we know auth state

  useEffect(() => {
    // Listens for Firebase auth state on every load/refresh.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email === ADMIN_EMAIL) {
        // Only the configured admin email is treated as a valid session.
        setUser(firebaseUser);
      } else {
        // Any other account (or none) is not authorized for this dashboard.
        setUser(null);
        if (firebaseUser) {
          // A non-admin somehow signed in (e.g. shared browser) — sign them out.
          signOut(auth);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email, password) {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL?.toLowerCase()) {
      // Fail fast client-side with a clear message, before hitting Firebase.
      // Firestore/Storage rules are the real enforcement layer (Phase 5).
      throw new Error('This account is not authorized for the admin dashboard.');
    }
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return credential.user;
  }

  async function logout() {
    await signOut(auth);
  }

  const value = { user, loading, login, logout, isAdmin: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
