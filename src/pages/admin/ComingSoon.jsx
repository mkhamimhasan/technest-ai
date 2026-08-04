// Placeholder for routes that get built out in later phases
// (Blog Management = Phase 4, Categories/Tags/Settings alongside it).
export default function ComingSoon({ title }) {
  return (
    <div className="space-y-2">
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      <div className="card mt-4">
        <p className="text-ink-muted text-sm">
          This screen is built in an upcoming phase.
        </p>
      </div>
    </div>
  );
}
