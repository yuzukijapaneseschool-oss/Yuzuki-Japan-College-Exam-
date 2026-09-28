import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  RotateCcw, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function RefundPolicy() {
  useEffect(() => {
    document.title = 'YUZUKI Japan College — Refund Policy';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 font-japanese select-text">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 px-4 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Official Policy • PayHere Merchant Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Transparent, fair guidelines regarding digital CBT Exam Practice Passes, payment processing through PayHere, duplicate transaction resolutions, and refund eligibility for YUZUKI Japan College.
          </p>
          <div className="pt-2 flex items-center justify-center space-x-4 text-xs text-slate-400 font-mono">
            <span>Effective Date: September 28, 2026</span>
            <span>•</span>
            <span>Last Updated: September 28, 2026</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">

        {/* Business Identification & Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                1. Institutional Overview & Scope of Service
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This Refund & Cancellation Policy applies to all digital educational products, online computer-based examination (CBT) mock simulators, and exam practice passes offered on the official website of <strong>YUZUKI JAPAN COLLEGE / YUZUKI (PVT) LTD</strong> (<a href="https://yuzukijapancollege.edu.lk" className="text-rose-600 hover:underline font-mono">https://yuzukijapancollege.edu.lk</a>).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <strong className="text-slate-900 block mb-1">Operating Entity:</strong>
              <span>YUZUKI (PVT) LTD / YUZUKI Japan College</span><br />
              <span>No 30, Samarakoonhena, Panwilthanna, Gampola, Sri Lanka</span>
            </div>
            <div>
              <strong className="text-slate-900 block mb-1">Official Contact:</strong>
              <span>Telephone: +94 71 110 9800 / 0711109800</span><br />
              <span>Email: <a href="mailto:support@yuzukijapancollege.edu.lk" className="text-rose-600 hover:underline">support@yuzukijapancollege.edu.lk</a></span>
            </div>
          </div>
        </div>

        {/* Nature of Digital Educational Services & Pricing */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
            <span>Digital Exam Practice Passes & Pricing Structure</span>
          </h2>
          
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              YUZUKI Japan College provides specialized online educational exam practice software designed to prepare candidates for Japanese language proficiency and vocational qualification tests. Our digital offerings include:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">JFT-Basic Bundle</span>
                  <span className="text-sm font-bold font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-900">$9.99 USD</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">JFT-Basic A2 Official Exam Suite</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Includes full 60-minute timed mock exams, Furigana Japanese text, Choukai listening audio, and instant scoring (30-day access).
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">SSW Category Pass</span>
                  <span className="text-sm font-bold font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-900">$9.99 USD / sector</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Specified Skilled Worker (特定技能) Passes</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Vocational exam mock papers for individual sectors (Nursing Caregiver, Truck Driving, Food Service, Agriculture, Automobile, Construction, etc.).
                </p>
              </div>
            </div>

            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Pass Validity Duration:</strong> Each paid Exam Practice Pass grants <strong>30 calendar days</strong> of continuous, unlimited online practice from the moment payment is verified.</li>
              <li><strong>Renewal Extension:</strong> Pass renewals add an additional 30 calendar days directly to the candidate's existing expiration date, ensuring no loss of remaining study time.</li>
              <li><strong>Complimentary JLPT Access:</strong> JLPT N5, JLPT N4, and JLPT N3 practice papers are provided completely free of charge to all registered students and do not require payment.</li>
              <li><strong>Category Isolation:</strong> Access to one paid SSW category pass does not grant access to other SSW sectors or JFT-Basic. Each category requires an independent pass.</li>
            </ul>
          </div>
        </section>

        {/* Digital Delivery & General Non-Refundable Nature */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
            <span>Digital Delivery & Non-Refundable Situations</span>
          </h2>
          
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-2 text-xs sm:text-sm text-amber-950">
            <div className="flex items-center space-x-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Digital Educational Content Delivery Notice</span>
            </div>
            <p className="leading-relaxed">
              Because YUZUKI Exam Practice Passes provide immediate, automated digital access to intellectual property, proprietary Japanese examination questions, audio recordings, and grading systems, <strong>fees paid for successfully activated Exam Practice Passes are non-refundable once access has been unlocked and utilized</strong>.
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2 pt-2">
            <p>Refunds will <strong>NOT</strong> be granted under the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Change of Mind:</strong> If a candidate changes their mind after completing payment and unlocking exam questions.</li>
              <li><strong>Lack of Personal Study Time:</strong> If a candidate fails to use their pass during the 30-day active validity window.</li>
              <li><strong>External Exam Outcome:</strong> If a candidate does not achieve their desired score in third-party official examinations (e.g. Prometric JFT-Basic, JLPT, or Japan Embassy tests).</li>
              <li><strong>Category Selection Error After Use:</strong> If a candidate accidentally purchased a different category (e.g., purchased SSW Agriculture instead of SSW Caregiver) and proceeded to attempt the exams. (If reported immediately prior to attempting any exams, category transfers can be made by support).</li>
              <li><strong>Account Suspension for Policy Violations:</strong> If an account is suspended or terminated due to prohibited activities such as account sharing, question scraping, automated bot attacks, or payment tampering.</li>
            </ul>
          </div>
        </section>

        {/* Eligible Situations for Refund */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">4</span>
            <span>Circumstances Eligible for Refund or Correction</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Technical Activation Failure</h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                If payment was successfully deducted by PayHere but our automated system failed to activate the 30-day pass, and our engineering support cannot manually activate your pass within <strong>24–48 hours</strong> of your notification.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Verified Duplicate Billing</h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                If a candidate was charged more than once for the same category order due to a network glitch or duplicate browser gateway submission, the extra transaction will be refunded 100% upon verification.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Verified Fraudulent Transaction</h4>
              <p className="text-slate-600 leading-relaxed text-xs">
                In cases of proven unauthorized or fraudulent card use reported promptly in writing with supporting bank documentation prior to account usage.
              </p>
            </div>
          </div>
        </section>

        {/* Payment Processing via PayHere */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">5</span>
            <span>Payment Processing Through PayHere Gateway</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span>Central Bank of Sri Lanka (CBSL) Approved Payment Gateway</span>
            </div>
            <p>
              All online credit card, debit card, and mobile wallet transactions on YUZUKI Japan College are processed securely through <strong>PayHere (Pvt) Ltd</strong>, an authorized payment service provider in Sri Lanka.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Failed or Cancelled Transactions:</strong> If your transaction is declined, cancelled, or fails during the PayHere checkout session, no money is received by YUZUKI Japan College. Any temporary pre-authorizations or holding amounts on your card will be automatically released by your issuing bank according to their standard policy.</li>
              <li><strong>Security & Privacy:</strong> YUZUKI Japan College does not store your card number, CVV, or banking passwords on our servers. All financial data is encrypted and processed directly by PayHere.</li>
            </ul>
          </div>
        </section>

        {/* Refund Request Procedure */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">6</span>
            <span>Refund Request Procedure & Required Information</span>
          </h2>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm">
            <p className="text-slate-600 leading-relaxed">
              To request a review for a technical failure or duplicate transaction, you must submit a written refund request within <strong>7 calendar days</strong> of the transaction date.
            </p>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Please provide the following mandatory information in your request:
              </h4>
              <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                <li>Full Name of Candidate (as registered in YUZUKI portal)</li>
                <li>Registered Student ID (e.g. <code>YEP00101</code> or <code>YJP00305</code>)</li>
                <li>Registered Email Address & Contact Phone Number</li>
                <li>PayHere Payment Reference ID / Transaction Reference (from your payment receipt)</li>
                <li>YUZUKI Official Order Number / Invoice ID (e.g. <code>YZK-INV-...</code>)</li>
                <li>Date and exact timestamp of the transaction</li>
                <li>Exact amount paid and currency (e.g., $9.99 USD or LKR equivalent)</li>
                <li>Clear screenshot or bank proof showing the debit and error message encountered</li>
              </ol>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Submit your request via email to: <a href="mailto:support@yuzukijapancollege.edu.lk" className="text-rose-600 font-bold hover:underline">support@yuzukijapancollege.edu.lk</a> or via WhatsApp Hotline: <a href="https://wa.me/94773539800" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">+94 77 353 9800</a>.
            </p>
          </div>
        </section>

        {/* Processing Timelines & Gateway Limitations */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">7</span>
            <span>Investigation Timeframe & Refund Processing</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Standard Verification & Banking Timelines</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Verification Review:</strong> Our administrative and technical team will review the transaction logs with PayHere within <strong>3 to 5 business days</strong> of receiving your complete request.</li>
              <li><strong>Refund Method:</strong> Approved refunds are credited directly back to the <strong>original payment method</strong> (e.g., the original Visa/MasterCard card, bank account, or digital wallet) through the PayHere refund portal. Cash refunds or transfers to alternate third-party accounts are strictly prohibited for security and anti-money laundering compliance.</li>
              <li><strong>Bank Settlement Period:</strong> Once initiated by YUZUKI through PayHere, the credited funds typically reflect in your bank account or card statement within <strong>5 to 10 business days</strong>, depending on your card issuer or bank (Commercial Bank, Sampath Bank, HNB, BOC, People's Bank, etc.).</li>
            </ul>
          </div>
        </section>

        {/* Contact & Support Section */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-japanese flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-rose-400" />
              <span>8. Need Assistance with a Payment or Refund?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If you experience any difficulties during checkout, have questions about your 30-day exam pass, or need help with a transaction, our administration team in Kandy is ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Direct Telephone:</span>
              <a href="tel:0711109800" className="text-rose-300 hover:text-white font-bold text-sm block">0711109800</a>
              <span className="text-[10px] text-slate-400">Mon - Sat: 8:30 AM - 5:30 PM</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">WhatsApp Support:</span>
              <a href="https://wa.me/94773539800" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold text-sm block">0773539800</a>
              <span className="text-[10px] text-slate-400">Fast Technical Assistance</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Official Support Email:</span>
              <a href="mailto:support@yuzukijapancollege.edu.lk" className="text-white hover:underline text-xs block truncate">support@yuzukijapancollege.edu.lk</a>
              <span className="text-[10px] text-slate-400">General & Payment Desk</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>YUZUKI Japan College, No 30, Samarakoonhena, Panwilthanna, Gampola, Sri Lanka.</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
