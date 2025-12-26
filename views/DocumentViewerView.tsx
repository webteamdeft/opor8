
import React, { useState } from 'react';
import { SOPDocument } from '../types';

interface DocumentViewerViewProps {
  doc: SOPDocument;
  onBack: () => void;
  logoUrl?: string;
}

const DocumentViewerView: React.FC<DocumentViewerViewProps> = ({ doc, onBack, logoUrl }) => {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="h-16 bg-white border-b px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-lg font-bold">{doc.title}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{doc.department} • v{doc.version}</p>
          </div>
        </div>
        <div className="flex space-x-2">
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">Download (.docx)</button>
        </div>
      </div>

      <div className="flex-1 bg-slate-200/50 p-12 overflow-y-auto custom-scrollbar">
         <div 
           className="max-w-4xl mx-auto bg-white shadow-2xl p-24 min-h-[1400px] relative transition-transform duration-300 origin-top"
           style={{ transform: `scale(${zoom / 100})` }}
         >
           {logoUrl && (
             <div className="absolute top-24 right-24 h-20 w-40 flex justify-end">
               <img src={logoUrl} alt="Logo" className="max-h-full opacity-80" />
             </div>
           )}

           <div className="mb-20 border-b-8 border-slate-100 pb-12 pr-48">
             <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">{doc.title}</h1>
             <div className="flex items-center space-x-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
               <span>Effective: {doc.lastUpdated}</span>
               <span>Ref: {doc.id}</span>
             </div>
           </div>

           <div className="prose prose-slate max-w-none space-y-8 text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
             {doc.content}
           </div>
         </div>
      </div>
    </div>
  );
};

export default DocumentViewerView;
