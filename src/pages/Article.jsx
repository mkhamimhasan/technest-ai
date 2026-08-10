import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Share2, Link as LinkIcon, Twitter, Facebook, Linkedin } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getPostBySlug, getRelatedPosts } from "../services/publicPostsService";
import { formatPostDate, toISODate } from "../utils/formatDate";
import { optimizeImage } from "../utils/imageUrl";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://technest-ai-kappa.vercel.app";

export default function Article() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const found = await getPostBySlug(slug);
        if (!active) return;
        if (!found) { setNotFound(true); return; }
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
    return () => { active = false; };
  }, [slug]);

  if (notFound) return <Navigate to="/blog" replace />;

  if (loading || !post) {
    return (
      <div className="pt-24 pb-20 px-4 max-w-3xl mx-auto animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/3 mb-8" />
        <div className="h-8 bg-white/10 rounded w-2/3 mb-4" />
        <div className="h-64 bg-white/10 rounded-2xl mb-8" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-white/10 rounded" />)}
        </div>
      </div>
    );
  }

  const shareUrl = `${SITE_URL}/blog/${post.slug}`;
  const authorName = post.author?.name || "TechNest AI";
  const ogImage = post.ogImage?.url || post.featuredImage?.url || "";
  const metaTitle = post.seoTitle || post.title;
  const metaDesc = post.metaDescription || post.excerpt || "";
  const publishedISO = toISODate(post.publishedAt);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: metaDesc,
    image: ogImage ? optimizeImage(ogImage, { width: 1200 }) : undefined,
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "TechNest AI",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icons.svg` },
    },
    datePublished: publishedISO,
    dateModified: publishedISO,
    mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
    url: shareUrl,
    keywords: (post.tags || []).join(", "),
  };

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <>
      <Helmet>
        <title>{metaTitle} — TechNest AI</title>
        <meta name="description" content={metaDesc} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={post.canonicalUrl || shareUrl} />
        {publishedISO && <meta name="article:published_time" content={publishedISO} />}
        {(post.tags || []).map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:site_name" content="TechNest AI" />
        {ogImage && <meta property="og:image" content={optimizeImage(ogImage, { width: 1200 })} />}
        {ogImage && <meta property="og:image:width" content="1200" />}
        {ogImage && <meta property="og:image:height" content="630" />}

        {/* Twitter */}
        <meta name="twitter:card" content={post.twitterCard || "summary_large_image"} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        {ogImage && <meta name="twitter:image" content={optimizeImage(ogImage, { width: 1200 })} />}

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-gray-300 truncate max-w-[200px]" aria-current="page">{post.title}</span>
          </nav>

          {/* Category + Title */}
          <span className="inline-block bg-purple-600/90 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-gray-500 text-sm mb-8 pb-8 border-b border-white/10 flex-wrap">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold" aria-hidden="true">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-300 font-medium">{authorName}</span>
            <span aria-hidden="true">•</span>
            {publishedISO && (
              <time dateTime={publishedISO}>{formatPostDate(post.publishedAt)}</time>
            )}
            <span aria-hidden="true">•</span>
            <span>{post.readingTime} min read</span>
          </div>

          {/* Featured Image — eager load for LCP */}
          {post.featuredImage?.url && (
            <div className="rounded-2xl overflow-hidden mb-10 bg-white/5" style={{ aspectRatio: "16/9" }}>
              <img
                src={optimizeImage(post.featuredImage.url, { width: 900 })}
                alt={post.title}
                width={900}
                height={506}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose-content max-w-none mb-12">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="flex items-center gap-3 mb-12 pb-12 border-b border-white/10 flex-wrap">
            <span className="text-gray-500 text-sm font-medium mr-2">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank" rel="noopener noreferrer"
              aria-label="Share on Twitter"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <Twitter size={16} aria-hidden="true" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <Facebook size={16} aria-hidden="true" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <Linkedin size={16} aria-hidden="true" />
            </a>
            <button
              onClick={handleCopy}
              aria-label="Copy link"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <LinkIcon size={16} aria-hidden="true" />
            </button>
            {copied && <span className="text-xs text-green-400">Copied!</span>}
          </div>

          {/* Author Box */}
          <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 mb-16">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0" aria-hidden="true">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Written by {authorName}</p>
              <p className="text-gray-400 text-sm">Editor at TechNest AI — covering AI, software, and emerging technology.</p>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-2xl font-bold text-white mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/blog/${rp.slug}`}
                    className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors"
                  >
                    <div className="h-32 overflow-hidden bg-white/5">
                      {rp.featuredImage?.url && (
                        <img
                          src={optimizeImage(rp.featuredImage.url, { width: 400 })}
                          alt={rp.title}
                          width={400}
                          height={128}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {rp.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}