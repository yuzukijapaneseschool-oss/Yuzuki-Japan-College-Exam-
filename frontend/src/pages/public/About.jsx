import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import campusMansion from '../../assets/campus_mansion.jpg';
import campusPool from '../../assets/campus_pool_view.jpg';
import batch4Group from '../../assets/batch_4_group.jpg';
import batch5Group from '../../assets/batch_5_group.jpg';
import classroomWorkshop from '../../assets/classroom_cultural_workshop.jpg';
import convocationGroup from '../../assets/convocation_group_full.jpg';

import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Gift,
  Smile,
  Banknote,
  BadgeCheck,
  Facebook,
  Phone,
  MessageCircle,
  FileCheck,
  Building,
  Target,
  Sparkles,
  Camera
} from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 text-slate-900 font-japanese">
      
      {/* Header Banner */}
      <section 
        className="relative bg-slate-950 text-white py-20 px-4 bg-cover bg-center text-center"
        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.96)), url(' + campusMansion + ')' }}
      >
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ゆづき日本カレッジ • Kandy Campus</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            About YUZUKI Japan College
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Kandy's premier Japanese language & career guidance institution empowering students across Sri Lanka to achieve their dream careers and higher education in Japan.
          </p>
        </div>
      </section>

      {/* Main Story & Academic Philosophy */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-rose-600 font-bold text-xs uppercase tracking-widest font-mono">
              Our Campus & Mission
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              A Dedicated Gateway to Japan from the Heart of Kandy
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>YUZUKI Japan College</strong> is dedicated to delivering high quality Japanese language education and comprehensive visa pathway support for Sri Lankan students and job seekers aged <strong>17 to 40</strong>.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you aim to pass <strong>JFT-Basic A2, JLPT N5-N3, or NAT-TEST</strong>, or to train for high-demand <strong>Specified Skilled Worker (SSW - 特定技能)</strong> categories such as <strong>Truck Driving, Nursing Caregiver, Food Service, Hospitality, or Agriculture</strong>, our curriculum provides end-to-end preparation with expert Senseis.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  🎯
                </div>
                <h4 className="font-bold text-base text-slate-900">Zero Japanese Foundation Required</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We begin with the fundamentals (Hiragana, Katakana, basic grammar) and systematically guide students to exam and conversational fluency.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  📚
                </div>
                <h4 className="font-bold text-base text-slate-900">Free Textbooks & Audio Material</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Standard course textbooks, exercises, and listening MP3 audio packs are provided free to all enrolled batch students.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img src={campusMansion} alt="Yuzuki College Campus Mansion" className="w-full h-80 object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img src={batch5Group} alt="Batch 5 Group" className="w-full h-40 object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img src={classroomWorkshop} alt="Classroom Workshop" className="w-full h-40 object-cover" />
              </div>
            </div>
          </div>

        </div>

        {/* Batch Celebrations Highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-slate-200">
          
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img src={batch4Group} alt="Yuzuki College Batch 4 Convocation" className="w-full h-80 object-cover" />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-rose-600 font-bold text-xs uppercase tracking-widest font-mono">
              Milestones & Student Life
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              7+ Successful Batches Trained with Outstanding Exam Pass Ratios
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every batch at YUZUKI Japan College participates in interactive classroom cultural workshops, Dansala community service, and official Convocation ceremonies upon passing their JLPT and JFT examinations.
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 font-japanese">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Prior Japanese Language Knowledge Required (Ages 17 to 40)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free Complete Japanese Standard Textbooks & Audio Pack Provided</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Computer CBT Mock Exam Lab simulations unlocked upon course completion</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Financial sponsorship documentation & bank education loan support</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/batch-register"
                className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all"
              >
                <FileCheck className="w-4 h-4" />
                <span>Register for Upcoming Batch &rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Highlights Grid */}
      <section className="bg-slate-100 py-16 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <GraduationCap className="w-8 h-8 text-rose-600" />
            <h4 className="font-bold text-slate-900 text-base">Qualified Japanese Faculty</h4>
            <p className="text-xs text-slate-600">Expert Senseis guiding students with correct pronunciation, grammar patterns, and Kaiwa speaking practice.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-base">Computer CBT Exam Lab</h4>
            <p className="text-xs text-slate-600">Official Prometric exam simulations with Choukai audio player and instant marks calculation.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Banknote className="w-8 h-8 text-amber-600" />
            <h4 className="font-bold text-slate-900 text-base">Bank Loan & Visa Support</h4>
            <p className="text-xs text-slate-600">Guidance on financial sponsorship documentation, bank education loans, and embassy interview training.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <MapPin className="w-8 h-8 text-indigo-600" />
            <h4 className="font-bold text-slate-900 text-base">Kandy Central Campus</h4>
            <p className="text-xs text-slate-600">Air-conditioned modern smart classrooms in Kandy with dedicated study support and batch coordination.</p>
          </div>
        </div>
      </section>

    </div>
  );
}