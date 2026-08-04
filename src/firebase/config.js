// Firebase initialization.
// All secrets come from environment variables (see .env.example) —
// never hardcode Firebase keys in source, even though these are
// technically public client keys, security is enforced by Firestore/Storage rules.
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard against re-initialization during Vite HMR
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// The single allowed admin email. Enforced client-side (redirect) AND
// server-side (Firestore/Storage rules) — client checks are UX only.
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export default app;
