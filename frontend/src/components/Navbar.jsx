import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import PublicNavbar from './PublicNavbar';
import { 
  CreditCard,
  GraduationCap, 
  UserCheck, 
  FileText, 
  BarChart3, 
  BookOpen, 
  LogOut, 
  Clock,
  Layers,
  Globe,
  Users
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const publicPaths = ['/', '/about', '/courses', '/visa-pathways', '/contact'];
  const isPublicPage = publicPaths.includes(location.pathname);

  // If user is on a public college website page, show the rich PublicNavbar!
  if (isPublicPage) {
    return <PublicNavbar />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className="bg-slate-950/95 backdrop-blur-md text-white shadow-xl sticky top-0 z-50 border-b border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-rose-600/60 shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform bg-white/90 p-0.5 flex items-center justify-center">
              <img src={logoImg} alt="Yuzuki Japan College Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-japanese">YUZUKI</span>
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded font-mono">
                  Exam Portal
                </span>
              </div>
              <p className="text-[11px] text-rose-300 font-japanese">ゆづき日本カレッジ • Kandy</p>
            </div>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {!isAdmin ? (
                <>
                  <Link
                    to="/dashboard"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ' + (
                      location.pathname === '/dashboard' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>My Exams</span>
                  </Link>

                  <Link
                    to="/history"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ' + (
                      location.pathname === '/history' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Exam History</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/admin"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ' + (
                      location.pathname === '/admin' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/admin/inquiries"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ' + (
                      location.pathname === '/admin/inquiries' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Admissions</span>
                  </Link>

                  <Link
                    to="/admin/approvals"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ' + (
                      location.pathname === '/admin/approvals' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approvals</span>
                  </Link>

                  <Link
                    to="/admin/quizzes"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ' + (
                      location.pathname.startsWith('/admin/quizzes') ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Quiz Builder</span>
                  </Link>

                  <Link
                    to="/admin/results"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ' + (
                      location.pathname === '/admin/results' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Results</span>
                  </Link>

                  <Link
                    to="/admin/payments"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ' + (
                      location.pathname === '/admin/payments' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Payments</span>
                  </Link>
                </>
              )}
            </nav>
          )}

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="text-xs text-rose-300 hover:text-white flex items-center space-x-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors font-japanese"
              title="Visit Main College Website"
            >
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>College Site</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-white leading-tight font-japanese">{user.name}</div>
                  <div className="text-[11px] text-rose-300 font-mono">{user.student_id || user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-900/50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}