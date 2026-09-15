import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { examAPI } from '../services/api';
import { History, Clock, BookOpen } from 'lucide-react';

export default function StudentHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await examAPI.getMyAttempts();
        setAttempts(res.data.attempts || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
            <History className="w-6 h-6 text-rose-600" />
            <span>Complete Exam History</span>
          </h1>
          <p className="text-sm text-slate-600">Review your past scores, percentages, and explanations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading history...</div>
        ) : attempts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No exam attempts recorded yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Exam Paper</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Percentage</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Time Taken</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attempts.map(att => (
                <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{att.exam_title}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">{att.course_name}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {att.score} / {att.total_marks}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{att.percentage}%</td>
                  <td className="py-3.5 px-4">
                    {att.passed === 1 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        PASSED (合格)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        FAILED (不合格)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                    {Math.floor(att.time_taken_seconds / 60)}m {att.time_taken_seconds % 60}s
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {new Date(att.completed_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/result/${att.id}`}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}