import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { listTags, ensureTagExists, deleteTag } from '../../services/tagsService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';

export default function TagsManager() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    listTags()
      .then(setTags)
      .catch(() => toast.error('Could not load tags.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      await ensureTagExists(name);
      const refreshed = await listTags();
      setTags(refreshed);
      setName('');
      toast.success('Tag added.');
    } catch (err) {
      toast.error(err.message || 'Could not add tag.');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteTag(deleteTarget.id);
      setTags((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success('Tag deleted.');
      setDeleteTarget(null);
    } catch {
      toast.error('Could not delete tag.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5 max-w-xl">
      <h1 className="font-display text-2xl font-semibold">Tags</h1>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className="input-field flex-1"
        />
        <button type="submit" disabled={adding} className="btn-primary shrink-0">
          <Plus size={16} />
          Add
        </button>
      </form>

      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : tags.length === 0 ? (
        <p className="text-ink-muted text-sm">
          No tags yet — they're also created automatically when you type a new one in the post editor.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-1.5 rounded-lg bg-surface-raised border border-surface-border px-3 py-1.5 text-sm"
            >
              {t.name}
              <button
                onClick={() => setDeleteTarget(t)}
                className="text-ink-faint hover:text-signal-rose"
                aria-label={`Delete ${t.name}`}
              >
                <Trash2 size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this tag?"
        message={`"${deleteTarget?.name}" will be removed from the tag list. Posts already using it will keep the tag as text.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
