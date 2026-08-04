import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { listCategories, createCategory } from '../../services/categoriesService';

export default function CategorySelect({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => toast.error('Could not load categories.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    try {
      const created = await createCategory(name);
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(created.name);
      setNewName('');
      setAdding(false);
      toast.success('Category added.');
    } catch (err) {
      toast.error(err.message || 'Could not add category.');
    }
  }

  if (adding) {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder="New category name"
          className="input-field flex-1"
        />
        <button type="button" onClick={handleAdd} className="btn-secondary shrink-0">
          Add
        </button>
        <button type="button" onClick={() => setAdding(false)} className="text-ink-faint text-sm px-2">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="input-field flex-1"
      >
        <option value="" disabled>
          {loading ? 'Loading…' : 'Select a category'}
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="btn-secondary shrink-0 px-3"
        aria-label="Add category"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
