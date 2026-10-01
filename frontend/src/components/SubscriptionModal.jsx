import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentAPI, examAPI } from '../services/api';
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
  CheckCircle2,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function SubscriptionModal({ isOpen, onClose, onSubscribed, defaultCategory = 'JFT-BASIC' }) {
  const { user, refreshUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await examAPI.getPortalCategories();
        const paidCats = (res.data.categories || []).filter(c => !c.is_free);
        setCategories(paidCats);
        if (defaultCategory && paidCats.some(c => c.category_code === defaultCategory)) {
          setSelectedCategory(defaultCategory);
        } else if (paidCats.length > 0 && !selectedCategory) {
          setSelectedCategory(paidCats[0].category_code);
        }
      } catch (err) {
        console.error('Failed to load categories for checkout:', err);
      }
    }
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, defaultCategory]);

  if (!isOpen) return null;

  const currentCat = categories.find(c => c.category_code === selectedCategory) || {
    category_code: selectedCategory,
    title: selectedCategory,
    price_usd: 9.99
  };

  const handlePayHereCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // 1. Initialize PayHere Checkout on Backend
      const checkoutRes = await paymentAPI.checkoutPracticePass({
        category_code: selectedCategory,
        currency: 'USD'
      });

      const { payhere_params, checkout_url, order_id } = checkoutRes.data;

      // 2. Submit form to official PayHere checkout gateway
      if (checkout_url && payhere_params) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = checkout_url;
        form.target = '_self';

        for (const [key, value] of Object.entries(payhere_params)) {
          if (value !== undefined && value !== null) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          }
        }

        document.body.appendChild(form);
        form.submit();
        return;
      }

      setError('Payment gateway configuration is missing. Please contact college support.');

    } catch (err) {
      console.error('PayHere Checkout error:', err);
      setError(err.response?.data?.error || 'Payment failed. Please try again or contact college support.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-japanese">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 relative overflow-hidden text-slate-900 my-8 animate-fade-in">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full border border-rose-500 bg-white p-0.5 overflow-hidden shadow shrink-0">
              <img src={logoImg} alt="Yuzuki Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PayHere Secure Gateway • USD 9.99</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-japanese">
                {successData ? 'Payment Confirmed (領収書)' : 'Unlock 30-Day Practice Pass'}
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

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl text-xs">
            {error}
          </div>
        )}

        {successData ? (
          /* Receipt / Confirmation Screen */
          <div className="space-y-6 animate-fade-in">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 font-japanese">
                30-Day Practice Pass Activated! 🎉
              </h3>
              <p className="text-xs text-emerald-800">
                Your payment was verified. You now have full 30-day access to <strong>{successData.category_title || successData.category_code}</strong>.
              </p>
            </div>

            {/* Official Invoice Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Order ID:</span>
                <strong className="text-slate-900">{successData.order_id}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Category Pass:</span>
                <strong className="text-rose-700">{successData.category_code}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Student ID / Name:</span>
                <strong className="text-slate-900">{user?.student_id} ({user?.name})</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Amount Paid:</span>
                <strong className="text-emerald-700 text-sm">$9.99 USD (~LKR 3,050)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pass Valid Until:</span>
                <strong className="text-slate-900">
                  {successData.pass?.valid_until ? new Date(successData.pass.valid_until).toLocaleDateString() : '30 Days from today'}
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
          <form onSubmit={handlePayHereCheckout} className="space-y-5">
            
            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Exam Practice Category (විෂය කාණ්ඩය තෝරන්න):
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:border-rose-500 focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.category_code} value={c.category_code}>
                    {c.title} ({c.active_exam_count || 0} Exams) — $9.99
                  </option>
                ))}
              </select>
            </div>

            {/* Price Summary Banner */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-2xl p-5 shadow-inner flex items-center justify-between">
              <div>
                <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider">
                  30-Day Practice Pass
                </span>
                <div className="text-3xl font-extrabold font-mono mt-0.5">
                  $9.99 <span className="text-xs font-normal text-slate-300 font-sans">USD</span>
                </div>
                <div className="text-[11px] text-amber-300 font-medium mt-0.5">
                  ≈ LKR 3,050.00 (Sri Lankan Rupees)
                </div>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/40 inline-block mb-1">
                  30 Days Unlimited
                </span>
                <div className="text-[10px] text-slate-400">Prometric CBT Simulator</div>
              </div>
            </div>

            {/* PayHere Payment Options Accepted */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <CreditCard className="w-4 h-4 text-rose-600" />
                  <span>Accepted Payment Methods (PayHere Lanka)</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Secured by PayHere
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Visa / MasterCard / AMEX</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>FriMi / Genie / eZ Cash</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Commercial Bank / Sampath</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>HNB / BOC / Peoples Bank</span>
                </div>
              </div>
            </div>

            {user?.role === 'student' && user?.status !== 'approved' && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Account Pending College Administration Approval</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Your account must be verified by YUZUKI Japan College administration before initiating payment. Once approved, you will be able to complete checkout and activate your practice pass.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || (user?.role === 'student' && user?.status !== 'approved')}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-700 hover:to-rose-900 text-white font-bold shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : user?.role === 'student' && user?.status !== 'approved' ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Awaiting College Administration Approval 🔒</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay USD 9.99 & Unlock {selectedCategory} (30 Days) 🚀</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant Pass Activation • Central Bank of Sri Lanka Approved Gateway</span>
            </div>

            <div className="text-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
              By proceeding, you agree to our{' '}
              <Link to="/terms-and-conditions" target="_blank" className="text-rose-600 hover:underline">
                Terms & Conditions
              </Link>
              ,{' '}
              <Link to="/privacy-policy" target="_blank" className="text-rose-600 hover:underline">
                Privacy Policy
              </Link>
              , and{' '}
              <Link to="/refund-policy" target="_blank" className="text-rose-600 hover:underline">
                Refund Policy
              </Link>
              .
            </div>

          </form>
        )}

      </div>
    </div>
  );
}