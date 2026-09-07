import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';

interface AdminResetPasswordPageProps {
  navigate: (path: string) => void;
}

export const AdminResetPasswordPage: React.FC<AdminResetPasswordPageProps> = ({ navigate }) => {
  const { adminUsers, updateAdminUserPassword, settings } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const trimmed = identifier.trim().toLowerCase();
    const user = adminUsers.find(
      (u) => u.email.toLowerCase() === trimmed || u.username.toLowerCase() === trimmed
    );

    if (!user) {
      setErrorMsg('No administrator account found matching this email or username.');
      return;
    }

    updateAdminUserPassword(user.id, newPassword);
    setSuccessMsg(`Password successfully updated for ${user.username} (${user.email}). You can now log in at /connect/admin.`);
    setNewPassword('');
    setConfirmPassword('');
    setIdentifier('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-2 border border-sky-500/30">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-outfit text-2xl font-bold text-white">
            Administrative Password Reset
          </h1>
          <p className="text-xs text-slate-400">
            Secure recovery console for authorized Mesina Farms hatchery personnel.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Admin Email or Username
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. jojomesina@icloud.com or super"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              New Secure Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 active:scale-[0.99] transition-all cursor-pointer shadow-md"
          >
            Update Admin Password
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => navigate('/connect/admin')}
            className="flex items-center gap-1.5 hover:text-sky-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Login</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            Go to Website
          </button>
        </div>
      </div>
    </div>
  );
};
