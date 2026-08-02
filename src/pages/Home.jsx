import { Link } from "react-router-dom";
import { ArrowRight, Zap, TrendingUp, BookOpen } from "lucide-react";

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

const categories = [
  { name: "Artificial Intelligence", count: 24, color: "from-purple-500 to-purple-700" },
  { name: "Web Development", count: 18, color: "from-cyan-500 to-cyan-700" },
  { name: "React", count: 15, color: "from-blue-500 to-blue-700" },
  { name: "JavaScript", count: 20, color: "from-yellow-500 to-yellow-700" },
  { name: "Cybersecurity", count: 12, color: "from-red-500 to-red-700" },
  { name: "Freelancing", count: 10, color: "from-green-500 to-green-700" },
];

export default function Home() {
  return (
    <div>
      {/* Hero
          Uses flex-1 instead of min-h-screen / calc(100vh-*).
          App.jsx's <main> is already a flex column that fills all
          remaining space below the sticky navbar. Making this section
          flex-1 lets it claim exactly that remaining space, no matter
          what the navbar's actual height is (desktop or mobile). */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#0a0a0f] to-cyan-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        {/* Balanced hero text block: heading, subtitle, and buttons now
            follow a consistent size ratio and spacing rhythm instead of
            the heading being disproportionately large next to the
            subtitle. */}
        <div className="relative text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-8">
            <Zap size={13} className="text-purple-400" />
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
              Explore Articles <ArrowRight size={16} />
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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-purple-400" />
                <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Latest Posts</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Recent Articles</h2>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-purple-600/90 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="text-purple-400 text-sm font-medium hover:text-purple-300 flex items-center gap-1">
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center gap-2 justify-center mb-2">
              <BookOpen size={18} className="text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Browse</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Explore Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} to="/categories" className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.count} articles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-8">Get the latest AI and tech articles delivered to your inbox every week.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
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
  );
}