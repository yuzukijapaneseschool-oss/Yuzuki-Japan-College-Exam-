import React from 'react';
import logoImg from '../assets/logo.png';
import { Printer, X, CheckCircle2, ShieldCheck, QrCode, Building, Phone, MapPin } from 'lucide-react';

export default function AdmissionCardModal({ isOpen, onClose, studentData }) {
  if (!isOpen || !studentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl space-y-4 my-8">
        
        {/* Action Header (Hidden in Print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">Official Admission Slip & Student ID</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Card Body */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 printable-area rounded-2xl mx-4 sm:mx-6 mb-6 shadow-xl border border-slate-200 font-japanese">
          
          {/* Card Header with Logo */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-rose-600 gap-4">
            <div className="flex items-center space-x-3">
              <img src={logoImg} alt="YUZUKI Logo" className="w-14 h-14 object-contain rounded-xl border border-slate-300 p-1 bg-white shadow-sm shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  YUZUKI JAPAN COLLEGE
                </h2>
                <span className="text-xs text-rose-700 font-bold block">ゆづき日本カレッジ • Kandy Campus</span>
                <span className="text-[10px] text-slate-500 font-mono">Official Batch Admission & Student Registration</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Status:</span>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                REGISTERED
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">{currentDate}</span>
            </div>
          </div>

          {/* Student ID Highlight Box */}
          <div className="my-5 p-4 bg-gradient-to-r from-rose-50 via-slate-50 to-amber-50 rounded-2xl border-2 border-rose-500/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-700 tracking-widest block font-mono">
                Official Student ID:
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-wider">
                {studentData.student_id}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono block">Campus:</span>
              <span className="text-xs font-bold text-slate-800">Kandy City Branch</span>
            </div>
          </div>

          {/* Student Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-200 py-4 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Full Name:</span>
              <strong className="text-slate-900 font-bold">{studentData.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">NIC / Passport:</span>
              <strong className="text-slate-900 font-bold">{studentData.nic_number || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Contact / WhatsApp:</span>
              <strong className="text-slate-900 font-bold">{studentData.phone || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Email Address:</span>
              <strong className="text-slate-900 truncate block">{studentData.email}</strong>
            </div>
            <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Enrolled Course Track:</span>
              <strong className="text-rose-700 text-xs font-bold">{studentData.course_name}</strong>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Delivery Mode: <strong>{studentData.batch_mode}</strong>
              </div>
            </div>
          </div>

          {/* Payment & Bank Fee Details */}
          <div className="mt-4 pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-500">
                Admission Fee Paid: <strong className="text-emerald-700 font-bold">LKR 5,000.00 (Non-Refundable)</strong>
              </div>
              <div className="text-[10px] text-slate-400">
                Bank: HNB BANK - Kundasale Branch (AC: 188010007971)
              </div>
            </div>

            <div className="border border-emerald-500/40 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-center font-bold text-[11px] shrink-0 font-mono">
              ✓ Deposit Slip Submitted
            </div>
          </div>

          {/* College Stamp & Hotlines Footer */}
          <div className="mt-6 pt-4 border-t border-dashed border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-500 gap-2">
            <div>
              <div>🏛️ <strong>YUZUKI Japan College (Kandy Campus)</strong></div>
              <div>Hotlines: 077 353 9800 (WhatsApp) / 071 110 9800</div>
              <div>Email: yuzukijapaneseschool@gmail.com</div>
            </div>
            <div className="text-right italic font-serif text-slate-400">
              Authorized Digital Admission Receipt
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}