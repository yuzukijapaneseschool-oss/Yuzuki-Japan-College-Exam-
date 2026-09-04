import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import Timer from '../components/Timer';
import AudioPlayer from '../components/AudioPlayer';
import SubscriptionModal from '../components/SubscriptionModal';
import { 
  LockKeyhole,
  CheckCircle2,
  ShieldCheck,
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertCircle, 
  Layers, 
  Image as ImageIcon, 
  ShieldAlert, 
  Maximize, 
  Lock,
  EyeOff,
  VideoOff
} from 'lucide-react';
import JapaneseText from '../components/JapaneseText';

export default function ExamSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [watermark, setWatermark] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [currentSectionNum, setCurrentSectionNum] = useState(1);
  const [lockedSections, setLockedSections] = useState([]);
  const [showSectionLockModal, setShowSectionLockModal] = useState(false);

  // Anti-Cheat & Anti-Screen Recording state
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isScreenRecordingShieldActive, setIsScreenRecordingShieldActive] = useState(false);
  const tabSwitchRef = useRef(0);

  useEffect(() => {
    async function loadExam() {
      try {
        const res = await examAPI.getSession(id);
        setExam(res.data.exam);
        setQuestions(res.data.questions || []);
        setWatermark(res.data.studentWatermark);
      } catch (err) {
        if (err.response?.data?.requires_subscription) {
          setShowSubModal(true);
        }
        setError(err.response?.data?.error || 'Failed to start exam session.');
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [id]);

  // Anti-Screen Recording & Anti-Cheat Engine
  useEffect(() => {
    // 1. Tab Switch & Blur
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchRef.current += 1;
        const currentSwitches = tabSwitchRef.current;
        setTabSwitchCount(currentSwitches);
        setShowTabWarning(true);
        setIsScreenRecordingShieldActive(true);

        if (currentSwitches >= 3) {
          alert('SECURITY ALERT: Maximum Tab switches (3/3) exceeded! The exam paper will now be submitted automatically.');
          handleSubmit();
        }
      } else {
        setTimeout(() => setIsScreenRecordingShieldActive(false), 500);
      }
    };

    const handleWindowBlur = () => {
      setIsScreenRecordingShieldActive(true);
      if (!document.hidden) {
        tabSwitchRef.current += 1;
        setTabSwitchCount(tabSwitchRef.current);
        setShowTabWarning(true);
      }
    };

    const handleWindowFocus = () => {
      setIsScreenRecordingShieldActive(false);
    };

    // 2. Anti-Screenshot & Keyboard Capture Interception
    const handleKeyDown = (e) => {
      // PrintScreen / Screenshot Shortcuts
      if (
        e.key === 'PrintScreen' ||
        (e.key === 's' && (e.metaKey || e.ctrlKey) && e.shiftKey) || // Win+Shift+S or Mac Cmd+Shift+3/4
        (e.ctrlKey && ['p', 's', 'u', 'c', 'x', 'a'].includes(e.key.toLowerCase())) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        setIsScreenRecordingShieldActive(true);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(''); // Clear clipboard immediately
        }
        setTimeout(() => setIsScreenRecordingShieldActive(false), 2500);
        return false;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        if (navigator.clipboard) {
          navigator.clipboard.writeText('');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [exam, answers, timeTaken]);

  const handleSelectOption = (qId, optionKey) => {
    const qIndex = questions.findIndex(q => q.id === qId);
    const qSec = Math.floor(qIndex / 15) + 1;
    if (lockedSections.includes(qSec)) {
      alert('このセクションは既に完了・ロックされています。');
      return;
    }
    setAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const toggleFlag = (qId) => {
    setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const sectionMinIndex = (currentSectionNum - 1) * 15;
  const sectionMaxIndex = Math.min(questions.length - 1, currentSectionNum * 15 - 1);

  const handleNextInCurrentSection = () => {
    if (currentIndex < sectionMaxIndex) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (currentSectionNum < 4 && questions.length > currentSectionNum * 15) {
        setShowSectionLockModal(true);
      } else {
        setShowSubmitModal(true);
      }
    }
  };

  const handlePrevInCurrentSection = () => {
    if (currentIndex > sectionMinIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const confirmLockAndAdvanceSection = () => {
    const nextSec = currentSectionNum + 1;
    setLockedSections(prev => [...prev, currentSectionNum]);
    setCurrentSectionNum(nextSec);
    setCurrentIndex(nextSec * 15 - 15);
    setShowSectionLockModal(false);
  };

  const handlePaletteClick = (idx) => {
    const targetSec = Math.floor(idx / 15) + 1;
    if (lockedSections.includes(targetSec)) {
      alert('セクション ' + targetSec + ' はロックされています（戻れません）。');
      return;
    }
    if (targetSec > currentSectionNum) {
      alert('現在のセクション（セクション ' + currentSectionNum + '）を完了してから進んでください。');
      return;
    }
    setCurrentIndex(idx);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {});
    } else {
      document.exitFullscreen().catch(e => {});
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await examAPI.submit(id, {
        answers,
        timeTakenSeconds: timeTaken,
        tabSwitchesCount: tabSwitchRef.current
      });
      navigate(`/result/${res.data.attemptId}`, { state: { resultData: res.data } });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit exam. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600 font-japanese">Preparing Secure Exam Paper...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2 font-japanese">Exam Access Notice</h2>
        <p className="text-sm text-slate-600 mb-6">{error}</p>
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors text-sm"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => setShowSubModal(true)}
            className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors text-sm shadow-md"
          >
            Unlock Access ($9.99/Mo)
          </button>
        </div>

        <SubscriptionModal
          isOpen={showSubModal}
          onClose={() => setShowSubModal(false)}
          onSubscribed={() => {
            window.location.reload();
          }}
        />
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const isCurrentSectionLastQuestion = currentIndex === sectionMaxIndex;
  const sectionLabels = [
    { num: 1, name: '文字・語彙 (Q01 - Q15)' },
    { num: 2, name: '会話・文法 (Q16 - Q30)' },
    { num: 3, name: '聴解 (Q31 - Q45)' },
    { num: 4, name: '読解 (Q46 - Q60)' }
  ];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  return (
    <div 
      className="min-h-screen bg-slate-100 flex flex-col justify-between select-none relative overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      
      {/* Blackout Curtain against Screen Recording & Capture */}
      {isScreenRecordingShieldActive && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in select-none">
          <VideoOff className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold font-japanese tracking-wide text-rose-400">
            ⚠️ SCREEN RECORDING & CAPTURE DETECTED
          </h2>
          <p className="text-sm text-slate-300 max-w-md mt-2">
            Screen recording, screenshot shortcuts, and unauthorized capturing are strictly prohibited during college examinations. Content is blacked out for examination integrity.
          </p>
          <p className="text-xs text-slate-500 mt-4 font-mono">
            Focus the exam window to resume.
          </p>
        </div>
      )}

      {/* Live Dynamic Continuous Anti-Camera Watermark */}
      {watermark && (
        <div className="fixed inset-0 pointer-events-none z-10 flex flex-wrap items-center justify-center gap-20 opacity-[0.04] overflow-hidden select-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="text-slate-900 font-mono text-xl font-bold -rotate-45 whitespace-nowrap">
              {watermark.name} • {watermark.student_id} • YUZUKI JAPAN COLLEGE
            </div>
          ))}
        </div>
      )}

      {/* Top Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              {exam.course_code}
            </span>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md font-japanese">
                {exam.title}
              </h1>
              <p className="text-xs text-slate-400">
                Question {currentIndex + 1} of {totalQuestions} • {exam.duration_minutes} Mins Paper
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center space-x-1"
              title="Toggle Fullscreen Focus"
            >
              <Maximize className="w-4 h-4" />
              <span className="hidden md:inline">Focus</span>
            </button>

            {exam.duration_minutes > 0 ? (
              <Timer
                durationMinutes={exam.duration_minutes}
                onTimeUp={handleSubmit}
                onTick={(elapsed) => setTimeTaken(elapsed)}
              />
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                <span>⏳ Untimed Practice Mode (ස්වයං පුහුණු මාදිලිය)</span>
              </div>
            )}

            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Paper</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Question + Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="inline-flex items-center space-x-2 bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-lg text-xs font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span className="font-japanese">{currentQ.section_name || 'General Section'}</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-[11px] text-slate-400 bg-slate-50 border px-2 py-1 rounded-lg font-mono flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>DRM Anti-Record Protected</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    flagged[currentQ.id]
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{flagged[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Question {currentIndex + 1} ({currentQ.marks || 1} {currentQ.marks === 1 ? 'mark' : 'marks'})
              </div>
              <div className="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed font-japanese select-none">
                <JapaneseText text={currentQ.question_text} />
              </div>
            </div>

            {currentQ.audio_url && (
              <AudioPlayer
                audioUrl={currentQ.audio_url}
                title={`Listening Comprehension (聴解) - Question ${currentIndex + 1}`}
              />
            )}

            {currentQ.image_url && (
              <div className="my-4">
                <div className="relative inline-block border rounded-xl overflow-hidden shadow-sm bg-slate-50">
                  <img
                    src={currentQ.image_url}
                    alt="Question Diagram"
                    className="max-h-72 object-contain cursor-pointer hover:opacity-90 pointer-events-none"
                    onClick={() => setSelectedImage(currentQ.image_url)}
                  />
                  <div className="text-[11px] text-slate-500 p-1.5 bg-slate-50 border-t flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Click image to zoom</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {[
                { key: 'A', text: currentQ.option_a },
                { key: 'B', text: currentQ.option_b },
                { key: 'C', text: currentQ.option_c },
                { key: 'D', text: currentQ.option_d }
              ]
                .filter(opt => opt.text && opt.text.trim() !== '')
                .map(opt => {
                  const isSelected = answers[currentQ.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start space-x-3.5 group select-none ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                    }`}>
                      {opt.key}
                    </div>
                    <div className={`text-base font-japanese pt-0.5 leading-relaxed select-none ${
                      isSelected ? 'text-slate-900 font-semibold' : 'text-slate-700'
                    }`}>
                      <JapaneseText text={opt.text} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={currentIndex === sectionMinIndex}
                onClick={handlePrevInCurrentSection}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent flex items-center space-x-1 font-japanese"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>前の問題</span>
              </button>

              <div className="text-xs text-slate-500 font-japanese font-semibold">
                セクション {currentSectionNum}: 問題 {currentIndex - sectionMinIndex + 1} / 15
              </div>

              {!isCurrentSectionLastQuestion ? (
                <button
                  type="button"
                  onClick={handleNextInCurrentSection}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-semibold text-sm transition-colors flex items-center space-x-1 font-japanese shadow"
                >
                  <span>次の問題</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : currentSectionNum < 4 && questions.length > currentSectionNum * 15 ? (
                <button
                  type="button"
                  onClick={() => setShowSectionLockModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm transition-all flex items-center space-x-1.5 font-japanese shadow-lg shadow-rose-600/30 active:scale-95"
                >
                  <LockKeyhole className="w-4 h-4" />
                  <span>セクション {currentSectionNum} を完了してロック 🔒</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-1 font-japanese"
                >
                  <Send className="w-4 h-4" />
                  <span>試験提出の確認</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Question Palette (Grouped by 15 Questions per Section) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm font-japanese">
                  問題パレット (15問単位)
                </h3>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Sec {currentSectionNum} 進行中
                </span>
              </div>

              {[1, 2, 3, 4].map(secNum => {
                const isSecActive = currentSectionNum === secNum;
                const isSecLocked = lockedSections.includes(secNum);
                const startIdx = (secNum - 1) * 15;
                const endIdx = Math.min(questions.length, secNum * 15);
                const secQuestions = questions.slice(startIdx, endIdx);

                if (secQuestions.length === 0) return null;

                return (
                  <div key={secNum} className={`p-3 rounded-2xl border transition-all ${
                    isSecActive 
                      ? 'bg-rose-50/40 border-rose-300 shadow-sm'
                      : isSecLocked
                        ? 'bg-slate-100/60 border-slate-200 opacity-60'
                        : 'bg-slate-50 border-slate-200 opacity-40'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 font-japanese flex items-center space-x-1">
                        {isSecLocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                        )}
                        <span>セクション {secNum} ({startIdx + 1}〜{endIdx})</span>
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-slate-500">
                        {isSecLocked ? '🔒 ロック済' : isSecActive ? '進行中' : '待機中'}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {secQuestions.map((q, localIdx) => {
                        const globalIdx = startIdx + localIdx;
                        const isAnswered = !!answers[q.id];
                        const isFlag = !!flagged[q.id];
                        const isCurrent = currentIndex === globalIdx;

                        let btnStyle = "bg-white text-slate-700 border-slate-200";
                        if (isAnswered) btnStyle = "bg-emerald-600 text-white border-emerald-700";
                        if (isFlag) btnStyle = "bg-amber-500 text-white border-amber-600";
                        if (isSecLocked) btnStyle = "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed";

                        return (
                          <button
                            key={q.id}
                            type="button"
                            disabled={isSecLocked || !isSecActive}
                            onClick={() => handlePaletteClick(globalIdx)}
                            className={`h-8 rounded-lg font-mono text-xs font-bold border transition-all flex items-center justify-center relative ${btnStyle} ${
                              isCurrent ? 'ring-2 ring-rose-500 ring-offset-1 scale-105 shadow' : ''
                            }`}
                            title={isSecLocked ? 'ロック済み（戻れません）' : `問題 ${globalIdx + 1}`}
                          >
                            {globalIdx + 1}
                            {isFlag && !isSecLocked && <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 right-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-japanese">
                <div className="flex items-center justify-between">
                  <span>回答済み：</span>
                  <strong className="text-slate-900 font-mono">{answeredCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>未回答：</span>
                  <strong className="text-rose-600 font-mono">{unansweredCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>フラグ：</span>
                  <strong className="text-amber-600 font-mono">{flaggedCount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION LOCKING CONFIRMATION MODAL (15-by-15 Lock) */}
      {showSectionLockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 border-2 border-rose-500 text-center animate-fade-in">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <LockKeyhole className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1 bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                <span>セクション {currentSectionNum} の完了確認</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-japanese">
                セクション {currentSectionNum} をロックして次へ進みますか？
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-japanese">
                ⚠️ <strong>注意：</strong>次のセクションに進むと、<strong>セクション {currentSectionNum}（問題 {(currentSectionNum-1)*15 + 1}〜{currentSectionNum*15}）は完全にロックされ、二度と回答の確認や修正ができなくなります。</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs font-japanese">
              <div className="text-left">
                <span className="text-slate-500">このセクションの回答数:</span>
                <div className="text-base font-bold text-slate-900 font-mono">
                  {questions.slice((currentSectionNum-1)*15, currentSectionNum*15).filter(q => answers[q.id]).length} / 15
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-500">次のセクション:</span>
                <div className="text-base font-bold text-rose-600 font-japanese">
                  セクション {currentSectionNum + 1}へ
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSectionLockModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors font-japanese"
              >
                見直す（まだ進まない）
              </button>

              <button
                type="button"
                onClick={confirmLockAndAdvanceSection}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all font-japanese flex items-center justify-center space-x-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>ロックして次へ進む</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switch Anti-Cheat Security Modal */}
      {showTabWarning && (
        <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border-2 border-red-500 text-center animate-bounce">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-red-900 font-japanese">
              ⚠️ Security Warning: Tab Switch Detected!
            </h3>
            <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-medium border border-red-200">
              Leaving the examination tab or switching applications is strictly prohibited.
              <div className="font-bold text-sm mt-1">
                Warning Count: {tabSwitchCount} / 3
              </div>
            </div>
            <p className="text-xs text-slate-500">
              * If you switch tabs 3 times, your exam paper will be submitted automatically with a security infraction notice sent to the College Admin.
            </p>
            <button
              type="button"
              onClick={() => setShowTabWarning(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
            >
              I Understand • Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 font-japanese">
              Submit Examination Paper?
            </h3>
            <p className="text-sm text-slate-600">
              Please verify your answers before submitting. Once submitted, your score will be calculated immediately.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-bold text-slate-900">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">Answered:</span>
                <span className="font-bold text-emerald-700">{answeredCount}</span>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Unanswered:</span>
                  <span className="font-bold">{unansweredCount}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors"
              >
                Continue Test
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center space-x-1"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Confirm & Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Zoomed diagram"
            className="max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}