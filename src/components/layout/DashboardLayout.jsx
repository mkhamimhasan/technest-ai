import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

// Wraps every /dashboard/* route. Sidebar is a fixed rail on desktop
// and a slide-out drawer on mobile, opened from the topbar hamburger.
export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-void">
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile-only topbar — this is what you'll tap on your phone */}
        <header className="lg:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-4 bg-surface/95 backdrop-blur border-b border-surface-border">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="text-ink-muted hover:text-ink"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-signal-gradient" />
            <span className="font-display font-semibold text-sm">TechNest AI</span>
          </div>
          <div className="w-[22px]" /> {/* balances the hamburger for centered logo */}
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
