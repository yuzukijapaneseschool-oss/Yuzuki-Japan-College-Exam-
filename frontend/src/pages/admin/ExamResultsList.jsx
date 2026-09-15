import React, { useEffect, useState } from 'react';
import { adminAPI, courseAPI } from '../../services/api';
import { GraduationCap, Search, ShieldAlert } from 'lucide-react';

export default function ExamResultsList() {
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCourse) params.course_id = selectedCourse;

      const [resData, courseData] = await Promise.all([
        adminAPI.getResults(params),
        courseAPI.getAll()
      ]);
      setResults(resData.data.results || []);
      setCourses(courseData.data.courses || []);
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [search, selectedCourse]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-rose-600" />
          <span>College Examination Results & Integrity Analytics</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review all student submissions, marks breakdown, time taken, pass/fail status, and anti-cheat tab-switch counts.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Student Name, Student ID, or Exam Title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none"
          />
        </div>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
        >
          <option value="">All Courses</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading student scores...</div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No exam results found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Exam Paper</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Percentage</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Integrity / Tab Switches</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {r.student_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{r.student_name}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-japanese">{r.exam_title}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{r.course_code}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {r.score} / {r.total_marks}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{r.percentage}%</td>
                    <td className="py-3.5 px-4">
                      {r.passed === 1 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          PASSED (合格)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          FAILED (不合格)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.tab_switches_count > 0 ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>{r.tab_switches_count} Tab Switch{r.tab_switches_count > 1 ? 'es' : ''}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50">
                          <span>0 Switches (Clean)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(r.completed_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}