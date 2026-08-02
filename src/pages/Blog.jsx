import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";

const posts = [
  {
    id: 1,
    title: "Top 10 AI Tools in 2025 You Must Try",
    excerpt: "Discover the most powerful AI tools that are transforming how we work, create, and innovate.",
    category: "AI Tools",
    date: "July 28, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop",
    slug: "top-10-ai-tools-2025",
  },
  {
    id: 2,
    title: "React 19: What's New and Why It Matters",
    excerpt: "A deep dive into React 19's new features and developer experience upgrades.",
    category: "React",
    date: "July 22, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    slug: "react-19-whats-new",
  },
  {
    id: 3,
    title: "The Rise of Agentic AI: Beyond Chatbots",
    excerpt: "How autonomous AI agents are moving beyond simple chat to take real actions in the world.",
    category: "Technology",
    date: "July 15, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop",
    slug: "rise-of-agentic-ai",
  },
  {
    id: 4,
    title: "Tailwind CSS v4: Complete Guide",
    excerpt: "Everything you need to know about Tailwind CSS v4 — new features and best practices.",
    category: "Web Development",
    date: "July 10, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format&fit=crop",
    slug: "tailwind-css-v4-guide",
  },
  {
    id: 5,
    title: "Cybersecurity in the Age of AI",
    excerpt: "How AI is both a threat and a defense in modern cybersecurity.",
    category: "Cybersecurity",
    date: "July 5, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
    slug: "cybersecurity-age-of-ai",
  },
  {
    id: 6,
    title: "How to Start Freelancing as a Developer",
    excerpt: "A practical guide to landing your first client and building a sustainable freelance career.",
    category: "Freelancing",
    date: "June 30, 2025",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    slug: "start-freelancing-developer",
  },
];

const categories = ["All", "AI Tools", "React", "Technology", "Web Development", "Cybersecurity", "Freelancing"];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
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
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? filtered.map((post) => (
            <article key={post.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden h-48">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="bg-purple-600/90 text-white text-xs font-medium px-3 py-1 rounded-full">{post.category}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="text-purple-400 text-sm font-medium hover:text-purple-300 flex items-center gap-1">
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          )) : (
            <div className="col-span-3 text-center text-gray-500 py-20">No articles found.</div>
          )}
        </div>
      </div>
    </div>
  );
}