import { Link } from 'react-router-dom';
import Skeleton from './Skeleton';

export default function StatCard({ label, value, icon: Icon, accent = 'indigo', loading, to }) {
  const accentMap = {
    indigo: 'text-signal-indigo bg-signal-indigo/10',
    cyan: 'text-signal-cyan bg-signal-cyan/10',
    amber: 'text-signal-amber bg-signal-amber/10',
    emerald: 'text-signal-emerald bg-signal-emerald/10',
  };

  const inner = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-ink-muted mb-2">{label}</p>
        {loading ? (
          <Skeleton className="h-8 w-14" />
        ) : (
          <p className="font-display text-3xl font-semibold text-ink">{value}</p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentMap[accent]}`}>
        <Icon size={18} />
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="card block hover:ring-2 hover:ring-signal-indigo/30 transition-shadow">
        {inner}
      </Link>
    );
  }

  return <div className="card">{inner}</div>;
}