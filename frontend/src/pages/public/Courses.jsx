import React from 'react';
import { Link } from 'react-router-dom';
import pagodaBg from '../../assets/japan_pagoda_bg.jpg';
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Laptop, 
  Users
} from 'lucide-react';

export default function Courses() {
  const courseList = [
    {
      id: 'jft',
      title: 'JFT-Basic A2 (Japan Foundation Test)',
      tag: 'SSW 5-Year Visa Prerequisite',
      color: 'border-rose-300 bg-rose-50/40',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'The official Japanese language test required by the Japanese Immigration Services Agency for Specified Skilled Worker (SSW - 特定技能) visa applicants.',
      duration: '3 - 4 Months',
      schedule: 'Weekday & Weekend Batches (Physical in Kandy & Online)',
      curriculum: [
        'Script & Vocabulary (文字・語彙) - Kanji, Daily Words, Situational Signs',
        'Conversation & Grammar (会話・文法) - Polite Expressions, Honorifics, Desires',
        'Listening Comprehension (聴解) - Authentic Audio tracks, News, Dialogues',
        'Reading Comprehension (読解) - Short passages, Maps, Notices, Workplace texts',
        'Full Computer CBT Practice in Exam Simulation Lab'
      ]
    },
    {
      id: 'jlpt-n5',
      title: 'JLPT N5 (Japanese Language Proficiency Test - Level N5)',
      tag: 'Foundational Japanese Certification',
      color: 'border-indigo-300 bg-indigo-50/40',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      desc: 'The essential foundation for Japanese language learners covering basic grammar, everyday greetings, hiragana, katakana, and foundational kanji characters.',
      duration: '3 - 4 Months',
      schedule: 'Morning & Evening Batches Available',
      curriculum: [
        'Hiragana & Katakana mastery and correct stroke orders',
        '100+ Essential Kanji Characters and Japanese vocabulary',
        'Basic Sentence Patterns (です・ます), Particles (は, が, を, に, で)',
        'Listening training with native Japanese voice recordings',
        'Mock exam papers with real time grading'
      ]
    },
    {
      id: 'jlpt-n4',
      title: 'JLPT N4 (Intermediate Japanese Certification)',
      tag: 'Student Visa & SSW Requirement',
      color: 'border-emerald-300 bg-emerald-50/40',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'Enables students to understand daily Japanese conversations spoken at natural speed and read simple articles in daily life and work environments.',
      duration: '4 - 5 Months',
      schedule: 'Physical & Interactive Online Zoom Batches',
      curriculum: [
        '300+ Kanji Characters and 1,500+ Vocabulary words',
        'Complex Grammatical Conjugations (Conditionals, Causative, Passive)',
        'Daily life conversational dialogues (Shopping, Hospital, Work)',
        'Extended reading passages & situational question analysis'
      ]
    },
    {
      id: 'jlpt-n3',
      title: 'JLPT N3 (Bridge to Business Japanese)',
      tag: 'University & Professional Placement',
      color: 'border-amber-300 bg-amber-50/40',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'The bridge between intermediate and advanced Japanese, qualifying students for Japanese universities, engineering jobs, and corporate positions in Japan.',
      duration: '5 - 6 Months',
      schedule: 'Weekend Intensive Batches',
      curriculum: [
        '650+ Kanji Characters and 3,500+ Specialized Vocabulary words',
        'Natural Japanese speech patterns, idioms, and keigo (敬語)',
        'Newspaper articles, essays, and business email comprehension',
        'Advanced listening comprehension under time pressure'
      ]
    },
    {
      id: 'nat',
      title: 'NAT-TEST Preparation (N5, N4, N3)',
      tag: 'Bi-Monthly Fast Track Test',
      color: 'border-purple-300 bg-purple-50/40',
      badgeColor: 'bg-purple-100 text-purple-800',
      desc: 'Bi-monthly examination held 6 times a year, matching JLPT standards and ideal for students needing urgent certificates for visa intakes.',
      duration: '2 - 3 Months',
      schedule: 'Express Crash Batches',
      curriculum: [
        'Fast-track Kanji and Vocabulary drills',
        'Targeted grammar questions and time management techniques',
        'Past exam paper revisions and mock tests'
      ]
    },
    {
      id: 'ssw-skills',
      title: 'SSW Skill Test Training (特定技能 技能試験)',
      tag: 'Caregiver & Food Service Modules',
      color: 'border-rose-300 bg-rose-50/40',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'Technical skills training for passing the Japanese government SSW skill assessments in Caregiver (介護), Food Service (外食業), and Agriculture sectors.',
      duration: '2 - 3 Months',
      schedule: 'Hands-on Workshops & Exam Drills',
      curriculum: [
        'Specialized Japanese terminology for Elderly Care / Food Service',
        'Hygiene & Safety standards in Japan (HACCP)',
        'Japanese workplace ethics, customer service, and employer interview preparation'
      ]
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 font-japanese">
      {/* Header Banner */}
      <section 
        className="relative bg-slate-950 text-white py-20 px-4 bg-cover bg-center text-center"
        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.95)), url(' + pagodaBg + ')' }}
      >
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-rose-400 font-bold text-xs uppercase tracking-widest font-mono">
            Academic Curriculum
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            Courses & Examination Programs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Comprehensive Japanese language education and computer-based CBT exam training tailored for your success in Japan.
          </p>
        </div>
      </section>

      {/* Courses List */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        {courseList.map((c) => (
          <div 
            key={c.id} 
            className={'bg-white rounded-3xl border-2 ' + c.color + ' p-6 sm:p-10 shadow-lg hover:shadow-xl transition-all space-y-6'}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className={'inline-block text-xs font-bold px-3 py-1 rounded-full font-mono mb-2 ' + c.badgeColor}>
                  {c.tag}
                </span>
                <h2 className="text-2xl font-bold text-slate-900">{c.title}</h2>
              </div>
              
              <Link
                to="/contact"
                className="bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors shrink-0 flex items-center space-x-1.5 self-start sm:self-center"
              >
                <span>Enroll in this Course</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {c.desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase text-slate-400 font-mono tracking-wider">
                  Course Structure & Modules
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {c.curriculum.map((mod, mi) => (
                    <li key={mi} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0 text-xs">
                <div>
                  <span className="text-slate-400 font-mono uppercase text-[10px] block">Duration</span>
                  <strong className="text-slate-900 text-sm font-semibold">{c.duration}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-mono uppercase text-[10px] block">Batch Schedule</span>
                  <strong className="text-slate-900 text-sm font-semibold">{c.schedule}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-mono uppercase text-[10px] block">CBT Practice Access</span>
                  <span className="text-rose-600 font-bold">Includes 24/7 CBT Online Exam Platform Pass</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}