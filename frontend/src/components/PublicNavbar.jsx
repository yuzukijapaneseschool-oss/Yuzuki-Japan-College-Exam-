import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  GraduationCap, 
  Compass, 
  BookOpen, 
  MapPin, 
  ChevronRight,
  Shield,
  UserCheck
} from 'lucide-react';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Visa Pathways', path: '/visa-pathways' },
    { name: 'Contact & Admissions', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Notification / Hotline Strip */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-900/40 text-[11px] sm:text-xs py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <span className="flex items-center space-x-1 text-rose-400 font-semibold font-japanese">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Kandy Campus, Sri Lanka</span>
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300">
              New Batch Admissions Open for <strong className="text-amber-300">JFT-Basic & JLPT 2026</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <a 
              href="tel:0711109800" 
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-rose-400" />
              <span className="font-mono font-semibold">0711109800</span>
            </a>
            <a 
              href="https://wa.me/94773539800" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="font-mono font-semibold">0773539800</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src={logoImg} 
            alt="YUZUKI Japan College Logo" 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-md border border-rose-500/30 group-hover:scale-105 transition-transform" 
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white font-japanese">
                YUZUKI <span className="text-rose-500">Japan College</span>
              </span>
              <span className="text-[10px] bg-rose-900/60 text-rose-300 border border-rose-700/50 px-1.5 py-0.5 rounded font-mono font-semibold">
                KANDY
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-japanese tracking-wider">
              ゆづき日本カレッジ • Japanese Language & Visa Institute
            </p>
          </div>
        </Link>

        {/* Desktop Menu Links */}
        <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-xl transition-all font-japanese ${
                  isActive
                    ? 'text-rose-400 bg-rose-950/40 font-bold border border-rose-800/40 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Exam Portal Button */}
        <div className="hidden sm:flex items-center space-x-2.5">
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-rose-900/30 flex items-center space-x-1.5 transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{user.role === 'admin' ? '👑 Admin Panel' : '🎓 Exam Dashboard'}</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-slate-200 border border-slate-800 px-3 py-2 rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/portal"
                className="bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-rose-900/40 flex items-center space-x-1.5 transition-all transform hover:scale-105 active:scale-95"
              >
                <GraduationCap className="w-4 h-4" />
                <span>🎓 Student Exam Portal</span>
              </Link>

              <Link
                to="/batch-register"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              >
                Batch Admission
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <Link
            to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/portal'}
            className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3 animate-fade-in font-japanese">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <Link
              to="/portal"
              onClick={() => setIsOpen(false)}
              className="w-full bg-rose-600 text-white text-center py-2.5 rounded-xl font-bold text-xs shadow-md"
            >
              🎓 Enter Online Exam Portal
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-900 text-slate-200 border border-slate-800 text-center py-2.5 rounded-xl font-semibold text-xs"
            >
              📞 Contact Kandy Branch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}