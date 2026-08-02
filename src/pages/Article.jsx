import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, ChevronRight, Share2, Link as LinkIcon } from "lucide-react";
import { posts, getPostBySlug, getRelatedPosts } from "../data/posts";

export default function Article() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  // If someone visits a slug that doesn't exist, send them back to the
  // blog list instead of showing a broken page.
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = getRelatedPosts(post, 3);

  const currentIndex = posts.findIndex((p) => p.id === post.id);
  const prevPost = posts[currentIndex - 1];
  const nextPost = posts[currentIndex + 1];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

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
          <img src={post.author.avatar} alt={post.author.name} className="w-9 h-9 rounded-full" />
          <span className="text-gray-300 font-medium">{post.author.name}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-10">
          <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-12">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-gray-300 text-lg leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
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
          <img src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full flex-shrink-0" />
          <div>
            <p className="text-white font-semibold mb-1">Written by {post.author.name}</p>
            <p className="text-gray-400 text-sm">{post.author.bio}</p>
          </div>
        </div>

        {/* Previous / Next Article */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500/50 transition-colors"
            >
              <span className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                <ArrowLeft size={12} /> Previous
              </span>
              <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                {prevPost.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="group bg-white/5 border border-white/10 rounded-xl p-5 text-right hover:border-purple-500/50 transition-colors"
            >
              <span className="flex items-center justify-end gap-1 text-gray-500 text-xs mb-2">
                Next <ArrowRight size={12} />
              </span>
              <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                {nextPost.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
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
                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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