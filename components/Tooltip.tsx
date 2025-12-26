
import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  // FIX: Only render the tooltip wrapper if there is actual content to display
  if (!content || content.trim() === '') {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block w-full">
      <div 
        onMouseEnter={() => setIsVisible(true)} 
        onMouseLeave={() => setIsVisible(false)}
        className="w-full"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-[100] px-3 py-2 text-xs font-black text-white bg-slate-900 rounded-xl shadow-2xl left-full ml-4 top-1/2 transform -translate-y-1/2 w-max max-w-[200px] text-center animate-fadeIn">
          {content}
          <div className="absolute w-2.5 h-2.5 bg-slate-900 transform rotate-45 top-1/2 -left-1 -translate-y-1/2"></div>
        </div>
      )}
    </div>
  );
};

export const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <Tooltip content={text}>
    <svg className="w-4 h-4 text-slate-400 inline ml-1 hover:text-slate-600 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </Tooltip>
);
