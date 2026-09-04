import React from 'react';
import { Link } from 'react-router-dom';
import pagodaBg from '../../assets/japan_pagoda_bg.jpg';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Plane, 
  FileCheck
} from 'lucide-react';

export default function VisaPathways() {
  const pathways = [
    {
      title: '1. Japan Student Visa (留学ビザ)',
      subtitle: 'Higher Education & Language School Pathways',
      badge: 'Most Popular Pathway',
      color: 'border-rose-300 bg-rose-50/30',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'Study at accredited Japanese Language Schools, Vocational Colleges (Senmon Gakko), and Universities across Tokyo, Osaka, Nagoya, Kyoto, and Fukuoka.',
      benefits: [
        'Work legally part-time up to 28 hours per week (earn approx. 120,000 - 180,000 JPY/month)',
        'Full 40 hours/week work permission during school holidays and vacations',
        'Pathway to convert into a full-time Japanese Work Visa upon graduation',
        'Complete documentation support for Certificate of Eligibility (COE) and visa grant'
      ],
      requirements: [
        'G.C.E. A/L or O/L Qualification',
        'Minimum JLPT N5 or NAT-TEST N5 or JFT-Basic A2 or 150-hour Japanese course certificate',
        'Financial Sponsorship documentation (we assist with family sponsorship preparation)'
      ]
    },
    {
      title: '2. SSW Specified Skilled Worker Visa (特定技能)',
      subtitle: '5-Year Direct Employment Visa with High Salary',
      badge: 'Full Work Visa',
      color: 'border-indigo-300 bg-indigo-50/30',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      desc: 'Direct 5-year full-time employment with Japanese companies in high-demand industries with Japanese standard wages, health insurance, and pension.',
      benefits: [
        'Earn attractive salaries (200,000 - 280,000+ JPY/month + Overtime + Bonuses)',
        'Full residency rights, health insurance, and pension scheme in Japan',
        'Eligible for SSW 2 category with permanent residency pathway in Japan',
        'Direct employer interview matching organized by YUZUKI College'
      ],
      requirements: [
        'JFT-Basic A2 Certificate or JLPT N4 Certificate',
        'SSW Skill Test Pass Certificate in respective field (Caregiver, Food Service, Agriculture, etc.)',
        'Age 18+ and medically fit'
      ]
    },
    {
      title: '3. Technical Intern Training Visa / TITP (技能実習)',
      subtitle: 'Hands-on Technical Training in Japanese Industry',
      badge: '3 - 5 Year Internship',
      color: 'border-emerald-300 bg-emerald-50/30',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'Acquire advanced Japanese technical and industrial skills with reputable Japanese manufacturing, construction, and agricultural organizations.',
      benefits: [
        'Fixed monthly stipends and overtime allowances',
        'Accommodation and health insurance supported by Japanese accepting organizations',
        'Opportunity to transition to SSW Skilled Worker Visa after 3 years without skill exams'
      ],
      requirements: [
        'Basic Japanese conversational ability (JLPT N5 level recommended)',
        'Vocational training or relevant physical capability',
        'Age 18 - 30 years'
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
            Immigration & Careers
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            Japan Visa Pathways & Processing
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Your trusted bridge from Sri Lanka to Japan with transparent, legal, and verified visa documentation.
          </p>
        </div>
      </section>

      {/* Pathways List */}
      <section className="py-20 px-4 max-w-7xl mx-auto space-y-12">
        {pathways.map((p) => (
          <div 
            key={p.title} 
            className={'bg-white rounded-3xl border-2 ' + p.color + ' p-6 sm:p-10 shadow-lg hover:shadow-xl transition-all space-y-6'}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className={'inline-block text-xs font-bold px-3 py-1 rounded-full font-mono mb-2 ' + p.badgeColor}>
                  {p.badge}
                </span>
                <h2 className="text-2xl font-bold text-slate-900">{p.title}</h2>
                <p className="text-xs text-rose-600 font-semibold">{p.subtitle}</p>
              </div>

              <Link
                to="/contact"
                className="bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors shrink-0 flex items-center space-x-1.5 self-start sm:self-center"
              >
                <span>Inquire Visa Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {p.desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase text-emerald-700 font-mono tracking-wider flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Benefits in Japan</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {p.benefits.map((b, bi) => (
                    <li key={bi} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0">
                <h4 className="font-bold text-xs uppercase text-indigo-700 font-mono tracking-wider flex items-center space-x-1">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  <span>Eligibility & Criteria</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {p.requirements.map((r, ri) => (
                    <li key={ri} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}