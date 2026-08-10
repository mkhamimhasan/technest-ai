import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { searchPublicPosts } from "../services/publicPostsService";
import { formatPostDate } from "../utils/formatDate";
import { optimizeImage } from "../utils/imageUrl";

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const found = await searchPublicPosts(query);
        setResults(found);
        setSearched(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  function handleResultClick() {
    onClose();
    setQuery("");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search size={20} className="text-gray-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
            aria-label="Search query"
          />
          {loading && <Loader2 size={18} className="text-gray-400 animate-spin shrink-0" aria-hidden="true" />}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors shrink-0"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() && (
            <div className="px-5 py-8 text-center text-gray-500 text-sm">
              Type to search articles…
            </div>
          )}

          {query.trim() && searched && results.length === 0 && !loading && (
            <div className="px-5 py-8 text-center text-gray-500 text-sm">
              No articles found for <span className="text-white">"{query}"</span>
            </div>
          )}

          {results.length > 0 && (
            <ul role="listbox" className="divide-y divide-white/5">
              {results.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`/blog/${post.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors group"
                    role="option"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0">
                      {post.featuredImage?.url && (
                        <img
                          src={optimizeImage(post.featuredImage.url, { width: 100 })}
                          alt=""
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-gray-600 text-xs">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{formatPostDate(post.publishedAt)}</span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>

                    <ArrowRight size={16} className="text-gray-600 group-hover:text-purple-400 shrink-0 transition-colors" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Footer hint */}
          {results.length > 0 && (
            <div className="px-5 py-3 border-t border-white/5 text-xs text-gray-600">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}