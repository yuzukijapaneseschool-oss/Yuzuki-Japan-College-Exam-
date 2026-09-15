import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';
import { 
  CreditCard, 
  DollarSign, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Receipt
} from 'lucide-react';

export default function PaymentManager() {
  const [data, setData] = useState({ metrics: {}, payments: [] });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentAPI.getAdminAll();
      setData(res.data || { metrics: {}, payments: [] });
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = (data.payments || []).filter(p => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.student_name?.toLowerCase().includes(term) ||
      p.student_id?.toLowerCase().includes(term) ||
      p.invoice_num?.toLowerCase().includes(term) ||
      p.payment_reference?.toLowerCase().includes(term)
    );
  });

  const metrics = data.metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-japanese flex items-center space-x-2">
          <CreditCard className="w-6 h-6 text-rose-600" />
          <span>Payment & Revenue Gateway Dashboard</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Monitor online student payments ($9.99 passes), invoice receipts, gateway transactions, and total revenue.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-3xl p-6 shadow-lg shadow-emerald-600/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Total Revenue (USD)</div>
            <div className="text-3xl font-extrabold font-mono mt-1">
              ${metrics.totalRevenueUSD || '0.00'}
            </div>
            <div className="text-xs text-emerald-200 mt-1">
              ≈ Rs. {(metrics.estimatedLKR || 0).toLocaleString()} LKR
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-3xl p-6 shadow-lg shadow-indigo-600/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-100">Active Subscribers</div>
            <div className="text-3xl font-extrabold font-mono mt-1">
              {metrics.activeSubscribers || 0}
            </div>
            <div className="text-xs text-indigo-200 mt-1">Paid 30-Day Passes</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-600 to-rose-800 text-white rounded-3xl p-6 shadow-lg shadow-rose-600/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-100">Completed Transactions</div>
            <div className="text-3xl font-extrabold font-mono mt-1">
              {metrics.totalTransactions || 0}
            </div>
            <div className="text-xs text-rose-200 mt-1">100% Success Rate</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Receipt className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-lg shadow-slate-900/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">Standard Plan Price</div>
            <div className="text-3xl font-extrabold font-mono mt-1">$9.99</div>
            <div className="text-xs text-amber-300 mt-1">Per Student / 30 Days</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-amber-400" />
          </div>
        </div>

      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Student Name, Student ID, or Invoice Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500/20 outline-none"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading payment records...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p>No transaction records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Enrolled Course</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {p.invoice_num}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">
                      {p.student_id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{p.student_name}</div>
                      <div className="text-[11px] text-slate-400">{p.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {p.course_name || 'General Track'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                      {p.payment_method}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      ${p.amount} {p.currency}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}