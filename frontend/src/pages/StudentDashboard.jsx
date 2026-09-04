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
  CreditCard
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
  const isTruckStudent = Boolean((user?.student_id && user?.student_id.startsWith('YTD')) || user?.course_id === 7 || user?.course_code === 'SSW-TRUCK-DRIVING');
  const isJapaneseStudent = Boolean((user?.student_id && user?.student_id.startsWith('YJP')) || [1, 2, 3, 4].includes(user?.course_id));

  const [selectedCourseFilter, setSelectedCourseFilter] = useState(
    isTruckStudent && !isDualTrack ? 'TRUCK' : 'ALL'
  );

  useEffect(() => {
    if (isTruckStudent && !isDualTrack) {
      setSelectedCourseFilter('TRUCK');
    }
  }, [user?.student_id, isTruckStudent, isDualTrack]);

  const [selectedTruckCategory, setSelectedTruckCategory] = useState('Driver Basics');

  const filteredExams = (exams || []).filter(exam => {
    if (selectedCourseFilter === 'ALL') return true;
    if (selectedCourseFilter === 'JFT') return exam.course_code === 'JFT-BASIC';
    if (selectedCourseFilter === 'TRUCK') return exam.course_code === 'SSW-TRUCK-DRIVING';
    if (selectedCourseFilter === 'JLPT') return ['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(exam.course_code);
    if (selectedCourseFilter === 'SSW_OTHER') return exam.course_code && exam.course_code.startsWith('SSW-') && exam.course_code !== 'SSW-TRUCK-DRIVING';
    return true;
  });

  const truckCategoryExams = (exams || []).filter(exam => 
    exam.course_code === 'SSW-TRUCK-DRIVING' && 
    exam.description && 
    exam.description.toLowerCase().includes(selectedTruckCategory.toLowerCase())
  );

  let availableTabs = [];
  if (isDualTrack) {
    availableTabs = [
      { id: 'ALL', label: 'All Exams (සියලුම විභාග)' },
      { id: 'TRUCK', label: '🚚 SSW Truck Driving (自動車運送業)' },
      { id: 'JFT', label: 'JFT-Basic (A2)' },
      { id: 'JLPT', label: 'JLPT (N5 / N4 / N3)' },
      { id: 'SSW_OTHER', label: 'Other SSW Vocational' }
    ];
  } else if (isTruckStudent) {
    availableTabs = [
      { id: 'TRUCK', label: '🚚 SSW Truck Driving (自動車運送業 - 583 Furigana MCQs)' }
    ];
  } else {
    availableTabs = [
      { id: 'ALL', label: 'All Japanese Exams (ජපන් භාෂා විභාග)' },
      { id: 'JFT', label: 'JFT-Basic (A2)' },
      { id: 'JLPT', label: 'JLPT (N5 / N4 / N3)' }
    ];
  }

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
                    <span>🌟 Dual Track Active (YJP + YTD)</span>
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

        {/* Standard Grid for Other Courses (JFT, JLPT, All) */}
        {selectedCourseFilter !== 'TRUCK' && (
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
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
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
                        <strong className="text-slate-800">{exam.passing_score}%</strong>
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