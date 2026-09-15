import React, { useState } from 'react';
import { paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  X, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  Printer, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function SubscriptionModal({ isOpen, onClose, onSubscribed }) {
  const { user, refreshUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'mobile' | 'bank'
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: user?.name || 'Kasun Perera',
    expiry: '12/28',
    cvv: '883',
    mobileNumber: user?.phone || '077 123 4567'
  });

  if (!isOpen) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let methodName = 'Credit / Debit Card (Visa)';
      if (paymentMethod === 'mobile') methodName = 'Sri Lankan Mobile Pay (FriMi / Genie / eZ Cash)';
      if (paymentMethod === 'bank') methodName = 'Online Bank Direct (JustPay)';

      const lastFour = paymentMethod === 'card' ? cardData.cardNumber.slice(-4) || '4242' : '8821';

      const res = await paymentAPI.checkout({
        paymentMethod: methodName,
        amount: 9.99,
        currency: 'USD',
        cardHolder: cardData.cardHolder,
        lastFour
      });

      setSuccessData(res.data);
      if (refreshUser) await refreshUser();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onSubscribed) onSubscribed();
    } catch (err) {
      alert('Payment failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFillCard = (type) => {
    if (type === 'visa') {
      setCardData({ ...cardData, cardNumber: '4532 8821 9043 4242', expiry: '08/29', cvv: '772' });
    } else if (type === 'master') {
      setCardData({ ...cardData, cardNumber: '5312 9940 1209 8831', expiry: '11/28', cvv: '419' });
    } else if (type === 'frimi') {
      setPaymentMethod('mobile');
      setCardData({ ...cardData, mobileNumber: '077 982 1104' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 relative overflow-hidden text-slate-900 my-8">
        
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full border border-rose-500 bg-white p-0.5 overflow-hidden shadow shrink-0">
              <img src={logoImg} alt="Yuzuki Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Online Exam Pass ($9.99 / Mo)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-japanese text-slate-900">
                {successData ? 'Payment Confirmed (領収書)' : 'Secure Online Checkout'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successData ? (
          /* Receipt / Confirmation Screen */
          <div className="space-y-6 animate-fade-in">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 font-japanese">
                30-Day Exam Pass Activated!
              </h3>
              <p className="text-xs text-emerald-800">
                Your payment was processed successfully. You now have full unlimited access to all Japanese & SSW examination papers.
              </p>
            </div>

            {/* Official Invoice Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Invoice Number:</span>
                <strong className="text-slate-900">{successData.payment?.invoice_num}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Transaction Ref:</span>
                <strong className="text-slate-900">{successData.payment?.reference}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Student Name:</span>
                <strong className="text-slate-900">{user?.name}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Student ID:</span>
                <strong className="text-slate-900">{user?.student_id}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Amount Paid:</span>
                <strong className="text-emerald-700 text-sm">$9.99 USD (~LKR 3,050)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pass Valid Until:</span>
                <strong className="text-slate-900">
                  {new Date(successData.subscription?.expires_at).toLocaleDateString()} (30 Days)
                </strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold transition-colors flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-md"
              >
                <span>Enter Exam Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form Screen */
          <form onSubmit={handlePay} className="space-y-5">
            
            {/* Price Card */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-2xl p-5 shadow-inner flex items-center justify-between">
              <div>
                <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider">
                  YUZUKI College Exam Pass
                </span>
                <div className="text-3xl font-extrabold font-mono mt-0.5">
                  $9.99 <span className="text-xs font-normal text-slate-300 font-sans">/ 30 Days</span>
                </div>
                <div className="text-[11px] text-amber-300 font-medium mt-0.5">
                  ≈ LKR 3,050 (Sri Lankan Rupees)
                </div>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/40 inline-block mb-1">
                  Full Access
                </span>
                <div className="text-[11px] text-slate-400">JFT • JLPT • SSW</div>
              </div>
            </div>

            
            {/* Pure Card Form */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <CreditCard className="w-4 h-4 text-rose-600" />
                  <span>Card Payment (Visa, MasterCard, Amex)</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  256-Bit SSL Encrypted
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardData.cardNumber}
                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                  placeholder="4532 •••• •••• 4242"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-mono outline-none bg-white shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    placeholder="12/28"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-rose-500 outline-none font-mono bg-white shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    CVV Security Code
                  </label>
                  <input
                    type="password"
                    required
                    maxLength="4"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    placeholder="•••"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-rose-500 outline-none font-mono bg-white shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardData.cardHolder}
                  onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-rose-500 outline-none bg-white font-medium shadow-sm"
                />
              </div>

              {/* Quick Auto-Fill test buttons */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  ⚡ 1-Click Test Cards:
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFillCard('visa')}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:border-rose-500 rounded-lg text-[11px] font-semibold text-slate-700 shadow-sm"
                  >
                    💳 Test Visa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFillCard('master')}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:border-rose-500 rounded-lg text-[11px] font-semibold text-slate-700 shadow-sm"
                  >
                    💳 Test Master
                  </button>
                </div>
              </div>
            </div>


            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay $9.99 USD & Activate 30 Days</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted Payment Gateway • Instant Activation</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}