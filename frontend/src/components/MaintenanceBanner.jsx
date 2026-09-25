import React, { useState } from 'react';
import { AlertTriangle, X, ShieldCheck, Clock } from 'lucide-react';

export default function MaintenanceBanner({ bannerText, endTime }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !bannerText) return null;

  return (
    <aside aria-label="System Notice" className="bg-gradient-to-r from-amber-600 via-amber-700 to-rose-700 text-white px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between z-50 sticky top-0 border-b border-amber-400/30">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 w-full">
        <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0 animate-bounce" />
        <span className="flex-1 leading-snug">{bannerText}</span>
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-400/30 font-mono text-amber-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>Student Accounts Protected</span>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-black/20 rounded-md text-amber-100 hover:text-white transition-colors ml-2"
        title="Dismiss Alert"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
}
