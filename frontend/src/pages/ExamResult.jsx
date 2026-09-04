import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { examAPI } from '../services/api';
import confetti from 'canvas-confetti';
import AudioPlayer from '../components/AudioPlayer';
import { CheckCircle2, XCircle, Home, Clock, HelpCircle, Sparkles, Layers, Lock } from 'lucide-react';
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
              {result.percentage}% ({result.passed ? 'Passed' : 'Below ' + result.passing_score + '%'})
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
            <span>Pass Requirement: <strong>{result.passing_score}%</strong></span>
          </div>
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
                  className="max-h-60 rounded-xl border shadow-sm object-contain pointer-events-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 select-none">
              {[
                { key: 'A', text: q.option_a },
                { key: 'B', text: q.option_b },
                { key: 'C', text: q.option_c },
                { key: 'D', text: q.option_d }
              ].map(opt => {
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