import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

const MAX_DIMENSION = 1920; // px — plenty for a full-bleed blog hero image
const JPEG_QUALITY = 0.82;

/**
 * Downscales/re-encodes an image client-side before it ever leaves the
 * phone. This is the single biggest lever for "fast loading" on a blog:
 * a 12MP phone photo (4-8MB) becomes a ~150-400KB JPEG, which means
 * faster uploads on mobile data AND faster page loads for every visitor.
 * PNGs with transparency and GIFs (possible animation) are left untouched;
 * everything else is normalized to JPEG.
 */
async function compressImage(file) {
  if (file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file; // fall back to the original if decoding fails

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
  if (!blob || blob.size >= file.size) return file; // compression didn't help — keep original

  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], newName, { type: 'image/jpeg' });
}

/**
 * Uploads a single image under /blog-images/ and returns its public URL.
 * Filenames are timestamp-prefixed to avoid collisions when publishing
 * from a phone where two images might share the same camera filename.
 */
export async function uploadBlogImage(file, { onProgress } = {}) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }
  const MAX_SIZE_MB = 8;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be under ${MAX_SIZE_MB}MB.`);
  }

  onProgress?.(10);
  const optimized = await compressImage(file);

  const safeName = optimized.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  const path = `blog-images/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);

  // uploadBytes is a single-shot upload; onProgress is a coarse placeholder
  // here (swap to uploadBytesResumable if you want a live progress bar later).
  onProgress?.(50);
  const snapshot = await uploadBytes(storageRef, optimized);
  onProgress?.(100);

  const url = await getDownloadURL(snapshot.ref);
  return { url, path };
}

export async function uploadMultipleBlogImages(files, { onProgress } = {}) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const result = await uploadBlogImage(files[i]);
    results.push(result);
    onProgress?.(Math.round(((i + 1) / files.length) * 100));
  }
  return results;
}

/** Deletes an image from Storage given its full path (not URL). */
export async function deleteBlogImage(path) {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    // Non-fatal — the doc reference is removed either way, don't block the user.
    console.warn('Could not delete storage file:', path, err.message);
  }
}

export default { uploadBlogImage, uploadMultipleBlogImages, deleteBlogImage };
