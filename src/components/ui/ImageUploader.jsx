import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadBlogImage, deleteBlogImage } from '../../services/storageService';

/**
 * value: single image -> { url, path } | null
 *        gallery mode -> array of { url, path }
 */
export default function ImageUploader({ value, onChange, multiple = false, label }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      if (multiple) {
        const uploaded = [];
        for (const file of files) {
          uploaded.push(await uploadBlogImage(file));
        }
        onChange([...(value || []), ...uploaded]);
      } else {
        const uploaded = await uploadBlogImage(files[0]);
        onChange(uploaded);
      }
      toast.success(files.length > 1 ? 'Images uploaded.' : 'Image uploaded.');
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove(item) {
    if (multiple) {
      onChange((value || []).filter((v) => v.path !== item.path));
    } else {
      onChange(null);
    }
    deleteBlogImage(item.path); // fire-and-forget, don't block the UI
  }

  const images = multiple ? value || [] : value ? [value] : [];

  return (
    <div>
      {label && <label className="label-text">{label}</label>}

      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div key={img.path} className="relative w-24 h-24 rounded-lg overflow-hidden border border-surface-border group">
            <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
            <button
              type="button"
              onClick={() => handleRemove(img)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {(multiple || !value) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-surface-border
              flex flex-col items-center justify-center gap-1 text-ink-faint
              hover:border-signal-indigo/50 hover:text-signal-indigo transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
            <span className="text-[11px]">{uploading ? 'Uploading' : 'Add'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
