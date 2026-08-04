import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { generateSlug } from '../utils/slugify';

const categoriesRef = collection(db, 'categories');

export async function listCategories() {
  const snap = await getDocs(query(categoriesRef, orderBy('name')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createCategory(name) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Category name is required.');
  const docRef = await addDoc(categoriesRef, {
    name: trimmed,
    slug: generateSlug(trimmed),
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, name: trimmed, slug: generateSlug(trimmed) };
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, 'categories', id));
}

export default { listCategories, createCategory, deleteCategory };
