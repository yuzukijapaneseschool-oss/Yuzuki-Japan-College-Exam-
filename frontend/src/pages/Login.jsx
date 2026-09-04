import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import samuraiBg from '../assets/samurai_bg.jpg';
import { LogIn, Key, User, AlertCircle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const performLogin = async (ident, pass) => {
    setError('');
    setErrorStatus('');
    setLoading(true);

    try {
      const user = await login(ident.trim(), pass.trim());
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.error || 'Failed to sign in. Please check your credentials.';
      const status = err.response?.data?.status || '';
      setError(msg);
      setErrorStatus(status);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performLogin(identifier, password);
  };


  return (
    <div 
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${samuraiBg})` }}
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />

      <div className="max-w-md w-full relative z-10 py-6">
        
        <div className="text-center mb-6">
          <div className="inline-block p-2 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-rose-600/40 shadow-2xl shadow-rose-950/60 mb-3">
            <img 
              src={logoImg} 
              alt="YUZUKI Japan College Logo" 
              className="w-24 h-24 object-contain mx-auto"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-japanese drop-shadow-lg">
            YUZUKI JAPAN COLLEGE
          </h1>
          <p className="text-sm text-rose-300 font-medium font-japanese mt-0.5 drop-shadow">
            ゆづき日本カレッジ • Online Examination Portal
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40">
          <h2 className="text-2xl font-bold text-slate-900 mb-1 font-japanese">Welcome Back</h2>
          <p className="text-xs text-slate-600 mb-5">
            Enter your <strong>Student ID</strong> or <strong>Registered Email</strong> to enter the exam room.
          </p>

          {error && (
            <div className={`p-4 rounded-xl mb-5 text-sm flex items-start space-x-3 ${
              errorStatus === 'pending'
                ? 'bg-amber-50 border border-amber-300 text-amber-900'
                : 'bg-rose-50 border border-rose-300 text-rose-900'
            }`}>
              {errorStatus === 'pending' ? (
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{errorStatus === 'pending' ? 'Approval Pending' : 'Login Error'}</p>
                <p className="mt-0.5 text-xs opacity-90">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student ID or Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Email / Student ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold shadow-lg shadow-rose-600/30 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Access Exam Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-3 text-center text-xs text-slate-600">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center">
              <p className="font-bold text-slate-900 text-xs mb-1">
                🏛️ දැනටමත් Yuzuki Student ID එකක් තිබේද?
              </p>
              <Link 
                to="/existing-student" 
                className="inline-flex items-center justify-center space-x-1 font-extrabold text-rose-700 hover:text-rose-800 text-xs bg-white px-3 py-1.5 rounded-xl border border-rose-300 shadow-sm transition-all hover:bg-rose-100"
              >
                <span>Activate Existing Student ID (සක්‍රීය කරන්න) &rarr;</span>
              </Link>
            </div>

            <div>
              New candidate for CBT Examination?{' '}
              <Link to="/register" className="font-bold text-rose-600 hover:text-rose-700 underline">
                Register Candidate ID
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}