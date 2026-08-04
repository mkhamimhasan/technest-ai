import { AlertTriangle, Loader2 } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} aria-hidden="true" />
      <div className="relative card max-w-sm w-full">
        <div className="w-10 h-10 rounded-lg bg-signal-rose/15 text-signal-rose flex items-center justify-center mb-3">
          <AlertTriangle size={18} />
        </div>
        <h2 className="font-display font-semibold text-lg mb-1">{title}</h2>
        <p className="text-ink-muted text-sm mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="btn-danger">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
