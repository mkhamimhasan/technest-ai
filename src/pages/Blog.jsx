import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { listPublicPosts } from "../services/publicPostsService";
import { listCategories } from "../services/categoriesService";
import { formatPostDate } from "../utils/formatDate";
import { optimizeImage } from "../utils/imageUrl";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://technest-ai-kappa.vercel.app";

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get("category") || "All";

  const setActiveCategory = (cat) => {
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [{ posts: allPosts }, cats] = await Promise.all([
          listPublicPosts({ pageSize: 200 }),
          listCategories(),
        ]);
        if (!active) return;
        setPosts(allPosts);
        setCategoryNames(cats.map((c) => c.name));
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const categories = ["All", ...categoryNames];

  const filtered = posts.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const pageTitle = activeCategory !== "All"
    ? `${activeCategory} Articles — TechNest AI`
    : "Blog — TechNest AI";
  const pageDesc = activeCategory !== "All"
    ? `Browse all ${activeCategory} articles on TechNest AI.`
    : "Explore all articles on AI, technology, software tools, and web development.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:site_name" content="TechNest AI" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
      </Helmet>

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Articles</span>
            </h1>
            <p className="text-gray-400 text-lg">Explore our latest posts on AI, tech, and development.</p>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
            <label htmlFor="blog-search" className="sr-only">Search articles</label>
            <input
              id="blog-search"
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category Filter */}
          {categoryNames.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-12" role="group" aria-label="Filter by category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {loading ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length > 0 ? filtered.map((post, i) => (
                <article key={post.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden h-48 bg-white/5">
                    {post.featuredImage?.url && (
                      <img
                        src={optimizeImage(post.featuredImage.url, { width: 600 })}
                        alt={post.title}
                        width={600}
                        height={400}
                        loading={i < 3 ? "eager" : "lazy"}
                        fetchPriority={i === 0 ? "high" : "auto"}
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
                    <h2 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
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
              )) : (
                <div className="col-span-3 text-center text-gray-500 py-20">
                  {search ? `No articles found for "${search}".` : "No articles found."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}