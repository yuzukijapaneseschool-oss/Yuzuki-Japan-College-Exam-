import React from 'react';

export default function JapaneseText({ text, className = '' }) {
  if (!text) return null;

  if (typeof text !== 'string') return <span className={className}>{text}</span>;

  // Convert markdown-style shorthand to HTML if present
  let html = text
    // Replace ==highlight== with <mark>highlight</mark>
    .replace(/==(.*?)==/g, '<mark>$1</mark>')
    // Replace **bold** with <b>bold</b>
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    // Replace __underline__ with <u>underline</u>
    .replace(/__(.*?)__/g, '<u>$1</u>')
    // Convert newlines to <br/>
    .replace(/\n/g, '<br/>');

  // Check if text has any HTML tags
  const hasHtml = /<[a-z][\s\S]*>/i.test(html) || html.includes('<br/>');

  if (hasHtml) {
    // Inject enhanced styling for underline and mark
    const styledHtml = html
      .replace(/<u>/gi, '<u class="underline decoration-slate-900 decoration-2 underline-offset-4 font-semibold">')
      .replace(/<mark>/gi, '<mark class="bg-amber-200 text-slate-950 font-bold px-1.5 py-0.5 rounded shadow-xs border border-amber-300/80">');

    return (
      <span
        className={`japanese-ruby-container leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: styledHtml }}
      />
    );
  }

  return <span className={`leading-relaxed ${className}`}>{text}</span>;
}
