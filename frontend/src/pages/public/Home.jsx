import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import pagodaBg from '../../assets/japan_pagoda_bg.jpg';

// Authentic Real Uploaded Photos
import campusMansion from '../../assets/campus_mansion.jpg';
import campusPool from '../../assets/campus_pool_view.jpg';
import campusTerrace from '../../assets/campus_terrace.jpg';
import batch4Group from '../../assets/batch_4_group.jpg';
import batch5Group from '../../assets/batch_5_group.jpg';
import classroomWorkshop from '../../assets/classroom_cultural_workshop.jpg';
import iceCreamDansala from '../../assets/yuzuki_ice_cream_dansala.jpg';
import convocationGroup from '../../assets/convocation_group_full.jpg';

// Real JFT Pass Achievers
import passMatheesh from '../../assets/jft_pass_matheesh.jpg';
import passDilmi from '../../assets/jft_pass_dilmi.jpg';
import passKavindu from '../../assets/jft_pass_kavindu.jpg';
import passSithum from '../../assets/jft_pass_sithum.jpg';
import passSachini from '../../assets/jft_pass_sachini.jpg';

import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Laptop, 
  Plane, 
  FileCheck, 
  Building, 
  Truck, 
  HeartPulse, 
  UtensilsCrossed, 
  Facebook, 
  Gift, 
  Banknote, 
  Smile, 
  BadgeCheck,
  MapPin,
  Mail,
  Camera,
  Star,
  Trophy,
  ChevronRight,
  Eye
} from 'lucide-react';

export default function Home() {
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  const courseHighlights = [
    {
      title: '🇯🇵 Japanese Language Program',
      subtitle: 'JFT-Basic A2 • JLPT N5, N4, N3 • NAT-TEST',
      badge: 'Physical Class • Kandy Campus',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      desc: 'Complete Japanese language training from basic Hiragana/Katakana to N3 fluency. Free textbooks, audio listening pack, and Sensei guidance.',
      duration: '3 - 4 Months',
      target: 'Ages 17–40 (No prior Japanese required)'
    },
    {
      title: '🚛 SSW Truck Driving & Logistics',
      subtitle: '自動車運送業・トラック運転',
      badge: 'Physical Class • Kandy Campus',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Specialized logistics terminology, Japanese traffic safety, route navigation, and direct employer interview preparation in Kandy.',
      duration: '3 Months',
      target: 'High Demand Work Category in Japan'
    },
    {
      title: '🏥 SSW Nursing Care / Caregiver',
      subtitle: '介護 (Kaigo)',
      badge: 'Online Live • Zoom',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Elderly care communication, nursing terminology, patient assistance skills, and SSW skill test preparation via interactive Zoom.',
      duration: '3 Months',
      target: 'Healthcare & Nursing Aspirants'
    },
    {
      title: '🍳 SSW Food Service & Hospitality',
      subtitle: '外食業 (Gaishoku) & 宿泊業',
      badge: 'Online Live • Zoom',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      desc: 'Kitchen hygiene (HACCP), customer service Japanese (Omotenashi), and front office operations training via interactive Zoom.',
      duration: '2 - 3 Months',
      target: 'Restaurant & Hotel Careers in Japan'
    }
  ];

  const collegeFeatures = [
    {
      icon: Gift,
      title: 'Free Textbooks & Audio Pack',
      desc: 'All official standard Japanese language textbooks, workbooks, and listening MP3 audio packs are provided free for registered students.'
    },
    {
      icon: Smile,
      title: 'Ages 17–40 (Zero Japanese Required)',
      desc: 'Courses start from zero foundation. Any student or job seeker between 17 and 40 years can enroll without prior Japanese language experience.'
    },
    {
      icon: Banknote,
      title: 'Bank Loan & Visa Documentation',
      desc: 'Comprehensive guidance on financial sponsorship documentation, bank education loans, and 100% transparent visa paperwork.'
    },
    {
      icon: Laptop,
      title: 'Prometric CBT Mock Exam Lab',
      desc: 'Computer-based mock exam simulator with official timer, listening tracks, and instant scoring unlocked upon course completion.'
    }
  ];

  const achievers = [
    { name: 'Dilmi Nawodya', score: '220 / 250', exam: 'JFT-Basic A2.2 (Pass)', img: passDilmi },
    { name: 'Kavindu Siriwardhana', score: '215 / 250', exam: 'JFT-Basic A2.2 (Pass)', img: passKavindu },
    { name: 'Matheesh Manelka', score: '210 / 250', exam: 'JFT-Basic A2.2 (Pass)', img: passMatheesh },
    { name: 'Sachini Mudiyanse', score: '206 / 250', exam: 'JFT-Basic A2.2 (Pass)', img: passSachini },
    { name: 'Sithum Lakmewala', score: '205 / 250', exam: 'JFT-Basic A2.2 (Pass)', img: passSithum }
  ];

  const campusGallery = [
    { title: '🏛️ Main Kandy Campus Mansion', desc: 'Luxury colonial facility with modern air-conditioned smart lecture rooms', img: campusMansion },
    { title: '👥 Official 5th Batch', desc: 'Students and teaching faculty celebrating milestone at Kandy campus', img: batch5Group },
    { title: '🎓 Official 4th Batch', desc: 'Staff in traditional attire with graduating students in college uniform', img: batch4Group },
    { title: '🌸 Japanese Cultural Workshop', desc: 'Classroom immersion with Hiragana, Katakana & Aisatsu greeting posters', img: classroomWorkshop },
    { title: '🏊 Swimming Pool & Mountain Scenery', desc: 'Peaceful natural environment for student focus and recreation', img: campusPool },
    { title: '☕ Outdoor Study Terrace', desc: 'Comfortable terrace overlooking scenic Kandy pine hills', img: campusTerrace },
    { title: '🍦 Community Ice Cream Dansala', desc: 'Yuzuki College students organizing community Dansala in Kundasale', img: iceCreamDansala },
    { title: '📜 Batch Convocation Ceremony', desc: 'Students receiving their official red Convocation certificate folders', img: convocationGroup }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 overflow-hidden font-japanese">
      
      {/* Hero Banner Section */}
      <section 
        className="relative bg-slate-950 text-white min-h-[88vh] flex items-center justify-center py-20 px-4 bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.96)), url(' + campusMansion + ')' }}
      >
        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          
          <div className="inline-flex items-center space-x-3 bg-rose-600/20 border border-rose-500/40 text-rose-300 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-lg">
            <img src={logoImg} alt="Yuzuki Logo" className="w-5 h-5 rounded-full object-contain bg-white/20" />
            <span>YUZUKI Japan College • Kandy Campus • ゆづき日本カレッジ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-japanese leading-tight">
            Study & Work in Japan <br />
            <span className="bg-gradient-to-r from-rose-400 via-amber-200 to-rose-500 bg-clip-text text-transparent">
              Your Pathway from Kandy
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Welcome to the official portal of <strong>YUZUKI Japan College (Kandy)</strong>. We provide comprehensive training for <strong>JFT-Basic A2, JLPT N5-N3, NAT-TEST, SSW Skilled Worker (Truck Driving, Caregiver, Food Service, Agriculture)</strong>, and end-to-end guidance for <strong>Student & 5-Year Working Visas</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/batch-register"
              className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-8 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-2xl shadow-rose-900/50 flex items-center space-x-2 transform hover:scale-105 transition-all"
            >
              <FileCheck className="w-5 h-5" />
              <span>📝 Register for Next Batch (HNB Slip)</span>
            </Link>

            <Link
              to="/portal"
              className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/40 px-7 py-4 rounded-2xl font-semibold text-sm sm:text-base flex items-center space-x-2 transition-all shadow-xl backdrop-blur-md"
            >
              <Laptop className="w-5 h-5 text-indigo-400" />
              <span>🎓 CBT Mock Exam Portal</span>
            </Link>

            <a
              href="https://wa.me/94773539800"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-6 py-4 rounded-2xl font-semibold text-sm sm:text-base flex items-center space-x-2 transition-colors backdrop-blur-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: 077 353 9800</span>
            </a>
          </div>

          {/* Verified Official Contacts Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto text-xs text-slate-300 font-mono">
            <div className="bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Kandy Campus, Sri Lanka</span>
            </div>
            <div className="bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>077 353 9800 / 071 110 9800</span>
            </div>
            <div className="bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">yuzukijapaneseschool@gmail.com</span>
            </div>
          </div>

        </div>
      </section>

      {/* 🏆 Top JFT-Basic Achievers: Wall of Fame */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 border border-amber-300 px-4 py-1 rounded-full text-xs font-bold font-mono">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Japan Foundation Test Official Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Congratulations to Our JFT-Basic High Achievers! 🎉
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Real scorecards and assessment notifications from the Japan Foundation. Our students achieve top marks on their first attempt!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {achievers.map((ach, idx) => (
            <div 
              key={idx}
              onClick={() => setActivePhotoModal(ach.img)}
              className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-md hover:shadow-2xl hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-64 overflow-hidden relative bg-slate-100">
                <img src={ach.img} alt={ach.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100 space-y-1">
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                  {ach.name}
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold font-mono">{ach.score}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded font-mono">
                    PASSED
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📸 Life at YUZUKI Japan College • Kandy Campus Real Photo Gallery */}
      <section className="bg-slate-100 py-20 px-4 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-rose-600 font-bold text-xs uppercase tracking-widest font-mono">
              Campus Gallery & Activities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Life at YUZUKI Japan College • Kandy Campus
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Explore our luxury campus mansion, smart lecture halls, swimming pool, terrace garden, batch celebrations, and community outreach in Kundasale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campusGallery.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setActivePhotoModal(item.img)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="h-52 overflow-hidden relative bg-slate-900">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1 rounded-xl shadow backdrop-blur-sm flex items-center space-x-1">
                      <Camera className="w-3.5 h-3.5 text-rose-600" />
                      <span>Full Photo</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* College Official Features & Student Benefits */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-rose-600 font-bold text-xs uppercase tracking-widest font-mono">
            YUZUKI Japan College • Kandy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Why Choose YUZUKI for Your Japan Pathway
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            From free textbooks to bank loan guidance and specialized Sensei mentoring.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collegeFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Course Offerings Section */}
      <section className="bg-slate-100 py-20 px-4 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-rose-600 font-bold text-xs uppercase tracking-widest font-mono">
              Academic Curriculum & Delivery Modes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Our Official Courses & Batch Tracks
            </h2>
            <p className="text-slate-600 text-sm">
              Physical classes conducted at our Kandy Campus; Online classes conducted via interactive live Zoom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseHighlights.map((c, i) => (
              <div 
                key={i} 
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <span className={'inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono border ' + c.badgeColor}>
                    {c.badge}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{c.subtitle}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Duration: <strong>{c.duration}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Target: <strong>{c.target}</strong></span>
                  </div>
                  <Link
                    to="/batch-register"
                    className="w-full mt-2 py-2.5 bg-slate-900 group-hover:bg-rose-600 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-colors shadow-sm"
                  >
                    <span>Register for Batch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prometric CBT Simulator Lab Highlight */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase font-mono">
              Prometric Computer-Based Testing (CBT) Simulator
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Real JFT-Basic & SSW Computer Exam Simulations
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Equipped with 60-question timed papers, authentic listening audio tracks (Choukai), 15-by-15 question section lock, and automated scoring unlocked for students upon course completion!
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audio Listening Player</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-rose-400 bg-rose-950/60 border border-rose-500/30 px-3 py-1.5 rounded-xl font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>15-Question Lock Policy</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-xl font-mono">
                <Award className="w-4 h-4" />
                <span>Instant Scorecards</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 text-center">
            <Link
              to="/portal"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all"
            >
              <Laptop className="w-5 h-5" />
              <span>Launch Student CBT Portal 🚀</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Official Facebook Community Link Banner */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-16 px-4 border-t border-blue-900/40">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-600/30 border border-blue-500/40 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
              <Facebook className="w-3.5 h-3.5" />
              <span>Official Facebook Community</span>
            </div>
            <h3 className="text-2xl font-bold">Follow YUZUKI Japan College on Facebook</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Check out our latest class announcements, batch convocation photos, Japanese language tips, and visa approvals on our official page.
            </p>
          </div>

          <a
            href="https://www.facebook.com/p/Yuzuki-Japan-College-61585333492032/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-xl flex items-center space-x-2 transition-all transform hover:scale-105 shrink-0"
          >
            <Facebook className="w-4 h-4" />
            <span>Open Facebook Page &rarr;</span>
          </a>
        </div>
      </section>

      {/* Direct Admission Call to Action */}
      <section className="bg-slate-950 text-white py-16 px-4 text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Join the Next Upcoming Batch
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Deposit the <strong>Rs. 5,000 Admission Fee</strong> to our official HNB account (188010007971 - Kundasale) and upload your slip to register online!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/batch-register"
              className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <FileCheck className="w-5 h-5" />
              <span>📝 Online Batch Registration</span>
            </Link>
            <a
              href="https://wa.me/94773539800"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center space-x-2 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: 077 353 9800</span>
            </a>
          </div>
        </div>
      </section>

      {/* Full Size Photo Inspection Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setActivePhotoModal(null)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
            >
              ✕
            </button>
            <img src={activePhotoModal} alt="Enlarged View" className="max-w-full max-h-[85vh] object-contain mx-auto" />
          </div>
        </div>
      )}

    </div>
  );
}