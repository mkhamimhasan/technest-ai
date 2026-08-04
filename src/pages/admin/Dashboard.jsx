import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, PenLine, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import StatCard from '../../components/ui/StatCard';
import { getDashboardStats } from '../../services/postsService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await getDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        // Firestore collection may not exist yet on a fresh project — that's fine,
        // just show zeros instead of a scary error toast on first-ever load.
        if (err.code === 'permission-denied') {
          toast.error('Could not load stats — check Firestore rules.');
        }
        if (!cancelled) setStats({ total: 0, published: 0, drafts: 0, scheduled: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const isEmpty = !loading && stats?.total === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Overview</h1>
          <p className="text-ink-muted text-sm mt-0.5">
            Your content at a glance.
          </p>
        </div>
        <Link to="/admin/posts/new" className="btn-primary">
          <Plus size={16} />
          New post
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total posts" value={stats?.total ?? 0} icon={FileText} accent="indigo" loading={loading} />
        <StatCard label="Published" value={stats?.published ?? 0} icon={CheckCircle2} accent="emerald" loading={loading} />
        <StatCard label="Drafts" value={stats?.drafts ?? 0} icon={PenLine} accent="cyan" loading={loading} />
        <StatCard label="Scheduled" value={stats?.scheduled ?? 0} icon={Clock} accent="amber" loading={loading} />
      </div>

      {isEmpty && (
        <div className="card text-center py-12">
          <div className="w-12 h-12 rounded-lg bg-signal-gradient mx-auto mb-4 flex items-center justify-center">
            <FileText size={20} className="text-void" />
          </div>
          <h2 className="font-display text-lg font-semibold mb-1">No posts yet</h2>
          <p className="text-ink-muted text-sm mb-5 max-w-sm mx-auto">
            Write your first post from your phone or your desktop — it publishes
            straight to the site.
          </p>
          <Link to="/admin/posts/new" className="btn-primary inline-flex">
            <Plus size={16} />
            Write your first post
          </Link>
        </div>
      )}
    </div>
  );
}
