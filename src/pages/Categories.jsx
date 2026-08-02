import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories, getCategoryCount } from "../data/posts";

export default function Categories() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Categories
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Browse articles by topic — from AI tools to web development, cybersecurity, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.name);
            return (
              <Link
                key={cat.name}
                to={`/blog?category=${encodeURIComponent(cat.name)}`}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-7 overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative">
                  <h2 className="text-white font-semibold text-lg mb-1">{cat.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    {count} {count === 1 ? "article" : "articles"}
                  </p>
                  <span className="inline-flex items-center gap-1 text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Browse <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}