import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examAPI } from '../services/api';
import logoImg from '../assets/logo.png';
import samuraiBg from '../assets/japan_pagoda_bg.jpg';
import AdmissionCardModal from '../components/AdmissionCardModal';
import SubscriptionModal from '../components/SubscriptionModal';
import { 
  BookOpen, 
  Clock, 
  PlayCircle, 
  History, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  CheckCircle, 
  Lock, 
  Phone, 
  MessageCircle, 
  GraduationCap,
  Award,
  Printer,
  FileText,
  CreditCard,
  BarChart2,
  ExternalLink
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, refreshUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [examsRes, attemptsRes] = await Promise.all([
          examAPI.getAvailable(),
          examAPI.getMyAttempts()
        ]);
        setExams(examsRes.data.exams || []);
        setAttempts(attemptsRes.data.attempts || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalExamsTaken = attempts.length;
  const passedExamsCount = attempts.filter(a => a.passed === 1).length;
  const averageScore = totalExamsTaken > 0 
    ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / totalExamsTaken)
    : 0;

  const subscription = user?.subscription;
  const isActive = Boolean(subscription?.is_active || user?.role === 'student' || user?.role === 'admin');

  const isDualTrack = Boolean(user?.allow_dual_track || user?.batch_mode === 'dual_track' || user?.role === 'admin');
  const isSSW2AccomStudent = Boolean((user?.student_id && user?.student_id.startsWith('YAC2')) || user?.course_code === 'SSW2-ACCOMMODATION' || user?.course_id === 15 || user?.registered_course?.includes('SSW 2') || user?.registered_course?.includes('特定技能2号') || user?.registered_course?.includes('Accommodation 2'));
  const isFoodManuStudent = Boolean((user?.student_id && user?.student_id.startsWith('YFM')) || user?.course_code === 'SSW-FOOD-MANUFACTURING' || user?.registered_course?.includes('Manufacturing') || user?.registered_course?.includes('飲食料品製造'));
  const isConstructionStudent = Boolean((user?.student_id && user?.student_id.startsWith('YCN')) || user?.course_code === 'SSW-CONSTRUCTION' || user?.course_id === 13 || user?.registered_course?.includes('Construction') || user?.registered_course?.includes('建設'));
  const isAviationStudent = Boolean((user?.student_id && user?.student_id.startsWith('YAV')) || user?.course_code === 'SSW-AIRPORT-GROUND' || user?.course_id === 10 || user?.registered_course?.includes('Aviation') || user?.registered_course?.includes('Airport') || user?.registered_course?.includes('航空'));
  const isFoodStudent = Boolean((user?.student_id && user?.student_id.startsWith('YFS')) || user?.course_code === 'SSW-FOOD-SERVICE' || user?.course_id === 11);
  const isCaregiverStudent = Boolean((user?.student_id && user?.student_id.startsWith('YCG')) || user?.course_code === 'SSW-CAREGIVER' || user?.course_id === 8);
  const isTruckStudent = Boolean((user?.student_id && user?.student_id.startsWith('YTD')) || (!user?.student_id?.startsWith('YJP') && (user?.course_id === 7 || user?.course_code === 'SSW-TRUCK-DRIVING')));
  const isAutoStudent = Boolean((user?.student_id && user?.student_id.startsWith('YAM')) || user?.course_code === 'SSW-AUTOMOBILE' || user?.course_id === 6);
  const isAgriStudent = Boolean((user?.student_id && user?.student_id.startsWith('YAG')) || user?.course_code === 'SSW-AGRICULTURE' || user?.course_id === 12);
  const isAccomStudent = Boolean((user?.student_id && user?.student_id.startsWith('YAC') && !user?.student_id.startsWith('YAC2')) || user?.course_code === 'SSW-ACCOMMODATION' || user?.course_id === 9);
  const isJapaneseStudent = Boolean((user?.student_id && user?.student_id.startsWith('YJP')) || [1, 2, 3, 4].includes(user?.course_id));

  const [selectedCourseFilter, setSelectedCourseFilter] = useState(
    isSSW2AccomStudent && !isDualTrack ? 'SSW2_ACCOM' :
    isFoodManuStudent && !isDualTrack ? 'FOOD_MANU' :
    isConstructionStudent && !isDualTrack ? 'CONSTRUCTION' :
    isAviationStudent && !isDualTrack ? 'AVIATION' :
    isFoodStudent && !isDualTrack ? 'FOOD' :
    isCaregiverStudent && !isDualTrack ? 'CAREGIVER' :
    isAgriStudent && !isDualTrack ? 'AGRI' :
    isAccomStudent && !isDualTrack ? 'ACCOM' :
    isTruckStudent && !isDualTrack ? 'TRUCK' :
    isAutoStudent && !isDualTrack ? 'AUTO' : 'ALL'
  );

  useEffect(() => {
    if (isSSW2AccomStudent && !isDualTrack) {
      setSelectedCourseFilter('SSW2_ACCOM');
    } else if (isFoodManuStudent && !isDualTrack) {
      setSelectedCourseFilter('FOOD_MANU');
    } else if (isConstructionStudent && !isDualTrack) {
      setSelectedCourseFilter('CONSTRUCTION');
    } else if (isAviationStudent && !isDualTrack) {
      setSelectedCourseFilter('AVIATION');
    } else if (isFoodStudent && !isDualTrack) {
      setSelectedCourseFilter('FOOD');
    } else if (isCaregiverStudent && !isDualTrack) {
      setSelectedCourseFilter('CAREGIVER');
    } else if (isAgriStudent && !isDualTrack) {
      setSelectedCourseFilter('AGRI');
    } else if (isAccomStudent && !isDualTrack) {
      setSelectedCourseFilter('ACCOM');
    } else if (isTruckStudent && !isDualTrack) {
      setSelectedCourseFilter('TRUCK');
    } else if (isAutoStudent && !isDualTrack) {
      setSelectedCourseFilter('AUTO');
    }
  }, [user?.student_id, isSSW2AccomStudent, isFoodManuStudent, isConstructionStudent, isAviationStudent, isFoodStudent, isCaregiverStudent, isAgriStudent, isAccomStudent, isTruckStudent, isAutoStudent, isDualTrack]);

  const [selectedTruckCategory, setSelectedTruckCategory] = useState('Driver Basics');
  const [selectedJlptLevel, setSelectedJlptLevel] = useState('N4');
  const [selectedJlptTab, setSelectedJlptTab] = useState('study');
  const [selectedJlptCategory, setSelectedJlptCategory] = useState('Vocabulary');

  const jlptModulesConfig = [
    { title: 'Kanji Reading', category: 'Vocabulary', total: 200 },
    { title: 'Notation', category: 'Vocabulary', total: 74 },
    { title: 'Context-based Expressions', category: 'Vocabulary', total: 92 },
    { title: 'Paraphrase', category: 'Vocabulary', total: 103 },
    { title: 'Usage', category: 'Vocabulary', total: 94 },
    { title: 'Grammar Forms', category: 'Grammar', total: 146 },
    { title: 'Sentence Construction', category: 'Grammar', total: 55 },
    { title: 'Text Grammar', category: 'Grammar', total: 16 },
    { title: 'Reading Comprehension (Short Text)', category: 'Reading', total: 50 },
    { title: 'Reading Comprehension (Medium Text)', category: 'Reading', total: 19 }
  ];

  const filteredExams = (exams || []).filter(exam => {
    if (selectedCourseFilter === 'ALL') return true;
    if (selectedCourseFilter === 'SSW2_ACCOM') return exam.course_code === 'SSW2-ACCOMMODATION' || (exam.title || '').toLowerCase().includes('ssw 2') || (exam.title || '').includes('特定技能2号') || (exam.title || '').includes('2号');
    if (selectedCourseFilter === 'FOOD_MANU') return exam.course_code === 'SSW-FOOD-MANUFACTURING' || (exam.title || '').toLowerCase().includes('food manufacturing') || (exam.title || '').includes('飲食料品製造') || (exam.title || '').includes('製造業');
    if (selectedCourseFilter === 'CONSTRUCTION') return exam.course_code === 'SSW-CONSTRUCTION' || (exam.title || '').toLowerCase().includes('construction') || (exam.title || '').includes('建設') || (exam.title || '').includes('土木') || (exam.title || '').includes('型枠') || (exam.title || '').includes('鉄筋');
    if (selectedCourseFilter === 'AVIATION') return exam.course_code === 'SSW-AIRPORT-GROUND' || (exam.title || '').toLowerCase().includes('aviation') || (exam.title || '').toLowerCase().includes('airport') || (exam.title || '').includes('航空') || (exam.title || '').includes('グランドハンドリング');
    if (selectedCourseFilter === 'FOOD') return exam.course_code === 'SSW-FOOD-SERVICE' || (((exam.title || '').toLowerCase().includes('food') && !(exam.title || '').toLowerCase().includes('manufacturing')) || (exam.title || '').toLowerCase().includes('restaurant') || (exam.title || '').includes('外食'));
    if (selectedCourseFilter === 'CAREGIVER') return exam.course_code === 'SSW-CAREGIVER' || (exam.title || '').toLowerCase().includes('caregiver') || (exam.title || '').toLowerCase().includes('nursing') || (exam.title || '').includes('介護');
    if (selectedCourseFilter === 'AGRI') return exam.course_code === 'SSW-AGRICULTURE' || (exam.title || '').toLowerCase().includes('agri') || (exam.title || '').includes('農業');
    if (selectedCourseFilter === 'ACCOM') return exam.course_code === 'SSW-ACCOMMODATION' || (exam.title || '').toLowerCase().includes('accom') || (exam.title || '').includes('宿泊');
    if (selectedCourseFilter === 'AUTO') return exam.course_code === 'SSW-AUTOMOBILE' || (exam.title || '').toLowerCase().includes('auto') || (exam.title || '').includes('自動車');
    if (selectedCourseFilter === 'TRUCK') return exam.course_code === 'SSW-TRUCK-DRIVING' || (exam.title || '').toLowerCase().includes('truck') || (exam.title || '').includes('トラック');
    if (selectedCourseFilter === 'JFT') return exam.course_code === 'JFT-BASIC' || (exam.title || '').toLowerCase().includes('jft');
    if (selectedCourseFilter === 'JLPT') return ['JLPT-N5', 'JLPT-N4', 'JLPT-N3', 'JLPT-N2', 'JLPT-N1'].includes(exam.course_code) || (exam.title || '').toLowerCase().includes('jlpt');
    if (selectedCourseFilter === 'SSW_OTHER') return exam.course_code && (exam.course_code.startsWith('SSW-') || exam.course_code.startsWith('SSW2-'));
    return true;
  });

  const truckCategoryExams = (exams || []).filter(exam => 
    exam.course_code === 'SSW-TRUCK-DRIVING' && 
    exam.description && 
    exam.description.toLowerCase().includes(selectedTruckCategory.toLowerCase())
  );

  const getCourseBadgeColor = (code = '', title = '') => {
    const c = code.toUpperCase();
    const t = title.toLowerCase();
    if (c === 'SSW2-ACCOMMODATION' || t.includes('ssw 2') || t.includes('特定技能2号') || t.includes('2号')) return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-300';
    if (c === 'SSW-FOOD-MANUFACTURING' || t.includes('food manufacturing') || t.includes('飲食料品製造') || t.includes('製造業')) return 'bg-lime-50 text-lime-800 border-lime-300';
    if (c === 'SSW-CONSTRUCTION' || t.includes('construction') || t.includes('建設') || t.includes('土木') || t.includes('型枠') || t.includes('鉄筋')) return 'bg-yellow-50 text-yellow-800 border-yellow-300';
    if (c === 'SSW-AIRPORT-GROUND' || t.includes('aviation') || t.includes('airport') || t.includes('航空') || t.includes('グランドハンドリング')) return 'bg-cyan-50 text-cyan-800 border-cyan-300';
    if (c === 'SSW-FOOD-SERVICE' || t.includes('food') || t.includes('restaurant') || t.includes('外食')) return 'bg-orange-50 text-orange-800 border-orange-300';
    if (c === 'SSW-CAREGIVER' || t.includes('caregiver') || t.includes('nursing') || t.includes('介護')) return 'bg-teal-50 text-teal-800 border-teal-300';
    if (c === 'SSW-AGRICULTURE' || t.includes('agri') || t.includes('農業')) return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (c === 'SSW-ACCOMMODATION' || t.includes('accom') || t.includes('宿泊')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (c === 'SSW-AUTOMOBILE' || t.includes('auto') || t.includes('自動車')) return 'bg-amber-50 text-amber-800 border-amber-300';
    if (c === 'SSW-TRUCK-DRIVING' || t.includes('truck') || t.includes('トラック')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (c === 'JFT-BASIC' || t.includes('jft')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (c.startsWith('JLPT')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const availableTabs = [
    { id: 'ALL', label: 'All Exams (සියලුම විභාග)' },
    { id: 'SSW2_ACCOM', label: '🏨 SSW 2 Accommodation (特定技能2号 宿泊業 - 580 Qs)' },
    { id: 'FOOD_MANU', label: '🏭 SSW Food Manufacturing (飲食料品製造 - 371 Qs)' },
    { id: 'CONSTRUCTION', label: '🏗️ SSW Construction (建設業 - 530 Qs)' },
    { id: 'AVIATION', label: '✈️ SSW Aviation (航空業 - 297 Qs)' },
    { id: 'FOOD', label: '🍽️ SSW Food Service (外食業 - 325 Qs)' },
    { id: 'CAREGIVER', label: '🩺 SSW Caregiving (介護 - 758 Qs)' },
    { id: 'AGRI', label: '🌾 SSW Agriculture (農業・耕種 - 376 Qs)' },
    { id: 'ACCOM', label: '🏨 SSW Accommodation (宿泊業 - 246 Qs)' },
    { id: 'AUTO', label: '🚗 SSW Automobile (自動車整備 - 419 Qs)' },
    { id: 'TRUCK', label: '🚚 SSW Truck Driving (自動車運送業 - 583 Qs)' },
    { id: 'JFT', label: `JFT-Basic (A2 - ${(exams || []).filter(e => e.course_code === 'JFT-BASIC' || (e.title || '').toLowerCase().includes('jft')).length || 19} Papers)` },
    { id: 'JLPT', label: '🇯🇵 JLPT Levels (日本語能力試験 - N5 / N4 / N3)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-japanese">
      
      {/* Educational CBT Lock Banner if Course In Progress */}
      {!isActive && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-indigo-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold font-japanese">
                    CBT Mock Exam Platform: Course in Progress (විෂය නිර්දේශය හදාරමින් පවතී)
                  </h2>
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-500/30">
                    Course Enrolled
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-japanese">
                  Welcome to <strong>YUZUKI Japan College</strong>! Full 60-Minute Prometric Computer-Based Mock Exams are provided to students upon completing the course curriculum with your Sensei.
                </p>
                <p className="text-xs text-indigo-300/90 leading-relaxed font-japanese">
                  * ඔබගේ පාඨමාලාවේ (Japanese Language / SSW Track) විෂය කොටස් ආවරණය කර අවසන් වූ පසු විද්‍යාලය මගින් CBT ආදර්ශ විභාග කාමරය විවෘත කරනු ලැබේ.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 self-start md:self-center">
              <button
                type="button"
                onClick={() => setShowSubscriptionModal(true)}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 shadow-xl transition-all transform hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay $9.99 (Card Payment) & Start Exams 💳</span>
              </button>

              <a
                href="https://wa.me/94773539800"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Sensei</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl bg-cover bg-center text-white p-8 sm:p-10 shadow-2xl border border-rose-950/40"
        style={{ backgroundImage: 'url(' + samuraiBg + ')' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-rose-950/70 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-rose-500 overflow-hidden shadow-2xl shrink-0 bg-white p-1 flex items-center justify-center">
              <img src={logoImg} alt="Yuzuki Logo" className="w-full h-full object-contain" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center space-x-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                  <span className="font-mono font-bold">Student ID: {user?.student_id}</span>
                </div>

                {isDualTrack ? (
                  <div className="inline-flex items-center space-x-1 bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                    <span>🌟 Dual Track Active (YJP + SSW)</span>
                  </div>
                ) : isFoodManuStudent ? (
                  <div className="inline-flex items-center space-x-1 bg-lime-500/30 border border-lime-400 text-lime-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    <span>🏭 SSW Food Manufacturing Track</span>
                  </div>
                ) : isConstructionStudent ? (
                  <div className="inline-flex items-center space-x-1 bg-yellow-500/30 border border-yellow-400 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    <span>🏗️ SSW Construction Track</span>
                  </div>
                ) : isAviationStudent ? (
                  <div className="inline-flex items-center space-x-1 bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    <span>✈️ SSW Aviation Track</span>
                  </div>
                ) : isTruckStudent ? (
                  <div className="inline-flex items-center space-x-1 bg-emerald-500/30 border border-emerald-400 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    <span>🚚 SSW Truck Driving Track</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1 bg-blue-500/30 border border-blue-400 text-blue-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    <span>🇯🇵 Japanese Language Track</span>
                  </div>
                )}

                {isActive ? (
                  <div className="inline-flex items-center space-x-1 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>CBT Exam Pass Active ({subscription?.days_remaining || 30} Days Left)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1 bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                    <Lock className="w-3.5 h-3.5" />
                    <span>CBT Simulator (Unlocks upon Course Completion)</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(true)}
                  className="inline-flex items-center space-x-1 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md transition-all transform hover:scale-105"
                  title="View and print official YUZUKI admission card"
                >
                  <Printer className="w-3 h-3" />
                  <span>My Admission Card 📄</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-japanese drop-shadow-md">
                Konnichiwa, {user?.name}! (こんにちは)
              </h1>
              <p className="text-slate-200 text-xs sm:text-sm mt-1 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>Enrolled Track: <strong className="text-amber-300">{user?.course_name || (isTruckStudent ? 'SSW Truck Driving' : 'Japanese Language Studies')}</strong></span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-center px-3">
              <div className="text-2xl font-bold text-white font-mono">{exams.length}</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Assigned</div>
            </div>
            <div className="text-center px-3 border-x border-white/20">
              <div className="text-2xl font-bold text-emerald-400 font-mono">{passedExamsCount}</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Passed</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-bold text-amber-400 font-mono">{averageScore}%</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Exams Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-rose-600" />
              <span>CBT Examinations & Practice Modules</span>
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Access official CBT mock papers and vocational skill mastery modules for your enrolled curriculum.
            </p>
          </div>
        </div>

        {/* Dual Track / Single Track Guidance Notice */}
        {!isDualTrack && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-base">{isTruckStudent ? '🚚' : '🇯🇵'}</span>
              <span className="text-slate-700">
                You are registered on the <strong>{isTruckStudent ? 'SSW Truck Driving Track (YTD)' : 'Japanese Language Track (YJP)'}</strong>.
                {isTruckStudent
                  ? ' To also unlock Japanese Language CBT mock exams, contact the College Admin to enable Dual Track.'
                  : ' To also unlock SSW Truck Driving CBT modules (583 Furigana Questions), contact the College Admin to enable Dual Track.'}
              </span>
            </div>
            <a
              href="https://wa.me/94773539800?text=Hello%20Sensei,%20I%20would%20like%20to%20request%20Dual%20Track%20(Japanese%20+%20Truck%20Driving)%20access."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shrink-0 self-start sm:self-center transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Request Dual Track Access</span>
            </a>
          </div>
        )}

        {/* Course Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {availableTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCourseFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCourseFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Truck Driving Dedicated Category View (Matching Official SSW Portal) */}
        {selectedCourseFilter === 'TRUCK' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
                  <span>🚚 SSW Truck Driving Skill Examination</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    Untimed Practice Mode
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Master official Japanese logistics regulations, traffic rules, vehicle inspections, and cargo safety at your own pace.
                </p>
              </div>
            </div>

            {/* 3 Main Category Tabs as in Screenshot */}
            <div className="flex border-b border-slate-200 text-center font-bold text-sm sm:text-base">
              {[
                { key: 'Driver Basics', label: 'Driver Basics' },
                { key: 'Transportation work', label: 'Transportation work' },
                { key: 'Cargo handling work', label: 'Cargo handling work' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedTruckCategory(cat.key)}
                  className={`flex-1 py-3 px-4 border-b-2 transition-all font-semibold ${
                    selectedTruckCategory === cat.key
                      ? 'border-emerald-500 text-slate-900 font-extrabold bg-slate-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sub-Topics List for Selected Category (Exact Screenshot Layout) */}
            <div className="space-y-3 pt-2">
              {truckCategoryExams.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No modules in this category yet. Questions will be added soon.
                </div>
              ) : (
                truckCategoryExams.map(tExam => (
                  <div
                    key={tExam.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-600">
                        <GraduationCap className="w-6 h-6 text-indigo-600/80" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm sm:text-base">
                          {tExam.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0 self-end sm:self-center">
                      {/* Start Button with Progress */}
                      <div className="flex flex-col items-center w-36">
                        <Link
                          to={'/exam/' + tExam.id}
                          className="w-full py-2 px-4 rounded-xl bg-[#0da58e] hover:bg-[#0b8b78] text-white font-medium text-xs sm:text-sm text-center shadow-sm transition-all active:scale-95"
                        >
                          Start
                        </Link>
                        <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500 font-mono w-full justify-between px-1">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden mr-1 border border-slate-200">
                            <div
                              className="bg-[#0da58e] h-full rounded-full"
                              style={{ width: `${tExam.user_attempts_count > 0 ? 100 : 0}%` }}
                            />
                          </div>
                          <span>{tExam.user_attempts_count > 0 ? `${tExam.question_count}/${tExam.question_count}` : `0/${tExam.question_count || 31}`}</span>
                        </div>
                      </div>

                      {/* Review Button */}
                      <div className="flex flex-col items-center w-36">
                        <Link
                          to={tExam.user_attempts_count > 0 ? '/history' : '/exam/' + tExam.id}
                          className="w-full py-2 px-4 rounded-xl bg-[#2b7a9e] hover:bg-[#236685] text-white font-medium text-xs sm:text-sm text-center shadow-sm transition-all active:scale-95"
                        >
                          Review
                        </Link>
                        <div className="mt-1 text-[11px] text-slate-700 font-mono">
                          <span className="font-bold">{tExam.user_attempts_count > 0 ? tExam.question_count : 0}</span>
                          <span className="text-slate-500">Questions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Dedicated JLPT Levels Practice & Examination Portal (N5 / N4 / N3) */}
        {selectedCourseFilter === 'JLPT' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Breadcrumb: home > JLPT N4 */}
            <div className="flex items-center space-x-2 text-sm text-slate-500 pt-1">
              <button 
                type="button"
                onClick={() => setSelectedCourseFilter('ALL')} 
                className="text-[#2b7a9e] hover:text-[#205e7a] hover:underline font-normal cursor-pointer"
              >
                home
              </button>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-600 font-medium">JLPT {selectedJlptLevel}</span>
            </div>

            {/* Header: Centered Large Title matching screenshot */}
            <div className="text-center pt-2 pb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] font-japanese tracking-tight">
                {selectedJlptLevel === 'N4' ? 'JLPT N4 Practice Questions' : selectedJlptLevel === 'N5' ? 'JLPT N5 Practice Questions' : 'JLPT N3 Practice Questions'}
              </h1>
            </div>

            {/* Level Selector Tabs: N4 (Default), N5, N3 */}
            <div className="flex justify-center pb-2">
              <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold max-w-2xl w-full">
                <button
                  type="button"
                  onClick={() => setSelectedJlptLevel('N4')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    selectedJlptLevel === 'N4'
                      ? 'bg-[#00b090] text-white shadow-md font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>🌸 JLPT N4 (Official SSW 10 Modules)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedJlptLevel('N5')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    selectedJlptLevel === 'N5'
                      ? 'bg-purple-600 text-white shadow-md font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>🔰 JLPT N5 (Mock Exam)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedJlptLevel('N3')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    selectedJlptLevel === 'N3'
                      ? 'bg-amber-600 text-white shadow-md font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>🏆 JLPT N3 (Mock Exam)</span>
                </button>
              </div>
            </div>

            {/* LEVEL: JLPT N4 */}
            {selectedJlptLevel === 'N4' && (
              <div className="space-y-6">
                {/* 3 Main Tabs: Study, Progress, Information */}
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
                  <div className="grid grid-cols-3 text-center font-bold text-sm sm:text-base">
                    <button
                      type="button"
                      onClick={() => setSelectedJlptTab('study')}
                      className={`py-3.5 px-4 flex items-center justify-center space-x-2 font-semibold transition-all border-b-[3px] ${
                        selectedJlptTab === 'study'
                          ? 'border-[#00b090] text-slate-900 font-extrabold bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-800 bg-white'
                      }`}
                    >
                      <BookOpen className="w-5 h-5 text-slate-700" />
                      <span>Study</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedJlptTab('progress')}
                      className={`py-3.5 px-4 flex items-center justify-center space-x-2 font-semibold transition-all border-b-[3px] ${
                        selectedJlptTab === 'progress'
                          ? 'border-[#00b090] text-slate-900 font-extrabold bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-800 bg-white'
                      }`}
                    >
                      <BarChart2 className="w-5 h-5 text-slate-700" />
                      <span>Progress</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedJlptTab('information')}
                      className={`py-3.5 px-4 flex items-center justify-center space-x-2 font-semibold transition-all border-b-[3px] ${
                        selectedJlptTab === 'information'
                          ? 'border-[#00b090] text-slate-900 font-extrabold bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-800 bg-white'
                      }`}
                    >
                      <FileText className="w-5 h-5 text-slate-700" />
                      <span>Information</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: STUDY */}
                {selectedJlptTab === 'study' && (
                  <div className="space-y-6">
                    {/* Notice message */}
                    <p className="text-xs sm:text-sm text-slate-600 font-medium px-1">
                      You can save incorrect answers for a long time by creating an account or logging in from the top-right icon.
                    </p>

                    {/* Sub-category Pills (Vocabulary, Grammar, Reading) */}
                    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
                      <div className="grid grid-cols-3 text-center font-bold text-sm sm:text-base">
                        {[
                          { key: 'Vocabulary', label: 'Vocabulary' },
                          { key: 'Grammar', label: 'Grammar' },
                          { key: 'Reading', label: 'Reading' }
                        ].map(cat => (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() => setSelectedJlptCategory(cat.key)}
                            className={`py-3 px-4 font-semibold transition-all border-b-[3px] ${
                              selectedJlptCategory === cat.key
                                ? 'border-[#00b090] text-slate-900 font-extrabold bg-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 bg-white'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Modules List for Selected Category */}
                    <div className="space-y-3 pt-1">
                      {jlptModulesConfig
                        .filter(m => m.category === selectedJlptCategory)
                        .map((m, idx) => {
                          const dbExam = (exams || []).find(e => 
                            ((e.course_code === 'JLPT-N4' || e.course_id === 3 || (e.id >= 159 && e.id <= 168)) && 
                            (e.title || '').toLowerCase().trim() === m.title.toLowerCase().trim())
                          );
                          const examId = dbExam?.id;
                          const examAttempts = (attempts || []).filter(a => a.exam_id === examId);
                          const hasAttempt = examAttempts.length > 0;
                          const qCount = dbExam?.question_count || m.total;

                          return (
                            <div
                              key={m.title}
                              className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-xs transition-all"
                            >
                              {/* Left: Graduation Cap & Module Title */}
                              <div className="flex items-center space-x-6 sm:pl-4">
                                <div className="shrink-0">
                                  <GraduationCap className="w-8 h-8 text-[#2b7a9e]" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800 text-sm sm:text-base font-japanese">
                                    {m.title}
                                  </h4>
                                </div>
                              </div>

                              {/* Right: Action Buttons (Start & Review) */}
                              <div className="flex items-center space-x-4 shrink-0 self-end sm:self-center">
                                {/* Start Button with Progress */}
                                <div className="flex flex-col items-center w-36 sm:w-44">
                                  {examId ? (
                                    <Link
                                      to={'/exam/' + examId}
                                      className="w-full py-2 px-4 rounded-xl bg-[#00b090] hover:bg-[#009b7f] text-white font-semibold text-xs sm:text-sm text-center shadow-xs transition-all active:scale-95"
                                    >
                                      Start
                                    </Link>
                                  ) : (
                                    <button
                                      disabled
                                      className="w-full py-2 px-4 rounded-xl bg-slate-300 text-white font-medium text-xs sm:text-sm text-center cursor-not-allowed"
                                    >
                                      Start
                                    </button>
                                  )}
                                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500 font-mono w-full justify-between px-1">
                                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden mr-1.5 border border-slate-200">
                                      <div
                                        className="bg-[#00b090] h-full rounded-full transition-all"
                                        style={{ width: `${hasAttempt ? 100 : (idx === 0 ? 1 : 0)}%` }}
                                      />
                                    </div>
                                    <span>{hasAttempt ? `${qCount}/${m.total}` : (idx === 0 ? `1/${m.total}` : `0/${m.total}`)}</span>
                                  </div>
                                </div>

                                {/* Review Button with Count */}
                                <div className="flex flex-col items-center w-36 sm:w-44">
                                  <Link
                                    to={hasAttempt ? '/history' : examId ? '/exam/' + examId : '#'}
                                    className="w-full py-2 px-4 rounded-xl bg-[#2b7a9e] hover:bg-[#236685] text-white font-semibold text-xs sm:text-sm text-center shadow-xs transition-all active:scale-95"
                                  >
                                    Review
                                  </Link>
                                  <div className="mt-1 text-[11px] text-slate-600 font-mono">
                                    <span className="font-bold">{hasAttempt ? qCount : 0}</span>
                                    <span>Questions</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Floating Sticky Bottom-Left Card: Resume Learning */}
                    <div className="fixed bottom-6 left-6 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 flex items-center space-x-3.5 max-w-xs transition-all">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-slate-700" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800">
                          JLPT N4 / Kanji Reading Q.1
                        </div>
                        <Link
                          to="/exam/159"
                          className="inline-block py-1 px-3 bg-[#2b7a9e] hover:bg-[#236685] text-white text-[11px] font-bold rounded-lg transition-all shadow-xs"
                        >
                          Resume learning
                        </Link>
                      </div>
                    </div>

                    {/* Floating Scroll-to-Top Button on Bottom-Right */}
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-slate-200/90 hover:bg-slate-300 text-slate-600 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                      title="Scroll to top"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* TAB 2: PROGRESS */}
                {selectedJlptTab === 'progress' && (
                  <div className="space-y-6 pt-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Learning Progress and History</h3>
                      <p className="text-xs text-slate-500">You can check your learning status at a glance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 text-center space-y-1">
                        <span className="text-xs text-slate-500 font-medium">Overall Progress</span>
                        <div className="text-2xl font-bold text-[#00b090] font-mono">
                          {Math.round(((attempts || []).filter(a => [159,160,161,162,163,164,165,166,167,168].includes(a.exam_id)).length / 10) * 100)}%
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {(attempts || []).filter(a => [159,160,161,162,163,164,165,166,167,168].includes(a.exam_id)).length} / 10 Modules
                        </span>
                      </div>

                      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 text-center space-y-1">
                        <span className="text-xs text-slate-500 font-medium">Waiting for Review</span>
                        <div className="text-2xl font-bold text-[#2b7a9e] font-mono">
                          {(attempts || []).filter(a => [159,160,161,162,163,164,165,166,167,168].includes(a.exam_id) && a.passed !== 1).length}
                        </div>
                        <span className="text-[11px] text-slate-400">Questions needing practice</span>
                      </div>

                      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 text-center space-y-1">
                        <span className="text-xs text-slate-500 font-medium">Accuracy Rate</span>
                        <div className="text-2xl font-bold text-emerald-700 font-mono">
                          {(() => {
                            const jlptAttempts = (attempts || []).filter(a => [159,160,161,162,163,164,165,166,167,168].includes(a.exam_id));
                            if (jlptAttempts.length === 0) return '-';
                            return Math.round(jlptAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / jlptAttempts.length) + '%';
                          })()}
                        </div>
                        <span className="text-[11px] text-slate-400">Average Score</span>
                      </div>
                    </div>

                    {/* Category Progress Breakdown */}
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                      <h4 className="text-sm font-bold text-slate-800">Progress by Category</h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Vocabulary (言語知識 - 文字・語彙)', total: 563, count: 5 },
                          { name: 'Grammar (言語知識 - 文法)', total: 217, count: 3 },
                          { name: 'Reading (読解)', total: 69, count: 2 }
                        ].map(c => (
                          <div key={c.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs sm:text-sm">
                            <span className="font-semibold text-slate-700">{c.name}</span>
                            <span className="font-mono text-slate-500 font-bold">{c.total} Questions ({c.count} Topics)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: INFORMATION */}
                {selectedJlptTab === 'information' && (
                  <div className="space-y-6 pt-2">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-lg font-bold text-slate-800">Related Information on JLPT N4</h3>
                      <p className="text-xs text-slate-500">Official guidelines, structure, and official test materials.</p>
                    </div>

                    {/* Test Structure & Passing Criteria */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-rose-600" />
                          <span>Test Structure & Timing</span>
                        </h4>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                          <li><strong>Language Knowledge (Vocabulary):</strong> 25 minutes (100 pts)</li>
                          <li><strong>Language Knowledge (Grammar) & Reading:</strong> 55 minutes (100 pts)</li>
                          <li><strong>Listening Comprehension:</strong> 35 minutes (60 pts)</li>
                          <li><strong>Total Duration:</strong> 115 minutes</li>
                        </ul>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>Passing Criteria</span>
                        </h4>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                          <li><strong>Overall Pass Mark:</strong> 90 / 180 points (50%)</li>
                          <li><strong>Language Knowledge (Vocab/Grammar) & Reading Cutoff:</strong> 38 / 120 points</li>
                          <li><strong>Listening Cutoff:</strong> 19 / 60 points</li>
                          <li>Both overall and sectional passing marks must be achieved.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Official Practice Workbooks & PDFs */}
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span>Official JLPT N4 Practice Workbook (PDF Downloads)</span>
                        </h4>
                        <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                          Source: JLPT.jp
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                        {[
                          { label: 'N4 Characters & Vocabulary PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N4V.pdf' },
                          { label: 'N4 Grammar PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N4G.pdf' },
                          { label: 'N4 Reading PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N4R.pdf' },
                          { label: 'N4 Listening PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N4L.pdf' },
                          { label: 'Official Practice Workbook Online', url: 'https://www.jlpt.jp/samples/sampleindex.html?mode=pc' },
                          { label: 'JITCO Textbooks & Study Materials', url: 'https://onlineshop.jitco.or.jp/shop/shopbrand.html?search=' }
                        ].map(res => (
                          <a
                            key={res.label}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-xs font-semibold text-slate-800 group"
                          >
                            <span className="truncate pr-2">{res.label}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LEVEL: JLPT N5 */}
            {selectedJlptLevel === 'N5' && (() => {
              const n5Exam = (exams || []).find(e => e.course_code === 'JLPT-N5' || e.course_id === 2 || (e.title || '').includes('N5'));
              const n5Attempts = (attempts || []).filter(a => a.exam_id === n5Exam?.id);
              const bestScore = n5Attempts.length > 0 ? Math.max(...n5Attempts.map(a => a.percentage || 0)) : null;

              return (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="bg-purple-500/30 border border-purple-400 text-purple-200 text-xs font-bold px-3 py-1 rounded-full">
                            Beginner Level (初級)
                          </span>
                          <span className="bg-white/10 text-slate-200 text-xs font-mono px-2.5 py-1 rounded-full">
                            45 Mins Mock Paper
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold font-japanese">
                          {n5Exam?.title || 'JLPT N5 Comprehensive Mock Exam 2026'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                          Master basic Japanese kanji (100 characters), essential vocabulary (800 words), and fundamental grammar particles (は, が, を, に, で) for everyday life.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                        {n5Exam ? (
                          <Link
                            to={'/exam/' + n5Exam.id}
                            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 shadow-xl transition-all transform hover:scale-105"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>{n5Attempts.length > 0 ? 'Retake JLPT N5 Paper' : 'Start N5 CBT Exam'}</span>
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">Exam paper being prepared</span>
                        )}

                        {n5Attempts.length > 0 && (
                          <Link
                            to="/history"
                            className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                          >
                            <History className="w-4 h-4 text-purple-300" />
                            <span>Best: {bestScore}%</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Test Structure & Passing Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span>N5 Test Structure & Timing</span>
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                        <li><strong>Language Knowledge (Vocabulary):</strong> 20 minutes (100 pts)</li>
                        <li><strong>Language Knowledge (Grammar) & Reading:</strong> 40 minutes (100 pts)</li>
                        <li><strong>Listening Comprehension:</strong> 30 minutes (60 pts)</li>
                        <li><strong>Total Questions:</strong> 50 Questions in CBT Mode</li>
                      </ul>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>N5 Passing Criteria</span>
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                        <li><strong>Overall Pass Mark:</strong> 80 / 180 points (44.4%)</li>
                        <li><strong>Language Knowledge & Reading Cutoff:</strong> 38 / 120 points</li>
                        <li><strong>Listening Cutoff:</strong> 19 / 60 points</li>
                        <li>Pass rate standard for Japanese Visa requirements.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Official N5 Workbook Downloads */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>Official JLPT N5 Sample Workbooks (PDF Downloads)</span>
                      </h4>
                      <span className="text-[11px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded">
                        Source: JLPT.jp
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                      {[
                        { label: 'N5 Kanji & Vocabulary PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N5V.pdf' },
                        { label: 'N5 Grammar PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N5G.pdf' },
                        { label: 'N5 Reading PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N5R.pdf' },
                        { label: 'N5 Listening PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N5L.pdf' }
                      ].map(res => (
                        <a
                          key={res.label}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all text-xs font-semibold text-slate-800 group"
                        >
                          <span className="truncate pr-2">{res.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* LEVEL: JLPT N3 */}
            {selectedJlptLevel === 'N3' && (() => {
              const n3Exam = (exams || []).find(e => e.course_code === 'JLPT-N3' || e.course_id === 4 || (e.title || '').includes('N3'));
              const n3Attempts = (attempts || []).filter(a => a.exam_id === n3Exam?.id);
              const bestScore = n3Attempts.length > 0 ? Math.max(...n3Attempts.map(a => a.percentage || 0)) : null;

              return (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="bg-amber-500/30 border border-amber-400 text-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                            Intermediate Level (中級)
                          </span>
                          <span className="bg-white/10 text-slate-200 text-xs font-mono px-2.5 py-1 rounded-full">
                            60 Mins Mock Paper
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold font-japanese">
                          {n3Exam?.title || 'JLPT N3 Comprehensive Mock Exam 2026'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                          Bridge between basic and advanced Japanese. Covers 650 kanji characters, 3,750 vocabulary words, intermediate grammar structures, and workplace communications.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                        {n3Exam ? (
                          <Link
                            to={'/exam/' + n3Exam.id}
                            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl transition-all transform hover:scale-105"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>{n3Attempts.length > 0 ? 'Retake JLPT N3 Paper' : 'Start N3 CBT Exam'}</span>
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">Exam paper being prepared</span>
                        )}

                        {n3Attempts.length > 0 && (
                          <Link
                            to="/history"
                            className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                          >
                            <History className="w-4 h-4 text-amber-300" />
                            <span>Best: {bestScore}%</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Test Structure & Passing Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>N3 Test Structure & Timing</span>
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                        <li><strong>Language Knowledge (Vocabulary):</strong> 30 minutes (60 pts)</li>
                        <li><strong>Language Knowledge (Grammar) & Reading:</strong> 70 minutes (60 pts)</li>
                        <li><strong>Listening Comprehension:</strong> 40 minutes (60 pts)</li>
                        <li><strong>Total Duration:</strong> 140 minutes</li>
                      </ul>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>N3 Passing Criteria</span>
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                        <li><strong>Overall Pass Mark:</strong> 95 / 180 points (52.8%)</li>
                        <li><strong>Vocab / Grammar / Reading / Listening Cutoff:</strong> 19 / 60 points each</li>
                        <li>Essential for engineering, managerial, and Specified Skilled Worker Type 2 tracks.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Official N3 Workbook Downloads */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>Official JLPT N3 Sample Workbooks (PDF Downloads)</span>
                      </h4>
                      <span className="text-[11px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded">
                        Source: JLPT.jp
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                      {[
                        { label: 'N3 Kanji & Vocabulary PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N3V.pdf' },
                        { label: 'N3 Grammar PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N3G.pdf' },
                        { label: 'N3 Reading PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N3R.pdf' },
                        { label: 'N3 Listening PDF', url: 'https://www.jlpt.jp/samples/sample2018/pdf/N3L.pdf' }
                      ].map(res => (
                        <a
                          key={res.label}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all text-xs font-semibold text-slate-800 group"
                        >
                          <span className="truncate pr-2">{res.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* Standard Grid for Other Courses (JFT, All) */}
        {selectedCourseFilter !== 'TRUCK' && selectedCourseFilter !== 'JLPT' && (
          loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-56 bg-slate-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-800">No Exams Active In This Category</h3>
              <p className="text-sm text-slate-500 mt-1">
                Select another course track above or check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map(exam => (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`border text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${getCourseBadgeColor(exam.course_code, exam.title)}`}>
                        {exam.course_code}
                      </span>
                      <div className="flex items-center space-x-1 text-slate-500 text-xs font-mono font-medium">
                        <Clock className="w-3.5 h-3.5 text-rose-600" />
                        <span>{exam.duration_minutes > 0 ? `${exam.duration_minutes} Mins` : 'Untimed'}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors font-japanese leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {exam.description || 'Full Computer-Based mock examination.'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400">Questions:</span>{' '}
                        <strong className="text-slate-800">{exam.question_count} MCQs</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Pass Mark:</span>{' '}
                        <strong className="text-slate-800">
                          {exam.passing_score >= 100 || exam.course_code === 'JFT-BASIC' ? '200 / 250 (80%)' : `${exam.passing_score}%`}
                        </strong>
                      </div>
                    </div>

                    {exam.user_attempts_count > 0 && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <span className="text-slate-500">Best Score:</span>
                        <span className="font-bold text-emerald-600 font-mono">
                          {exam.user_best_percentage}% ({exam.user_attempts_count} {exam.user_attempts_count === 1 ? 'attempt' : 'attempts'})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <Link
                      to={'/exam/' + exam.id}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{exam.user_attempts_count > 0 ? 'Retake Exam Paper' : (exam.duration_minutes > 0 ? `Start ${exam.duration_minutes}-Min Exam` : 'Start Practice Module')}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {attempts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-600" />
              <span>My Exam Attempts & Results History</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-y border-slate-200 font-mono">
                <tr>
                  <th className="py-3.5 px-4">Exam Paper</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Percentage</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map(att => (
                  <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{att.exam_title}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{att.course_code}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {att.score} / {att.total_marks}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{att.percentage}%</td>
                    <td className="py-3.5 px-4">
                      {att.passed === 1 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          PASSED (合格)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          FAILED (不合格)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(att.completed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={'/result/' + att.id}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline"
                      >
                        Review Paper
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Admission Card Printable Modal */}
      {user && (
        <AdmissionCardModal
          isOpen={showAdmissionModal}
          onClose={() => setShowAdmissionModal(false)}
          studentData={{
            name: user.name,
            student_id: user.student_id,
            email: user.email,
            phone: user.phone || 'Campus Record',
            nic_number: user.nic_number || 'Campus Record',
            course_name: user.course_name || 'Japanese Language Studies',
            batch_mode: 'Enrolled Track (Kandy Campus)'
          }}
        />
      )}

      {/* Online 30-Day CBT Exam Pass Subscription Modal ($9.99 / Mo) */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribed={() => {
          if (refreshUser) refreshUser();
        }}
      />

    </div>
  );
}