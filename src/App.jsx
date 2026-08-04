import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public site pages (unchanged design)
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin CMS
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import PostsList from "./pages/admin/PostsList";
import PostEditor from "./pages/admin/PostEditor";
import CategoriesManager from "./pages/admin/CategoriesManager";
import TagsManager from "./pages/admin/TagsManager";
import ComingSoon from "./pages/admin/ComingSoon";

// Wraps every public-facing route with the existing Navbar/Footer —
// exactly the same shell App.jsx used before the CMS was merged in.
function PublicLayout() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1B2033",
              color: "#E7E9F3",
              border: "1px solid #262C42",
            },
          }}
        />
        <Routes>
          {/* ---------- Public website (design untouched) ---------- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Article />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ---------- Admin CMS ---------- */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/:id/edit" element={<PostEditor />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="tags" element={<TagsManager />} />
            <Route path="settings" element={<ComingSoon title="Settings" />} />
          </Route>
        </Routes>

        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
