const STYLES = {
  published: 'bg-signal-emerald/15 text-signal-emerald',
  draft: 'bg-ink-faint/15 text-ink-muted',
  scheduled: 'bg-signal-amber/15 text-signal-amber',
};

const LABELS = {
  published: 'Published',
  draft: 'Draft',
  scheduled: 'Scheduled',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
        STYLES[status] || STYLES.draft
      }`}
    >
      {LABELS[status] || status}
    </span>
  );
}
