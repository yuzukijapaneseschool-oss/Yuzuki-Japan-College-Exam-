import React from 'react';

export default function JapaneseText({ text, className = '' }) {
  if (!text) return null;

  // If text contains HTML tags like <ruby> or <rt> or <br>, render as HTML safely
  if (typeof text === 'string' && (text.includes('<ruby') || text.includes('<rt') || text.includes('<span') || text.includes('<br'))) {
    return (
      <span
        className={`japanese-ruby-container ${className}`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  return <span className={className}>{text}</span>;
}
