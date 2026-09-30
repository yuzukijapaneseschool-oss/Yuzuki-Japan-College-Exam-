import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck,
  LogOut
} from 'lucide-react';

export default function ChangePasswordModal({ isOpen, onClose, onPasswordChanged }) {
  const { setAuthData, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword.trim() || !newPassword.trim()) {
      setError('Current password and new password are required.');
      return;
    }

    if (newPassword.trim().length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (currentPassword.trim() === newPassword.trim()) {
      setError('New password cannot be the same as your current password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.changePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim()
      });

      setSuccess(res.data?.message || 'Password changed successfully! Please sign in again using your new password.');
      if (res.data?.token && res.data?.user && setAuthData) {
        setAuthData(res.data.token, res.data.user);
      }
      if (onPasswordChanged) {
        onPasswordChanged();
      }
    } catch (err) {
      console.error('Password change error:', err);
      const msg = err.response?.data?.error || 'Failed to update password. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  const handleReLogin = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-japanese">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600/30 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Change Password</h3>
              <p className="text-xs text-rose-200/80">මුරපදය වෙනස් කිරීම • Account Security</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start space-x-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {success ? (
            <div className="space-y-4 py-2 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Password Updated Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {success}
                </p>
              </div>
              <div className="pt-3 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Continue on Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleReLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-600/20 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign In with New Password</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Current Password (වත්මන් මුරපදය)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 placeholder:text-slate-400 outline-none text-xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  New Password (නව මුරපදය)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 placeholder:text-slate-400 outline-none text-xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password (නව මුරපදය තහවුරු කරන්න)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 placeholder:text-slate-400 outline-none text-xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
