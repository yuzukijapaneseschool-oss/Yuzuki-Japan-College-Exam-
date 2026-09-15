import React, { useState } from 'react';
import { inquiryAPI } from '../../services/api';
import pagodaBg from '../../assets/japan_pagoda_bg.jpg';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Facebook, 
  CheckCircle2, 
  Send
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course_interested: 'JFT-Basic A2 (SSW)',
    city: 'Kandy',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await inquiryAPI.submit(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        course_interested: 'JFT-Basic A2 (SSW)',
        city: 'Kandy',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-japanese">
      {/* Header Banner */}
      <section 
        className="relative bg-slate-950 text-white py-20 px-4 bg-cover bg-center text-center"
        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.95)), url(' + pagodaBg + ')' }}
      >
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-rose-400 font-bold text-xs uppercase tracking-widest font-mono">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            Contact YUZUKI Japan College
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Visit our Kandy campus or reach out via phone, WhatsApp, or email for admissions and visa consultations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Contact Details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Kandy Campus Office
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our admissions counselors and Japanese language Senseis are available Monday to Saturday to guide you.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Campus Address:</strong>
                  <span className="text-slate-600">YUZUKI Japan College, Kandy, Central Province, Sri Lanka.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <Phone className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Hotline (Voice Calls):</strong>
                  <a href="tel:0711109800" className="text-slate-700 hover:text-rose-600 font-mono font-bold text-base">
                    0711109800
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm bg-emerald-50/40">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">WhatsApp Admissions Helpline:</strong>
                  <a href="https://wa.me/94773539800" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 font-mono font-bold text-base">
                    0773539800 (Click to Chat 💬)
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <Mail className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Official Email:</strong>
                  <a href="mailto:yuzukijapaneseschool@gmail.com" className="text-slate-700 hover:text-rose-600 font-mono">
                    yuzukijapaneseschool@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-blue-200 shadow-sm bg-blue-50/40">
                <Facebook className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Official Facebook Page:</strong>
                  <a 
                    href="https://www.facebook.com/p/Yuzuki-Japan-College-61585333492032/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-700 hover:text-blue-900 underline text-xs break-all"
                  >
                    facebook.com/p/Yuzuki-Japan-College
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border-2 border-rose-200 p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">Send an Admission Inquiry</h3>
                <p className="text-xs text-slate-500">
                  Fill out your details below and our Kandy campus counselor will contact you.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 text-emerald-900">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-lg">Inquiry Successfully Submitted!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you! We have received your inquiry and will reach out to your phone or WhatsApp shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Dilshan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0773539800"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">City / District</label>
                      <input
                        type="text"
                        placeholder="Kandy"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Course / Pathway Interested *</label>
                    <select
                      value={formData.course_interested}
                      onChange={(e) => setFormData({ ...formData, course_interested: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 text-sm"
                    >
                      <option value="JFT-Basic A2 (SSW)">JFT-Basic A2 (SSW Specialized)</option>
                      <option value="JLPT N5">JLPT N5 (Beginner)</option>
                      <option value="JLPT N4">JLPT N4 (Intermediate)</option>
                      <option value="JLPT N3">JLPT N3 (Advanced)</option>
                      <option value="NAT-TEST (N5/N4/N3)">NAT-TEST</option>
                      <option value="SSW Skills Training">SSW Skills Training (Caregiver/Food Service)</option>
                      <option value="Student Visa Guidance">Student Visa Guidance</option>
                      <option value="Training Visa (TITP)">Training Visa (TITP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Questions or Comments</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your educational background or any questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-rose-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Admission Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}