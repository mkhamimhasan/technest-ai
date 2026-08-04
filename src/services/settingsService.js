import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const SETTINGS_DOC = doc(db, 'settings', 'site');

export const DEFAULT_SETTINGS = {
  siteName: 'TechNest AI',
  tagline: 'AI news, tools and tutorials — explained simply.',
  defaultOgImage: null, // { url, path }
  twitterHandle: '',
  socialLinks: { twitter: '', linkedin: '', youtube: '', github: '' },
};

/** Reads site-wide settings, falling back to sane defaults if unset. */
export async function getSiteSettings() {
  const snap = await getDoc(SETTINGS_DOC);
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...snap.data() };
}

/** Admin-only write (enforced by firestore.rules). */
export async function updateSiteSettings(data) {
  await setDoc(SETTINGS_DOC, data, { merge: true });
}

export default { getSiteSettings, updateSiteSettings, DEFAULT_SETTINGS };
