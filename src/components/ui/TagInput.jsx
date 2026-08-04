import { useState } from 'react';
import { X } from 'lucide-react';
import { ensureTagExists } from '../../services/tagsService';

export default function TagInput({ value = [], onChange }) {
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  async function addTag() {
    const raw = draft.trim();
    if (!raw) return;
    if (value.some((t) => t.toLowerCase() === raw.toLowerCase())) {
      setDraft('');
      return; // no duplicates
    }
    setSaving(true);
    try {
      const name = await ensureTagExists(raw); // registers it in /tags if new
      onChange([...value, name]);
      setDraft('');
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="input-field flex flex-wrap gap-1.5 items-center py-2">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-signal-indigo/15 text-signal-indigo text-xs font-medium px-2 py-1"
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        disabled={saving}
        placeholder={value.length ? '' : 'Type a tag and press Enter'}
        className="flex-1 min-w-[100px] bg-transparent outline-none text-sm placeholder:text-ink-faint"
      />
    </div>
  );
}
