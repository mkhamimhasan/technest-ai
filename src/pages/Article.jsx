import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronRight, Share2, Link as LinkIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getPostBySlug, getRelatedPosts } from "../services/publicPostsService";
import { formatPostDate } from "../utils/formatDate";

export default function Article() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const found = await getPostBySlug(slug);
        if (!active) return;
        if (!found) {
          setNotFound(true);
          return;
        }
        setPost(found);
        const related = await getRelatedPosts(found, 3);
        if (active) setRelatedPosts(related);
      } catch (err) {
        console.error("Failed to load article:", err);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (notFound) {
    return <Navigate to="/blog" replace />;
  }

  if (loading || !post) {
    return <div className="pt-24 pb-20 px-4 text-center text-gray-500">Loading article…</div>;
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const authorName = post.author?.name || "TechNest AI";

  return (
    <article className="pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-white transition-colors">
            Blog
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-300 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Category + Title */}
        <span className="inline-block bg-purple-600/90 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-gray-500 text-sm mb-8 pb-8 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-300 font-medium">{authorName}</span>
          <span>•</span>
          <span>{formatPostDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readingTime} min read</span>
        </div>

        {/* Featured Image */}
        {post.featuredImage?.url && (
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={post.featuredImage.url} alt={post.title} className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Article Content */}
        <div className="prose-content max-w-none mb-12">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-3 mb-12 pb-12 border-b border-white/10">
          <span className="text-gray-500 text-sm font-medium mr-2">Share this article:</span>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <Share2 size={16} />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <Share2 size={16} />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <Share2 size={16} />
          </a>
          <button
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            aria-label="Copy link"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <LinkIcon size={16} />
          </button>
        </div>

        {/* Author Box */}
        <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 mb-16">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Written by {authorName}</p>
            <p className="text-gray-400 text-sm">Editor at TechNest AI.</p>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.slug}`}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors"
                >
                  <div className="h-32 overflow-hidden">
                    <img src={rp.featuredImage?.url} alt={rp.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {rp.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
