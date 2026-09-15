import React, { useState, useEffect } from 'react';
import { inquiryAPI } from '../../services/api';
import { 
  Users, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await inquiryAPI.getAll();
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      console.error('Error loading inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await inquiryAPI.updateStatus(id, newStatus);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      alert('Failed to update inquiry status.');
    }
  };

  const filtered = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone.includes(search) ||
      (inq.email && inq.email.toLowerCase().includes(search.toLowerCase())) ||
      inq.course_interested.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-japanese">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-rose-500" />
            <h1 className="text-xl font-bold">Online Admission Inquiries</h1>
          </div>
          <p className="text-xs text-slate-400">
            Manage student registrations received through the official website and admissions form.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start sm:self-center border border-slate-700"
        >
          <RefreshCw className={'w-3.5 h-3.5 ' + (loading ? 'animate-spin' : '')} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, phone, course, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-500 shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 shadow-sm"
          >
            <option value="all">All Inquiries ({inquiries.length})</option>
            <option value="new">New Inquiries</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading admission inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No admission inquiries found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase font-mono tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Course Interested</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(inq => {
                  const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('0') ? '94' + cleanPhone.slice(1) : cleanPhone;
                  const waMsg = encodeURIComponent('Hello ' + inq.name + ', Greetings from YUZUKI Japan College (Kandy). Thank you for inquiring about our ' + inq.course_interested + ' course!');

                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{inq.name}</div>
                        {inq.message && (
                          <div className="text-[11px] text-slate-500 max-w-xs truncate" title={inq.message}>
                            💬 {inq.message}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {new Date(inq.created_at).toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 space-y-1">
                        <div className="font-mono font-semibold text-slate-800">{inq.phone}</div>
                        {inq.email && <div className="text-[11px] text-slate-500 font-mono">{inq.email}</div>}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold font-mono text-[11px]">
                          {inq.course_interested}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {inq.city || 'Kandy'}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={'text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ' + (
                            inq.status === 'new' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            inq.status === 'contacted' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                            inq.status === 'enrolled' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          )}
                        >
                          <option value="new">🟡 New</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="enrolled">🟢 Enrolled</option>
                          <option value="closed">⚪ Closed</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <a
                          href={'tel:' + inq.phone}
                          className="inline-flex items-center space-x-1 p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Call Phone"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={'https://wa.me/' + waNumber + '?text=' + waMsg}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}