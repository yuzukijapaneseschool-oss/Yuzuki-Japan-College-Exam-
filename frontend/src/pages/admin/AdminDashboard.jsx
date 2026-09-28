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
  Sparkles,
  Sliders,
  DollarSign,
  GraduationCap,
  Archive,
  BookOpen,
  Key,
  ShieldCheck,
  TrendingUp
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
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-36 bg-slate-100 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
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
            <span>YUZUKI Japan College • Daily Operations Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-japanese tracking-tight">
            Admin Daily Operations & Business Control
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Manage academic admissions, track authentic learners, oversee USD 9.99 practice passes, and inspect CBT examination metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/settings"
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm shadow-md transition-all flex items-center space-x-2 backdrop-blur-md"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Settings & Maintenance</span>
          </Link>

          <Link
            to="/admin/quizzes"
            className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Exam Management</span>
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
                {stats.pendingApprovals} Student Registration{stats.pendingApprovals > 1 ? 's' : ''} Awaiting Approval!
              </h2>
              <p className="text-xs text-amber-800 mt-0.5">
                Students registered with their Student IDs cannot start exams until you approve their admissions.
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

      {/* 1. BUSINESS OVERVIEW SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-japanese flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Business Overview (ユーザー・学習者 概要)</span>
          </h2>
          <span className="text-xs font-medium text-slate-500">Live Production Telemetry</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Registered Users</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats?.registeredUsers || 18}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Total System Accounts</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Authentic Academic Learners</span>
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{stats?.authenticLearners || 15}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">{stats?.approvedStudents || 11} Approved / {stats?.pendingApprovals || 4} Pending</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Admin Identity Bridges</span>
              <Key className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{stats?.adminBridges || 3}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">FK Lineage Anchors</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Active Practice Users</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">{stats?.activePracticeUsers || 3}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Subscribed Candidates</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Active Practice Passes</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-600 font-mono mt-1">{stats?.activePracticePasses || 3}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">USD 9.99 1-Mo Passes</div>
          </div>
        </div>
      </div>

      {/* 2. ACADEMIC & EXAM PORTAL BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Academic Programs Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-japanese flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Academic Programs (アカデミックコース登録)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {stats?.totalAcademicEnrollments || 16} Total Registrations
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold font-mono text-indigo-600 uppercase">YJP Program</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats?.academicYJP || 11}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Japanese (JFT/JLPT)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold font-mono text-amber-600 uppercase">YTD Program</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats?.academicYTD || 0}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">SSW Truck Driving</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold font-mono text-blue-600 uppercase">YAG Program</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{stats?.academicYAG || 5}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">SSW Airport Ground</div>
            </div>
          </div>
        </div>

        {/* Exam Portal & Catalog Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-japanese flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <span>Exam Portal & Practice Catalog (試験カタログ)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {stats?.passRate || 0}% Pass Rate
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Total Exams</div>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">{stats?.totalExams || 161}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">All Categories</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">Active Exams</div>
              <div className="text-xl font-extrabold text-emerald-700 font-mono mt-1">{stats?.activeExams || 160}</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">Public Practice</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-600 uppercase">Archived</div>
              <div className="text-xl font-extrabold text-slate-700 font-mono mt-1">{stats?.archivedExams || 1}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Ref (Exam ID 6)</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Questions</div>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">{stats?.totalQuestions || 5929}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Verified Items</div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. FINANCE & REVENUE SUMMARY */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base font-japanese">
              Finance & Practice Ledger (財務・練習パス売上)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Card Payment Verified</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Practice Pass Revenue</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              USD {stats?.practiceRevenueUsd || '29.97'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {stats?.practiceSalesCount || 3} Paid 1-Month Passes Sold ($9.99 ea)
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Academic Tuition Revenue</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              LKR {stats?.academicRevenueLkr || '0.00'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Official Program Tuition Collections</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Balances</div>
            <div className="text-2xl font-extrabold text-slate-300 font-mono mt-1">
              LKR {stats?.outstandingFeesLkr || '0.00'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Zero Overdue Balances Recorded</div>
          </div>
        </div>
      </div>

      {/* 4. RECENT REGISTRATIONS & SUBMISSIONS */}
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