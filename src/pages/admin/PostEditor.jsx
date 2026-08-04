import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import toast from 'react-hot-toast';
import { ChevronDown, Loader2, Star, Save, Send, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateSlug } from '../../utils/slugify';
import { calculateReadingTime } from '../../utils/readingTime';
import { createPost, updatePost, getPostById } from '../../services/postsService';
import ImageUploader from '../../components/ui/ImageUploader';
import TagInput from '../../components/ui/TagInput';
import CategorySelect from '../../components/ui/CategorySelect';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: null,
  gallery: [],
  category: '',
  tags: [],
  status: 'draft',
  scheduledFor: '',
  featured: false,
  seoTitle: '',
  metaDescription: '',
  canonicalUrl: '',
  ogImage: null,
  twitterCard: 'summary_large_image',
};

export default function PostEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(EMPTY_POST);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getPostById(id)
      .then((data) => {
        if (!data) {
          toast.error('Post not found.');
          navigate('/admin/posts');
          return;
        }
        setPost({ ...EMPTY_POST, ...data, scheduledFor: '' });
        setSlugTouched(true);
      })
      .catch(() => toast.error('Could not load post.'))
      .finally(() => setLoading(false));
  }, [id, isNew, navigate]);

  const readingTime = useMemo(() => calculateReadingTime(post.content), [post.content]);
  const wordCount = useMemo(
    () => post.content.trim().split(/\s+/).filter(Boolean).length,
    [post.content]
  );

  function update(field, val) {
    setPost((p) => ({ ...p, [field]: val }));
  }

  function handleTitleChange(title) {
    setPost((p) => ({
      ...p,
      title,
      slug: slugTouched ? p.slug : generateSlug(title),
    }));
  }

  function validate() {
    if (!post.title.trim()) return 'Give the post a title.';
    if (!post.slug.trim()) return "The slug can't be empty.";
    if (!post.content.trim()) return 'Write some content before saving.';
    if (!post.category) return 'Pick a category.';
    if (post.status === 'scheduled' && !post.scheduledFor)
      return 'Choose a date and time to schedule for.';
    return null;
  }

  async function handleSave(status) {
    const payload = { ...post, status };

    if (status !== 'draft') {
      const error = validate();
      if (error) {
        toast.error(error);
        return;
      }
    } else if (!post.title.trim()) {
      toast.error('Give the post a title before saving.');
      return;
    }

    setSaving(true);
    try {
      const finalPayload = {
        ...payload,
        readingTime,
        author: { email: user?.email, name: user?.email?.split('@')[0] },
      };

      if (isNew) {
        const newId = await createPost(finalPayload);
        toast.success(
          status === 'published' ? 'Published.' : status === 'scheduled' ? 'Scheduled.' : 'Draft saved.'
        );
        navigate(`/admin/posts/${newId}/edit`, { replace: true });
      } else {
        await updatePost(id, finalPayload);
        toast.success(
          status === 'published' ? 'Published.' : status === 'scheduled' ? 'Scheduled.' : 'Draft saved.'
        );
      }
    } catch (err) {
      toast.error(err.message || 'Could not save post.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading post…" />;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {isNew ? 'New post' : 'Edit post'}
          </h1>
          <p className="text-ink-muted text-sm mt-0.5">
            {readingTime} min read · {wordCount} words
          </p>
        </div>
        <button
          type="button"
          onClick={() => update('featured', !post.featured)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            post.featured
              ? 'bg-signal-amber/15 border-signal-amber/40 text-signal-amber'
              : 'border-surface-border text-ink-muted hover:text-ink'
          }`}
        >
          <Star size={16} fill={post.featured ? 'currentColor' : 'none'} />
          Featured
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card space-y-4">
            <div>
              <label className="label-text">Title</label>
              <input
                value={post.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 10 AI Tools That Will Save You Hours in 2026"
                className="input-field text-lg font-medium"
              />
            </div>

            <div>
              <label className="label-text">Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-ink-faint text-sm shrink-0">/blog/</span>
                <input
                  value={post.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update('slug', generateSlug(e.target.value));
                  }}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-text">Excerpt</label>
              <textarea
                value={post.excerpt}
                onChange={(e) => update('excerpt', e.target.value)}
                rows={2}
                placeholder="A short teaser shown on the blog home and in search results"
                className="input-field resize-none"
              />
            </div>
          </div>

          <div className="card">
            <label className="label-text">Content (Markdown)</label>
            <div data-color-mode="dark">
              <MDEditor
                value={post.content}
                onChange={(val) => update('content', val || '')}
                height={420}
                preview="live"
              />
            </div>
          </div>

          {/* SEO — collapsible so the primary flow stays fast on mobile */}
          <div className="card">
            <button
              type="button"
              onClick={() => setSeoOpen((s) => !s)}
              className="w-full flex items-center justify-between"
            >
              <span className="font-display font-semibold">SEO &amp; sharing</span>
              <ChevronDown
                size={18}
                className={`text-ink-faint transition-transform ${seoOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {seoOpen && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="label-text">SEO title</label>
                  <input
                    value={post.seoTitle}
                    onChange={(e) => update('seoTitle', e.target.value)}
                    placeholder={post.title || 'Falls back to the post title'}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Meta description</label>
                  <textarea
                    value={post.metaDescription}
                    onChange={(e) => update('metaDescription', e.target.value)}
                    rows={2}
                    maxLength={160}
                    placeholder={post.excerpt || 'Falls back to the excerpt'}
                    className="input-field resize-none"
                  />
                  <p className="text-xs text-ink-faint mt-1">{post.metaDescription.length}/160</p>
                </div>
                <div>
                  <label className="label-text">Canonical URL</label>
                  <input
                    value={post.canonicalUrl}
                    onChange={(e) => update('canonicalUrl', e.target.value)}
                    placeholder="Leave blank to use the default post URL"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Twitter card type</label>
                  <select
                    value={post.twitterCard}
                    onChange={(e) => update('twitterCard', e.target.value)}
                    className="input-field"
                  >
                    <option value="summary_large_image">Summary with large image</option>
                    <option value="summary">Summary</option>
                  </select>
                </div>
                <ImageUploader
                  label="Open Graph image (falls back to featured image)"
                  value={post.ogImage}
                  onChange={(v) => update('ogImage', v)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-5">
          <div className="card space-y-4">
            <div>
              <label className="label-text">Status</label>
              <select
                value={post.status}
                onChange={(e) => update('status', e.target.value)}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {post.status === 'scheduled' && (
              <div>
                <label className="label-text">Publish at</label>
                <input
                  type="datetime-local"
                  value={post.scheduledFor}
                  onChange={(e) => update('scheduledFor', e.target.value)}
                  className="input-field"
                />
              </div>
            )}

            <div>
              <label className="label-text">Category</label>
              <CategorySelect value={post.category} onChange={(v) => update('category', v)} />
            </div>

            <div>
              <label className="label-text">Tags</label>
              <TagInput value={post.tags} onChange={(v) => update('tags', v)} />
            </div>
          </div>

          <div className="card">
            <ImageUploader
              label="Featured image"
              value={post.featuredImage}
              onChange={(v) => update('featuredImage', v)}
            />
          </div>

          <div className="card">
            <ImageUploader
              label="Gallery"
              value={post.gallery}
              onChange={(v) => update('gallery', v)}
              multiple
            />
          </div>
        </div>
      </div>

      {/* Sticky action bar — reachable with a thumb on mobile */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-surface/95 backdrop-blur border-t border-surface-border px-4 py-3 flex gap-3 justify-end z-20">
        <button type="button" disabled={saving} onClick={() => handleSave('draft')} className="btn-secondary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(post.status === 'scheduled' ? 'scheduled' : 'published')}
          className="btn-primary"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : post.status === 'scheduled' ? (
            <Clock size={16} />
          ) : (
            <Send size={16} />
          )}
          {post.status === 'scheduled' ? 'Schedule' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
