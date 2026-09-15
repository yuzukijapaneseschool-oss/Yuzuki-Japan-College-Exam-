import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappNumber = '94773539800';
  const defaultMessage = encodeURIComponent('Hello Yuzuki Japan College, I would like to inquire about Japanese language classes & visa guidance in Kandy.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="WhatsApp Quick Support" className="fixed bottom-6 right-6 z-50 flex items-center group">
      <span className="mr-3 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap hidden sm:inline-block">
        Chat with YUZUKI College (Kandy) 💬
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-110 active:scale-95 animate-bounce"
        title="WhatsApp Hotline: 0773539800"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
}