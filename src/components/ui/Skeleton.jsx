// Generic skeleton block — compose these to build loading states
// for cards, lists, and tables without a layout jump on load.
export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-surface-raised rounded-md ${className}`} />;
}
