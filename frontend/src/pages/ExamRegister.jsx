import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI, examAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
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
  ArrowLeft,
  BookOpen,
  GraduationCap,
  MessageCircle,
  LogIn,
  Layers,
  CreditCard,
  Check,
  Clock,
  Award,
  HelpCircle,
  Shield,
  PlayCircle
} from 'lucide-react';
import JapaneseText from '../components/JapaneseText';

export default function ExamRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthData, refreshUser } = useAuth();

  // Wizard Step: 1 = Select Exam, 2 = Student Details, 3 = Review, 4 = Payment, 5 = Access Activated
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Exam Data from Backend
  const [examsList, setExamsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedExamType, setSelectedExamType] = useState('JFT'); // 'JFT', 'JLPT', 'SSW'
  const [selectedExam, setSelectedExam] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    nic_number: ''
  });

  // School Student State
  const [isSchoolStudent, setIsSchoolStudent] = useState(false);
  const [studentId, setStudentId] = useState('');

  // Post-Registration State
  const [registeredUser, setRegisteredUser] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('unpaid'); // 'unpaid', 'paid', 'free_access', 'school_free'
  const [paymentResult, setPaymentResult] = useState(null);
  const [payhereLoading, setPayhereLoading] = useState(false);

  // Load available exams and categories from database
  useEffect(() => {
    async function loadCatalog() {
      try {
        const [examsRes, catsRes] = await Promise.all([
          examAPI.getAvailable(),
          examAPI.getPortalCategories()
        ]);
        const allExams = examsRes.data.exams || [];
        const allCats = catsRes.data.categories || [];
        setExamsList(allExams);
        setCategoriesList(allCats);

        // Preselect if query param exists (e.g. ?examId=45 or ?exam=45)
        const paramExamId = searchParams.get('examId') || searchParams.get('exam') || searchParams.get('id');
        if (paramExamId) {
          const matched = allExams.find(e => String(e.id) === String(paramExamId));
          if (matched) {
            setSelectedExam(matched);
            if (matched.category?.includes('JFT') || matched.title?.includes('JFT')) setSelectedExamType('JFT');
            else if (matched.category?.includes('JLPT') || matched.is_free) setSelectedExamType('JLPT');
            else setSelectedExamType('SSW');
          }
        } else {
          // Default to Exam 45 (JFT Model Paper 03)
          const defaultEx = allExams.find(e => e.id === 45) || allExams[0];
          if (defaultEx) setSelectedExam(defaultEx);
        }
      } catch (err) {
        console.error('Failed to load exam catalog:', err);
      }
    }
    loadCatalog();
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
  };

  // Step 1 -> Step 2
  const handleProceedToDetails = () => {
    if (!selectedExam) {
      setError('Please select an examination to proceed.');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  // Step 2 -> Step 3 (Validation)
  const handleProceedToReview = (e) => {
    e.preventDefault();
    setError('');

    if (isSchoolStudent && (!studentId || !studentId.trim())) {
      setError('Please enter your official YUZUKI Student ID (e.g. YJP-2026-001).');
      return;
    }

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

    setCurrentStep(3);
  };

  // Step 3 -> Step 4 (Create Account)
  const handleCreateAccount = async () => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dob: formData.dob ? formData.dob.trim() : null,
        nic_number: formData.nic_number ? formData.nic_number.trim() : null,
        exam_id: selectedExam?.id,
        category_code: selectedExam?.category || 'JFT-BASIC',
        is_school_student: isSchoolStudent,
        student_id: isSchoolStudent ? studentId.trim().toUpperCase() : undefined
      };

      const res = await authAPI.registerExamPractice(payload);

      // Save user session in context
      if (res.data.token && res.data.user) {
        setAuthData(res.data.token, res.data.user);
      }

      setRegisteredUser({
        id: res.data.user?.id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        student_id: res.data.student_id,
        is_school_student: isSchoolStudent,
        status: res.data.user?.status
      });

      // Both school students and external candidates enter PENDING state upon registration
      // Flow: REGISTER -> PENDING ADMIN APPROVAL -> PAYMENT -> ACCESS
      const isFreeExam = Boolean(selectedExam?.is_free || ['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(selectedExam?.category));
      setPaymentStatus(isSchoolStudent ? 'school_free' : (isFreeExam ? 'free_access' : 'pending_approval'));
      setCurrentStep(5);
      try {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      } catch (e) {}

    } catch (err) {
      console.error('Registration error:', err);
      const serverMsg = err.response?.data?.error || 'Registration failed. Please try again or contact college support.';
      setError(serverMsg);
      setCurrentStep(2); // Go back to details to fix
    } finally {
      setLoading(false);
    }
  };

  // Step 4: PayHere Checkout
  const handlePaymentCheckout = async () => {
    setError('');
    setPayhereLoading(true);

    try {
      const categoryCode = selectedExam?.category || 'JFT-BASIC';

      // Initiate Official PayHere Checkout Session
      const checkoutRes = await paymentAPI.checkoutPracticePass({
        category_code: categoryCode,
        currency: 'USD'
      });

      const { payhere_params, checkout_url } = checkoutRes.data;

      // Auto-submit to PayHere Sandbox / Live Gateway Form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = checkout_url || 'https://sandbox.payhere.lk/pay/checkout';
      form.target = '_self';

      for (const [key, value] of Object.entries(payhere_params || {})) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Payment checkout error:', err);
      setError(err.response?.data?.error || 'Payment gateway connection failed. Please contact college support.');
    } finally {
      setPayhereLoading(false);
    }
  };

  // Filter exams for Step 1
  const jftExams = examsList.filter(e => e.category === 'JFT-BASIC' || e.title?.toUpperCase().includes('JFT') || e.course_id === 1);
  const jlptExams = examsList.filter(e => e.is_free || ['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(e.category) || e.title?.toUpperCase().includes('JLPT'));
  const sswExams = examsList.filter(e => e.category?.startsWith('SSW') || (!jftExams.some(x => x.id === e.id) && !jlptExams.some(x => x.id === e.id)));

  const currentExams = selectedExamType === 'JFT' ? jftExams : selectedExamType === 'JLPT' ? jlptExams : sswExams;

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 bg-cover bg-center font-japanese relative select-none"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98)), url(${samuraiBg})` }}
    >
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Top Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-1">
            <img 
              src={logoImg} 
              alt="YUZUKI Japan College Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain border border-rose-500/40 shadow-lg group-hover:scale-105 transition-transform shrink-0" 
            />
            <div className="text-left">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white block font-japanese">
                YUZUKI <span className="text-rose-500">EXAM PORTAL</span>
              </span>
              <span className="text-[11px] text-rose-300 font-mono">Official Prometric CBT Examination Simulator</span>
            </div>
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Student Exam Registration & Access Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Choose your target Japanese exam, create your student profile, and unlock full access with official timing and scoring.
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            
            <div className={`p-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              currentStep === 1 
                ? 'bg-rose-600 text-white shadow-md' 
                : currentStep > 1 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-slate-800/60 text-slate-400'
            }`}>
              {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : <span>1.</span>}
              <span className="hidden sm:inline">Select Exam</span>
            </div>

            <div className={`p-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              currentStep === 2 
                ? 'bg-rose-600 text-white shadow-md' 
                : currentStep > 2 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-slate-800/60 text-slate-400'
            }`}>
              {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : <span>2.</span>}
              <span className="hidden sm:inline">Student Details</span>
            </div>

            <div className={`p-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              currentStep === 3 
                ? 'bg-rose-600 text-white shadow-md' 
                : currentStep > 3 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-slate-800/60 text-slate-400'
            }`}>
              {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : <span>3.</span>}
              <span className="hidden sm:inline">Review & Create</span>
            </div>

            <div className={`p-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              currentStep >= 4 
                ? currentStep === 5 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                : 'bg-slate-800/60 text-slate-400'
            }`}>
              <span>4.</span>
              <span className="hidden sm:inline">{currentStep === 5 ? 'Access Active' : 'Payment & Start'}</span>
            </div>

          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-rose-950/90 border-2 border-rose-500/60 text-rose-200 rounded-2xl text-xs flex items-start space-x-3 shadow-lg animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Notice</p>
              <p className="mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: SELECT EXAM */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-japanese flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-rose-500" />
                  <span>Step 1: Choose Your Examination (විභාගය තෝරන්න)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select the exact exam model paper or category you wish to prepare for.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedExamType('JFT')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedExamType === 'JFT' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JFT-Basic A2 (Paid)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedExamType('JLPT')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedExamType === 'JLPT' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JLPT N5/N4/N3 (Free)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedExamType('SSW')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedExamType === 'SSW' ? 'bg-amber-500 text-slate-950 font-extrabold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SSW Prometric
                </button>
              </div>
            </div>

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
              {currentExams.map(exam => {
                const isSelected = selectedExam?.id === exam.id;
                const isFree = Boolean(exam.is_free || ['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(exam.category));

                return (
                  <div
                    key={exam.id}
                    onClick={() => handleSelectExam(exam)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50 scale-[1.01]'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="bg-slate-800 text-slate-300 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                            Exam ID: {exam.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isFree ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}>
                            {isFree ? '100% Free Practice' : 'USD 9.99 (30-Day Pass)'}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center shadow">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white font-japanese leading-snug">
                        {exam.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {exam.description || 'Full CBT timed examination model with instant grading and audio listening.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-mono">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        <span>{exam.duration_minutes || 60} Mins</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>{exam.question_count || 60} Questions</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <Award className="w-3.5 h-3.5" />
                        <span>Pass: {exam.passing_score || 200}/250</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selection Bar & Bottom Action */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                {selectedExam ? (
                  <span>
                    Selected: <strong className="text-rose-400 font-japanese">{selectedExam.title}</strong> (Exam ID: {selectedExam.id})
                  </span>
                ) : (
                  <span className="text-slate-500">Please click on an exam card above to select it.</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleProceedToDetails}
                disabled={!selectedExam}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Continue to Student Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: STUDENT DETAILS */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <form 
            onSubmit={handleProceedToReview} 
            className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 animate-fade-in"
          >
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-japanese flex items-center space-x-2">
                <User className="w-6 h-6 text-rose-500" />
                <span>Step 2: Candidate Information (ශිෂ්‍ය තොරතුරු)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Registering for: <strong className="text-rose-400 font-japanese">{selectedExam?.title}</strong> (Exam ID: {selectedExam?.id})
              </p>
            </div>

            {/* School Student Checkbox / Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white font-japanese">
                      Enrolled YUZUKI Japan College Student? (විද්‍යාලයේ සිසුවෙක්ද?)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Enrolled college students receive 30 Days 100% Free Practice Pass ($0.00).
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSchoolStudent}
                    onChange={(e) => setIsSchoolStudent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {isSchoolStudent && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2 animate-fade-in">
                  <label className="block text-xs font-medium text-amber-300">
                    Your Official YUZUKI Student ID (ශිෂ්‍ය අංකය) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <IdCard className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                      required={isSchoolStudent}
                      placeholder="e.g. YJP-2026-001 or YJP00305"
                      className="w-full bg-slate-900 border-2 border-amber-500/50 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-400">
                    ✨ Your Student ID will remain preserved throughout the platform and grant 30-Day Free CBT access.
                  </p>
                </div>
              )}
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
                  Mobile / WhatsApp (දුරකථන අංකය) <span className="text-rose-400">*</span>
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
                    placeholder="e.g. 0771234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password (මුරපදය) <span className="text-rose-400">*</span>
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
                  Confirm Password (මුරපදය තහවුරු කරන්න) <span className="text-rose-400">*</span>
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

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  National ID (NIC) <span className="text-slate-500 text-[10px]">(Optional)</span>
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
                    placeholder="e.g. 200012345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Date of Birth <span className="text-slate-500 text-[10px]">(Optional)</span>
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
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Exam Selection</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                <span>Review Order & Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: REVIEW & SUMMARY */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-japanese flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
                <span>Step 3: Review & Confirm Registration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Please verify your registration information and exam order details before account creation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Info Summary */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                  👤 Candidate Profile
                </span>
                <div className="text-xs space-y-2 text-slate-300">
                  <p>Full Name: <strong className="text-white">{formData.name}</strong></p>
                  <p>Email: <strong className="text-white">{formData.email}</strong></p>
                  <p>Phone: <strong className="text-white">{formData.phone}</strong></p>
                  {isSchoolStudent && (
                    <p>YUZUKI Student ID: <strong className="text-amber-300 font-mono">{studentId.trim().toUpperCase()}</strong> <span className="text-[10px] text-emerald-400">(School Student)</span></p>
                  )}
                  {formData.nic_number && <p>NIC: <strong className="text-white">{formData.nic_number}</strong></p>}
                  {formData.dob && <p>DOB: <strong className="text-white">{formData.dob}</strong></p>}
                </div>
              </div>

              {/* Selected Exam & Fee Summary */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block border-b border-slate-800 pb-2">
                  📝 Selected Exam Order
                </span>
                <div className="text-xs space-y-2 text-slate-300">
                  <p>Exam Name: <strong className="text-white font-japanese">{selectedExam?.title}</strong></p>
                  <p>Exam ID: <strong className="text-rose-400 font-mono">Exam {selectedExam?.id}</strong></p>
                  <p>Category: <strong className="text-white">{selectedExam?.category || 'JFT-BASIC'}</strong></p>
                  <p>Duration & Qs: <strong className="text-white">{selectedExam?.duration_minutes || 60} Mins • {selectedExam?.question_count || 60} Qs</strong></p>
                  <p>Scoring: <strong className="text-emerald-400 font-mono">250 Maximum Marks (Pass: 200 Marks)</strong></p>
                </div>
              </div>
            </div>

            {/* Fee & Gateway Highlight Box */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border-2 border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                  Total Payable Amount
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-0.5">
                  {isSchoolStudent ? (
                    <span className="text-emerald-400">FREE ACCESS ($0.00) <span className="text-xs text-amber-300 font-normal">/ YUZUKI Student 30-Day Benefit</span></span>
                  ) : selectedExam?.is_free || ['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(selectedExam?.category) ? (
                    <span className="text-emerald-400">FREE ACCESS ($0.00)</span>
                  ) : (
                    <span>USD $9.99 <span className="text-xs text-slate-400 font-normal">/ 30-Day Practice Pass</span></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isSchoolStudent
                    ? 'YUZUKI Japan College enrolled student benefits applied. 30-day practice pass included.'
                    : 'Includes full CBT exam simulator, listening audio, reading passages, and instant official scoring.'}
                </p>
              </div>

              {!isSchoolStudent && (
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block mb-1">PayHere Merchant Gateway</span>
                  <span className="inline-block bg-slate-800 text-slate-200 border border-slate-700 text-xs px-3 py-1 rounded-lg font-mono">
                    💳 Visa • Master • Amex • eZ Cash
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={loading}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Confirm & Create Account &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PAYMENT GATEWAY (PAYHERE) */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 animate-fade-in">
            <div className="border-b border-slate-800 pb-4 text-center">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                Account Created: {registeredUser?.student_id}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-japanese">
                Step 4: Complete Payment for Exam Access
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Unlock 30 days of unlimited mock exam practice for <strong className="text-rose-400 font-japanese">{selectedExam?.title}</strong>.
              </p>
            </div>

            {/* Payment Summary Box */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Candidate Student ID</span>
                <span className="text-sm font-bold text-amber-300 font-mono">{registeredUser?.student_id}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Target Examination</span>
                <span className="text-xs font-bold text-white font-japanese">{selectedExam?.title}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Duration & Validity</span>
                <span className="text-xs font-bold text-emerald-400">30-Day Unlimited Access Pass</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-slate-200">Amount Due</span>
                <span className="text-2xl font-extrabold text-white font-mono">USD $9.99</span>
              </div>
            </div>

            {/* Payment Gateway Action */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={payhereLoading}
                onClick={handlePaymentCheckout}
                className="w-full p-4 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {payhereLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold">Pay USD $9.99 via PayHere Gateway (Visa / Master / Amex / eZ Cash)</div>
                    <div className="text-[11px] text-rose-200">Secure checkout with Central Bank of Sri Lanka approved gateway</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: ACCESS ACTIVATED & DIRECT EXAM ENTRY */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-950 border border-amber-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
                {registeredUser?.is_school_student 
                  ? 'YUZUKI Enrolled Student • Pending Verification' 
                  : (selectedExam?.is_free ? 'Free JLPT Practice Registered' : 'Registration Received • Pending Admin Approval')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-japanese">
                {registeredUser?.is_school_student 
                  ? 'Registration Received! 🎓' 
                  : (selectedExam?.is_free ? 'Free Practice Ready! 🎉' : 'Registration Received! 📋 (承認待ち)')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {registeredUser?.is_school_student
                  ? `Welcome YUZUKI student ${registeredUser?.name || formData.name}! Your Student ID is ${registeredUser?.student_id}. Your account is pending verification by college administration. Once approved, your 30-Day Free CBT Practice Pass will be automatically activated.`
                  : (selectedExam?.is_free 
                      ? `Welcome ${registeredUser?.name || formData.name}! Your account is created and free JLPT practice is available immediately.`
                      : `Welcome ${registeredUser?.name || formData.name}! Your candidate registration is pending approval by YUZUKI Japan College administration. Once approved, you can log in, complete payment ($9.99 USD) via PayHere, and activate your 30-day exam practice pass.`)}
              </p>
            </div>

            {/* Candidate Summary Card */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 rounded-3xl border-2 border-amber-400/50 text-left max-w-lg mx-auto shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400 font-mono">YOUR STUDENT ID:</span>
                <span className="text-xl font-extrabold font-mono text-amber-300">{registeredUser?.student_id}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="text-slate-400">Registered Email:</span>
                <span className="text-white font-mono">{registeredUser?.email || formData.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="text-slate-400">Target Exam:</span>
                <span className="text-rose-400 font-bold font-japanese">{selectedExam?.title} (ID: {selectedExam?.id})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Access Status:</span>
                <span className="text-amber-400 font-bold">
                  {registeredUser?.is_school_student 
                    ? 'PENDING COLLEGE APPROVAL (FREE BENEFIT) 🎓' 
                    : (selectedExam?.is_free ? 'FREE ACCESS ENABLED 🚀' : 'PENDING ADMIN APPROVAL ⏳')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 max-w-lg mx-auto">
              {selectedExam?.is_free ? (
                <button
                  type="button"
                  onClick={() => navigate(`/exam/${selectedExam?.id || 2}`)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>START FREE EXAM NOW &rarr;</span>
                </button>
              ) : (
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-1 text-left">
                  <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Next Steps After Registration:</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    1. YUZUKI Japan College administration reviews your registration.<br/>
                    {registeredUser?.is_school_student
                      ? '2. Administration approves your student ID and activates your 30-Day Free Pass.'
                      : '2. Once approved, log in to your Student Dashboard to complete PayHere checkout ($9.99 USD) and unlock your exams.'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Layers className="w-4 h-4" />
                  <span>Go to Student Dashboard</span>
                </button>

                <Link
                  to="/login"
                  className="py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Test Login on Another Device</span>
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}