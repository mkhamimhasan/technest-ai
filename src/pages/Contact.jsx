import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <MessageSquare size={14} className="text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Touch</span>
          </h1>
          <p className="text-gray-400">Have a question or want to write for us? We'd love to hear from you.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
                <Send size={28} className="text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Message Sent!</h3>
              <p className="text-gray-400">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-6 text-purple-400 hover:text-purple-300 text-sm">
                Send another message
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Your message here..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Send Message <Send size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500">
          <Mail size={16} />
          <span className="text-sm">contact@technestai.com</span>
        </div>
      </div>
    </div>
  );
}