import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { examAPI } from '../services/api';
import confetti from 'canvas-confetti';
import AudioPlayer from '../components/AudioPlayer';
import { CheckCircle2, XCircle, Home, Clock, HelpCircle, Sparkles, Layers, Lock, ArrowRight, GraduationCap, BookOpen } from 'lucide-react';
import JapaneseText from '../components/JapaneseText';

export default function ExamResult() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.resultData || null);
  const [loading, setLoading] = useState(!location.state?.resultData);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!result) {
      async function fetchResult() {
        try {
          const res = await examAPI.getAttemptDetail(id);
          const att = res.data.attempt;
          setResult({
            score: att.score,
            total_marks: att.total_marks,
            percentage: att.percentage,
            passed: att.passed === 1,
            passing_score: att.passing_score,
            time_taken_seconds: att.time_taken_seconds,
            examTitle: att.exam_title,
            courseName: att.course_name,
            studentName: att.student_name,
            studentId: att.student_id,
            is_jft: att.is_jft || res.data.is_jft,
            section_breakdown: res.data.section_breakdown || att.section_breakdown || [],
            detailedReview: res.data.detailedReview
          });
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to load exam score.');
        } finally {
          setLoading(false);
        }
      }
      fetchResult();
    }
  }, [id, result]);

  useEffect(() => {
    if (result && result.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600 font-japanese">Calculating Score...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-rose-200 text-center">
        <p className="text-rose-600 font-semibold">{error || 'Result record not found.'}</p>
        <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const formatMinutes = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div 
      className="max-w-5xl mx-auto px-4 py-8 space-y-8 select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onSelectStart={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <div className={`rounded-3xl p-8 sm:p-10 text-white shadow-xl border relative overflow-hidden ${
        result.passed
          ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border-emerald-800'
          : 'bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 border-rose-800'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-white/10 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Exam Complete</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-japanese tracking-tight">
              {result.passed ? 'PASSED (合格おめでとうございます!)' : 'NEEDS PRACTICE (不合格 - 次回頑張りましょう)'}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              {result.examTitle || 'Official College Examination Paper'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[200px]">
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
              Final Score
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono my-1">
              {result.score} <span className="text-xl text-slate-300 font-normal">/ {result.total_marks}</span>
            </div>
            <div className={`text-lg font-bold font-mono ${result.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.percentage}% ({result.passed ? 'Passed (合格)' : (result.total_marks === 250 || result.passing_score >= 100 ? 'Below 200 Marks / 80%' : `Below ${result.passing_score}%`)})
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>Time Taken: <strong>{formatMinutes(result.time_taken_seconds || 0)}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-rose-400" />
            <span>Pass Requirement: <strong>{result.total_marks === 250 || result.passing_score >= 100 ? '200 / 250 Marks (80.0%)' : `${result.passing_score}%`}</strong></span>
          </div>
        </div>
      </div>

      {/* Official Section Performance & Score Report Table */}
      {result.section_breakdown && result.section_breakdown.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1">
                Official Examination Score Report
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-japanese">
                Section Performance Breakdown (セクション別得点)
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Passing Criterion: <strong className="text-slate-800">{result.total_marks === 250 ? '200 / 250 (80.0%)' : `${result.passing_score}%`}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-50">
                  <th className="py-3 px-4 rounded-l-xl">Section / Skill (試験科目)</th>
                  <th className="py-3 px-4 text-center">Correct Qs</th>
                  <th className="py-3 px-4 text-center">Raw Marks</th>
                  <th className="py-3 px-4 text-center">Normalized Score (/100)</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {result.section_breakdown.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-japanese font-medium text-slate-800">
                      {sec.section_name}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                      {sec.correct_questions} / {sec.total_questions}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                      {sec.raw_earned} <span className="text-slate-400 font-normal">/ {sec.raw_total}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-indigo-700">
                      {Number(sec.normalized_score).toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                        sec.normalized_score >= 80 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : sec.normalized_score >= 60 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {sec.normalized_score >= 80 ? 'Proficient' : sec.normalized_score >= 60 ? 'Satisfactory' : 'Needs Practice'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-900 text-white font-bold text-sm">
                  <td className="py-3.5 px-4 rounded-l-xl font-japanese">
                    TOTAL OVERALL (総合得点)
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    {result.section_breakdown.reduce((a, s) => a + s.correct_questions, 0)} / {result.section_breakdown.reduce((a, s) => a + s.total_questions, 0)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-amber-300">
                    {result.score} / {result.total_marks}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-emerald-400">
                    {Number(result.percentage).toFixed(1)} / 100
                  </td>
                  <td className="py-3.5 px-4 text-right rounded-r-xl">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider ${
                      result.passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {result.passed ? 'PASSED (合格)' : 'FAILED (不合格)'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Academic / SSW Conversion Funnel CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Steps in Japan • 進路・試験対策</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-japanese tracking-tight">
            Want to continue your Japan journey?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Take the next step towards your career in Japan. Unlock comprehensive JFT-Basic & SSW Prometric question banks (USD 9.99 for 1 month) or explore accredited career diploma programs at YUZUKI Japan College.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            to="/portal"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Explore JFT / SSW Practice</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/courses"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 backdrop-blur-md"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Learn About YUZUKI Courses</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all flex items-center space-x-2 shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <div className="text-xs text-slate-500 font-mono flex items-center space-x-1">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected Content • Copy Disabled</span>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-japanese">
          Question-by-Question Review & Answer Key
        </h2>

        {result.detailedReview?.map((q, idx) => (
          <div
            key={q.id || idx}
            className={`bg-white rounded-2xl border-2 p-6 shadow-sm space-y-4 select-none ${
              q.is_correct ? 'border-emerald-200' : 'border-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  Question {idx + 1}
                </span>
                <span className="text-xs text-slate-500 font-japanese font-medium">
                  {q.section_name}
                </span>
              </div>

              <div className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                q.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {q.is_correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{q.is_correct ? `+${q.marks} Marks (Correct)` : '0 Marks (Incorrect)'}</span>
              </div>
            </div>

            <div className="text-base font-medium text-slate-900 font-japanese select-none">
              <JapaneseText text={q.question_text} />
            </div>

            {q.audio_url && (
              <AudioPlayer audioUrl={q.audio_url} title={`Audio Track - Question ${idx + 1}`} />
            )}

            {q.image_url && (
              <div className="my-3">
                <img
                  src={q.image_url}
                  alt="Diagram"
                  className="max-h-60 rounded-xl border border-slate-200 shadow-sm object-contain bg-white p-1"
                  onError={(e) => {
                    if (!e.target.dataset.tried) {
                      e.target.dataset.tried = '1';
                      const filename = q.image_url.split('/').pop();
                      e.target.src = `/images/${filename}`;
                    }
                  }}
                />
              </div>
            )}

            {(() => {
              const availableOptions = [
                { key: 'A', text: q.option_a },
                { key: 'B', text: q.option_b },
                { key: 'C', text: q.option_c },
                { key: 'D', text: q.option_d }
              ].filter(opt => opt.text && opt.text.trim() !== '');

              return (
                <div className={`grid gap-2 pt-2 select-none ${
                  availableOptions.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                }`}>
                  {availableOptions.map(opt => {
                    const isUserChoice = q.student_choice === opt.key;
                    const isCorrect = q.correct_option === opt.key;

                    let optClass = "border-slate-200 bg-slate-50 text-slate-700";
                    if (isCorrect) optClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                    if (isUserChoice && !isCorrect) optClass = "border-rose-500 bg-rose-50 text-rose-900 font-semibold";

                    return (
                      <div
                        key={opt.key}
                        className={`p-3 rounded-xl border-2 text-sm flex items-center justify-between select-none ${optClass}`}
                      >
                        <div className="flex items-center space-x-2 font-japanese select-none">
                          <span className="font-bold font-mono">{opt.key}.</span>
                          <span className="select-none"><JapaneseText text={opt.text} /></span>
                        </div>
                        <div>
                          {isCorrect && <span className="text-[11px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Correct</span>}
                          {isUserChoice && !isCorrect && <span className="text-[11px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded">Your Choice</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {q.explanation && (
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start space-x-2 select-none">
                <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="select-none">
                  <strong className="text-indigo-900">Explanation (解説):</strong> <JapaneseText text={q.explanation} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}