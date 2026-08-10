/**
 * Transforms a Cloudinary URL to add optimization parameters.
 * auto format (WebP/AVIF), quality auto, and resize.
 * Falls back to the original URL for non-Cloudinary images.
 */
export function optimizeImage(url, { width = 800, quality = 'auto' } = {}) {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;

  // Insert transformation after /upload/
  const transform = `f_auto,q_${quality},w_${width},c_limit`;
  return url.replace('/upload/', `/upload/${transform}/`);
}

/**
 * Returns a tiny blurred placeholder (low quality thumbnail).
 * Used for blur-up loading effect.
 */
export function placeholderImage(url) {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_50,q_10,e_blur:200/');
}