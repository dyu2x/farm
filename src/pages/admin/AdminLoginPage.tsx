import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { adminLogin, currentAdminUser, settings } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to admin dashboard
  if (currentAdminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-md w-full space-y-4">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Already Authenticated</h2>
          <p className="text-xs text-slate-400">
            You are currently signed in as{' '}
            <span className="text-white font-semibold">{currentAdminUser.username}</span> ({currentAdminUser.role}).
          </p>
          <button
            onClick={() => navigate('/connect/admin/dashboard')}
            className="w-full py-3 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer"
          >
            Enter Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = adminLogin(identifier, password);
    setLoading(false);

    if (success) {
      navigate('/connect/admin/dashboard');
    } else {
      setError('Invalid username/email or password. Please verify credentials.');
    }
  };

  const fillQuickCredentials = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto mb-2 p-2">
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-outfit text-2xl font-black text-white tracking-tight">
            Mesina Farms Control Portal
          </h1>
          <p className="text-xs text-slate-400">
            Hatchery Inventory, Stock Monitoring &amp; Farmer Inquiry Operations
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form — STRICTLY NO PASSWORD RESET LINK ON THIS PAGE */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="jojomesina@icloud.com or super"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* Quick Demo Credentials Autofill chips for evaluation */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 text-xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Authorized Demo Credentials:
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fillQuickCredentials('jojomesina@icloud.com', 'abc123')}
              className="text-left py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-sky-300 font-mono flex justify-between cursor-pointer"
            >
              <span>Default Admin: jojomesina@icloud.com</span>
              <span className="text-slate-400">abc123</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('super', 'abc123!')}
              className="text-left py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-amber-300 font-mono flex justify-between cursor-pointer"
            >
              <span>Super Admin: super</span>
              <span className="text-slate-400">abc123!</span>
            </button>
          </div>
        </div>

        {/* Return to website link */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
