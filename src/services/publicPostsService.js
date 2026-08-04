import {
  collection,
  query,
  where,
  or,
  and,
  orderBy,
  limit as fsLimit,
  startAfter,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const postsRef = collection(db, 'posts');

/**
 * A post is publicly visible when it's published, OR it's scheduled and its
 * publishedAt time has already passed. This composite filter must mirror
 * firestore.rules exactly — Firestore validates queries against security
 * rules at request time, so if this filter doesn't match the rule's
 * condition, the whole query is rejected (not silently filtered).
 */
function visibilityFilter() {
  return or(
    where('status', '==', 'published'),
    and(where('status', '==', 'scheduled'), where('publishedAt', '<=', Timestamp.now()))
  );
}

/**
 * Paginated feed for the blog home / category pages.
 * Pass `cursor` (the last doc from the previous page) to load the next page.
 */
export async function listPublicPosts({ pageSize = 9, cursor, category, tag } = {}) {
  const clauses = [visibilityFilter()];
  if (category) clauses.push(where('category', '==', category));
  if (tag) clauses.push(where('tags', 'array-contains', tag));
  clauses.push(orderBy('publishedAt', 'desc'), fsLimit(pageSize));
  if (cursor) clauses.push(startAfter(cursor));

  const snap = await getDocs(query(postsRef, ...clauses));
  return {
    posts: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snap.docs[snap.docs.length - 1] || null,
    hasMore: snap.docs.length === pageSize,
  };
}

/** Featured posts for the homepage hero. Published-only keeps the query simple. */
export async function getFeaturedPosts(max = 4) {
  const snap = await getDocs(
    query(
      postsRef,
      where('status', '==', 'published'),
      where('featured', '==', true),
      orderBy('publishedAt', 'desc'),
      fsLimit(max)
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Looks up a single post by slug for the single-post page.
 * Two explicit queries (rather than one query + client filter) because
 * Firestore rejects queries it can't statically prove satisfy the rules —
 * each query below matches one branch of the visibility rule exactly.
 */
export async function getPostBySlug(slug) {
  const publishedSnap = await getDocs(
    query(postsRef, where('slug', '==', slug), where('status', '==', 'published'), fsLimit(1))
  );
  if (!publishedSnap.empty) {
    const d = publishedSnap.docs[0];
    return { id: d.id, ...d.data() };
  }

  const scheduledSnap = await getDocs(
    query(
      postsRef,
      where('slug', '==', slug),
      where('status', '==', 'scheduled'),
      where('publishedAt', '<=', Timestamp.now()),
      fsLimit(1)
    )
  );
  if (!scheduledSnap.empty) {
    const d = scheduledSnap.docs[0];
    return { id: d.id, ...d.data() };
  }

  return null;
}

/** Other posts in the same category, excluding the current one. */
export async function getRelatedPosts(post, max = 3) {
  if (!post?.category) return [];
  const snap = await getDocs(
    query(
      postsRef,
      where('status', '==', 'published'),
      where('category', '==', post.category),
      orderBy('publishedAt', 'desc'),
      fsLimit(max + 1)
    )
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.id !== post.id)
    .slice(0, max);
}

/**
 * Client-side search across a recent window of published posts.
 * Fine for a personal/small blog; if the catalog grows large, swap this
 * for a dedicated search service (Algolia, Typesense, Meilisearch) fed by
 * a Cloud Function trigger on post writes.
 */
export async function searchPublicPosts(term, { max = 200 } = {}) {
  const q = term.trim().toLowerCase();
  if (!q) return [];

  const snap = await getDocs(
    query(postsRef, where('status', '==', 'published'), orderBy('publishedAt', 'desc'), fsLimit(max))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
}

/** All published slugs — used by the sitemap generator script. */
export async function getAllPublishedSlugs() {
  const snap = await getDocs(query(postsRef, where('status', '==', 'published')));
  return snap.docs.map((d) => d.data().slug).filter(Boolean);
}

export default {
  listPublicPosts,
  getFeaturedPosts,
  getPostBySlug,
  getRelatedPosts,
  searchPublicPosts,
  getAllPublishedSlugs,
};
