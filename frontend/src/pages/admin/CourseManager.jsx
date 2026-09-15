import React, { useEffect, useState } from 'react';
import { courseAPI } from '../../services/api';
import { Layers, Plus, Edit, Trash2, Sparkles, BookOpen, Wrench, Car, Plane, Hotel, HeartHandshake, Truck } from 'lucide-react';

const SSW_TEMPLATES = [
  { code: 'SSW-AGRICULTURE', name: 'SSW - Agriculture (農業)', category: 'Specified Skilled Worker (SSW)', description: 'Crop farming, livestock management, farm machinery safety, and greenhouse cultivation Japanese.' },
  { code: 'SSW-CONSTRUCTION', name: 'SSW - Construction & Civil Engineering (建設業)', category: 'Specified Skilled Worker (SSW)', description: 'Scaffolding safety, structural reinforcement, masonry, electrical installation, and construction site Japanese.' },
  { code: 'SSW-FOOD-MFG', name: 'SSW - Manufacture of Food & Beverages (飲食料品製造業)', category: 'Specified Skilled Worker (SSW)', description: 'Food processing factory safety, hygiene inspection, packaging machinery operations, and quality control.' },
  { code: 'SSW-SHIPBUILDING', name: 'SSW - Shipbuilding & Marine Industry (造船・舶用工業)', category: 'Specified Skilled Worker (SSW)', description: 'Welding, steel fabrication, marine engine fitting, painting, and dockyard safety protocols.' },
  { code: 'SSW-CLEANING', name: 'SSW - Building Cleaning Management (ビルクリーニング)', category: 'Specified Skilled Worker (SSW)', description: 'Commercial floor maintenance, chemical safety, disinfection standards, and environmental hygiene.' }
];

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Specified Skilled Worker (SSW)',
    description: ''
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseAPI.update(editingCourse.id, formData);
      } else {
        await courseAPI.create(formData);
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ code: '', name: '', category: 'Specified Skilled Worker (SSW)', description: '' });
      fetchCourses();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleQuickAddTemplate = async (template) => {
    try {
      await courseAPI.create(template);
      fetchCourses();
    } catch (err) {
      alert('Failed to add template: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete course "${name}"?`)) return;
    try {
      await courseAPI.delete(id);
      fetchCourses();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const openEdit = (c) => {
    setEditingCourse(c);
    setFormData({ 
      code: c.code, 
      name: c.name, 
      category: c.category || 'Specified Skilled Worker (SSW)', 
      description: c.description || '' 
    });
    setShowModal(true);
  };

  const generalList = courses.filter(c => !c.code.startsWith('SSW'));
  const sswList = courses.filter(c => c.code.startsWith('SSW'));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
            <Layers className="w-6 h-6 text-rose-600" />
            <span>Course & SSW Sector Management</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage Japanese language exams (JFT / JLPT) and Specified Skilled Worker (特定技能 - SSW) sectors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCourse(null);
            setFormData({ code: '', name: '', category: 'Specified Skilled Worker (SSW)', description: '' });
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Sector / Course</span>
        </button>
      </div>

      {/* Quick Add SSW Sector Templates */}
      <div className="bg-gradient-to-r from-rose-50 via-indigo-50 to-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-rose-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Quick 1-Click Templates: Add More SSW Sectors (特定技能)
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Click any upcoming SSW sector to immediately add it to your college exam portal:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {SSW_TEMPLATES.map(t => {
            const alreadyAdded = courses.some(c => c.code === t.code);
            return (
              <button
                key={t.code}
                type="button"
                disabled={alreadyAdded}
                onClick={() => handleQuickAddTemplate(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                  alreadyAdded
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-rose-300 text-rose-800 hover:bg-rose-600 hover:text-white shadow-sm'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.name}</span>
                {alreadyAdded && <span className="text-[10px] text-slate-400 font-mono">(Active)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* SSW Sectors List */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b pb-2">
          <Wrench className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-bold text-slate-900 font-japanese">
            Specified Skilled Worker (SSW / 特定技能) Sectors ({sswList.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sswList.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded border border-rose-200 uppercase font-mono">
                    {c.code}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {c.student_count} Students • {c.exam_count} Exams
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-japanese">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.description || 'Specialized SSW Japanese skill curriculum.'}</p>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  title="Edit Course"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id, c.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Language Courses List */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center space-x-2 border-b pb-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900 font-japanese">
            General Japanese Language Exam Tracks ({generalList.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalList.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded border border-indigo-200 uppercase font-mono">
                    {c.code}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {c.student_count} Students • {c.exam_count} Exams
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-japanese">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id, c.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-japanese">
              {editingCourse ? 'Edit Course / Sector' : 'Add New Course / SSW Sector'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSW-AUTOMOBILE or JLPT-N2"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 text-xs uppercase rounded-xl border border-slate-300 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSW - Automobile Repair (自動車整備)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none font-japanese"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none bg-white"
                >
                  <option value="Specified Skilled Worker (SSW)">Specified Skilled Worker (SSW / 特定技能)</option>
                  <option value="General Language">General Japanese Language Track</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Course curriculum and training description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none font-japanese"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}