import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import AudioPlayer from '../../components/AudioPlayer';
import JapaneseText from '../../components/JapaneseText';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  Image as ImageIcon, 
  Music, 
  Headphones, 
  CheckCircle, 
  HelpCircle,
  Clock,
  Layers,
  X,
  Underline as UnderlineIcon,
  Highlighter,
  Bold,
  Eye,
  Sparkles,
  Type
} from 'lucide-react';

export default function QuestionEditor() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [optionCount, setOptionCount] = useState(3);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const [formData, setFormData] = useState({
    section_name: 'Section 1: Vocabulary (文字・語彙)',
    question_text: '',
    image_url: '',
    audio_url: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    marks: 2,
    explanation: '',
    order_num: 0
  });

  const questionTextareaRef = useRef(null);

  const applyFormatting = (targetField, tagStart, tagEnd, defaultText = 'word') => {
    let currentVal = formData[targetField] || '';
    let startPos = currentVal.length;
    let endPos = currentVal.length;

    const el = targetField === 'question_text' ? questionTextareaRef.current : null;
    if (el) {
      startPos = el.selectionStart ?? currentVal.length;
      endPos = el.selectionEnd ?? currentVal.length;
    }

    const selectedText = currentVal.substring(startPos, endPos);
    const textToWrap = selectedText.length > 0 ? selectedText : defaultText;
    const replacement = `${tagStart}${textToWrap}${tagEnd}`;
    const newVal = currentVal.substring(0, startPos) + replacement + currentVal.substring(endPos);

    setFormData(prev => ({ ...prev, [targetField]: newVal }));

    setTimeout(() => {
      if (el) {
        el.focus();
        const selStart = startPos + tagStart.length;
        const selEnd = selStart + textToWrap.length;
        el.setSelectionRange(selStart, selEnd);
      }
    }, 15);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getQuestions(examId);
      setExam(res.data.exam);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [examId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await adminAPI.uploadImage(data);
      setFormData(prev => ({ ...prev, image_url: res.data.url }));
    } catch (err) {
      alert('Failed to upload image: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAudio(true);
    try {
      const data = new FormData();
      data.append('audio', file);
      const res = await adminAPI.uploadAudio(data);
      setFormData(prev => ({ ...prev, audio_url: res.data.url }));
    } catch (err) {
      alert('Failed to upload audio: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        option_d: optionCount === 4 ? (formData.option_d || '') : '',
        correct_option: (optionCount === 3 && formData.correct_option === 'D') ? 'A' : formData.correct_option
      };

      if (editingQ) {
        await adminAPI.updateQuestion(editingQ.id, payload);
      } else {
        await adminAPI.createQuestion(examId, {
          ...payload,
          order_num: questions.length + 1
        });
      }
      setShowModal(false);
      setEditingQ(null);
      resetForm();
      fetchQuestions();
    } catch (err) {
      alert('Failed to save question: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await adminAPI.deleteQuestion(id);
      fetchQuestions();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const openEdit = (q) => {
    setEditingQ(q);
    const hasD = q.option_d && q.option_d.trim() !== '';
    setOptionCount(hasD ? 4 : 3);
    setFormData({
      section_name: q.section_name || 'General',
      question_text: q.question_text || '',
      image_url: q.image_url || '',
      audio_url: q.audio_url || '',
      option_a: q.option_a || '',
      option_b: q.option_b || '',
      option_c: q.option_c || '',
      option_d: q.option_d || '',
      correct_option: q.correct_option || 'A',
      marks: q.marks || 1,
      explanation: q.explanation || '',
      order_num: q.order_num || 0
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setOptionCount(3);
    setFormData({
      section_name: 'Section 1: Vocabulary (文字・語彙)',
      question_text: '',
      image_url: '',
      audio_url: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      marks: 2,
      explanation: '',
      order_num: 0
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back Link & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/quizzes"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Exams</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 font-japanese">
            {exam?.title || 'Exam Questions Editor'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Course: <strong className="text-slate-800">{exam?.course_name}</strong> • Duration: <strong className="text-slate-800">{exam?.duration_minutes} Mins</strong> • Total Questions: <strong className="text-slate-800">{questions.length}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingQ(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Plus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No questions added yet.</h3>
            <p className="text-xs text-slate-500 mt-1">Click "Add New Question" above to attach text, audio tracks, and images.</p>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-japanese">
                    {q.section_name}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({q.marks} {q.marks === 1 ? 'mark' : 'marks'})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => openEdit(q)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                    title="Edit Question"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-base font-medium text-slate-900 font-japanese leading-relaxed">
                <JapaneseText text={q.question_text} />
              </div>

              {q.audio_url && (
                <AudioPlayer audioUrl={q.audio_url} title="Listening Track Preview (音声プレビュー)" />
              )}

              {q.image_url && (
                <div>
                  <img src={q.image_url} alt="Attached diagram" className="max-h-48 rounded-xl border object-contain" />
                </div>
              )}

              {/* Options display */}
              {(() => {
                const availableOptions = [
                  { key: 'A', text: q.option_a },
                  { key: 'B', text: q.option_b },
                  { key: 'C', text: q.option_c },
                  { key: 'D', text: q.option_d }
                ].filter(opt => opt.text && opt.text.trim() !== '');

                return (
                  <div className={`grid gap-2 text-sm ${
                    availableOptions.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                  }`}>
                    {availableOptions.map(opt => {
                      const isCorrect = q.correct_option === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border flex items-center justify-between font-japanese ${
                            isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-400/50'
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span><strong className="font-mono">{opt.key}.</strong> <JapaneseText text={opt.text} /></span>
                          {isCorrect && (
                            <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow-xs">
                              Correct Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {q.explanation && (
                <div className="text-xs text-slate-600 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Question Modal with Image and Audio Uploads */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-japanese">
                {editingQ ? 'Edit Question' : 'Add New Question to Exam Paper'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Section Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Section 1: Script & Vocabulary (文字・語彙)"
                    value={formData.section_name}
                    onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none font-japanese"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Marks / Points
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Question Text (Supports Japanese) <span className="text-rose-600">*</span>
                  </label>
                  
                  {/* Rich Formatting Toolbar */}
                  <div className="flex items-center flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
                    <button
                      type="button"
                      onClick={() => applyFormatting('question_text', '<u>', '</u>', '下線部')}
                      className="px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-95"
                      title="Underline selected text (<u>word</u>)"
                    >
                      <UnderlineIcon className="w-3.5 h-3.5 text-rose-600" />
                      <span className="underline decoration-rose-600 decoration-2 underline-offset-2">Underline</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormatting('question_text', '<mark>', '</mark>', '強調')}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-95"
                      title="Highlight selected text (<mark>word</mark>)"
                    >
                      <Highlighter className="w-3.5 h-3.5 text-amber-700" />
                      <span>Highlight 🟡</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormatting('question_text', '<b>', '</b>', '太字')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-95"
                      title="Bold selected text (<b>word</b>)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                      <span className="font-extrabold">Bold</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormatting('question_text', '（　', '　）', '1')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 font-japanese"
                      title="Insert Japanese fullwidth blank brackets （　　）"
                    >
                      <span>（　） Blank</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyFormatting('question_text', '<ruby>', '<rt>かんじ</rt></ruby>', '漢字')}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 font-japanese"
                      title="Add Kanji with Furigana (<ruby>漢字<rt>かんじ</rt></ruby>)"
                    >
                      <span>🌸 Furigana</span>
                    </button>
                  </div>
                </div>

                <textarea
                  ref={questionTextareaRef}
                  rows="3"
                  required
                  placeholder="e.g. Look at the illustration and choose the correct word.&#10;&#10;01. この <u>おじいさん</u> は だれですか。"
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none font-japanese leading-relaxed"
                />

                {/* Real-time Live Student Preview Box */}
                <div className="mt-2 p-3 bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live Student Preview (විභාගයේදී ශිෂ්‍යයාට පෙනෙන ආකාරය):</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded font-extrabold">Real-Time</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm font-japanese text-slate-900 min-h-[38px] shadow-xs leading-relaxed">
                    {formData.question_text ? (
                      <JapaneseText text={formData.question_text} />
                    ) : (
                      <span className="text-slate-400 italic text-xs">Type or format question text above to see live preview...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Media Uploads: Audio & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                
                {/* Audio Upload (Music / Listening Track) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                    <Music className="w-4 h-4 text-rose-600" />
                    <span>Listening Track (音声 / Audio)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Upload MP3 / WAV audio track for listening comprehension.</p>
                  
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    onChange={handleAudioUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200 cursor-pointer"
                  />

                  {uploadingAudio && <p className="text-xs text-rose-600 animate-pulse mt-1">Uploading audio...</p>}

                  {formData.audio_url && (
                    <div className="mt-2 flex items-center justify-between text-xs bg-white p-2 rounded-lg border">
                      <span className="truncate max-w-[160px] text-slate-700 font-mono">{formData.audio_url}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, audio_url: '' })}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Image Upload (Picture / Diagram) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Question Image (画像 / Picture)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">Upload diagram, chart, or sign for reading questions.</p>
                  
                  <input
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.webp,.svg"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                  />

                  {uploadingImage && <p className="text-xs text-indigo-600 animate-pulse mt-1">Uploading picture...</p>}

                  {formData.image_url && (
                    <div className="mt-2 flex items-center justify-between text-xs bg-white p-2 rounded-lg border">
                      <img src={formData.image_url} alt="Thumbnail" className="w-8 h-8 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Multiple Choice Options (3 for JFT, 4 for JLPT) */}
              <div className="space-y-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Options & Correct Answer (ප්‍රශ්නයේ පිළිතුරු) <span className="text-rose-600">*</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {optionCount === 3 ? '⚡ JFT Format: 3 Options (A, B, C)' : '📘 JLPT Format: 4 Options (A, B, C, D)'}
                    </p>
                  </div>

                  {/* Format Selector: 3 Options (JFT) / 4 Options (JLPT) */}
                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setOptionCount(3);
                        setFormData(prev => ({
                          ...prev,
                          option_d: '',
                          correct_option: prev.correct_option === 'D' ? 'A' : prev.correct_option
                        }));
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                        optionCount === 3
                          ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>3 Options (JFT)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOptionCount(4)}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                        optionCount === 4
                          ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>4 Options (JLPT)</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {[
                    { key: 'A', field: 'option_a' },
                    { key: 'B', field: 'option_b' },
                    { key: 'C', field: 'option_c' },
                    ...(optionCount === 4 ? [{ key: 'D', field: 'option_d' }] : [])
                  ].map(opt => (
                    <div key={opt.key} className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, correct_option: opt.key })}
                        className={`w-8 h-8 rounded-lg font-bold text-xs shrink-0 flex items-center justify-center transition-all ${
                          formData.correct_option === opt.key
                            ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                        title={`Click to mark ${opt.key} as correct answer`}
                      >
                        {opt.key}
                      </button>
                      
                      <div className="relative flex-1 flex items-center">
                        <input
                          type="text"
                          required
                          placeholder={`Option ${opt.key} text (e.g. 1. おじいさん)`}
                          value={formData[opt.field] || ''}
                          onChange={(e) => setFormData({ ...formData, [opt.field]: e.target.value })}
                          className="w-full pr-16 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 bg-white outline-none font-japanese"
                        />
                        <div className="absolute right-1.5 flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => applyFormatting(opt.field, '<u>', '</u>', 'text')}
                            className="px-1.5 py-0.5 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded text-[11px] font-bold border border-slate-200 bg-white"
                            title="Underline inside option"
                          >
                            <u>U</u>
                          </button>
                          <button
                            type="button"
                            onClick={() => applyFormatting(opt.field, '<mark>', '</mark>', 'text')}
                            className="px-1 py-0.5 hover:bg-amber-200 text-slate-700 rounded text-[10px] font-bold border border-amber-300 bg-amber-100"
                            title="Highlight inside option"
                          >
                            🟡
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                  <span>
                    Selected Correct Key: <strong className="text-emerald-700 font-bold font-mono text-xs bg-emerald-100 px-2 py-0.5 rounded">{formData.correct_option}</strong>
                  </span>
                  <span className="text-slate-400 italic">Click letter box on left to set correct answer</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Explanation / Answer Notes (Shown after submission)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. 「まいあさ」は漢字で「毎朝」と書きます。"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none font-japanese"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md"
                >
                  {editingQ ? 'Save Question' : 'Add Question'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}