import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back.');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Map common Firebase auth errors to plain-language messages.
      const message =
        {
          'auth/invalid-credential': 'Incorrect email or password.',
          'auth/wrong-password': 'Incorrect email or password.',
          'auth/user-not-found': 'Incorrect email or password.',
          'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
        }[err.code] || err.message || 'Could not sign in. Try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-signal-gradient flex items-center justify-center">
            <Lock size={20} className="text-void" />
          </div>
          <h1 className="font-display text-2xl font-semibold">TechNest AI</h1>
          <p className="text-ink-muted text-sm mt-1">Sign in to the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="label-text">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-9"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="label-text">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-9 pr-9"
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-ink-faint mt-6">
          This dashboard is restricted to a single admin account.
        </p>
      </div>
    </div>
  );
}
