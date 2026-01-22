import React from 'react';

/**
 * Helper function to wrap English text in a span with LTR direction
 * This ensures proper text direction when mixing Hebrew (RTL) and English (LTR) text
 */
export const wrapEnglishText = (text: string): React.ReactNode => {
  // Remove any existing bidirectional marks
  const cleanText = text.replace(/[\u200E\u200F]/g, '').trim();
  
  // Split text by English words (words that contain only English letters)
  // Match English words that start with capital letter and are at least 2 characters
  const englishWordRegex = /\b([A-Z][A-Za-z0-9]+)\b/g;
  const parts: Array<{ text: string; isEnglish: boolean }> = [];
  let lastIndex = 0;
  let match;
  
  while ((match = englishWordRegex.exec(cleanText)) !== null) {
    // Add text before the English word
    if (match.index > lastIndex) {
      parts.push({ text: cleanText.substring(lastIndex, match.index), isEnglish: false });
    }
    // Add the English word
    parts.push({ text: match[1], isEnglish: true });
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < cleanText.length) {
    parts.push({ text: cleanText.substring(lastIndex), isEnglish: false });
  }
  
  // If no English words found, return the text as is
  if (parts.length === 0) {
    return cleanText;
  }
  
  return parts.map((part, index) => {
    if (part.isEnglish) {
      // Wrap English word in span with LTR direction and isolate it
      return (
        <span 
          key={index} 
          dir="ltr" 
          style={{ 
            display: 'inline',
            unicodeBidi: 'isolate',
            direction: 'ltr'
          }}
        >
          {part.text}
        </span>
      );
    }
    return <React.Fragment key={index}>{part.text}</React.Fragment>;
  });
};
