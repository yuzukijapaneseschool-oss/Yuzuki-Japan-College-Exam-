import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { examAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SubscriptionModal from '../../components/SubscriptionModal';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  ArrowRight, 
  Award,
  Globe,
  Filter,
  Check
} from 'lucide-react';
import JapaneseText from '../../components/JapaneseText';

export default function ExamPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showSubModal, setShowSubModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState('JFT-BASIC');

  const [portalCategories, setPortalCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [examsRes, catsRes] = await Promise.all([
          examAPI.getAvailable(),
          examAPI.getPortalCategories()
        ]);
        setExams(examsRes.data.exams || []);
        setPortalCategories(catsRes.data.categories || []);
      } catch (err) {
        setError('Failed to load exams catalog. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categories = [
    { key: 'ALL', label: 'All Exams (全試験)' },
    { key: 'FREE', label: '✨ Free (JLPT N5-N3)', isFree: true },
    { key: 'PAID', label: '🔒 Paid (JFT / SSW)' },
    ...(portalCategories.length > 0 
      ? portalCategories.map(c => ({
          key: c.category_code,
          label: `${c.category_code.replace('SSW-', '').replace('SSW2-', 'SSW2 ')} (${c.active_exam_count || (c.is_free ? 'Free' : '$9.99')})`,
          fullTitle: c.title,
          isFree: c.is_free,
          activeCount: c.active_exam_count
        }))
      : [
          { key: 'JLPT-N5', label: 'JLPT N5 (Free)', isFree: true },
          { key: 'JLPT-N4', label: 'JLPT N4 (Free)', isFree: true },
          { key: 'JLPT-N3', label: 'JLPT N3 (Free)', isFree: true },
          { key: 'JFT-BASIC', label: 'JFT-Basic A2 (USD 9.99)' },
          { key: 'SSW-CAREGIVER', label: 'SSW Caregiver (介護)' },
          { key: 'SSW-FOOD-SERVICE', label: 'SSW Food Service (外食)' },
          { key: 'SSW-AGRICULTURE', label: 'SSW Agriculture (農業)' },
          { key: 'SSW-TRUCK-DRIVING', label: 'SSW Truck Driving (自動車運送)' },
          { key: 'SSW-AIRPORT-GROUND', label: 'SSW Airport Ground (航空)' },
          { key: 'SSW-AUTOMOBILE', label: 'SSW Automobile (自動車整備)' },
          { key: 'SSW-CONSTRUCTION', label: 'SSW Construction (建設)' },
          { key: 'SSW-FOOD-MANUFACTURING', label: 'SSW Food Mfg (飲食料品製造)' },
          { key: 'SSW-ACCOMMODATION', label: 'SSW Accommodation (宿泊)' },
          { key: 'SSW2-ACCOMMODATION', label: 'SSW2 Accommodation (特定技能2号)' }
        ]
    )
  ];

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      (exam.title && exam.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exam.category && exam.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exam.course_name && exam.course_name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'FREE') return exam.is_free;
    if (selectedCategory === 'PAID') return !exam.is_free;
    return exam.category === selectedCategory;
  });

  const freeExamsCount = exams.filter(e => e.is_free).length;
  const paidExamsCount = exams.filter(e => !e.is_free).length;

  const handleStartExam = (exam) => {
    if (exam.is_free) {
      navigate(`/exam/${exam.id}`);
    } else {
      if (!user) {
        navigate('/login', { state: { redirect: `/exam/${exam.id}` } });
      } else if (exam.has_active_pass || user.role === 'admin') {
        navigate(`/exam/${exam.id}`);
      } else {
        setTargetCategory(exam.category || 'JFT-BASIC');
        setShowSubModal(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-600 selection:text-white pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-rose-950/60 via-slate-950 to-slate-950 border-b border-rose-900/30 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Official Japan Practice Exam Portal • 日本語・特定技能 模擬試験</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-japanese">
            Master JLPT, JFT & SSW Exams with <span className="text-rose-500">Real Exam Papers</span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Practice over 160+ full-length model exam papers and 5,900+ verified Japanese questions. 
            <strong className="text-white"> Free open JLPT practice for all visitors</strong> with instant scoring and detailed answer explanations.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 text-left">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Free JLPT (N5-N3)</p>
                <p className="text-sm font-bold text-white font-japanese">No Login Needed</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">JFT-Basic & SSW</p>
                <p className="text-sm font-bold text-white font-japanese">USD 9.99 — 1 Month</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">10+ SSW Fields</p>
                <p className="text-sm font-bold text-white font-japanese">Official Prometric Format</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Device Security</p>
                <p className="text-sm font-bold text-white font-japanese">One-Device Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel Marketing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Gateway to Japan • 入学・試験対策</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-japanese">
              Start Your Japan Exam Journey
            </h2>
            <p className="text-slate-300 text-sm">
              Practice free JLPT exams or unlock JFT and SSW practice for one month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* FREE PATH */}
            <div className="bg-slate-950/80 border-2 border-emerald-500/40 hover:border-emerald-500/80 rounded-2xl p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    FREE ACCESS
                  </span>
                  <span className="text-xs text-slate-400 font-medium">100% Free</span>
                </div>
                <h3 className="text-lg font-bold text-white font-japanese group-hover:text-emerald-300 transition-colors">
                  JLPT N5 / N4 / N3
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open mock examinations for grammar, vocabulary, reading, and listening. Instant scoring with complete answer explanations.
                </p>
                <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold pt-1">
                  <Check className="w-4 h-4" />
                  <span>No Login Required</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedCategory('FREE');
                    const el = document.getElementById('exam-catalog-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-950"
                >
                  <span>Start Free Practice</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PAID PATH */}
            <div className="bg-slate-950/80 border-2 border-rose-500/40 hover:border-rose-500/80 rounded-2xl p-6 flex flex-col justify-between transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    PAID PRACTICE
                  </span>
                  <span className="text-xs text-amber-400 font-bold">USD 9.99</span>
                </div>
                <h3 className="text-lg font-bold text-white font-japanese group-hover:text-rose-300 transition-colors">
                  JFT-BASIC / SSW Categories
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Official CBT Prometric simulations across 10+ SSW sectors (Caregiver, Truck Driving, Aviation, Hospitality, Food Service).
                </p>
                <div className="inline-flex items-center space-x-1.5 text-xs text-amber-400 font-semibold pt-1">
                  <Lock className="w-4 h-4" />
                  <span>USD 9.99 — 1 Month Access • Registration Required</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/exam-register', { state: { redirect: '/portal' } });
                    } else {
                      setSelectedCategory('PAID');
                      const el = document.getElementById('exam-catalog-anchor');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-950"
                >
                  <span>{user ? 'Explore Paid Practice' : 'Register & Practice'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="exam-catalog-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Controls: Search and Filter Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exams by title, level, or skill category..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>

            {/* Free vs Paid Toggle Pill */}
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'ALL' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({exams.length})
              </button>
              <button
                onClick={() => setSelectedCategory('FREE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'FREE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✨ Free ({freeExamsCount})
              </button>
              <button
                onClick={() => setSelectedCategory('PAID')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'PAID' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🔒 Paid ({paidExamsCount})
              </button>
            </div>
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.key
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exam Cards Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-400 font-japanese">Loading Practice Exam Catalog...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-950/30 border border-rose-800/50 rounded-2xl text-center text-rose-300">
            <p>{error}</p>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="p-12 bg-slate-900/50 border border-slate-800 rounded-3xl text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white font-japanese">No Exams Found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map(exam => {
              const isFree = exam.is_free;
              const hasPass = exam.has_active_pass || user?.role === 'admin';

              return (
                <div 
                  key={exam.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group hover:scale-[1.01]"
                >
                  <div className="space-y-3">
                    {/* Badge Strip */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                        {exam.category || 'EXAM'}
                      </span>

                      {isFree ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <Sparkles className="w-3 h-3" />
                          <span>FREE PRACTICE</span>
                        </span>
                      ) : hasPass ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PASS ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          <Lock className="w-3 h-3" />
                          <span>USD 9.99 — 1-Mo</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-white font-japanese group-hover:text-rose-400 transition-colors line-clamp-2">
                        {exam.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-japanese">
                        {exam.description || `${exam.course_name} official practice mock examination.`}
                      </p>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exam.duration_minutes || 60} mins</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exam.question_count || 0} Qs</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-slate-500" />
                        <span>Pass {exam.passing_score || 60}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleStartExam(exam)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md ${
                        isFree
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                          : hasPass
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950'
                          : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-950'
                      }`}
                    >
                      {isFree ? (
                        <>
                          <span>Start Free Exam Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : hasPass ? (
                        <>
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Start Exam Session</span>
                        </>
                      ) : !user ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Login to Unlock (USD 9.99)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock 1-Month Pass (USD 9.99)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subscription / Checkout Modal */}
      {showSubModal && (
        <SubscriptionModal 
          isOpen={showSubModal} 
          onClose={() => setShowSubModal(false)}
          onSubscribed={async () => {
            setShowSubModal(false);
            const res = await examAPI.getAvailable();
            setExams(res.data.exams || []);
          }}
        />
      )}
    </div>
  );
}
