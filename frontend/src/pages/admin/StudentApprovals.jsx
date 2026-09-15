import React, { useEffect, useState } from 'react';
import { adminAPI, courseAPI } from '../../services/api';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  FileText,
  MessageCircle,
  Phone,
  Eye,
  ExternalLink,
  Building
} from 'lucide-react';

export default function StudentApprovals() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'all'
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingSlipUrl, setViewingSlipUrl] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'all') params.status = activeTab;
      if (search) params.search = search;
      if (selectedCourse) params.course_id = selectedCourse;

      const [stuRes, crsRes] = await Promise.all([
        adminAPI.getStudents(params),
        courseAPI.getAll()
      ]);
      setStudents(stuRes.data.students || []);
      setCourses(crsRes.data.courses || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [activeTab, search, selectedCourse]);

  const handleStatusChange = async (studentId, status, courseId = null) => {
    try {
      await adminAPI.updateStudentStatus(studentId, { status, course_id: courseId });
      fetchStudents();
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student "${studentName}"? This action cannot be undone.`)) return;
    try {
      await adminAPI.deleteStudent(studentId);
      fetchStudents();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 font-japanese">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-rose-600" />
            <span>Batch Admissions & Bank Slip Approvals</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Verify student registrations, inspect uploaded <strong>Bank Deposit Slips</strong>, approve exam access, and coordinate with students via WhatsApp.
          </p>
        </div>

        <a
          href="/api/admin/backup-db"
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all self-start sm:self-center border border-slate-700"
          title="Download snapshot of yuzuki.db"
        >
          <span>💾 Download Database Backup (1-Click)</span>
        </a>
      </div>

      {/* Tabs & Search Filter Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex space-x-2">
            {[
              { key: 'pending', label: 'Pending Approvals' },
              { key: 'approved', label: 'Approved Students' },
              { key: 'all', label: 'All Students' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ' + (
                  activeTab === tab.key
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Course Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Name, ID, NIC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none w-48 sm:w-64"
              />
            </div>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white font-japanese"
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading student directory...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700 text-sm">No students found matching this criteria.</p>
            <p className="text-xs text-slate-400 mt-1">All registrations have been handled or no records match the filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 font-mono tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student ID & NIC</th>
                  <th className="py-3.5 px-4">Full Name & City</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Enrolled Track</th>
                  <th className="py-3.5 px-4">Bank Slip</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => {
                  const cleanPhone = s.phone ? s.phone.replace(/[^0-9]/g, '') : '';
                  const waNumber = cleanPhone.startsWith('0') ? '94' + cleanPhone.slice(1) : cleanPhone;
                  const waMsg = encodeURIComponent('Hello ' + s.name + ', Greetings from YUZUKI Japan College Kandy. Regarding your registration (' + s.student_id + ') for ' + (s.course_name || 'Japanese course') + ':');

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900 bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 inline-block text-[11px]">
                          {s.student_id}
                        </div>
                        {s.nic_number && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            NIC: <strong>{s.nic_number}</strong>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                        <div className="text-[11px] text-slate-500">
                          📍 {s.city || 'Kandy'} • <span className="font-semibold text-indigo-600">{s.batch_mode === 'online_zoom' ? '💻 Online Live' : '🏛️ Physical Kandy'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 space-y-1">
                        <div className="font-mono text-slate-700">{s.email}</div>
                        <div className="flex items-center space-x-1.5 font-mono">
                          <span className="font-semibold text-slate-800">{s.phone}</span>
                          {s.phone && (
                            <a
                              href={'https://wa.me/' + waNumber + '?text=' + waMsg}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-rose-50 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold font-mono text-[11px] block max-w-xs truncate">
                          {s.course_name || 'No Course Assigned'}
                        </span>
                        <div className="mt-1">
                          {s.allow_dual_track === 1 || s.batch_mode === 'dual_track' ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-xs">
                              <span>🌟 Dual Track (YJP + YTD)</span>
                            </span>
                          ) : (s.student_id && s.student_id.startsWith('YTD')) || s.course_id === 7 ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <span>🚚 Truck Driving Only (YTD)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              <span>🇯🇵 Japanese Language Only (YJP)</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {s.bank_slip_url ? (
                          <button
                            type="button"
                            onClick={() => setViewingSlipUrl(s.bank_slip_url)}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                            title="Click to view full Bank Slip"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>View Slip 📄</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">No Slip Uploaded</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {s.status === 'approved' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Approved
                          </span>
                        )}
                        {s.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 animate-pulse border border-amber-300">
                            Pending Review
                          </span>
                        )}
                        {s.status === 'rejected' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5 flex-wrap gap-y-1">
                          {s.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center space-x-1"
                              title="Approve student access"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {s.status === 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.id, 'rejected')}
                              className="px-2 py-1 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-[11px] font-semibold transition-all"
                              title="Deactivate / Reject access"
                            >
                              Deactivate
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const res = await adminAPI.toggleDualTrack(s.id);
                                alert(res.data.message || 'Dual Track setting updated!');
                                fetchStudents();
                              } catch (e) {
                                alert('Failed to toggle Dual Track: ' + (e.response?.data?.error || e.message));
                              }
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm flex items-center space-x-1 ${
                              s.allow_dual_track === 1 || s.batch_mode === 'dual_track'
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                            }`}
                            title={s.allow_dual_track === 1 || s.batch_mode === 'dual_track' ? "Dual Track is ACTIVE. Student has access to both Japanese & Truck Driving exams. Click to isolate to single course." : "Click to enable Dual Track (grants access to both Japanese & Truck Driving exams)."}
                          >
                            <span>{s.allow_dual_track === 1 || s.batch_mode === 'dual_track' ? '🌟 Dual Track (ON)' : '🔄 Dual Track (OFF)'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await adminAPI.extendSubscription(s.id, { days: 30 });
                                alert('Successfully unlocked 30-day CBT Exam Simulator pass for ' + s.name + '!');
                                fetchStudents();
                              } catch (e) {
                                alert('Failed to unlock: ' + (e.response?.data?.error || e.message));
                              }
                            }}
                            className="px-2.5 py-1 bg-amber-50 border border-amber-400 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-bold transition-all shadow-sm flex items-center space-x-1"
                            title="Unlock CBT Mock Exam Simulator for this student (upon course completion)"
                          >
                            <span>🔓 Unlock CBT</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingStudent(s)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                            title="Change Course Assignment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(s.id, s.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full-Size Bank Slip Modal Preview */}
      {viewingSlipUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Uploaded Bank Deposit Slip / Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingSlipUrl(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-950 rounded-2xl p-2 border border-slate-800">
              {viewingSlipUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe src={viewingSlipUrl} className="w-full h-96 rounded-xl" title="Bank Slip PDF" />
              ) : (
                <img src={viewingSlipUrl} alt="Bank Deposit Slip" className="max-h-[65vh] object-contain rounded-xl shadow-lg" />
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <a
                href={viewingSlipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setViewingSlipUrl(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Assignment Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-japanese">
              Edit Student Assignment
            </h3>
            <p className="text-xs text-slate-500">
              Student: <strong>{editingStudent.name}</strong> ({editingStudent.student_id})
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned College Course
                </label>
                <select
                  defaultValue={editingStudent.course_id}
                  id="modalCourseSelect"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 outline-none font-japanese"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Status
                </label>
                <select
                  defaultValue={editingStudent.status}
                  id="modalStatusSelect"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 outline-none"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected / Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const newCourse = parseInt(document.getElementById('modalCourseSelect').value, 10);
                  const newStatus = document.getElementById('modalStatusSelect').value;
                  handleStatusChange(editingStudent.id, newStatus, newCourse);
                  setEditingStudent(null);
                }}
                className="px-5 py-2 text-sm font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}