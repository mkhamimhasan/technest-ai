import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#0a0a0f] min-h-screen flex flex-col">
        <Navbar />
        {/* main is the flexible child of the flex-col wrapper above.
            It automatically fills all remaining height below the
            navbar, so no extra padding-top or vh math is needed here. */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Article />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </BrowserRouter>
  );
}

export default App;