import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, courseAPI } from '../../services/api';
import { 
  FileText, 
  Plus, 
  Clock, 
  Award, 
  Layers, 
  Edit, 
  Trash2, 
  ListChecks, 
  CheckCircle, 
  Eye,
  AlertCircle,
  Search,
  Car,
  Truck,
  Hotel,
  Sprout,
  BookOpen,
  Briefcase,
  Sparkles,
  X,
  Filter
} from 'lucide-react';

export default function QuizManager() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    duration_minutes: 60,
    passing_score: 50,
    description: '',
    is_active: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examsRes, coursesRes] = await Promise.all([
        adminAPI.getExams(),
        courseAPI.getAll()
      ]);
      setExams(examsRes.data.exams || []);
      setCourses(coursesRes.data.courses || []);
      if (coursesRes.data.courses?.length > 0 && !formData.course_id) {
        setFormData(prev => ({ ...prev, course_id: coursesRes.data.courses[0].id }));
      }
    } catch (err) {
      console.error('Failed to load exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await adminAPI.updateExam(editingExam.id, formData);
      } else {
        await adminAPI.createExam(formData);
      }
      setShowCreateModal(false);
      setEditingExam(null);
      setFormData({
        title: '',
        course_id: courses[0]?.id || '',
        duration_minutes: 60,
        passing_score: 50,
        description: '',
        is_active: true
      });
      fetchData();
    } catch (err) {
      alert('Error saving exam: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete exam "${title}"? All associated questions will be removed.`)) return;
    try {
      await adminAPI.deleteExam(id);
      fetchData();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const openEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      course_id: exam.course_id,
      duration_minutes: exam.duration_minutes,
      passing_score: exam.passing_score,
      description: exam.description || '',
      is_active: exam.is_active === 1
    });
    setShowCreateModal(true);
  };

  // Helper function to determine exam category
  const getExamCategory = (exam) => {
    const code = exam.course_code || '';
    const title = (exam.title || '').toLowerCase();

    if (code === 'JFT-BASIC' || title.includes('jft')) return 'JFT';
    if (code === 'SSW-AGRICULTURE' || title.includes('agriculture') || title.includes('農業') || title.includes('耕種')) return 'AGRI';
    if (code === 'SSW-ACCOMMODATION' || title.includes('accommodation') || title.includes('宿泊業') || title.includes('hotel')) return 'ACCOM';
    if (code === 'SSW-AUTOMOBILE' || title.includes('automobile') || title.includes('自動車整備')) return 'AUTO';
    if (code === 'SSW-TRUCK-DRIVING' || title.includes('truck') || title.includes('トラック') || title.includes('運送')) return 'TRUCK';
    if (['JLPT-N5', 'JLPT-N4', 'JLPT-N3', 'JLPT-N2', 'JLPT-N1'].includes(code) || title.includes('jlpt')) return 'JLPT';
    if (code.startsWith('SSW-')) return 'SSW_OTHER';
    return 'OTHER';
  };

  // Category counts
  const jftCount = exams.filter(e => getExamCategory(e) === 'JFT').length;
  const agriCount = exams.filter(e => getExamCategory(e) === 'AGRI').length;
  const accomCount = exams.filter(e => getExamCategory(e) === 'ACCOM').length;
  const autoCount = exams.filter(e => getExamCategory(e) === 'AUTO').length;
  const truckCount = exams.filter(e => getExamCategory(e) === 'TRUCK').length;
  const jlptCount = exams.filter(e => getExamCategory(e) === 'JLPT').length;
  const otherSswCount = exams.filter(e => getExamCategory(e) === 'SSW_OTHER').length;

  const totalQuestions = exams.reduce((acc, e) => acc + (e.question_count || 0), 0);
  const agriQuestions = exams.filter(e => getExamCategory(e) === 'AGRI').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const accomQuestions = exams.filter(e => getExamCategory(e) === 'ACCOM').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const autoQuestions = exams.filter(e => getExamCategory(e) === 'AUTO').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const jftQuestions = exams.filter(e => getExamCategory(e) === 'JFT').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const truckQuestions = exams.filter(e => getExamCategory(e) === 'TRUCK').reduce((acc, e) => acc + (e.question_count || 0), 0);

  // Tabs list
  const categoryTabs = [
    { id: 'ALL', label: 'All Exams', subLabel: 'සියලුම විභාග', count: exams.length, icon: Layers, color: 'slate' },
    { id: 'JFT', label: 'JFT-Basic (A2)', subLabel: '13 Model Papers', count: jftCount, icon: BookOpen, color: 'rose' },
    { id: 'AGRI', label: 'SSW Agriculture', subLabel: '農業・耕種 (376 Qs)', count: agriCount, icon: Sprout, color: 'emerald' },
    { id: 'ACCOM', label: 'SSW Accommodation', subLabel: '宿泊業 (246 Qs)', count: accomCount, icon: Hotel, color: 'indigo' },
    { id: 'AUTO', label: 'SSW Automobile', subLabel: '自動車整備 (419 Qs)', count: autoCount, icon: Car, color: 'amber' },
    { id: 'TRUCK', label: 'SSW Truck Driving', subLabel: 'トラック運転 (583 Qs)', count: truckCount, icon: Truck, color: 'sky' },
    { id: 'JLPT', label: 'JLPT Levels', subLabel: 'N5 / N4 / N3', count: jlptCount, icon: Award, color: 'purple' },
    { id: 'SSW_OTHER', label: 'Other SSW Sectors', subLabel: 'Caregiver / Food', count: otherSswCount, icon: Briefcase, color: 'slate' },
  ];

  // Filtering
  const filteredExams = exams.filter(exam => {
    // Category match
    const cat = getExamCategory(exam);
    if (activeCategory !== 'ALL' && cat !== activeCategory) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (exam.title || '').toLowerCase().includes(q);
      const matchDesc = (exam.description || '').toLowerCase().includes(q);
      const matchCode = (exam.course_code || '').toLowerCase().includes(q);
      const matchName = (exam.course_name || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCode && !matchName) return false;
    }

    return true;
  });

  // Badge style helper
  const getBadgeStyle = (cat) => {
    switch (cat) {
      case 'JFT':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'AGRI':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'ACCOM':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'AUTO':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'TRUCK':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'JLPT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SSW_OTHER':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'JFT': return <BookOpen className="w-3.5 h-3.5 mr-1" />;
      case 'AGRI': return <Sprout className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
      case 'ACCOM': return <Hotel className="w-3.5 h-3.5 mr-1 text-indigo-600" />;
      case 'AUTO': return <Car className="w-3.5 h-3.5 mr-1 text-amber-600" />;
      case 'TRUCK': return <Truck className="w-3.5 h-3.5 mr-1 text-sky-600" />;
      case 'JLPT': return <Award className="w-3.5 h-3.5 mr-1 text-purple-600" />;
      case 'SSW_OTHER': return <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-600" />;
      default: return <FileText className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-japanese">
      
      {/* Header & Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Examination & Quiz Management
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                ප්‍රශ්න පත්‍ර සහ විභාග මොඩියුල කළමනාකරණය (JFT, SSW Agriculture, SSW Accommodation, SSW Automobile, SSW Truck & JLPT)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingExam(null);
            setShowCreateModal(true);
          }}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Exam</span>
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-rose-500/10 via-white to-white p-3.5 sm:p-4 rounded-2xl border border-rose-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-rose-900/60 uppercase tracking-wider">JFT-Basic</p>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{jftCount} Papers</h4>
            <p className="text-[10px] sm:text-[11px] text-rose-600 font-medium">{jftQuestions} Qs</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-900/60 uppercase tracking-wider">SSW Agriculture</p>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{agriCount} Modules</h4>
            <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium">{agriQuestions} Agri MCQs</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 via-white to-white p-3.5 sm:p-4 rounded-2xl border border-indigo-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Hotel className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-indigo-900/60 uppercase tracking-wider">SSW Accom.</p>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{accomCount} Modules</h4>
            <p className="text-[10px] sm:text-[11px] text-indigo-600 font-medium">{accomQuestions} MCQs</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 via-white to-white p-3.5 sm:p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-amber-900/60 uppercase tracking-wider">SSW Auto</p>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{autoCount} Modules</h4>
            <p className="text-[10px] sm:text-[11px] text-amber-600 font-medium">{autoQuestions} MCQs</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-500/10 via-white to-white p-3.5 sm:p-4 rounded-2xl border border-sky-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-sky-900/60 uppercase tracking-wider">SSW Truck</p>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{truckCount} Modules</h4>
            <p className="text-[10px] sm:text-[11px] text-sky-600 font-medium">{truckQuestions} MCQs</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-500/10 via-white to-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total System</p>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{exams.length} Exams</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">{totalQuestions} Total Qs</p>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {categoryTabs.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 border shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Results Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exams by title, module name, or course code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 px-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Showing <strong>{filteredExams.length}</strong> of <strong>{exams.length}</strong> examinations</span>
          </div>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ))
        ) : filteredExams.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No exams found in this category</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery 
                ? `No results matched "${searchQuery}". Try changing your search keywords or switching category tabs.`
                : 'No examinations are available in this category yet. Click "Create New Exam" above to add one.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredExams.map(exam => {
            const cat = getExamCategory(exam);
            const badgeCls = getBadgeStyle(cat);

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Course Badge & Duration */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg border ${badgeCls}`}>
                      {getCategoryIcon(cat)}
                      <span className="truncate max-w-[130px]">{exam.course_code}</span>
                    </span>

                    <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>{exam.duration_minutes} Mins</span>
                    </div>
                  </div>

                  {/* Exam Title */}
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-rose-600 transition-colors">
                    {exam.title}
                  </h3>

                  {/* Course Name subtitle */}
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    {exam.course_name}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {exam.description || 'No specific description provided.'}
                  </p>

                  {/* Quick Info Grid */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Total MCQs</span>
                      <strong className="text-slate-800 text-sm font-mono">
                        {exam.question_count || 0} Questions
                      </strong>
                    </div>

                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">Passing Criteria</span>
                      <strong className="text-slate-800 text-sm font-mono">
                        {exam.passing_score >= 100 ? `${exam.passing_score} / 250` : `${exam.passing_score}%`}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/admin/quizzes/${exam.id}/questions`}
                    className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <ListChecks className="w-4 h-4" />
                    <span>Manage Questions ({exam.question_count || 0})</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => openEdit(exam)}
                    className="p-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs transition-colors cursor-pointer"
                    title="Edit Exam Settings"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(exam.id, exam.title)}
                    className="p-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs transition-colors cursor-pointer"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingExam ? 'Edit Exam Settings' : 'Create New Examination Paper'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Exam Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JFT-Basic Official Model Paper 02 (60 Minutes)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none font-japanese"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Course / Sector <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none bg-white"
                  >
                    <optgroup label="General Japanese Languages">
                      {courses.filter(c => !c.code?.startsWith('SSW-')).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Specified Skilled Worker (SSW)">
                      {courses.filter(c => c.code?.startsWith('SSW-')).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Duration (Minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="300"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Passing Score <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="250"
                    placeholder="e.g. 200 for JFT or 60 for SSW"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">JFT standard: 200 / SSW standard: 60</span>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Active (Visible in Student CBT)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. 60-minute JFT paper with Listening comprehension tracks."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none font-japanese"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-rose-600/30 transition-all cursor-pointer"
                >
                  {editingExam ? 'Save Changes' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}