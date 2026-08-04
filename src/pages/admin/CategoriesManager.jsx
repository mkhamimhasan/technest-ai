import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { listCategories, createCategory, deleteCategory } from '../../services/categoriesService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => toast.error('Could not load categories.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      const created = await createCategory(name);
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      toast.success('Category added.');
    } catch (err) {
      toast.error(err.message || 'Could not add category.');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success('Category deleted.');
      setDeleteTarget(null);
    } catch {
      toast.error('Could not delete category.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5 max-w-xl">
      <h1 className="font-display text-2xl font-semibold">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="input-field flex-1"
        />
        <button type="submit" disabled={adding} className="btn-primary shrink-0">
          <Plus size={16} />
          Add
        </button>
      </form>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-ink-muted text-sm">No categories yet — add your first one above.</p>
      ) : (
        <div className="card divide-y divide-surface-border p-0">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-ink-faint">/{c.slug}</p>
              </div>
              <button
                onClick={() => setDeleteTarget(c)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-muted hover:bg-signal-rose/10 hover:text-signal-rose"
                aria-label={`Delete ${c.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        message={`"${deleteTarget?.name}" will be removed. Posts already using it will keep the category name as text.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
