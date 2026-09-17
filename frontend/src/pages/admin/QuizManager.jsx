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
  HeartHandshake,
  UtensilsCrossed,
  Plane,
  HardHat,
  Factory,
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
    if (code === 'SSW2-ACCOMMODATION' || title.includes('ssw 2') || title.includes('特定技能2号') || title.includes('2号')) return 'SSW2_ACCOM';
    if (code === 'SSW-FOOD-MANUFACTURING' || title.includes('food manufacturing') || title.includes('飲食料品製造') || title.includes('製造業') || title.includes('seizougyou')) return 'FOOD_MANU';
    if (code === 'SSW-CONSTRUCTION' || title.includes('construction') || title.includes('建設') || title.includes('土木') || title.includes('型枠') || title.includes('鉄筋') || title.includes('kensetsu')) return 'CONSTRUCTION';
    if (code === 'SSW-AIRPORT-GROUND' || title.includes('aviation') || title.includes('airport') || title.includes('航空') || title.includes('グランドハンドリング')) return 'AVIATION';
    if (code === 'SSW-FOOD-SERVICE' || ((title.includes('food') || title.includes('外食') || title.includes('restaurant') || title.includes('cooking')) && !title.includes('manufacturing') && !title.includes('製造'))) return 'FOOD';
    if (code === 'SSW-CAREGIVER' || title.includes('caregiver') || title.includes('介護') || title.includes('nursing')) return 'CAREGIVER';
    if (code === 'SSW-AGRICULTURE' || title.includes('agriculture') || title.includes('農業') || title.includes('耕種')) return 'AGRI';
    if (code === 'SSW-ACCOMMODATION' || title.includes('accommodation') || title.includes('宿泊業') || title.includes('hotel')) return 'ACCOM';
    if (code === 'SSW-AUTOMOBILE' || title.includes('automobile') || title.includes('自動車整備')) return 'AUTO';
    if (code === 'SSW-TRUCK-DRIVING' || title.includes('truck') || title.includes('トラック') || title.includes('運送')) return 'TRUCK';
    if (['JLPT-N5', 'JLPT-N4', 'JLPT-N3', 'JLPT-N2', 'JLPT-N1'].includes(code) || title.includes('jlpt')) return 'JLPT';
    if (code.startsWith('SSW-') || code.startsWith('SSW2-')) return 'SSW_OTHER';
    return 'OTHER';
  };

  // Category counts
  const jftCount = exams.filter(e => getExamCategory(e) === 'JFT').length;
  const ssw2AccomCount = exams.filter(e => getExamCategory(e) === 'SSW2_ACCOM').length;
  const foodManuCount = exams.filter(e => getExamCategory(e) === 'FOOD_MANU').length;
  const constructionCount = exams.filter(e => getExamCategory(e) === 'CONSTRUCTION').length;
  const aviationCount = exams.filter(e => getExamCategory(e) === 'AVIATION').length;
  const foodCount = exams.filter(e => getExamCategory(e) === 'FOOD').length;
  const caregiverCount = exams.filter(e => getExamCategory(e) === 'CAREGIVER').length;
  const agriCount = exams.filter(e => getExamCategory(e) === 'AGRI').length;
  const accomCount = exams.filter(e => getExamCategory(e) === 'ACCOM').length;
  const autoCount = exams.filter(e => getExamCategory(e) === 'AUTO').length;
  const truckCount = exams.filter(e => getExamCategory(e) === 'TRUCK').length;
  const jlptCount = exams.filter(e => getExamCategory(e) === 'JLPT').length;
  const otherSswCount = exams.filter(e => getExamCategory(e) === 'SSW_OTHER').length;

  const totalQuestions = exams.reduce((acc, e) => acc + (e.question_count || 0), 0);
  const ssw2AccomQuestions = exams.filter(e => getExamCategory(e) === 'SSW2_ACCOM').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const foodManuQuestions = exams.filter(e => getExamCategory(e) === 'FOOD_MANU').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const constructionQuestions = exams.filter(e => getExamCategory(e) === 'CONSTRUCTION').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const aviationQuestions = exams.filter(e => getExamCategory(e) === 'AVIATION').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const foodQuestions = exams.filter(e => getExamCategory(e) === 'FOOD').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const caregiverQuestions = exams.filter(e => getExamCategory(e) === 'CAREGIVER').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const agriQuestions = exams.filter(e => getExamCategory(e) === 'AGRI').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const accomQuestions = exams.filter(e => getExamCategory(e) === 'ACCOM').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const autoQuestions = exams.filter(e => getExamCategory(e) === 'AUTO').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const jftQuestions = exams.filter(e => getExamCategory(e) === 'JFT').reduce((acc, e) => acc + (e.question_count || 0), 0);
  const truckQuestions = exams.filter(e => getExamCategory(e) === 'TRUCK').reduce((acc, e) => acc + (e.question_count || 0), 0);

  // Sector Quick Filter Cards configuration
  const sectorOverviewCards = [
    {
      id: 'SSW2_ACCOM',
      name: 'SSW 2 Accom.',
      fullName: 'Accommodation (特定技能2号 宿泊業)',
      sub: '特定技能2号 宿泊',
      tag: 'SSW 2',
      tagBg: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
      modules: `${ssw2AccomCount} Modules`,
      questions: `${ssw2AccomQuestions} MCQs`,
      icon: Hotel,
      cardBg: 'from-fuchsia-500/10 via-fuchsia-50/40 to-white',
      border: 'border-fuchsia-200 hover:border-fuchsia-400',
      iconBg: 'bg-fuchsia-100 border-fuchsia-200 text-fuchsia-700',
      badgeText: 'text-fuchsia-700'
    },
    {
      id: 'FOOD_MANU',
      name: 'Food Manu.',
      fullName: 'Food & Beverage Manufacturing (飲食料品製造)',
      sub: '飲食料品製造',
      tag: 'SSW 1',
      tagBg: 'bg-lime-100 text-lime-800 border-lime-200',
      modules: `${foodManuCount} Modules`,
      questions: `${foodManuQuestions} Qs`,
      icon: Factory,
      cardBg: 'from-lime-500/10 via-lime-50/40 to-white',
      border: 'border-lime-200 hover:border-lime-400',
      iconBg: 'bg-lime-100 border-lime-200 text-lime-700',
      badgeText: 'text-lime-700'
    },
    {
      id: 'CONSTRUCTION',
      name: 'Construction',
      fullName: 'Construction Industry (建設業)',
      sub: '建設業',
      tag: 'SSW 1',
      tagBg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      modules: `${constructionCount} Modules`,
      questions: `${constructionQuestions} Qs`,
      icon: HardHat,
      cardBg: 'from-yellow-500/10 via-yellow-50/40 to-white',
      border: 'border-yellow-200 hover:border-yellow-400',
      iconBg: 'bg-yellow-100 border-yellow-200 text-yellow-700',
      badgeText: 'text-yellow-700'
    },
    {
      id: 'AVIATION',
      name: 'Aviation',
      fullName: 'Airport Ground Handling (航空・空港)',
      sub: '航空グランド',
      tag: 'SSW 1',
      tagBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      modules: `${aviationCount} Modules`,
      questions: `${aviationQuestions} Qs`,
      icon: Plane,
      cardBg: 'from-cyan-500/10 via-cyan-50/40 to-white',
      border: 'border-cyan-200 hover:border-cyan-400',
      iconBg: 'bg-cyan-100 border-cyan-200 text-cyan-700',
      badgeText: 'text-cyan-700'
    },
    {
      id: 'FOOD',
      name: 'Food Service',
      fullName: 'Food Service / Restaurant (外食業)',
      sub: '外食業',
      tag: 'SSW 1',
      tagBg: 'bg-orange-100 text-orange-800 border-orange-200',
      modules: `${foodCount} Modules`,
      questions: `${foodQuestions} Qs`,
      icon: UtensilsCrossed,
      cardBg: 'from-orange-500/10 via-orange-50/40 to-white',
      border: 'border-orange-200 hover:border-orange-400',
      iconBg: 'bg-orange-100 border-orange-200 text-orange-700',
      badgeText: 'text-orange-700'
    },
    {
      id: 'CAREGIVER',
      name: 'Caregiving',
      fullName: 'Nursing Caregiver (介護福祉)',
      sub: '介護福祉',
      tag: 'SSW 1',
      tagBg: 'bg-teal-100 text-teal-800 border-teal-200',
      modules: `${caregiverCount} Modules`,
      questions: `${caregiverQuestions} Qs`,
      icon: HeartHandshake,
      cardBg: 'from-teal-500/10 via-teal-50/40 to-white',
      border: 'border-teal-200 hover:border-teal-400',
      iconBg: 'bg-teal-100 border-teal-200 text-teal-700',
      badgeText: 'text-teal-700'
    },
    {
      id: 'AGRI',
      name: 'Agriculture',
      fullName: 'Agriculture & Crop Cultivation (農業・耕種)',
      sub: '農業・耕種',
      tag: 'SSW 1',
      tagBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      modules: `${agriCount} Modules`,
      questions: `${agriQuestions} Qs`,
      icon: Sprout,
      cardBg: 'from-emerald-500/10 via-emerald-50/40 to-white',
      border: 'border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-100 border-emerald-200 text-emerald-700',
      badgeText: 'text-emerald-700'
    },
    {
      id: 'ACCOM',
      name: 'Accom. (Type 1)',
      fullName: 'Accommodation (特定技能1号 宿泊業)',
      sub: '宿泊業 1号',
      tag: 'SSW 1',
      tagBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      modules: `${accomCount} Modules`,
      questions: `${accomQuestions} Qs`,
      icon: Hotel,
      cardBg: 'from-indigo-500/10 via-indigo-50/40 to-white',
      border: 'border-indigo-200 hover:border-indigo-400',
      iconBg: 'bg-indigo-100 border-indigo-200 text-indigo-700',
      badgeText: 'text-indigo-700'
    },
    {
      id: 'AUTO',
      name: 'Automobile',
      fullName: 'Automobile Maintenance (自動車整備)',
      sub: '自動車整備',
      tag: 'SSW 1',
      tagBg: 'bg-amber-100 text-amber-800 border-amber-200',
      modules: `${autoCount} Modules`,
      questions: `${autoQuestions} Qs`,
      icon: Car,
      cardBg: 'from-amber-500/10 via-amber-50/40 to-white',
      border: 'border-amber-200 hover:border-amber-400',
      iconBg: 'bg-amber-100 border-amber-200 text-amber-700',
      badgeText: 'text-amber-700'
    },
    {
      id: 'TRUCK',
      name: 'Truck Driving',
      fullName: 'Automobile Transportation (トラック運転)',
      sub: '自動車運送',
      tag: 'SSW 1',
      tagBg: 'bg-sky-100 text-sky-800 border-sky-200',
      modules: `${truckCount} Modules`,
      questions: `${truckQuestions} Qs`,
      icon: Truck,
      cardBg: 'from-sky-500/10 via-sky-50/40 to-white',
      border: 'border-sky-200 hover:border-sky-400',
      iconBg: 'bg-sky-100 border-sky-200 text-sky-700',
      badgeText: 'text-sky-700'
    },
    {
      id: 'JFT',
      name: 'JFT-Basic (A2)',
      fullName: 'Japan Foundation Test A2 (国際交流基金)',
      sub: '国際交流基金 A2',
      tag: 'JFT',
      tagBg: 'bg-rose-100 text-rose-800 border-rose-200',
      modules: `${jftCount} Papers`,
      questions: `${jftQuestions} Qs`,
      icon: BookOpen,
      cardBg: 'from-rose-500/10 via-rose-50/40 to-white',
      border: 'border-rose-200 hover:border-rose-400',
      iconBg: 'bg-rose-100 border-rose-200 text-rose-700',
      badgeText: 'text-rose-700'
    },
    {
      id: 'JLPT',
      name: 'JLPT Levels',
      fullName: 'Japanese-Language Proficiency Test (日本語能力試験)',
      sub: '日本語能力試験',
      tag: 'JLPT',
      tagBg: 'bg-purple-100 text-purple-800 border-purple-200',
      modules: `${jlptCount || 5} Levels`,
      questions: `${jlptQuestions || 100} Qs`,
      icon: Award,
      cardBg: 'from-purple-500/10 via-purple-50/40 to-white',
      border: 'border-purple-200 hover:border-purple-400',
      iconBg: 'bg-purple-100 border-purple-200 text-purple-700',
      badgeText: 'text-purple-700'
    }
  ];

  // Tabs list
  const categoryTabs = [
    { id: 'ALL', label: 'All Exams', subLabel: 'සියලුම විභාග', count: exams.length, icon: Layers, color: 'slate' },
    { id: 'SSW2_ACCOM', label: 'SSW 2 Accommodation', subLabel: '特定技能2号 宿泊業 (580 Qs)', count: ssw2AccomCount, icon: Hotel, color: 'fuchsia' },
    { id: 'FOOD_MANU', label: 'SSW Food Manufacturing', subLabel: '飲食料品製造 (371 Qs)', count: foodManuCount, icon: Factory, color: 'lime' },
    { id: 'CONSTRUCTION', label: 'SSW Construction', subLabel: '建設業 (530 Qs)', count: constructionCount, icon: HardHat, color: 'yellow' },
    { id: 'AVIATION', label: 'SSW Aviation', subLabel: '航空業 (297 Qs)', count: aviationCount, icon: Plane, color: 'cyan' },
    { id: 'FOOD', label: 'SSW Food Service', subLabel: '外食業 (325 Qs)', count: foodCount, icon: UtensilsCrossed, color: 'orange' },
    { id: 'CAREGIVER', label: 'SSW Caregiving', subLabel: '介護 (758 Qs)', count: caregiverCount, icon: HeartHandshake, color: 'teal' },
    { id: 'AGRI', label: 'SSW Agriculture', subLabel: '農業・耕種 (376 Qs)', count: agriCount, icon: Sprout, color: 'emerald' },
    { id: 'ACCOM', label: 'SSW Accommodation', subLabel: '宿泊業 (246 Qs)', count: accomCount, icon: Hotel, color: 'indigo' },
    { id: 'AUTO', label: 'SSW Automobile', subLabel: '自動車整備 (419 Qs)', count: autoCount, icon: Car, color: 'amber' },
    { id: 'TRUCK', label: 'SSW Truck Driving', subLabel: 'トラック運転 (583 Qs)', count: truckCount, icon: Truck, color: 'sky' },
    { id: 'JFT', label: 'JFT-Basic (A2)', subLabel: '13 Model Papers', count: jftCount, icon: BookOpen, color: 'rose' },
    { id: 'JLPT', label: 'JLPT Levels', subLabel: 'N5 / N4 / N3', count: jlptCount, icon: Award, color: 'purple' },
    { id: 'SSW_OTHER', label: 'Other SSW Sectors', subLabel: 'Others', count: otherSswCount, icon: Briefcase, color: 'slate' },
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
      case 'SSW2_ACCOM':
        return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-300';
      case 'FOOD_MANU':
        return 'bg-lime-50 text-lime-800 border-lime-300';
      case 'CONSTRUCTION':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300';
      case 'AVIATION':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300';
      case 'FOOD':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      case 'CAREGIVER':
        return 'bg-teal-50 text-teal-800 border-teal-300';
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
      case 'SSW2_ACCOM': return <Hotel className="w-3.5 h-3.5 mr-1 text-fuchsia-600" />;
      case 'FOOD_MANU': return <Factory className="w-3.5 h-3.5 mr-1 text-lime-600" />;
      case 'CONSTRUCTION': return <HardHat className="w-3.5 h-3.5 mr-1 text-yellow-600" />;
      case 'AVIATION': return <Plane className="w-3.5 h-3.5 mr-1 text-cyan-600" />;
      case 'FOOD': return <UtensilsCrossed className="w-3.5 h-3.5 mr-1 text-orange-600" />;
      case 'CAREGIVER': return <HeartHandshake className="w-3.5 h-3.5 mr-1 text-teal-600" />;
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
                ප්‍රශ්න පත්‍ර සහ විභාග මොඩියුල කළමනාකරණය (JFT, SSW Food Manufacturing, SSW Construction, SSW Aviation, SSW Food Service, SSW Caregiving, SSW Agriculture, SSW Accommodation, SSW Automobile, SSW Truck & JLPT)
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

      {/* Executive 4-Pillar Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Total System */}
        <div 
          onClick={() => setActiveCategory('ALL')}
          className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg border border-slate-700/60 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group ${
            activeCategory === 'ALL' ? 'ring-2 ring-rose-400 shadow-rose-900/20' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total System Exams</span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">{exams.length} Exams</div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-rose-400">{totalQuestions.toLocaleString()} Total Questions</span>
              <span className="text-slate-500">•</span>
              <span>12 Sectors</span>
            </p>
          </div>
        </div>

        {/* Pillar 2: SSW Type 2 */}
        <div 
          onClick={() => setActiveCategory(activeCategory === 'SSW2_ACCOM' ? 'ALL' : 'SSW2_ACCOM')}
          className={`p-5 rounded-2xl bg-gradient-to-br from-fuchsia-950 via-purple-900 to-slate-900 text-white shadow-lg border border-fuchsia-700/40 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group ${
            activeCategory === 'SSW2_ACCOM' ? 'ring-2 ring-fuchsia-400 shadow-fuchsia-900/30' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SSW Type 2 (特定技能2号)
            </span>
            <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Hotel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">{ssw2AccomCount} Modules</div>
            <p className="text-xs text-fuchsia-200 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-amber-300">{ssw2AccomQuestions} MCQs</span>
              <span className="text-fuchsia-400">•</span>
              <span>Accommodation Industry</span>
            </p>
          </div>
        </div>

        {/* Pillar 3: SSW Type 1 (9 Sectors) */}
        <div 
          onClick={() => setActiveCategory(activeCategory === 'FOOD_MANU' ? 'ALL' : 'FOOD_MANU')}
          className={`p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 text-white shadow-lg border border-indigo-700/40 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">SSW Type 1 (9 Sectors)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {exams.length - ssw2AccomCount - jftCount - jlptCount} Modules
            </div>
            <p className="text-xs text-cyan-200 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-cyan-300">
                {(totalQuestions - ssw2AccomQuestions - jftQuestions - (jlptQuestions || 0)).toLocaleString()} MCQs
              </span>
              <span className="text-slate-500">•</span>
              <span>9 Industrial Sectors</span>
            </p>
          </div>
        </div>

        {/* Pillar 4: JFT-Basic & Language */}
        <div 
          onClick={() => setActiveCategory(activeCategory === 'JFT' ? 'ALL' : 'JFT')}
          className={`p-5 rounded-2xl bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 text-white shadow-lg border border-rose-700/40 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group ${
            activeCategory === 'JFT' ? 'ring-2 ring-rose-400 shadow-rose-900/30' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">JFT-Basic & Language</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">{jftCount} Papers</div>
            <p className="text-xs text-rose-200 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-amber-300">{jftQuestions} Qs</span>
              <span className="text-rose-400">•</span>
              <span>A2 Foundation & JLPT</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sector Quick Filter Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Curriculum Tracks & Specialized Sectors (විෂය ක්ෂේත්‍ර ප්‍රශ්න පත්‍ර)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any sector card to filter exams immediately</p>
          </div>
          {activeCategory !== 'ALL' && (
            <button
              type="button"
              onClick={() => setActiveCategory('ALL')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors border border-rose-200"
            >
              Reset Filter (Show All)
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {sectorOverviewCards.map(sector => {
            const Icon = sector.icon;
            const isSelected = activeCategory === sector.id;
            return (
              <div 
                key={sector.id}
                onClick={() => setActiveCategory(isSelected ? 'ALL' : sector.id)}
                className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between bg-gradient-to-br ${sector.cardBg} ${sector.border} ${
                  isSelected 
                    ? 'ring-2 ring-rose-500 shadow-md transform -translate-y-0.5 bg-white' 
                    : 'hover:-translate-y-0.5 hover:shadow-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-2.5">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${sector.iconBg} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border tracking-wider uppercase ${sector.tagBg}`}>
                      {sector.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors truncate" title={sector.fullName}>
                      {sector.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{sector.sub}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-baseline justify-between gap-1 text-[11px]">
                  <span className="font-bold text-slate-900">{sector.modules}</span>
                  <span className={`font-semibold ${sector.badgeText}`}>{sector.questions}</span>
                </div>
              </div>
            );
          })}
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