import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Facebook, 
  GraduationCap, 
  CheckCircle2, 
  ExternalLink,
  Shield
} from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 text-sm select-none">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Brand & About */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img src={logoImg} alt="YUZUKI Logo" className="w-10 h-10 rounded-xl object-contain border border-rose-500/30" />
            <div>
              <h3 className="font-bold text-base text-white font-japanese">YUZUKI Japan College</h3>
              <p className="text-xs text-rose-400 font-japanese">ゆづき日本カレッジ • Kandy</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-japanese">
            Premier Japanese Language Academy & Overseas Educational Institute in Kandy, Sri Lanka. Offering official JFT-Basic A2, JLPT N5-N3, NAT-TEST, SSW Skilled Worker training, and Student Visa consultation.
          </p>
          <div className="flex items-center space-x-3 pt-1">
            <a
              href="https://www.facebook.com/p/Yuzuki-Japan-College-61585333492032/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors border border-blue-500/30"
              title="Follow us on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/94773539800"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-emerald-500/30"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Course Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm font-japanese border-l-2 border-rose-500 pl-2">
            Language Courses
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-japanese">
            <li>
              <Link to="/courses" className="hover:text-rose-400 transition-colors flex items-center space-x-1.5">
                <span>• JFT-Basic A2 (SSW Specialized)</span>
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-rose-400 transition-colors flex items-center space-x-1.5">
                <span>• JLPT N5, N4, N3 Preparation</span>
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-rose-400 transition-colors flex items-center space-x-1.5">
                <span>• NAT-TEST Fast-Track Modules</span>
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-rose-400 transition-colors flex items-center space-x-1.5">
                <span>• Japanese Business Manners & Kaiwa</span>
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-rose-400 transition-colors flex items-center space-x-1.5">
                <span>• SSW Skill Test Training</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Visa & Career Pathways */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm font-japanese border-l-2 border-rose-500 pl-2">
            Japan Visa Pathways
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-japanese">
            <li>
              <Link to="/visa-pathways" className="hover:text-rose-400 transition-colors">
                • Student Visa (Language Schools)
              </Link>
            </li>
            <li>
              <Link to="/visa-pathways" className="hover:text-rose-400 transition-colors">
                • SSW (Specified Skilled Worker Visa)
              </Link>
            </li>
            <li>
              <Link to="/visa-pathways" className="hover:text-rose-400 transition-colors">
                • TITP Technical Intern Training Visa
              </Link>
            </li>
            <li>
              <Link to="/visa-pathways" className="hover:text-rose-400 transition-colors">
                • Japanese University Placement
              </Link>
            </li>
            <li>
              <Link to="/portal" className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 mt-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Online CBT Exam Platform</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Campus Info */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm font-japanese border-l-2 border-rose-500 pl-2">
            Kandy Campus Contact
          </h4>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>YUZUKI Japan College, Kandy, Central Province, Sri Lanka.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <a href="tel:0711109800" className="hover:text-white font-mono font-semibold">0711109800 (Voice)</a>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <a href="https://wa.me/94773539800" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-mono font-semibold text-emerald-400">0773539800 (WhatsApp)</a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <a href="mailto:yuzukijapaneseschool@gmail.com" className="hover:text-white font-mono">yuzukijapaneseschool@gmail.com</a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 pt-6 max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-japanese">
        <p>&copy; 2026 YUZUKI Japan College (ゆづき日本カレッジ). All Rights Reserved.</p>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <Link to="/portal" className="hover:text-slate-300">CBT Exam Room</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-slate-300">Admissions</Link>
          <span>•</span>
          <Link to="/login" className="hover:text-slate-300">Staff Login</Link>
        </div>
      </div>
    </footer>
  );
}