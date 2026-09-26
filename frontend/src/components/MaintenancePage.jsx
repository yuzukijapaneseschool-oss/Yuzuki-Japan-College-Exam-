import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { 
  ShieldCheck, 
  Clock, 
  Wrench, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Layers,
  ArrowRight,
  Headphones
} from 'lucide-react';

export default function MaintenancePage({ settings, onRefresh }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!settings?.maintenance_end_time) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(settings.maintenance_end_time).getTime();
      const difference = Math.max(0, target - now);

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, totalSeconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings?.maintenance_end_time]);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const formatTargetTime = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return null;
    }
  };

  const targetTimeFormatted = formatTargetTime(settings?.maintenance_end_time);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Background Japanese Aesthetic Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with College Brand */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-10 pt-2 pb-4">
        <div className="flex items-center space-x-3">
          <img src={logoImg} alt="Yuzuki Japan College Logo" className="w-12 h-12 rounded-full object-contain drop-shadow-md shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-japanese">YUZUKI</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono">
                System Status
              </span>
            </div>
            <p className="text-xs text-rose-300/90 font-japanese">ゆづき日本カレッジ • Examination Platform</p>
          </div>
        </div>

        <button
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Checking...' : 'Refresh Status'}</span>
        </button>
      </div>

      {/* Main Content Box */}
      <div className="max-w-3xl mx-auto w-full my-auto z-10 py-6 space-y-6">
        
        {/* Status Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 bg-rose-500/15 border border-rose-500/30 text-rose-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide backdrop-blur-md shadow-inner animate-pulse">
            <Wrench className="w-4 h-4 text-rose-400" />
            <span>SYSTEM UPGRADE & MAINTENANCE IN PROGRESS</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-japanese tracking-tight leading-tight">
            {settings?.maintenance_title || 'පද්ධති නඩත්තු කටයුත්තක් සිදුවේ'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            {settings?.maintenance_message || 
              'වඩාත් වේගවත් හා උසස් විභාග අත්දැකීමක් ලබාදීම සඳහා පද්ධතියේ නඩත්තු කටයුත්තක් සිදුවෙමින් පවතී. ඉතා ඉක්මනින් විභාග පද්ධතිය නැවත සක්‍රීය වනු ඇත.'}
          </p>
        </div>

        {/* Countdown Timer Block (If end time is set) */}
        {settings?.maintenance_end_time && timeLeft.totalSeconds > 0 && (
          <div className="bg-slate-900/80 border border-rose-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl max-w-xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Estimated Platform Ready in:</span>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 shadow-inner">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Hours</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 shadow-inner">
                <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Minutes</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 shadow-inner">
                <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Seconds</div>
              </div>
            </div>

            {targetTimeFormatted && (
              <p className="text-xs text-slate-400">
                Expected Completion Time: <strong className="text-white font-mono font-bold">{targetTimeFormatted}</strong>
              </p>
            )}
          </div>
        )}

        {/* 🛡️ Unconditional Data & Student Protection Guarantee Box */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-emerald-950/60 border border-emerald-500/40 rounded-3xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-emerald-300 font-japanese">
                  සිසුන්ගේ සියලු දත්ත 100% ක් සුරක්ෂිතයි (All Student Data is 100% Preserved)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                මෙම නඩත්තු කටයුතු අතරතුරදී ඔබගේ <strong>ලියාපදිංචි ගිණුම (Registered Account), Student ID, සක්‍රීය දින (Subscription)</strong> සහ මෙතෙක් සිදුකළ <strong>විභාග ලකුණු (Exam History)</strong> කිසිදු වෙනසක් හෝ අඩුවක් නොවී SQLite දත්ත ගබඩාවේ ස්ථිරවම සුරක්ෂිතව පවතී.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-emerald-400/90 font-medium">
                <span className="flex items-center space-x-1 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Account Login Active</span>
                </span>
                <span className="flex items-center space-x-1 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Exam Records Safe</span>
                </span>
                <span className="flex items-center space-x-1 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Automatic Backups Running</span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer & Admin Bypass */}
      <div className="max-w-4xl mx-auto w-full z-10 pt-4 pb-2 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <p className="font-japanese">
          © {new Date().getFullYear()} YUZUKI Japan College • Japanese Language & CBT Exam Portal
        </p>
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-slate-400 hover:text-white flex items-center space-x-1 font-mono transition-colors text-[11px]"
            title="Administrator Sign In"
          >
            <Lock className="w-3 h-3 text-rose-500" />
            <span>Admin Sign In</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
