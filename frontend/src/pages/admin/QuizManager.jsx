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
  AlertCircle
} from 'lucide-react';

export default function QuizManager() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
            <FileText className="w-6 h-6 text-rose-600" />
            <span>Examination & Quiz Management</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create, configure duration (60-minute JFT papers), manage listening and reading questions, and set passing marks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingExam(null);
            setShowCreateModal(true);
          }}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Exam</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />
          ))
        ) : exams.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No exams created yet.</h3>
            <p className="text-xs text-slate-500 mt-1">Click "Create New Exam" above to add your first Japanese examination paper.</p>
          </div>
        ) : (
          exams.map(exam => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-rose-200 uppercase">
                    {exam.course_code}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-500 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>{exam.duration_minutes} Mins</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-lg font-japanese leading-snug">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {exam.description || 'No description provided.'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">Questions:</span>{' '}
                    <strong className="text-slate-800">{exam.question_count} Questions</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Pass Mark:</span>{' '}
                    <strong className="text-slate-800">{exam.passing_score}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/admin/quizzes/${exam.id}/questions`}
                  className="flex-1 py-2 px-3 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center space-x-1"
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>Questions ({exam.question_count})</span>
                </Link>

                <button
                  type="button"
                  onClick={() => openEdit(exam)}
                  className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs transition-colors"
                  title="Edit Exam Settings"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(exam.id, exam.title)}
                  className="p-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs transition-colors"
                  title="Delete Exam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 font-japanese">
              {editingExam ? 'Edit Exam Settings' : 'Create New Examination Paper'}
            </h3>

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
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none font-japanese"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
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
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Passing Score (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.passing_score}
                    onChange={(e) => setFormData({ ...formData, passing_score: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none font-mono"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-semibold text-slate-700">
                    Active (Visible to Students)
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
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none font-japanese"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md"
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