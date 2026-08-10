import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { listPosts, deletePost } from '../../services/postsService';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'scheduled', label: 'Scheduled' },
];

export default function PostsList() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') ?? '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load(reset = true) {
    reset ? setLoading(true) : setLoadingMore(true);
    try {
      const { posts: fetched, lastDoc, hasMore: more } = await listPosts({
        status: statusFilter || undefined,
        cursor: reset ? undefined : cursor,
      });
      setPosts((prev) => (reset ? fetched : [...prev, ...fetched]));
      setCursor(lastDoc);
      setHasMore(more);
    } catch (err) {
      toast.error('Could not load posts.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePost(deleteTarget.id, {
        featuredImage: deleteTarget.featuredImage,
        gallery: deleteTarget.gallery,
      });
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success('Post deleted.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Could not delete post.');
    } finally {
      setDeleting(false);
    }
  }

  const visiblePosts = posts.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold">Posts</h1>
        <Link to="/admin/posts/new" className="btn-primary">
          <Plus size={16} />
          New post
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-signal-indigo/15 text-signal-indigo'
                  : 'text-ink-muted hover:bg-surface-raised'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="input-field pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-ink-muted text-sm mb-4">
            {search ? 'No posts match your search.' : "No posts here yet."}
          </p>
          {!search && (
            <Link to="/admin/posts/new" className="btn-primary inline-flex">
              <Plus size={16} />
              Write a post
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {visiblePosts.map((post) => (
            <div key={post.id} className="card flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-surface-raised shrink-0 overflow-hidden">
                {post.featuredImage?.url && (
                  <img src={post.featuredImage.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{post.title || 'Untitled'}</p>
                  {post.featured && <Star size={14} className="text-signal-amber shrink-0" fill="currentColor" />}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <StatusBadge status={post.status} />
                  {post.category && <span className="text-xs text-ink-faint">{post.category}</span>}
                  {post.readingTime && (
                    <span className="text-xs text-ink-faint">{post.readingTime} min read</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/admin/posts/${post.id}/edit`}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:bg-surface-raised hover:text-ink"
                  aria-label="Edit post"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => setDeleteTarget(post)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:bg-signal-rose/10 hover:text-signal-rose"
                  aria-label="Delete post"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && hasMore && !search && (
        <div className="text-center">
          <button onClick={() => load(false)} disabled={loadingMore} className="btn-secondary">
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this post?"
        message={`"${deleteTarget?.title || 'Untitled'}" will be permanently removed, including its images. This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}