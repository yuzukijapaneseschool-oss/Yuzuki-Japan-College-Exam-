import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import samuraiBg from '../assets/japan_pagoda_bg.jpg';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  IdCard, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  GraduationCap,
  MessageCircle,
  LogIn,
  Layers
} from 'lucide-react';

export default function ExamRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    nic_number: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!formData.name || !formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (formData.name.trim().length < 2) {
      setError('Full name must be at least 2 characters long.');
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.phone || !formData.phone.trim()) {
      setError('Please enter your mobile/WhatsApp phone number.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dob: formData.dob ? formData.dob.trim() : null,
        nic_number: formData.nic_number ? formData.nic_number.trim() : null
      };

      const res = await authAPI.registerExamPractice(payload);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setRegisteredSuccess({
        student_id: res.data.student_id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        message: res.data.message
      });

    } catch (err) {
      console.error('Exam practice registration error:', err);
      const serverMsg = err.response?.data?.error || 'Registration failed. Please try again or contact support.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center font-japanese relative"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.94), rgba(2, 6, 23, 0.98)), url(${samuraiBg})` }}
    >
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        
        {/* Top Header Branding */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-2">
            <img 
              src={logoImg} 
              alt="YUZUKI Japan College Logo" 
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-contain border border-rose-500/40 shadow-lg group-hover:scale-105 transition-transform shrink-0" 
            />
            <div className="text-left">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white block font-japanese">
                YUZUKI <span className="text-rose-500">EXAM PORTAL</span>
              </span>
              <span className="text-xs text-rose-300 font-mono">Prometric Computer-Based Testing (CBT) Simulator</span>
            </div>
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Exam Practice Candidate Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Create your account for instant access to the YUZUKI Exam Portal. Practice <strong>Free JLPT N5 / N4 / N3</strong> mock exams or unlock official <strong>JFT-Basic & SSW Prometric CBT</strong> papers.
          </p>

          {/* Quick Context Switchers */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <Link 
              to="/existing-student" 
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-950/70 border border-emerald-500/40 px-3.5 py-1.5 rounded-full font-bold shadow-md transition-all hover:bg-emerald-900/80"
            >
              <span>🏛️ Already enrolled in College Classes?</span>
              <span className="underline font-bold text-amber-300">Activate Student ID &rarr;</span>
            </Link>

            <Link 
              to="/batch-register" 
              className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3.5 py-1.5 rounded-full font-medium transition-colors"
            >
              <span>Joining Classroom Batches?</span>
              <span className="underline font-bold">Batch Admissions (Rs. 5000 Slip) &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Registration Success View */}
        {registeredSuccess ? (
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-japanese">
                Account Created Successfully! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Welcome <strong>{registeredSuccess.name}</strong>! Your exam candidate portal profile is ready.
              </p>
            </div>

            {/* Generated Student ID Callout */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 rounded-3xl border-2 border-amber-400/50 text-center space-y-2 max-w-md mx-auto shadow-xl">
              <span className="text-[11px] uppercase tracking-widest text-amber-400 font-mono font-bold block">
                Your Exam Practice Student ID:
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-300 tracking-wider">
                {registeredSuccess.student_id}
              </div>
              <p className="text-[11px] text-slate-400">
                You can log in using either this <strong>Student ID</strong> or your email (<strong>{registeredSuccess.email}</strong>).
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left max-w-md mx-auto text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>What's Next?</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                1. Log in with your new credentials.<br />
                2. Practice all <strong>Free JLPT N5, N4, and N3</strong> mock exams with instant scoring.<br />
                3. Choose any specialized <strong>JFT-Basic or SSW CBT category pass</strong> whenever you are ready.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Proceed to Login (ඇතුල් වන්න) &rarr;</span>
                </Link>

                <Link
                  to="/portal"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Exam Catalog</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Registration Form View */
          <form 
            onSubmit={handleSubmit} 
            className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6"
          >
            {error && (
              <div className="p-4 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-2xl text-xs flex items-start space-x-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Section 1: Candidate Account Credentials */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm border-b border-slate-800 pb-2">
                <User className="w-4 h-4" />
                <span>1. Candidate Profile (ශිෂ්‍ය තොරතුරු)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name (සම්පූර්ණ නම) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Kasun Chamara Bandara"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address (විද්‍යුත් තැපෑල) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    WhatsApp / Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 077 123 4567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Optional Identity Information */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between text-slate-300 font-bold text-sm border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <IdCard className="w-4 h-4" />
                  <span>2. Additional Verification (Optional / අමතර තොරතුරු)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Optional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Date of Birth (උපන් දිනය) <span className="text-slate-500 text-[10px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    NIC or Passport Number <span className="text-slate-500 text-[10px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <IdCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="nic_number"
                      value={formData.nic_number}
                      onChange={handleChange}
                      placeholder="e.g. 200012345678 / N1234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Portal Security */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm border-b border-slate-800 pb-2">
                <Lock className="w-4 h-4" />
                <span>3. Portal Password (මුරපදය)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Confirm Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Repeat password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Information Notice */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>What is included with your account:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
                <li>Instant Free Access to <strong>JLPT N5, N4, and N3</strong> practice exams.</li>
                <li>Single-device secure login with individual attempt logs and timer simulator.</li>
                <li>Option to unlock 1-Month Prometric CBT Practice Passes (JFT-Basic / SSW) anytime.</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-700 hover:to-rose-900 text-white rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-rose-950 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Exam Practice Account 🚀</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer Navigation */}
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80 space-y-2">
              <div>
                Already registered with YUZUKI?{' '}
                <Link to="/login" className="text-rose-400 hover:text-rose-300 underline font-bold">
                  Sign In to Exam Portal &rarr;
                </Link>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}