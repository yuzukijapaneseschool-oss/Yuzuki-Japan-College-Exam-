import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authAPI, courseAPI, paymentAPI } from '../services/api';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import samuraiBg from '../assets/japan_pagoda_bg.jpg';
import { 
  Laptop, 
  CreditCard, 
  Mail, 
  Lock, 
  User, 
  BookOpen, 
  Phone, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Globe
} from 'lucide-react';

export default function ExamRegister() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Online / International',
    course_id: '',
    password: '',
    confirmPassword: ''
  });

  const [cardData, setCardData] = useState({
    cardNumber: '4532 •••• •••• 4242',
    cardHolder: '',
    expiry: '08/29',
    cvv: '772'
  });

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await courseAPI.getAll();
        setCourses(res.data.courses || []);
        if (res.data.courses && res.data.courses.length > 0) {
          setFormData(prev => ({ ...prev, course_id: res.data.courses[0].id }));
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    }
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'name' && !cardData.cardHolder) {
      setCardData(prev => ({ ...prev, cardHolder: e.target.value }));
    }
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleQuickFillCard = (type) => {
    if (type === 'visa') {
      setCardData({ ...cardData, cardNumber: '4532 8821 9043 4242', expiry: '08/29', cvv: '772' });
    } else if (type === 'master') {
      setCardData({ ...cardData, cardNumber: '5312 9940 1209 8831', expiry: '11/28', cvv: '419' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.course_id) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 1. Register student in DB
      const regRes = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        course_id: parseInt(formData.course_id, 10),
        city: formData.city.trim() || 'Online'
      });

      const token = regRes.data.token;
      if (token) {
        localStorage.setItem('yuzuki_token', token);
      }

      // 2. Process $9.99 Card Payment
      await axios.post('/api/payments/checkout', {
        amount: 9.99,
        currency: 'USD',
        paymentMethod: 'Credit / Debit Card (Visa/Master)',
        cardHolder: cardData.cardHolder || formData.name,
        lastFour: cardData.cardNumber.slice(-4) || '4242'
      }, {
        headers: { Authorization: 'Bearer ' + token }
      });

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (err) {
      console.error('Registration/Payment error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please check your details or try another card.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center font-japanese relative"
      style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.94), rgba(2, 6, 23, 0.98)), url(' + samuraiBg + ')' }}
    >
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-2">
            <img src={logoImg} alt="YUZUKI Logo" className="w-12 h-12 rounded-2xl object-contain border border-rose-500/40 shadow-lg group-hover:scale-105 transition-transform" />
            <div className="text-left">
              <span className="font-extrabold text-xl tracking-tight text-white block">
                YUZUKI <span className="text-rose-500">EXAM PORTAL</span>
              </span>
              <span className="text-xs text-rose-300 font-mono">Prometric Computer-Based Testing (CBT) Simulator</span>
            </div>
          </Link>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Online CBT Exam Candidate Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Practice official <strong>JFT-Basic A2 (Paper 20 with Audio) & JLPT</strong> mock exams. Get instant 30-Day access with <strong>Card Payment ($9.99 / Month)</strong>!
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
            <Link to="/existing-student" className="inline-flex items-center space-x-1.5 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-950/70 border border-emerald-500/40 px-4 py-1.5 rounded-full font-bold shadow-md transition-all hover:bg-emerald-900/80">
              <span>🏛️ Already a College Student?</span>
              <span className="underline font-black text-amber-300">Activate Your Student ID (No Fee) &rarr;</span>
            </Link>

            <Link to="/batch-register" className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3.5 py-1.5 rounded-full font-medium transition-colors">
              <span>Looking to enroll in Classes?</span>
              <span className="underline font-bold">Batch Admissions (Rs. 5000 Slip) &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-8 shadow-2xl text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Payment Confirmed & 30-Day Exam Pass Active! 🎉
            </h2>
            <p className="text-sm text-slate-300">
              Welcome to the YUZUKI Exam Room. Redirecting to your Student Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
            
            {error && (
              <div className="p-4 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-2xl text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Candidate Account Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm border-b border-slate-800 pb-2">
                <User className="w-4 h-4" />
                <span>1. Candidate Account Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name (සම්පූර්ණ නම) *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Kasun Bandara"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address (විද්‍යුත් තැපෑල) *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 077 123 4567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Exam Track *</label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Password (මුරපදය) *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password (මුරපදය තහවුරු කරන්න) *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: 30-Day Exam Pass ($9.99 Card Checkout) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>2. Online Exam Pass Checkout ($9.99 / Month)</span>
                </div>
                <span className="text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono">
                  Instant 30-Day Access
                </span>
              </div>

              {/* Price Tag Box */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white text-sm">Unlimited Prometric CBT Mock Simulator Access</div>
                  <div className="text-xs text-slate-300">Official 60-Minute papers, Choukai Audio Player, Instant Scoring & Review</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">$9.99 <span className="text-xs text-slate-400 font-normal">/ Month</span></div>
                  <div className="text-[10px] text-emerald-400">Card Payment (Visa / Mastercard)</div>
                </div>
              </div>

              {/* Quick Fill Test Cards */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span>Quick fill test card:</span>
                <button
                  type="button"
                  onClick={() => handleQuickFillCard('visa')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg font-mono font-bold transition-colors"
                >
                  💳 Visa (••• 4242)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillCard('master')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg font-mono font-bold transition-colors"
                >
                  💳 Master (••• 8831)
                </button>
              </div>

              {/* Card Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Card Number (කාඩ්පත් අංකය) *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    required
                    placeholder="4532 8821 9043 4242"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Cardholder Name *</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={cardData.cardHolder || formData.name}
                    onChange={handleCardChange}
                    required
                    placeholder="Name on card"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Expiry (MM/YY) *</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      required
                      placeholder="12/28"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono text-center focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">CVV *</label>
                    <input
                      type="password"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      required
                      maxLength="4"
                      placeholder="883"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono text-center focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-700 hover:to-rose-900 text-white rounded-2xl font-bold text-sm sm:text-base shadow-2xl flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-amber-300" />
                    <span>Pay $9.99 with Card & Activate 30-Day Exam Pass 🚀</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-rose-400 hover:text-rose-300 underline font-semibold">
                Sign In to Exam Portal &rarr;
              </Link>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}