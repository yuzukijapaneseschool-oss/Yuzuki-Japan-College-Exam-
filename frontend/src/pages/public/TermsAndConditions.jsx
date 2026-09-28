import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  CreditCard, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  Ban, 
  Scale, 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
  Smartphone
} from 'lucide-react';

export default function TermsAndConditions() {
  useEffect(() => {
    document.title = 'YUZUKI Japan College — Terms & Conditions';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 font-japanese select-text">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 px-4 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Scale className="w-3.5 h-3.5 text-rose-400" />
            <span>Official Policy • Terms of Service & User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Legal terms, user responsibilities, examination rules, payment conditions, and content protection standards governing the use of YUZUKI Japan College services and CBT examination simulator.
          </p>
          <div className="pt-2 flex items-center justify-center space-x-4 text-xs text-slate-400 font-mono">
            <span>Effective Date: September 28, 2026</span>
            <span>•</span>
            <span>Last Updated: September 28, 2026</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">

        {/* 1. Agreement to Terms */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                1. Acceptance of Terms & Operator Identification
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                These Terms & Conditions ("Terms", "Agreement") constitute a legally binding agreement between you ("User", "Student", "Candidate") and <strong>YUZUKI JAPAN COLLEGE / YUZUKI (PVT) LTD</strong> ("YUZUKI", "College", "we", "our", or "us"), an educational institution incorporated in Sri Lanka having its principal place of business at <strong>No 30, Samarakoonhena, Panwilthanna, Gampola, Sri Lanka</strong>.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            By registering for an account, purchasing an Exam Practice Pass, attempting mock exams, or browsing our website (<a href="https://yuzukijapancollege.edu.lk" className="text-rose-600 hover:underline font-mono">https://yuzukijapancollege.edu.lk</a>), you acknowledge that you have read, understood, and agree to be bound by these Terms, along with our <Link to="/privacy-policy" className="text-rose-600 hover:underline font-semibold">Privacy Policy</Link> and <Link to="/refund-policy" className="text-rose-600 hover:underline font-semibold">Refund & Cancellation Policy</Link>.
          </p>
        </div>

        {/* 2. User Accounts & Registration */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
            <span>Account Registration & Student Responsibilities</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Eligibility:</strong> Our services and CBT examination simulator are available to individuals aged 17 years and above who are preparing for Japanese language exams (JFT-Basic, JLPT, NAT-TEST) or Specified Skilled Worker (SSW) vocational qualifications.</li>
              <li><strong>Accurate Information:</strong> You agree to provide true, accurate, current, and complete personal information during registration (including your legal name, contact email, and active telephone number). Providing fraudulent information or registering under a false identity is strictly prohibited.</li>
              <li><strong>Account Confidentiality:</strong> You are solely responsible for maintaining the confidentiality of your account password and Student ID. You agree to notify YUZUKI immediately upon discovering any unauthorized access to your account.</li>
              <li><strong>Personal Non-Transferable License:</strong> Your account is personal to you. You may not sell, lease, transfer, or assign your account or any purchased examination pass to any other person.</li>
            </ul>
          </div>
        </section>

        {/* 3. Strict Single-Device Policy & Anti-Account Sharing */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
            <span>Single-Device Policy & Anti-Account Sharing Rules</span>
          </h2>

          <div className="bg-rose-50/80 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-rose-950">
            <div className="flex items-center space-x-2.5 font-bold text-rose-900 text-base">
              <Smartphone className="w-6 h-6 text-rose-600 shrink-0" />
              <span>Strict One-Device Binding Enforcement</span>
            </div>
            <p className="leading-relaxed">
              To protect the integrity of examination materials and prevent unlawful commercial group sharing, <strong>YUZUKI enforces an automated single-device binding policy for all student accounts</strong>.
            </p>
            <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-2 text-slate-800">
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Upon your initial sign-in, your student account automatically binds to that primary browser/device.</li>
                <li>Simultaneous logins from multiple phones, laptops, or sharing login credentials with friends, classmates, or coaching centers is strictly blocked by our security engine.</li>
                <li>If you legitimately change your study device (e.g. replace a phone or computer), you must contact YUZUKI Administration to request an authorized device reset.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Exam Practice Passes, Category Isolation & Expiration */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">4</span>
            <span>Exam Practice Passes, Pricing & Category Isolation</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono">JFT-Basic A2 Bundle Pass</span>
                <h4 className="font-bold text-slate-900 text-sm">$9.99 USD / 30 Days (~LKR 3,050)</h4>
                <p className="text-xs text-slate-600">
                  Grants 30 calendar days of access to all official JFT-Basic model exam papers, timed Prometric-style simulation, and audio listening Choukai.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono">SSW Sector Specific Pass</span>
                <h4 className="font-bold text-slate-900 text-sm">$9.99 USD / sector / 30 Days</h4>
                <p className="text-xs text-slate-600">
                  Grants 30 calendar days of access exclusively to the purchased Specified Skilled Worker sector (e.g., Caregiver, Truck Driving, Food Service, Agriculture, etc.).
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Key Category Entitlement & Expiration Rules:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                <li><strong>Strict Category Isolation:</strong> A pass purchased for one SSW category (such as <em>SSW Nursing Caregiver</em>) does NOT grant access to other SSW categories (such as <em>SSW Truck Driving</em> or <em>SSW Automobile</em>) or JFT-Basic. Each category requires an independent pass.</li>
                <li><strong>30-Day Active Window:</strong> Each pass is strictly active for <strong>30 calendar days</strong> from the exact timestamp of verified PayHere payment. Upon expiration, access is locked until renewed.</li>
                <li><strong>Renewal Extension:</strong> Renewing a pass prior to or after expiration adds +30 days to your valid period without penalizing unspent days.</li>
                <li><strong>Complimentary JLPT Access:</strong> JLPT N5, JLPT N4, and JLPT N3 practice papers are educational public resources provided free of charge and remain separate from paid passes.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Payments & PayHere Integration */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">5</span>
            <span>Payment Terms & PayHere Gateway Integration</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span>Secure Transactions via PayHere (CBSL Regulated)</span>
            </div>
            <p>
              All online payments for Exam Practice Passes are processed via <strong>PayHere (Pvt) Ltd</strong>. By initiating a payment, you agree to comply with PayHere’s terms of service.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Pricing & Currency:</strong> Exam passes are priced in USD ($9.99 USD) and converted at real-time gateway exchange rates for Sri Lankan cardholders. Prices are subject to revision, but price changes will not impact an active 30-day pass already paid for.</li>
              <li><strong>Confirmation & Invoices:</strong> Upon successful transaction completion and server-side signature verification, a digital receipt and invoice are generated automatically in your portal account.</li>
              <li><strong>Refunds:</strong> All purchases are governed by our official <Link to="/refund-policy" className="text-rose-600 font-semibold hover:underline">Refund Policy</Link>. As digital educational content is delivered instantaneously upon payment, completed passes are non-refundable once accessed.</li>
            </ul>
          </div>
        </section>

        {/* 6. Prohibited Activities & Anti-Cheating Rules */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">6</span>
            <span>Prohibited Conduct & Anti-Piracy Safeguards</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm">
            <p className="text-slate-600 leading-relaxed">
              Users are strictly forbidden from engaging in any of the following unauthorized or unlawful activities. Engaging in prohibited conduct will result in immediate permanent account termination without refund and potential legal prosecution:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 flex items-start space-x-3 text-rose-950">
                <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>No Content Scraping / Piracy:</strong> Copying, photographing, screenshotting, recording, downloading, scraping, or commercially distributing YUZUKI exam questions, Furigana text, audio files, or answer keys.</span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 flex items-start space-x-3 text-rose-950">
                <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>No Account Sharing:</strong> Sharing student account credentials or allowing multiple persons to access exams using a single paid pass.</span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 flex items-start space-x-3 text-rose-950">
                <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>No Access Control Bypass:</strong> Attempting to tamper with API parameters, forge payment hashes, bypass category locks, or alter score records.</span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 flex items-start space-x-3 text-rose-950">
                <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>No Reverse Engineering:</strong> Decompiling, disassembling, probing, or vulnerability scanning the backend API or client applications.</span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 flex items-start space-x-3 text-rose-950">
                <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>No Denial of Service:</strong> Overloading our servers with automated bots, brute-force requests, or DDoS attacks.</span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 flex items-start space-x-3 text-rose-950">
                <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>No Cheating During Timed Sessions:</strong> Excessive tab-switching or attempting to copy text is monitored by our automated anti-cheat engine.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Intellectual Property & Copyright */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">7</span>
            <span>Intellectual Property & Copyright Ownership</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              All software, algorithms, mock examination questions, Furigana typography, listening comprehension audio tracks, explanations, graphics, logos, trademarks, and UI layouts available on YUZUKI Japan College are the exclusive intellectual property of <strong>YUZUKI (PVT) LTD</strong> and are protected under the <strong>Intellectual Property Act, No. 36 of 2003 of Sri Lanka</strong> and international copyright treaties.
            </p>
            <p>
              Purchasing a 30-day Exam Practice Pass grants you a limited, non-exclusive, non-transferable, revocable license for personal, non-commercial study only. No right, title, or interest in any intellectual property is transferred to you.
            </p>
          </div>
        </section>

        {/* 8. Educational Disclaimer & Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">8</span>
            <span>Educational Disclaimer & Limitation of Liability</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Independent Educational Simulator:</strong> YUZUKI Japan College provides prep materials developed according to official Japan Foundation, Prometric, and JLPT curriculum guidelines. YUZUKI is an independent educational academy in Sri Lanka and is not officially affiliated with the Japan Foundation, Prometric Inc., or the Embassy of Japan.</li>
              <li><strong>No Score Guarantee:</strong> While our CBT mock tests are designed to closely simulate real exam difficulty, YUZUKI makes no express or implied warranty that practice on our platform guarantees passing official external tests. Individual results depend on student diligence and effort.</li>
              <li><strong>Service Availability:</strong> We strive to maintain 99.9% platform availability. However, access may be temporarily interrupted for scheduled maintenance, updates, or unforeseen ISP/telecommunication outages. YUZUKI is not liable for indirect, incidental, or consequential damages resulting from platform downtime or student hardware defects.</li>
            </ul>
          </div>
        </section>

        {/* 9. Governing Law & Jurisdiction */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">9</span>
            <span>Governing Law & Legal Jurisdiction</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              These Terms & Conditions shall be governed by and construed in accordance with the substantive laws of the <strong>Democratic Socialist Republic of Sri Lanka</strong>. Any dispute, claim, or controversy arising out of or relating to these Terms or the use of our services shall be subject to the exclusive jurisdiction of the competent courts in Kandy / Colombo, Sri Lanka.
            </p>
          </div>
        </section>

        {/* 10. Contact & Administration */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-japanese flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-rose-400" />
              <span>10. Inquiries Regarding Terms of Service</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If you have any questions or require clarification regarding these Terms & Conditions, please reach out to YUZUKI Japan College Administration:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Campus Telephone:</span>
              <a href="tel:0711109800" className="text-rose-300 hover:text-white font-bold text-sm block">0711109800</a>
              <span className="text-[10px] text-slate-400">Administration Desk</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Official Email:</span>
              <a href="mailto:info@yuzukijapancollege.edu.lk" className="text-white hover:underline text-xs block truncate">info@yuzukijapancollege.edu.lk</a>
              <span className="text-[10px] text-slate-400">Legal & Terms Inquiries</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">WhatsApp Support:</span>
              <a href="https://wa.me/94773539800" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold text-sm block">0773539800</a>
              <span className="text-[10px] text-slate-400">Student Assistance</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>YUZUKI Japan College, No 30, Samarakoonhena, Panwilthanna, Gampola, Sri Lanka.</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
              <span>•</span>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
