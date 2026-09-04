import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authAPI, courseAPI } from '../services/api';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import samuraiBg from '../assets/japan_pagoda_bg.jpg';
import AdmissionCardModal from '../components/AdmissionCardModal';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  BookOpen, 
  Phone, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  Building, 
  Upload, 
  FileText, 
  MapPin, 
  IdCard, 
  MessageCircle, 
  Laptop, 
  X,
  Truck,
  HeartPulse,
  UtensilsCrossed,
  Hotel,
  Wheat,
  Wrench,
  Plane,
  ShieldAlert,
  Printer
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  // Course configuration with locked/recommended study mode
  const courseOptions = [
    {
      id: 1,
      name: '🇯🇵 Japanese Language Mastery (JFT-Basic A2 / JLPT N5-N3 / NAT)',
      code: 'JFT-JLPT-NAT',
      mode: 'physical_kandy',
      modeLabel: '🏛️ Physical Classroom (Kandy Campus)',
      modeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: GraduationCap,
      desc: 'Comprehensive Japanese script, grammar, Kaiwa conversation, and listening in our air-conditioned Kandy smart classrooms.'
    },
    {
      id: 7,
      name: '🚛 SSW Truck Driving & Logistics (自動車運送業・トラック運転)',
      code: 'SSW-TRUCK-DRIVING',
      mode: 'physical_kandy',
      modeLabel: '🏛️ Physical Classroom & Training (Kandy Campus)',
      modeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Truck,
      desc: 'Specialized logistics Japanese, freight regulations, road safety, and driver interview training in Kandy.'
    },
    {
      id: 8,
      name: '🏥 SSW Nursing Care / Caregiver (介護 - Kaigo)',
      code: 'SSW-CAREGIVER',
      mode: 'online_zoom',
      modeLabel: '💻 Online Interactive Live (Zoom)',
      modeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: HeartPulse,
      desc: 'Elderly care communication, nursing terminology, and live Zoom lecture sessions with recorded archives.'
    },
    {
      id: 11,
      name: '🍳 SSW Food Service & Restaurant Operations (外食業)',
      code: 'SSW-FOOD-SERVICE',
      mode: 'online_zoom',
      modeLabel: '💻 Online Interactive Live (Zoom)',
      modeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      icon: UtensilsCrossed,
      desc: 'Kitchen safety, culinary terms, food hygiene standards (HACCP), and customer order management via live Zoom.'
    },
    {
      id: 9,
      name: '🏨 SSW Accommodation & Hospitality (宿泊業)',
      code: 'SSW-ACCOMMODATION',
      mode: 'online_zoom',
      modeLabel: '💻 Online Interactive Live (Zoom)',
      modeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Hotel,
      desc: 'Hospitality Japanese (Omotenashi), front desk customer service, and Japanese honorifics (Keigo).'
    },
    {
      id: 5,
      name: '🌾 SSW Agriculture & Farming (農業 - Nogyo)',
      code: 'SSW-AGRICULTURE',
      mode: 'online_zoom',
      modeLabel: '💻 Online Interactive Live (Zoom)',
      modeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      icon: Wheat,
      desc: 'Crop cultivation, livestock handling, agricultural machinery, and farm management Japanese.'
    },
    {
      id: 6,
      name: '🚗 SSW Automobile Repair & Maintenance (自動車整備)',
      code: 'SSW-AUTOMOBILE',
      mode: 'online_zoom',
      modeLabel: '💻 Online Interactive Live (Zoom)',
      modeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: Wrench,
      desc: 'Automotive diagnostics, engine terminology, safety protocols, and mechanical repair Japanese.'
    },
    {
      id: 10,
      name: '✈️ SSW Airport Ground Handling & Aviation (航空業)',
      code: 'SSW-AIRPORT-GROUND',
      mode: 'online_zoom',
      modeLabel: '💻 Online Interactive Live (Zoom)',
      modeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: Plane,
      desc: 'Ramp services, baggage handling operations, tarmac safety signals, and international airport communication.'
    }
  ];

  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nic_number: '',
    city: 'Kandy',
  });

  // Slip upload state
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await courseAPI.getAll();
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    }
    loadCourses();
  }, []);

  const handleSlipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipFile(file);
      if (file.type.startsWith('image/')) {
        setSlipPreview(URL.createObjectURL(file));
      } else {
        setSlipPreview('pdf_doc');
      }
    }
  };

  const removeSlip = () => {
    setSlipFile(null);
    setSlipPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!slipFile) {
      setError('Please upload your Bank Deposit Slip or Online Transfer Receipt for the Rs. 5,000 registration fee.');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Slip file
      setUploadingSlip(true);
      const slipFormData = new FormData();
      slipFormData.append('slip', slipFile);

      const uploadRes = await axios.post('/api/auth/upload-slip', slipFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedSlipUrl = uploadRes.data.url;
      setUploadingSlip(false);

      const chosen = courseOptions[selectedCourseIndex];

      // 2. Submit Registration
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        nic_number: formData.nic_number,
        city: formData.city,
        course_id: chosen.id,
        batch_mode: chosen.mode,
        bank_slip_url: uploadedSlipUrl
      };

      const res = await authAPI.register(payload);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setRegisteredSuccess({
        student_id: res.data.student_id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course_name: chosen.name,
        batch_mode: chosen.modeLabel,
        message: res.data.message
      });

    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.error || 'Registration failed. Please check your details or call our Kandy campus.');
    } finally {
      setLoading(false);
      setUploadingSlip(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center font-japanese relative"
      style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.98)), url(' + samuraiBg + ')' }}
    >
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">

        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-2">
            <img src={logoImg} alt="YUZUKI Logo" className="w-12 h-12 rounded-2xl object-contain border border-rose-500/40 shadow-lg group-hover:scale-105 transition-transform" />
            <div className="text-left">
              <span className="font-extrabold text-xl tracking-tight text-white block">
                YUZUKI <span className="text-rose-500">Japan College</span>
              </span>
              <span className="text-xs text-rose-300 font-mono">Kandy Campus • 2026 Batch Admissions</span>
            </div>
          </Link>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Next Batch Online Admission & Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Register for upcoming batches. Deposit the <strong>Rs. 5,000 Admission Fee</strong> to our bank account and upload your deposit slip to receive your official <strong>YJP Student ID</strong>!
          </p>

          <div className="pt-2">
            <Link to="/existing-student" className="inline-flex items-center space-x-1.5 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-950/80 border border-emerald-500/50 px-4 py-2 rounded-full font-bold shadow-lg transition-all hover:bg-emerald-900">
              <span>🏛️ Already enrolled with a Student ID?</span>
              <span className="underline font-black text-amber-300">Activate CBT Exam Access (No Fee) &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Success Screen */}
        {registeredSuccess ? (
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Registration & Deposit Slip Received! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Thank you <strong>{registeredSuccess.name}</strong>! Your batch registration for <strong>{registeredSuccess.course_name}</strong> has been submitted.
              </p>
            </div>

            {/* Official Student ID Box */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 rounded-3xl border-2 border-amber-400/50 text-center space-y-2 max-w-md mx-auto shadow-xl">
              <span className="text-[11px] uppercase tracking-widest text-amber-400 font-mono font-bold block">
                Your Official YUZUKI Student ID:
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-300 tracking-wider">
                {registeredSuccess.student_id}
              </div>
              <p className="text-[11px] text-slate-400">
                Please save this Student ID for CBT mock exams and campus records.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left space-y-2 max-w-md mx-auto text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Full Name:</span>
                <span className="text-white font-bold">{registeredSuccess.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Batch Mode:</span>
                <span className="text-white">{registeredSuccess.batch_mode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Admission Fee:</span>
                <span className="text-emerald-400 font-bold">Rs. 5,000 (Paid via Bank Deposit)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Pending Slip Verification
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print Official Admission Slip 📄</span>
                </button>

                <a
                  href={'https://wa.me/94773539800?text=' + encodeURIComponent('Hello YUZUKI College (Kandy), I just registered for the new batch and uploaded my Rs. 5000 bank deposit slip! My Student ID is: ' + registeredSuccess.student_id + ' (' + registeredSuccess.name + ')')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm on WhatsApp</span>
                </a>
              </div>

              <div>
                <Link
                  to="/login"
                  className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold block mt-3"
                >
                  Go to Student Login &rarr;
                </Link>
              </div>
            </div>

            {/* Admission Card Print Modal */}
            <AdmissionCardModal
              isOpen={showAdmissionModal}
              onClose={() => setShowAdmissionModal(false)}
              studentData={registeredSuccess}
            />
          </div>
        ) : (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">

            {error && (
              <div className="mb-6 p-4 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-2xl text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              {/* 1. Student Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-slate-300 font-bold text-sm">
                  <User className="w-4 h-4 text-rose-500" />
                  <span>1. Student Personal Details (ශිෂ්‍ය තොරතුරු)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Full Name (සම්පූර්ණ නම) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Bandara"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">NIC / Passport Number (හැඳුනුම්පත් අංකය) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 200123456789 / 981234567V"
                      value={formData.nic_number}
                      onChange={(e) => setFormData({ ...formData, nic_number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">WhatsApp / Calling Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0773539800"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">City / District (නගරය) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kandy, Matale, Kurunegala"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address (විද්‍යුත් තැපෑල) *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>
              </div>

              {/* 2. Course & Batch Mode Selection */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-slate-300 font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-rose-500" />
                  <span>2. Select Course & Study Mode (පාඨමාලාව තෝරන්න)</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-300 font-medium mb-1">Available Programs & Batch Mode:</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {courseOptions.map((opt, idx) => {
                      const Icon = opt.icon;
                      const isSelected = selectedCourseIndex === idx;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedCourseIndex(idx)}
                          className={'p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ' + (
                            isSelected 
                              ? 'bg-rose-950/40 border-rose-500 shadow-md' 
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          )}
                        >
                          <input
                            type="radio"
                            name="course_selection"
                            checked={isSelected}
                            onChange={() => setSelectedCourseIndex(idx)}
                            className="mt-1 text-rose-600 focus:ring-rose-500"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <span className={'font-bold text-sm ' + (isSelected ? 'text-white' : 'text-slate-200')}>
                                {opt.name}
                              </span>
                              <span className={'text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-mono self-start sm:self-center ' + opt.modeColor}>
                                {opt.modeLabel}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Admission Fee & Bank Slip Upload Box */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-slate-300 font-bold text-sm">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>3. Registration Fee (Rs. 5,000) & Bank Slip Upload</span>
                </div>

                {/* College Official Bank Account Box */}
                <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 rounded-3xl p-5 space-y-3 shadow-xl">
                  
                  {/* Fee Highlight */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-800/40">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block">
                        Batch Admission / Registration Fee:
                      </span>
                      <div className="text-2xl font-extrabold text-amber-300 font-mono">
                        LKR 5,000.00 (Rs. 5,000)
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-rose-950/80 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl font-bold text-[11px] font-mono self-start sm:self-center">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Non-Refundable (ආපසු නොගෙවනු ලැබේ)</span>
                    </div>
                  </div>

                  {/* Bank Account Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                    <div>• Bank: <strong className="text-white font-bold">HNB BANK (Hatton National Bank)</strong></div>
                    <div>• Account Name: <strong className="text-white font-bold">YUZUKU PVT LTD</strong></div>
                    <div>• Account Number: <strong className="text-amber-300 font-mono text-sm font-bold tracking-wider">188010007971</strong></div>
                    <div>• Branch: <strong className="text-white font-bold">Kundasale Branch</strong></div>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1 border-t border-emerald-900/40">
                    * කරුණාකර රු. 5,000 මුදල ඉහත ගිණුමට තැන්පත් කර (Deposit / Online Transfer), ලබාගත් රිසිට්පතේ (Slip) පැහැදිලි ඡායාරූපයක් හෝ Screenshot එකක් පහතින් Upload කරන්න.
                  </p>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Upload Bank Deposit Slip / Receipt (PNG, JPG, PDF) *
                  </label>

                  {slipPreview ? (
                    <div className="relative bg-slate-950 border-2 border-emerald-500/60 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3 truncate">
                        {slipPreview === 'pdf_doc' ? (
                          <FileText className="w-10 h-10 text-rose-400 shrink-0" />
                        ) : (
                          <img src={slipPreview} alt="Slip Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-700 shrink-0 shadow-md" />
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-white truncate text-xs">{slipFile.name}</div>
                          <div className="text-[10px] text-emerald-400 font-mono">{(slipFile.size / 1024).toFixed(1)} KB • Ready to submit</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeSlip}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition-colors"
                        title="Remove Slip"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-700 hover:border-rose-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-colors">
                      <Upload className="w-8 h-8 text-rose-400 mb-2 animate-pulse" />
                      <span className="text-slate-200 font-bold text-xs sm:text-sm">Click to Select & Upload Deposit Slip (රිසිට්පත තෝරන්න)</span>
                      <span className="text-[10px] text-slate-500 mt-1">Supports JPG, PNG, WEBP, PDF up to 50MB</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleSlipChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 4. Portal Password */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-800 text-slate-300 font-bold text-sm">
                  <Lock className="w-4 h-4 text-rose-500" />
                  <span>4. Create Student Portal Password (මුරපදය)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Password (අවම අකුරු 6ක්) *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || uploadingSlip}
                className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-rose-900/40 transition-all flex items-center justify-center space-x-2 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading || uploadingSlip ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Submit Batch Registration & Rs. 5000 Bank Slip 🚀</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-6 text-slate-400 text-xs">
              Already have an approved account?{' '}
              <Link to="/login" className="text-rose-400 hover:text-rose-300 font-bold underline">
                Log In to Student Portal
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}