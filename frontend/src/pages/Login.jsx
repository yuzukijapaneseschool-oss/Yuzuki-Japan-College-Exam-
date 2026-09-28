import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import samuraiBg from '../assets/samurai_bg.jpg';
import { 
  LogIn, 
  Key, 
  User, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  GraduationCap, 
  ArrowRight 
} from 'lucide-react';

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
          <div className="mb-4 inline-block">
            <img 
              src={logoImg} 
              alt="YUZUKI Japan College Logo" 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-contain mx-auto drop-shadow-2xl hover:scale-105 transition-transform"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-japanese drop-shadow-lg">
            YUZUKI JAPAN COLLEGE
          </h1>
          <p className="text-sm text-rose-300 font-medium font-japanese mt-0.5 drop-shadow">
            ゆづき日本カレッジ • Online Examination Portal
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/40">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href={`https://wa.me/94773539800?text=${encodeURIComponent('Hello Sensei, I forgot my Yuzuki Exam Portal password. My Student ID / Email is: ' + (identifier || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center space-x-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Forgot Password? (අමතකද?)</span>
                </a>
              </div>
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

          {/* Registration Section */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-3.5">
            
            <div className="text-center">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-japanese block">
                Don't have an account? (ගිණුමක් නොමැතිද?)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Choose your registration pathway below:
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Exam Practice Registration */}
              <Link 
                to="/exam-register"
                className="group block p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-rose-50/60 border border-rose-200/90 hover:border-rose-400 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors font-japanese flex items-center space-x-1.5">
                        <span>Register for Exam Practice</span>
                        <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold font-mono">Online CBT</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        JFT-Basic, SSW skill tests & Free JLPT mock exams
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                </div>
              </Link>

              {/* Option 2: Classroom / Japanese Language Course Registration */}
              <Link 
                to="/batch-register"
                className="group block p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                      <GraduationCap className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors font-japanese flex items-center space-x-1.5">
                        <span>Apply for Japanese Language Course</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold font-mono">Kandy Campus</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Physical & Online Zoom batch admissions (Rs. 5,000 deposit)
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                </div>
              </Link>
            </div>

            {/* Existing Student ID Activation Helper */}
            <div className="pt-1 text-center text-xs text-slate-500">
              <span>Already an enrolled YUZUKI college student? </span>
              <Link 
                to="/existing-student" 
                className="font-bold text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center space-x-0.5"
              >
                <span>Activate Student ID &rarr;</span>
              </Link>
            </div>

            {/* WhatsApp Assistance */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <a
                href="https://wa.me/94773539800?text=Hello%20Sensei,%20I%20need%20assistance%20logging%20into%20the%20Yuzuki%20Exam%20Portal."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-700 font-bold hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact Sensei on WhatsApp (උදව් ලබාගන්න)</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}