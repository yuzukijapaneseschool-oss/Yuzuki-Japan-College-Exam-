import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/api';
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Power, 
  Save, 
  AlertTriangle, 
  Database, 
  Download, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  FileCheck, 
  BellRing,
  Sparkles,
  Info,
  Calendar,
  Layers,
  RotateCcw
} from 'lucide-react';

export default function SystemSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [backupMsg, setBackupMsg] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);

  const [formData, setFormData] = useState({
    maintenance_mode: false,
    maintenance_title: 'YUZUKI Japan College - System Maintenance (පද්ධති නඩත්තු කටයුත්තක්)',
    maintenance_message: 'පද්ධතියේ නඩත්තු කටයුත්තක් සිදුවෙමින් පවතී. ඔබගේ සියලුම ගිණුම් විස්තර, ලියාපදිංචි සහ විභාග ලකුණු 100% ක් සුරක්ෂිතව ඇත. ඉතා ඉක්මනින් විභාග පද්ධතිය නැවත සක්‍රීය වනු ඇත.',
    maintenance_start_time: '',
    maintenance_end_time: '',
    maintenance_duration_minutes: 60,
    show_banner_alert: false,
    banner_alert_text: '📢 දැනුම්දීමයි: ඉදිරි පැය කිහිපය තුළ පද්ධතියේ නඩත්තු කටයුත්තක් සිදු කෙරේ. ඔබගේ ගිණුම් සහ විභාග දත්ත 100% ක් සුරක්ෂිතයි.',
    allow_admin_bypass: true
  });

  const [stats, setStats] = useState({
    total_students: 0,
    approved_students: 0,
    pending_students: 0,
    total_exams: 0,
    total_attempts: 0,
    total_payments: 0,
    total_backups: 0,
    latest_backup: null
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsAPI.getAdmin();
      if (res.data?.settings) {
        setFormData({
          ...res.data.settings,
          maintenance_start_time: res.data.settings.maintenance_start_time || '',
          maintenance_end_time: res.data.settings.maintenance_end_time || ''
        });
      }
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccessMsg('');
    try {
      await settingsAPI.updateAdmin(formData);
      setSaveSuccessMsg('✓ System settings updated successfully! (සැකසුම් සාර්ථකව සුරැකිණි)');
      setTimeout(() => setSaveSuccessMsg(''), 5000);
      fetchSettings();
    } catch (err) {
      alert('Failed to save settings: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleQuickPresetDuration = (minutes) => {
    const now = new Date();
    const future = new Date(now.getTime() + minutes * 60 * 1000);

    // Format to YYYY-MM-DDTHH:MM for input datetime-local
    const formatLocal = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setFormData(prev => ({
      ...prev,
      maintenance_start_time: formatLocal(now),
      maintenance_end_time: formatLocal(future),
      maintenance_duration_minutes: minutes
    }));
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    setBackupMsg('');
    try {
      const res = await settingsAPI.createBackup();
      setBackupMsg(`✓ ${res.data.message} (${res.data.filename} - ${res.data.size_kb} KB)`);
      setTimeout(() => setBackupMsg(''), 6000);
      fetchSettings();
    } catch (err) {
      alert('Backup failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsBackingUp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-500 font-japanese">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading System Settings & Health Monitor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-japanese tracking-tight">
              System Settings & Maintenance
            </h1>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono flex items-center space-x-1 ${
              formData.maintenance_mode 
                ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${formData.maintenance_mode ? 'bg-rose-600' : 'bg-emerald-600'}`} />
              <span>{formData.maintenance_mode ? 'Maintenance Active' : 'System Online'}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">
            Control maintenance windows, scheduled countdown timers, warning alerts, and student data protection.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-sm font-semibold flex items-center space-x-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 🛡️ Student Data Health & Persistence Reassurance Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-japanese">
                Student Accounts & Data Persistence Engine
              </h2>
              <p className="text-xs text-slate-300">
                All registered students, attempts, and subscription logs are strictly safeguarded in SQLite.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateBackup}
            disabled={isBackingUp}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Database className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
            <span>{isBackingUp ? 'Creating Backup...' : 'Instant DB Backup Snapshot'}</span>
          </button>
        </div>

        {backupMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-600/60 text-emerald-200 rounded-xl text-xs font-mono">
            {backupMsg}
          </div>
        )}

        {/* Live Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-2xl font-black text-white font-mono">{stats.total_students}</div>
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Total Students</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-2xl font-black text-emerald-400 font-mono">{stats.approved_students}</div>
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Approved & Active</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-2xl font-black text-amber-400 font-mono">{stats.total_attempts}</div>
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Exam Attempts</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-2xl font-black text-rose-400 font-mono">{stats.total_exams}</div>
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mt-1">Exams Configured</div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
          <span>Database Integrity: <strong className="text-emerald-400">100% Active & Protected</strong></span>
          {stats.latest_backup && (
            <span>Last Snapshot: <strong className="text-slate-300 font-mono">{new Date(stats.latest_backup.created_at).toLocaleString()}</strong></span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: Master Maintenance Mode Toggle */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                formData.maintenance_mode ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
              }`}>
                <Power className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-japanese">
                  Maintenance Mode Switch (නඩත්තු ප්‍රකාරය සක්‍රීය / අක්‍රීය කිරීම)
                </h2>
                <p className="text-xs text-slate-500">
                  When enabled, regular students will see the Maintenance screen. Admins can still access all portal features.
                </p>
              </div>
            </div>

            {/* Big Switch */}
            <div className="flex items-center space-x-3">
              <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
                formData.maintenance_mode ? 'text-rose-600' : 'text-slate-500'
              }`}>
                {formData.maintenance_mode ? 'ON (Maintenance Active)' : 'OFF (Live)'}
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, maintenance_mode: !prev.maintenance_mode }))}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer relative shadow-inner ${
                  formData.maintenance_mode ? 'bg-rose-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    formData.maintenance_mode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Maintenance Notice Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Maintenance Screen Title (ශීර්ෂ පාඨය)
              </label>
              <input
                type="text"
                value={formData.maintenance_title}
                onChange={(e) => setFormData({ ...formData, maintenance_title: e.target.value })}
                placeholder="e.g. YUZUKI Japan College - System Maintenance (පද්ධති නඩත්තු කටයුත්තක්)"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-japanese outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Maintenance Explanation Message (සිසුන්ට දිස්වන විස්තරය / නිවේදනය)
              </label>
              <textarea
                rows="3"
                value={formData.maintenance_message}
                onChange={(e) => setFormData({ ...formData, maintenance_message: e.target.value })}
                placeholder="e.g. පද්ධතියේ නඩත්තු කටයුත්තක් සිදුවෙමින් පවතී. ඔබගේ සියලු දත්ත 100% ක් සුරක්ෂිතයි..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-sans outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 2: Maintenance Time & Duration Scheduler */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>Maintenance Schedule & Live Countdown Timer (නඩත්තු කාලසීමාව)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Set an estimated completion time so students see a dynamic countdown timer (Hours:Minutes:Seconds).
                </p>
              </div>
            </div>

            {/* Quick Duration Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold mr-1">Quick Presets:</span>
              {[
                { label: '+30 Minutes', mins: 30 },
                { label: '+1 Hour', mins: 60 },
                { label: '+2 Hours', mins: 120 },
                { label: '+4 Hours', mins: 240 },
                { label: '+8 Hours', mins: 480 }
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleQuickPresetDuration(preset.mins)}
                  className="px-3 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer active:scale-95"
                >
                  {preset.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, maintenance_start_time: '', maintenance_end_time: '' }))}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-medium transition-all"
              >
                Clear Times
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maintenance Start Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.maintenance_start_time}
                  onChange={(e) => setFormData({ ...formData, maintenance_start_time: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated End Time (Countdown Target)
                </label>
                <input
                  type="datetime-local"
                  value={formData.maintenance_end_time}
                  onChange={(e) => setFormData({ ...formData, maintenance_end_time: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 3: Advance Warning Announcement Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-japanese">
                  Advance Maintenance Alert Banner (කලින් දැනුම්දීමේ බැනරය)
                </h2>
                <p className="text-xs text-slate-500">
                  Display a top announcement bar to inform students in advance before maintenance begins.
                </p>
              </div>
            </div>

            {/* Banner Toggle */}
            <div className="flex items-center space-x-3">
              <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
                formData.show_banner_alert ? 'text-amber-700' : 'text-slate-500'
              }`}>
                {formData.show_banner_alert ? 'BANNER ON' : 'BANNER OFF'}
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, show_banner_alert: !prev.show_banner_alert }))}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer relative shadow-inner ${
                  formData.show_banner_alert ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    formData.show_banner_alert ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Banner Alert Message (බැනරයේ පෙන්වන පණිවිඩය)
            </label>
            <input
              type="text"
              value={formData.banner_alert_text}
              onChange={(e) => setFormData({ ...formData, banner_alert_text: e.target.value })}
              placeholder="e.g. 📢 දැනුම්දීමයි: අද රාත්‍රී 10:00 සිට 10:30 දක්වා පද්ධතියේ නඩත්තු කටයුත්තක් සිදු කෙරේ. සිසුන්ගේ සියලු දත්ත සුරක්ෂිතයි."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Banner Live Preview */}
          {formData.show_banner_alert && formData.banner_alert_text && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live Banner Preview:</span>
              <div className="bg-gradient-to-r from-amber-600 to-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />
                <span>{formData.banner_alert_text}</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            Changes take effect immediately across all student screens and public pages.
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
