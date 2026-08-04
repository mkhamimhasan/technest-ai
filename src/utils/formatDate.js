import { format } from 'date-fns';

/**
 * Accepts a Firestore Timestamp, JS Date, or date string and returns a
 * human-readable date. Returns an empty string for null/undefined
 * (e.g. a draft that's never been published) instead of throwing.
 */
export function formatPostDate(value, pattern = 'MMM d, yyyy') {
  if (!value) return '';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, pattern);
}

/** Same as formatPostDate, but returns a raw ISO string — for <meta>/JSON-LD. */
export function toISODate(value) {
  if (!value) return null;
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default formatPostDate;
