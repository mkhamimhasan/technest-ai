const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
 * Uploads a single image to Cloudinary under the "blog-images" folder
 * and returns its public URL. Cloudinary auto-assigns a unique public_id,
 * so filename collisions aren't a concern.
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

  const formData = new FormData();
  formData.append('file', optimized);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'blog-images');

  onProgress?.(50);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Image upload failed.');
  }

  const data = await res.json();
  onProgress?.(100);

  // path = Cloudinary's public_id, needed later for deletion
  return { url: data.secure_url, path: data.public_id };
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

/**
 * Deletes an image from Cloudinary given its public_id.
 * NOTE: Unsigned deletion isn't supported client-side by Cloudinary for
 * security reasons — this requires a small server-side/Cloud Function
 * endpoint using your API secret. For now this is a placeholder that
 * warns instead of throwing, so it won't block the rest of your CMS.
 */
export async function deleteBlogImage(path) {
  if (!path) return;
  console.warn(
    'Cloudinary deletion requires a server-side endpoint (API secret). ' +
    'Image not deleted from storage:', path
  );
}

export default { uploadBlogImage, uploadMultipleBlogImages, deleteBlogImage };