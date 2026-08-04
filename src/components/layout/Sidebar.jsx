import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/posts', label: 'Posts', icon: FileText },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { to: '/admin/tags', label: 'Tags', icon: Tags },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    toast.success('Signed out.');
  }

  return (
    <>
      {/* Mobile scrim — tapping outside the drawer closes it */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 z-50
          bg-surface border-r border-surface-border
          flex flex-col
          transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-signal-gradient shrink-0" />
            <span className="font-display font-semibold text-ink">TechNest AI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-ink-faint hover:text-ink"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-signal-indigo/15 text-signal-indigo'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-raised'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-surface-border">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-ink-faint truncate">Signed in as</p>
            <p className="text-sm text-ink truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-muted hover:text-signal-rose hover:bg-surface-raised transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
