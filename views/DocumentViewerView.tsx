
import React, { useState } from 'react';
import { SOPDocument, User } from '../types';

interface DocumentViewerViewProps {
  doc: SOPDocument;
  user?: User;
  onBack: () => void;
  logoUrl?: string;
}

const DocumentViewerView: React.FC<DocumentViewerViewProps> = ({ doc, user, onBack, logoUrl }) => {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="h-14 sm:h-16 bg-white border-b px-4 sm:px-6 md:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button onClick={onBack} className="p-1 sm:p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold truncate">{doc.title}</h2>
            <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase truncate">{doc.department} • v{doc.version}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(user?.isPaid || user?.isPro) ? (
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs sm:text-sm">Download</button>
          ) : (
            <button
              onClick={() => alert("Word export is a Professional feature.")}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 text-slate-400 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Unlock
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-slate-200/50 p-4 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar">
        <div
          className="max-w-4xl mx-auto bg-white shadow-2xl p-6 sm:p-12 md:p-16 lg:p-24 min-h-[auto] md:min-h-[1400px] relative transition-transform duration-300 origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {logoUrl && (
            <div className="absolute top-6 right-6 sm:top-12 sm:right-12 lg:top-24 lg:right-24 h-12 w-24 sm:h-16 sm:w-32 lg:h-20 lg:w-40 flex justify-end">
              <img src={logoUrl} alt="Logo" className="max-h-full opacity-80" />
            </div>
          )}

          <div className="mb-10 sm:mb-20 border-b-4 sm:border-b-8 border-slate-100 pb-8 sm:pb-12 pr-0 md:pr-48">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tighter uppercase leading-tight sm:leading-none">{doc.title}</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>Effective: {doc.lastUpdated}</span>
              <span>Ref: {doc.id}</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 sm:space-y-8 text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
            {doc.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerView;
