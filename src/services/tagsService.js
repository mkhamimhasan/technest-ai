import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { generateSlug } from '../utils/slugify';

const tagsRef = collection(db, 'tags');

export async function listTags() {
  const snap = await getDocs(query(tagsRef, orderBy('name')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Ensures a tag exists (creates it if this is the first time it's used)
 * and returns its name. Called from the post editor's tag input, so
 * typing a brand-new tag "just works" without a separate management step.
 */
export async function ensureTagExists(name) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const slug = generateSlug(trimmed);

  const existing = await getDocs(query(tagsRef, where('slug', '==', slug)));
  if (!existing.empty) return trimmed;

  await addDoc(tagsRef, { name: trimmed, slug, createdAt: serverTimestamp() });
  return trimmed;
}

export async function deleteTag(id) {
  await deleteDoc(doc(db, 'tags', id));
}

export default { listTags, ensureTagExists, deleteTag };
