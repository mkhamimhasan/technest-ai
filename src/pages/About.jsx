import { Zap, Target, Users, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Zap size={14} className="text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">TechNest AI</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            TechNest AI is a premium technology blog dedicated to exploring the cutting edge of artificial intelligence, web development, and future technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: "Our Mission", desc: "To make complex technology accessible and understandable for everyone — from beginners to experts." },
            { icon: Users, title: "Our Audience", desc: "Developers, students, AI enthusiasts, tech professionals, and startup founders worldwide." },
            { icon: Globe, title: "Our Reach", desc: "Serving readers from over 50 countries with high-quality, SEO-optimized tech content." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center mb-4">
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-white/10 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Want to Write for Us?</h2>
          <p className="text-gray-400 mb-6">We welcome guest contributors who are passionate about technology and AI.</p>
          <a href="/contact" className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity inline-block">
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}