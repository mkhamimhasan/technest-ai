export default function LoadingSpinner({ label = 'Loading…', fullScreen = true }) {
  return (
    <div
      className={
        fullScreen
          ? 'min-h-screen flex flex-col items-center justify-center gap-3'
          : 'flex flex-col items-center justify-center gap-3 py-12'
      }
    >
      <div className="w-9 h-9 rounded-full border-2 border-surface-border border-t-signal-indigo animate-spin" />
      <p className="text-sm text-ink-muted">{label}</p>
    </div>
  );
}
