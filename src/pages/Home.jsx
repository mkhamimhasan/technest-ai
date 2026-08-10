import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Zap, TrendingUp, BookOpen } from "lucide-react";
import { listPublicPosts } from "../services/publicPostsService";
import { listCategories } from "../services/categoriesService";
import { formatPostDate } from "../utils/formatDate";
import { colorForIndex } from "../utils/categoryColors";
import { optimizeImage } from "../utils/imageUrl";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://technest-ai-kappa.vercel.app";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [{ posts: latest }, cats] = await Promise.all([
          listPublicPosts({ pageSize: 6 }),
          listCategories(),
        ]);
        if (!active) return;
        setPosts(latest);
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load homepage content:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <>
      <Helmet>
        <title>TechNest AI — Insights on AI & Technology</title>
        <meta name="description" content="Explore the latest insights, tutorials, and news on AI, technology, software tools, and web development. Written for readers in the USA, UK, and Australia." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={SITE_URL} />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="TechNest AI — Insights on AI & Technology" />
        <meta property="og:description" content="Explore the latest insights, tutorials, and news on AI, technology, software tools, and web development." />
        <meta property="og:site_name" content="TechNest AI" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TechNest AI — Insights on AI & Technology" />
        <meta name="twitter:description" content="Explore the latest insights on AI, technology, and software tools." />
      </Helmet>

      <div>
        {/* Hero */}
        <section className="relative flex-1 flex items-center justify-center overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#0a0a0f] to-cyan-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative text-center px-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-8">
              <Zap size={13} className="text-purple-400" aria-hidden="true" />
              <span className="text-purple-300 text-xs font-medium tracking-wide">
                Welcome to TechNest AI
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-[1.3] tracking-tight">
              Discover the Future of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 whitespace-nowrap">
                AI &amp; Technology
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
              <Link
                to="/blog"
                className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
              >
                Explore Articles <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to="/about"
                className="border border-white/15 text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-20 px-4" aria-labelledby="latest-posts-heading">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-purple-400" aria-hidden="true" />
                  <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Latest Posts</span>
                </div>
                <h2 id="latest-posts-heading" className="text-3xl md:text-4xl font-bold text-white">Recent Articles</h2>
              </div>
              <Link to="/blog" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                View All <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {loading ? (
              /* Skeleton to prevent CLS */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-white/10" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                      <div className="h-5 bg-white/10 rounded" />
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-500 py-16">
                No articles published yet — check back soon.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => (
                  <article key={post.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                    {/* Fixed height image container prevents CLS */}
                    <div className="relative overflow-hidden h-48 bg-white/5">
                      {post.featuredImage?.url && (
                        <img
                          src={optimizeImage(post.featuredImage.url, { width: 600 })}
                          alt={post.title}
                          width={600}
                          height={400}
                          /* First image loads eagerly for LCP */
                          loading={i === 0 ? "eager" : "lazy"}
                          fetchPriority={i === 0 ? "high" : "auto"}
                          decoding={i === 0 ? "sync" : "async"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-purple-600/90 text-white text-xs font-medium px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
                        <time dateTime={post.publishedAt?.toDate?.().toISOString()}>
                          {formatPostDate(post.publishedAt)}
                        </time>
                        <span aria-hidden="true">•</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-purple-400 text-sm font-medium hover:text-purple-300 flex items-center gap-1"
                        aria-label={`Read more about ${post.title}`}
                      >
                        Read More <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="py-20 px-4 bg-white/2" aria-labelledby="categories-heading">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <BookOpen size={18} className="text-cyan-400" aria-hidden="true" />
                  <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Browse</span>
                </div>
                <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-white">Explore Categories</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    to={`/blog?category=${encodeURIComponent(cat.name)}`}
                    className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorForIndex(i)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} aria-hidden="true" />
                    <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="py-20 px-4" aria-labelledby="newsletter-heading">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-white/10 rounded-3xl p-12">
              <h2 id="newsletter-heading" className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
              <p className="text-gray-400 mb-8">Get the latest AI and tech articles delivered to your inbox every week.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
                />
                <button className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}