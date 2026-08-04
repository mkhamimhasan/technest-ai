import {
  collection,
  getCountFromServer,
  query,
  where,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  orderBy,
  limit as fsLimit,
  startAfter,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { deleteBlogImage } from './storageService';

const postsRef = collection(db, 'posts');

/**
 * Creates a new post document.
 * status: 'draft' | 'published' | 'scheduled'
 * - draft: publishedAt is null
 * - published: publishedAt is set to now
 * - scheduled: publishedAt is set to the chosen future Date
 */
export async function createPost(data) {
  const now = serverTimestamp();
  const publishedAt = resolvePublishedAt(data.status, data.scheduledFor);

  const docRef = await addDoc(postsRef, {
    ...stripEditorOnlyFields(data),
    createdAt: now,
    updatedAt: now,
    publishedAt,
  });
  return docRef.id;
}

export async function updatePost(id, data) {
  const publishedAt = resolvePublishedAt(data.status, data.scheduledFor);
  await updateDoc(doc(db, 'posts', id), {
    ...stripEditorOnlyFields(data),
    updatedAt: serverTimestamp(),
    publishedAt,
  });
}

export async function deletePost(id, { featuredImage, gallery } = {}) {
  await deleteDoc(doc(db, 'posts', id));
  // Best-effort cleanup of associated Storage files — doesn't block deletion.
  if (featuredImage?.path) deleteBlogImage(featuredImage.path);
  (gallery || []).forEach((img) => img?.path && deleteBlogImage(img.path));
}

export async function getPostById(id) {
  const snap = await getDoc(doc(db, 'posts', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Paginated post list for the admin table, newest first.
 * Pass `cursor` (the last doc from a previous page) to load the next page.
 */
export async function listPosts({ status, pageSize = 20, cursor } = {}) {
  const clauses = [orderBy('createdAt', 'desc'), fsLimit(pageSize)];
  if (status) clauses.unshift(where('status', '==', status));
  if (cursor) clauses.push(startAfter(cursor));

  const snap = await getDocs(query(postsRef, ...clauses));
  return {
    posts: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length === pageSize,
  };
}

function resolvePublishedAt(status, scheduledFor) {
  if (status === 'published') return Timestamp.now();
  if (status === 'scheduled' && scheduledFor) return Timestamp.fromDate(new Date(scheduledFor));
  return null; // draft
}

// Don't persist transient editor state (e.g. the raw datetime-local string)
function stripEditorOnlyFields({ scheduledFor, ...rest }) {
  return rest;
}

/**
 * Dashboard overview counts. Uses count-aggregation queries so we
 * never have to download full post documents just to show a number.
 * Full post CRUD (create/edit/delete/publish) lands in Phase 4.
 */
export async function getDashboardStats() {
  const [total, published, drafts, scheduled] = await Promise.all([
    getCountFromServer(postsRef),
    getCountFromServer(query(postsRef, where('status', '==', 'published'))),
    getCountFromServer(query(postsRef, where('status', '==', 'draft'))),
    getCountFromServer(query(postsRef, where('status', '==', 'scheduled'))),
  ]);

  return {
    total: total.data().count,
    published: published.data().count,
    drafts: drafts.data().count,
    scheduled: scheduled.data().count,
  };
}

export default {
  getDashboardStats,
  createPost,
  updatePost,
  deletePost,
  getPostById,
  listPosts,
};
