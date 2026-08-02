// Single source of truth for all blog post data.
// Home.jsx, Blog.jsx, Article.jsx, and Categories.jsx all import from here
// so posts never need to be duplicated or kept in sync manually.

export const posts = [
  {
    id: 1,
    title: "Top 10 AI Tools in 2025 You Must Try",
    excerpt: "Discover the most powerful AI tools that are transforming how we work, create, and innovate.",
    category: "AI Tools",
    date: "July 28, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&auto=format&fit=crop",
    slug: "top-10-ai-tools-2025",
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?img=47",
      bio: "Sarah covers AI tools and productivity software for TechNest AI.",
    },
    content: [
      "Artificial intelligence tools have moved far beyond simple chatbots. In 2025, an entire ecosystem of AI-powered software is reshaping how developers, designers, and marketers get work done every day.",
      "From code generation assistants that understand entire codebases to design tools that turn a rough sketch into a polished interface, the common thread is speed: tasks that once took hours now take minutes.",
      "One of the biggest shifts this year has been the rise of agentic tools — AI systems that don't just answer questions but actually carry out multi-step tasks on your behalf, like researching a topic, drafting a report, and formatting it for you.",
      "For teams evaluating which tools to adopt, the best approach is to start small: pick one workflow that feels repetitive or slow, and test whether an AI tool can meaningfully speed it up before rolling it out more broadly.",
      "As these tools mature, the gap between teams that use them well and teams that don't is likely to keep growing, making it worth investing time now to learn what fits your workflow.",
    ],
  },
  {
    id: 2,
    title: "React 19: What's New and Why It Matters",
    excerpt: "A deep dive into React 19's new features and developer experience upgrades.",
    category: "React",
    date: "July 22, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop",
    slug: "react-19-whats-new",
    author: {
      name: "Marcus Lee",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "Marcus is a frontend engineer who writes about React and the modern web.",
    },
    content: [
      "React 19 focuses heavily on reducing the boilerplate developers have historically had to write around data fetching, forms, and optimistic UI updates.",
      "The new Actions API lets you handle form submissions and pending states without manually wiring up multiple useState calls, making common patterns noticeably shorter and easier to reason about.",
      "Server Components, which were experimental in earlier releases, are now a stable part of the framework, letting teams render more of their UI on the server without shipping unnecessary JavaScript to the browser.",
      "The React Compiler, previously known as 'React Forget,' automatically memoizes components and values, which means many manual useMemo and useCallback calls are no longer necessary in typical applications.",
      "For teams currently on React 18, the migration path is designed to be incremental — most existing code continues to work unchanged, with new features opted into gradually.",
    ],
  },
  {
    id: 3,
    title: "The Rise of Agentic AI: Beyond Chatbots",
    excerpt: "How autonomous AI agents are moving beyond simple chat to take real actions in the world.",
    category: "Technology",
    date: "July 15, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop",
    slug: "rise-of-agentic-ai",
    author: {
      name: "Priya Nair",
      avatar: "https://i.pravatar.cc/150?img=32",
      bio: "Priya writes about emerging AI systems and their real-world applications.",
    },
    content: [
      "For years, most people's experience of AI was limited to chat interfaces: you ask a question, the model answers, and the interaction ends there.",
      "Agentic AI changes that model by giving systems the ability to break a goal down into steps, use tools like web browsers or code interpreters, and keep working until the goal is complete — with limited human intervention.",
      "This shift is already visible in coding assistants that can open files, run tests, and fix bugs across an entire project, rather than just suggesting a single line of code.",
      "The trade-off is that agentic systems require more careful guardrails, since a mistake made early in a multi-step task can compound if it isn't caught quickly.",
      "As tooling around monitoring and correcting these agents improves, expect agentic AI to expand from developer tools into everyday business workflows like research, scheduling, and customer support.",
    ],
  },
  {
    id: 4,
    title: "Tailwind CSS v4: Complete Guide",
    excerpt: "Everything you need to know about Tailwind CSS v4 — new features and best practices.",
    category: "Web Development",
    date: "July 10, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&auto=format&fit=crop",
    slug: "tailwind-css-v4-guide",
    author: {
      name: "David Kim",
      avatar: "https://i.pravatar.cc/150?img=15",
      bio: "David is a web developer focused on CSS architecture and design systems.",
    },
    content: [
      "Tailwind CSS v4 introduces a new engine built for speed, with build times reported to be significantly faster than previous versions, especially on large projects.",
      "Configuration has moved closer to plain CSS: instead of a large JavaScript config file, most customization now happens directly in your CSS using native CSS variables, which makes the mental model simpler for many teams.",
      "Container queries are now supported out of the box, letting components adapt their layout based on the size of their parent container rather than only the viewport — a long-requested feature.",
      "The utility class naming conventions remain largely familiar, so most of your existing knowledge and muscle memory carries over directly to v4.",
      "For teams upgrading from v3, Tailwind provides an automated migration tool that handles most of the mechanical changes, though custom plugins may need manual review.",
    ],
  },
  {
    id: 5,
    title: "Cybersecurity in the Age of AI",
    excerpt: "How AI is both a threat and a defense in modern cybersecurity.",
    category: "Cybersecurity",
    date: "July 5, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop",
    slug: "cybersecurity-age-of-ai",
    author: {
      name: "Amara Osei",
      avatar: "https://i.pravatar.cc/150?img=28",
      bio: "Amara covers cybersecurity trends and enterprise risk for TechNest AI.",
    },
    content: [
      "AI has become a double-edged sword in cybersecurity: the same techniques that help defenders detect anomalies faster are also being used by attackers to craft more convincing phishing campaigns.",
      "Automated phishing emails generated by language models are now harder to distinguish from legitimate communication, since they no longer contain the awkward phrasing that used to be a red flag.",
      "On the defensive side, AI-powered systems can analyze network traffic in real time and flag unusual patterns far faster than manual review, often catching intrusions within minutes instead of days.",
      "Security teams are increasingly adopting a layered approach: using AI for detection and triage, while keeping human analysts in the loop for final decisions on high-stakes incidents.",
      "Organizations that treat AI purely as a defensive add-on, without also training staff to recognize AI-generated social engineering attempts, remain the most exposed.",
    ],
  },
  {
    id: 6,
    title: "How to Start Freelancing as a Developer",
    excerpt: "A practical guide to landing your first client and building a sustainable freelance career.",
    category: "Freelancing",
    date: "June 30, 2025",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop",
    slug: "start-freelancing-developer",
    author: {
      name: "Jonah Whitfield",
      avatar: "https://i.pravatar.cc/150?img=8",
      bio: "Jonah has worked as an independent developer for over six years.",
    },
    content: [
      "Landing your first freelance client is usually the hardest part — not because of a lack of skill, but because of a lack of visible proof that you can deliver.",
      "Building two or three small portfolio projects that closely resemble real client work is often more effective than a long resume, since prospective clients can see exactly what you're capable of.",
      "Pricing is one of the most common early mistakes: charging too little to 'get started' often attracts clients who don't value the work, making it harder to raise rates later.",
      "Clear written agreements — even a simple one-page scope document — prevent the majority of disputes that new freelancers run into around timelines and revisions.",
      "Sustainable freelancing usually comes from repeat clients and referrals rather than constantly chasing new leads, so delivering reliably on your first few projects pays off far beyond the initial paycheck.",
    ],
  },
];

// Categories are derived directly from the posts above, so this list is
// always accurate — no manual syncing needed when a new post is added.
// A small color palette is cycled through for visual variety.
const categoryColors = [
  "from-purple-500 to-purple-700",
  "from-cyan-500 to-cyan-700",
  "from-blue-500 to-blue-700",
  "from-yellow-500 to-yellow-700",
  "from-red-500 to-red-700",
  "from-green-500 to-green-700",
  "from-pink-500 to-pink-700",
  "from-indigo-500 to-indigo-700",
];

const uniqueCategoryNames = [...new Set(posts.map((p) => p.category))];

export const categories = uniqueCategoryNames.map((name, i) => ({
  name,
  color: categoryColors[i % categoryColors.length],
}));

// Convenience helper: count how many posts exist per category name.
export function getCategoryCount(categoryName) {
  return posts.filter((p) => p.category === categoryName).length;
}

// Convenience helper: find a single post by its slug.
export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}

// Convenience helper: get up to `limit` related posts (same category,
// excluding the current post itself).
export function getRelatedPosts(currentPost, limit = 3) {
  return posts
    .filter((p) => p.category === currentPost.category && p.id !== currentPost.id)
    .slice(0, limit);
}