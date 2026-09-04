import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, courseAPI } from '../services/api';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import samuraiBg from '../assets/japan_pagoda_bg.jpg';
import { 
  IdCard, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  GraduationCap, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  Building, 
  Laptop,
  Check,
  Info
} from 'lucide-react';

export default function ExistingStudentRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    nic_number: '',
    city: 'Kandy',
    password: '',
    confirmPassword: ''
  });

  // Track detection: 'YTD' -> Truck Driving (7), 'YJP' -> Japanese (1)
  const [detectTrack, setDetectTrack] = useState('YJP');

  const handleStudentIdChange = (e) => {
    const val = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, student_id: val }));

    if (val.startsWith('YTD')) {
      setDetectTrack('YTD');
    } else if (val.startsWith('YJP')) {
      setDetectTrack('YJP');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanId = formData.student_id.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter your official College Student ID (e.g. YJP-001 or YTD-001).');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in your Full Name and Email Address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const isTruck = cleanId.startsWith('YTD') || detectTrack === 'YTD';
      const assignedCourseId = isTruck ? 7 : 1;

      const payload = {
        student_id: cleanId,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        nic_number: formData.nic_number.trim(),
        city: formData.city.trim(),
        course_id: assignedCourseId,
        password: formData.password
      };

      const res = await authAPI.registerExisting(payload);

      // Save token & user for automatic instant login
      if (res.data.token) {
        localStorage.setItem('yuzuki_token', res.data.token);
        localStorage.setItem('yuzuki_user', JSON.stringify(res.data.user));
      }

      // Trigger Confetti
      try {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setSuccessData({
        student_id: res.data.student_id,
        name: formData.name,
        email: formData.email,
        track_name: isTruck ? 'SSW Truck Driving & Logistics (19 Exams / 583 Furigana Qs)' : 'Japanese Language (JFT-Basic / JLPT N5)',
        message: res.data.message
      });

    } catch (err) {
      console.error('Activation failed:', err);
      setError(err.response?.data?.error || 'Activation failed. Please check your Student ID or contact College administration.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (successData) {
    return (
      <div 
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative font-japanese"
        style={{ backgroundImage: `url(${samuraiBg})` }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

        <div className="max-w-xl w-full relative z-10 py-8">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border-2 border-emerald-500/40 shadow-2xl text-white text-center space-y-6">
            
            <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Portal Activated • 30-Day Pass Unlocked
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-japanese">
                සාදරයෙන් පිළිගනිමු! (Welcome)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ඔබගේ <strong>Student ID ({successData.student_id})</strong> එක සාර්ථකව සක්‍රීය විය. ඉදිරි <strong>දින 30 පුරා</strong> ඔබට නියමිත විභාග පුහුණුවීම් සිදු කළ හැක.
              </p>
            </div>

            {/* Student ID Card Badge */}
            <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="text-xs text-slate-400">Official Student ID</span>
                <span className="text-base font-mono font-black text-amber-400 tracking-wider">
                  {successData.student_id}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="text-xs text-slate-400">Student Name</span>
                <span className="text-sm font-bold text-white">
                  {successData.name}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="text-xs text-slate-400">Authorized Track</span>
                <span className="text-xs font-bold text-emerald-300 truncate max-w-[240px]">
                  {successData.track_name}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>CBT Exam Simulation Pass:</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline" />
                  <span>30-Day Active Exam Pass (Free)</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>🚀 Launch CBT Exam Simulation Room (විභාග අරඹන්න)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-[11px] text-slate-400 font-japanese">
              * මීළඟ වතාවේදී ඔබගේ <strong>Student ID ({successData.student_id})</strong> සහ සකස් කළ Password එක මගින් Login විය හැක.
            </p>

          </div>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM
  const isTruckDetected = formData.student_id.toUpperCase().startsWith('YTD') || detectTrack === 'YTD';

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat relative font-japanese"
      style={{ backgroundImage: `url(${samuraiBg})` }}
    >
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />

      <div className="max-w-3xl w-full relative z-10 py-8">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-block p-2 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-rose-600/40 shadow-2xl mb-3">
            <img 
              src={logoImg} 
              alt="YUZUKI Japan College Logo" 
              className="w-20 h-20 object-contain mx-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-japanese drop-shadow-lg">
            YUZUKI JAPAN COLLEGE
          </h1>
          <p className="text-xs sm:text-sm text-rose-300 font-medium font-japanese mt-0.5 drop-shadow">
            🏛️ Existing Student Portal Activation (පවතින සිසුන් සක්‍රීය කරගැනීම)
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/40 space-y-6">
          
          {/* Prefix Verification Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-2xl border-2 transition-all ${
              !isTruckDetected ? 'border-rose-500 bg-rose-50 shadow-sm' : 'border-slate-200 bg-slate-50 opacity-75'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md font-mono font-black text-xs bg-rose-600 text-white">
                  YJP-XXXXX
                </span>
                <span className="text-xs font-bold text-slate-900">Japanese Language Track</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                JFT-Basic A2 & JLPT N5 Official CBT Mock Papers
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl border-2 transition-all ${
              isTruckDetected ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-slate-200 bg-slate-50 opacity-75'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md font-mono font-black text-xs bg-amber-600 text-white">
                  YTD-XXXXX
                </span>
                <span className="text-xs font-bold text-slate-900">Truck Driving Track</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                SSW Truck Driving 19 Modules (583 Furigana Questions)
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs sm:text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Activation Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Student ID & Identity */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <IdCard className="w-4 h-4 text-rose-600" />
                  <span>1. Student ID & Track Matching</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Existing Student ID Input */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    College Student ID (YJP or YTD) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="student_id"
                      required
                      placeholder="e.g. YJP-2026-001 or YTD-001"
                      value={formData.student_id}
                      onChange={handleStudentIdChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-rose-400/60 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 text-slate-900 font-mono font-bold placeholder:text-slate-400 text-sm outline-none bg-rose-50/20 uppercase"
                    />
                  </div>
                  
                  {/* Dynamic Match Badge */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Auto-detected Course Track:</span>
                    {isTruckDetected ? (
                      <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                        <Truck className="w-3.5 h-3.5 inline mr-1" />
                        <span>SSW Truck Driving (Exams 19 / 583 Qs)</span>
                      </span>
                    ) : (
                      <span className="font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                        <GraduationCap className="w-3.5 h-3.5 inline mr-1" />
                        <span>Japanese Language (JFT / JLPT)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* If ID does not have YJP or YTD prefix, allow manual track toggle */}
                {!formData.student_id.toUpperCase().startsWith('YTD') && !formData.student_id.toUpperCase().startsWith('YJP') && formData.student_id.length > 0 && (
                  <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Select your College Enrolled Stream:
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setDetectTrack('YJP')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                          detectTrack === 'YJP' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        🇯🇵 Japanese Language (YJP)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetectTrack('YTD')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                          detectTrack === 'YTD' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        🚛 Truck Driving (YTD)
                      </button>
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name (සම්පූර්ණ නම) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Kasun Chamara"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address (විද්‍යුත් ලිපිනය) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. kasun@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Mobile / WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp / Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="07X XXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* NIC Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    NIC / Passport No (හැඳුනුම්පත් අංකය)
                  </label>
                  <input
                    type="text"
                    name="nic_number"
                    placeholder="e.g. 2000XXXXXXXX or NXXXXXX"
                    value={formData.nic_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Set Password */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-rose-600" />
                  <span>2. Create Exam Portal Password</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    New Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-slate-900 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-700 hover:to-rose-900 text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-xl shadow-rose-600/30 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Activate 30-Day CBT Exam Pass (සක්‍රීය කරන්න)</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation Links */}
          <div className="border-t border-slate-200/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <div>
              Already have an active login?{' '}
              <Link to="/login" className="font-bold text-rose-600 hover:underline">
                Sign In here
              </Link>
            </div>
            <div>
              New student applying for admission?{' '}
              <Link to="/batch-register" className="font-bold text-slate-900 hover:underline">
                New Admission Registration
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
