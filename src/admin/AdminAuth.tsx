import React, { useEffect, useState } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';
import { loginApi } from '../utils/api';

interface AdminAuthProps {
  onUnlock: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onUnlock }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setError(''), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setError('Enter a valid staff email.');
      return;
    }

    setLoading(true);
    try {
      const { token } = await loginApi(form.email, form.password);
      localStorage.setItem('ce_admin_token', token);
      onUnlock();
    } catch (err: any) {
      setError(err.message || 'Login failed. Check credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-stone-950">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-stone-800 bg-stone-900 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3 pb-6 border-b border-stone-800">
            <div className="w-11 h-11 rounded-full bg-amber-900 flex items-center justify-center stroke-stone-950">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-stone-100">Editorial CMS Access</h1>
              <p className="text-xs font-mono text-stone-500 mt-0.5">Critical Eye &middot; Restricted</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 pt-6">
            <div>
              <label htmlFor="adminEmail" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Staff Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="adminEmail"
                  type="email"
                  autoComplete="username"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="editor@criticaleye.org"
                  className="w-full h-11 pl-10 pr-3 rounded-md border border-stone-700 focus:border-amber-600 focus:outline-none bg-stone-950 text-stone-100 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full h-11 pl-10 pr-11 rounded-md border border-stone-700 focus:border-amber-600 focus:outline-none bg-stone-950 text-stone-100 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-amber-900/40 bg-amber-950/40 px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 rounded-md text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Unlock Dashboard'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
