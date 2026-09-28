import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Database, 
  Eye, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  Server, 
  Cookie, 
  RefreshCw,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'YUZUKI Japan College — Privacy Policy';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 font-japanese select-text">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 px-4 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Official Policy • Student Privacy & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            How YUZUKI Japan College collects, utilizes, safeguards, and respects the personal information and examination data of students and CBT candidates.
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

        {/* Introduction Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                1. Institutional Commitment to Privacy
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>YUZUKI JAPAN COLLEGE / YUZUKI (PVT) LTD</strong> ("YUZUKI", "we", "our", or "us"), registered at <strong>No 30, Samarakoonhena, Panwilthanna, Gampola, Sri Lanka</strong>, is committed to safeguarding the privacy and confidential data of all students, applicants, and online CBT exam practice candidates who visit our website (<a href="https://yuzukijapancollege.edu.lk" className="text-rose-600 hover:underline font-mono">https://yuzukijapancollege.edu.lk</a>).
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            This Privacy Policy explains what personal information we collect, why we collect it, how it is processed and stored, how we handle payment processing via <strong>PayHere</strong>, and what rights you have regarding your personal data.
          </p>
        </div>

        {/* 2. Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
            <span>Types of Information We Collect</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-rose-600" />
                <span>Personal & Profile Information</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li>Full Name and Japanese Katakana name (where provided)</li>
                <li>Email address and telephone/WhatsApp contact number</li>
                <li>National Identity Card (NIC) / Passport number (for student admissions)</li>
                <li>Date of birth, hometown/city, and residential district</li>
                <li>Assigned Student ID (e.g. <code>YEP00101</code>, <code>YJP00305</code>)</li>
                <li>Classroom batch mode or online practice track enrollment</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Academic & Examination Data</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li>Active 30-day exam practice passes and category entitlements</li>
                <li>Mock exam attempts, answer choices, and section scores</li>
                <li>Time taken per exam paper and question response speed</li>
                <li>Pass/fail determination and historical score improvements</li>
                <li>Tab-switching frequency metrics (anti-cheat monitoring)</li>
                <li>Assigned Sensei feedback and performance reports</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Payment & Order Records</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li>PayHere Payment Reference ID (e.g. <code>PAYHERE-SB-...</code>)</li>
                <li>Internal invoice number (e.g. <code>YZK-INV-...</code>)</li>
                <li>Payment status (unpaid, paid, refunded), currency, and amount</li>
                <li>Bank deposit slip images (for physical batch admissions)</li>
                <li><strong>No Card Data:</strong> Full card numbers and CVVs are NOT collected or stored by YUZUKI</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <Server className="w-4 h-4 text-amber-600" />
                <span>Technical & Device Security Data</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li>IP address and network location details</li>
                <li>Browser user-agent, operating system, and screen resolution</li>
                <li>Device fingerprint tokens (for single-device login binding)</li>
                <li>System access timestamps and security logs</li>
                <li>Session authentication tokens (JSON Web Tokens)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Payment Processing & Payment Privacy (PayHere) */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
            <span>Payment Security & Non-Storage of Financial Credentials</span>
          </h2>

          <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-emerald-950">
            <div className="flex items-center space-x-2.5 font-bold text-emerald-900 text-base">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>Payment Processing via PayHere (CBSL Approved Gateway)</span>
            </div>
            <p className="leading-relaxed">
              When you purchase an online CBT Exam Practice Pass (\$9.99 USD) on our platform, all payment transactions are routed securely through <strong>PayHere (Pvt) Ltd</strong>, an authorized Payment Service Provider regulated by the <strong>Central Bank of Sri Lanka (CBSL)</strong> and certified to <strong>PCI-DSS (Payment Card Industry Data Security Standard) Level 1</strong>.
            </p>
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-2 text-slate-800">
              <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">
                Strict Financial Privacy Guarantee:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>YUZUKI Japan College does NOT collect, receive, or store your full 16-digit credit/debit card numbers, CVV/CVC security codes, card expiration dates, PIN numbers, or online banking passwords.</strong></li>
                <li>Payment details are entered directly on PayHere's encrypted gateway pages.</li>
                <li>YUZUKI receives only encrypted server-to-server notifications containing transaction status codes, amounts, and PayHere reference identifiers necessary to verify payment and automatically activate your 30-day exam pass.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Purpose of Information Collection */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">4</span>
            <span>Why We Collect Your Information</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>We process personal and academic information strictly for the following legitimate educational and administrative purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Student Registration & Account Creation:</strong> To establish your candidate profile and issue your unique sequential Student ID (e.g. <code>YEP00101</code>, <code>YJP00305</code>).</li>
              <li><strong>Exam Practice Pass Activation:</strong> To grant instantaneous, automated 30-day access to your chosen examination category (JFT-Basic, SSW Caregiver, Truck Driving, Food Service, Agriculture, etc.).</li>
              <li><strong>Scoring, Analytics & Digital Reports:</strong> To automatically compute test results, evaluate listening/reading performance, and display customized study dashboards.</li>
              <li><strong>Security & Anti-Cheating Enforcement:</strong> To bind student accounts to a single active device, monitor suspicious tab-switching behavior, prevent unauthorized account sharing, and defeat bot scrapers.</li>
              <li><strong>Payment Verification & Accounting:</strong> To reconcile PayHere transaction receipts, issue digital invoices, and maintain audited accounting records as required by Sri Lankan commercial regulations.</li>
              <li><strong>Student Support & Notifications:</strong> To answer inquiries, send official admission cards via email, and provide prompt technical assistance.</li>
            </ul>
          </div>
        </section>

        {/* 5. Data Sharing & Third-Party Disclosures */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">5</span>
            <span>Data Sharing & Third-Party Disclosures</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p><strong>We do NOT sell, rent, lease, or trade student personal information to commercial advertising brokers or third-party marketers.</strong></p>
            <p>Information is shared only with trusted technical and institutional service providers where strictly necessary:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Payment Gateway (PayHere):</strong> Transaction metadata (Student ID, order ID, amount) is exchanged with PayHere to process and verify payments.</li>
              <li><strong>Cloud Infrastructure & Server Hosting:</strong> Secure cloud server and database providers hosting our backend systems, with strict encryption in transit and at rest.</li>
              <li><strong>Email Service Providers:</strong> Automated transactional email dispatchers for admission cards and receipts.</li>
              <li><strong>Legal & Regulatory Authorities:</strong> We may disclose information if required by Sri Lankan law, court order, subpoena, or to protect the safety, rights, and intellectual property of YUZUKI Japan College.</li>
            </ul>
          </div>
        </section>

        {/* 6. Data Security & Storage */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">6</span>
            <span>Data Security, Encryption & Retention</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <Lock className="w-4 h-4 text-rose-600" />
              <span>Multi-Layered Security Protections</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Transport Layer Security (TLS/HTTPS):</strong> All data transmitted between your browser and our servers is secured using modern TLS 1.3 cryptographic protocols.</li>
              <li><strong>Password Hashing:</strong> All student passwords are salted and hashed using the industry-standard <strong>Bcrypt</strong> algorithm prior to database storage. We cannot read plaintext passwords.</li>
              <li><strong>Rate-Limiting & Anti-Brute-Force:</strong> Automated firewalls and express rate-limiters block brute-force password guessing and automated attacks.</li>
              <li><strong>Data Retention:</strong> Student records, exam attempt histories, and transaction invoices are retained for as long as your account remains active and for the duration required by educational auditing and tax laws.</li>
              <li><strong>Security Disclaimer:</strong> While we employ industry-recommended technical, physical, and administrative safeguards, no method of transmission over the Internet or electronic storage is 100% infallible, and absolute security cannot be guaranteed.</li>
            </ul>
          </div>
        </section>

        {/* 7. Cookies & Local Storage */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">7</span>
            <span>Cookies & Browser Storage</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              YUZUKI Japan College uses standard functional cookies and local storage tokens exclusively to facilitate essential website operations:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Authentication Tokens (JWT):</strong> Secure tokens stored locally in your browser to maintain your active login session across portal pages without requiring repetitive sign-ins.</li>
              <li><strong>Exam Session State:</strong> Temporary session memory to ensure your exam progress and timers are not lost during network fluctuations.</li>
              <li><strong>No Third-Party Ad Cookies:</strong> We do not deploy cross-site tracking cookies or behavioral advertising trackers on our exam platform.</li>
            </ul>
          </div>
        </section>

        {/* 8. User Rights & Data Correction */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">8</span>
            <span>Your Rights & Access to Information</span>
          </h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>Students and registered candidates have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Access Your Profile:</strong> View your registration information, active pass durations, and past exam attempts at any time via your student dashboard.</li>
              <li><strong>Correct Inaccurate Data:</strong> Request updates to misspelled names, contact phone numbers, or email addresses by contacting college administration with valid proof of identity.</li>
              <li><strong>Account Inquiries:</strong> Inquire about any transaction or stored educational record by contacting <a href="mailto:support@yuzukijapancollege.edu.lk" className="text-rose-600 font-bold hover:underline">support@yuzukijapancollege.edu.lk</a>.</li>
            </ul>
          </div>
        </section>

        {/* 9. Policy Updates & Contact Details */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-japanese flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-rose-400" />
              <span>9. Privacy Inquiries & Policy Updates</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We may periodically update this Privacy Policy to reflect enhancements in our portal, changes in applicable data protection regulations, or payment gateway requirements. Any modifications will be posted here with an updated revision date.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Privacy Officer / Administration:</span>
              <a href="tel:0711109800" className="text-rose-300 hover:text-white font-bold text-sm block">0711109800</a>
              <span className="text-[10px] text-slate-400">YUZUKI (PVT) LTD</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Official Email:</span>
              <a href="mailto:info@yuzukijapancollege.edu.lk" className="text-white hover:underline text-xs block truncate">info@yuzukijapancollege.edu.lk</a>
              <span className="text-[10px] text-slate-400">Data Protection Desk</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">WhatsApp Hotline:</span>
              <a href="https://wa.me/94773539800" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold text-sm block">0773539800</a>
              <span className="text-[10px] text-slate-400">Fast Support</span>
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
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
