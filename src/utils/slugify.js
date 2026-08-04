import slugify from 'slugify';

/**
 * Turns a post title into a URL-safe slug.
 * "10 Best AI Tools in 2026!" -> "10-best-ai-tools-in-2026"
 */
export function generateSlug(title = '') {
  return slugify(title, {
    lower: true,
    strict: true, // strips special characters
    trim: true,
  });
}

export default generateSlug;
