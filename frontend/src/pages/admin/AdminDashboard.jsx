import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Award, 
  Layers, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats);
        setRecentRegistrations(res.data.recentRegistrations || []);
        setRecentAttempts(res.data.recentAttempts || []);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleQuickApprove = async (studentId) => {
    try {
      await adminAPI.updateStudentStatus(studentId, { status: 'approved' });
      // Refresh stats
      const res = await adminAPI.getStats();
      setStats(res.data.stats);
      setRecentRegistrations(res.data.recentRegistrations || []);
    } catch (err) {
      alert('Failed to approve student: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-40 bg-slate-100 animate-pulse rounded-2xl mb-6" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YUZUKI Japan College • Administration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-japanese tracking-tight">
            Admin Examination Portal (管理者ダッシュボード)
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Manage student admissions, verify Student IDs, create timed JFT/JLPT exams, and review student grades.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/quizzes"
            className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Create New Exam</span>
          </Link>
        </div>
      </div>

      {/* Pending Approvals Alert Banner (If Any) */}
      {stats?.pendingApprovals > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0">
              {stats.pendingApprovals}
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-950 font-japanese">
                {stats.pendingApprovals} Student Registration{stats.pendingApprovals > 1 ? 's' : ''} Awaiting Your Approval!
              </h2>
              <p className="text-xs text-amber-800 mt-0.5">
                Students who registered with their Student IDs cannot log in or start exams until you approve their account.
              </p>
            </div>
          </div>

          <Link
            to="/admin/approvals"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-1"
          >
            <span>Review Registrations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-2">{stats?.totalStudents || 0}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            {stats?.approvedStudents || 0} Approved Students
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Approvals</span>
            <UserCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono mt-2">{stats?.pendingApprovals || 0}</div>
          <div className="text-xs text-slate-500 mt-1">
            Requires Student ID check
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Exams</span>
            <FileText className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-2">{stats?.totalExams || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Across {stats?.totalCourses || 0} courses</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Exam Pass Rate</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono mt-2">{stats?.passRate || 0}%</div>
          <div className="text-xs text-slate-500 mt-1">{stats?.totalAttempts || 0} total papers graded</div>
        </div>
      </div>

      {/* Two Column Section: Recent Students & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Registrations Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg font-japanese flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Recent Student Registrations</span>
            </h2>
            <Link to="/admin/approvals" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
              Manage All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRegistrations.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No student registrations recorded yet.</p>
            ) : (
              recentRegistrations.map(s => (
                <div key={s.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center space-x-2">
                      <span>{s.name}</span>
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {s.student_id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {s.course_name} • {s.email}
                    </div>
                  </div>

                  <div>
                    {s.status === 'pending' ? (
                      <button
                        onClick={() => handleQuickApprove(s.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Exam Attempts Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg font-japanese flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Recent Exam Submissions</span>
            </h2>
            <Link to="/admin/results" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
              View All Results &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentAttempts.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No exam submissions yet.</p>
            ) : (
              recentAttempts.map(att => (
                <div key={att.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center space-x-2">
                      <span>{att.student_name}</span>
                      <span className="font-mono text-xs text-slate-500">({att.student_id})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                      {att.exam_title}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold font-mono text-slate-900">
                      {att.score}/{att.total_marks} ({att.percentage}%)
                    </div>
                    <span className={`text-[11px] font-bold ${att.passed === 1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {att.passed === 1 ? 'PASSED (合格)' : 'FAILED'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}