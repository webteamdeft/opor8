
import React, { useState } from 'react';

// Added packId to the props interface to resolve the type error in App.tsx
export const SamplesView: React.FC<{ packId: string, onUpgrade: () => void, isPro?: boolean, logoUrl?: string }> = ({ packId, onUpgrade, isPro, logoUrl }) => {
  const [activeDoc, setActiveDoc] = useState(0);
  const docs = [
    { title: 'Expense Reimbursement Procedure', dept: 'Finance', content: '# Expense Reimbursement Policy\n\n## 1. Objective\nThis SOP outlines the steps for employees to claim business-related expenses...' },
    { title: 'New Hire Onboarding Checklist', dept: 'HR', content: '# New Hire Onboarding SOP\n\n## Purpose\nTo ensure a consistent and welcoming experience for all new employees joining {Company Name}...' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Free Sample Pack</h2>
          <p className="text-sm text-slate-500">Previewing 2 of 44 documents generated for your business</p>
        </div>
        {!isPro && (
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Unlock All 44 Documents
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left List */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {docs.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDoc(i)}
              className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${activeDoc === i ? 'bg-white border-indigo-600 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-100'}`}
            >
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-1 block">{d.dept}</span>
              <p className="text-sm font-bold text-slate-900 line-clamp-2">{d.title}</p>
            </button>
          ))}
          <div className="mt-8 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
            <p className="text-xs font-bold text-indigo-700 mb-4 italic">"+ 42 more documents will be unlocked after payment"</p>
            <div className="space-y-2 opacity-50 select-none">
              <div className="h-4 bg-indigo-200 rounded w-full shimmer"></div>
              <div className="h-4 bg-indigo-200 rounded w-3/4 shimmer"></div>
              <div className="h-4 bg-indigo-200 rounded w-5/6 shimmer"></div>
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 bg-slate-200/50 p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-sm p-16 min-h-[1000px] relative">
            {logoUrl && (
              <div className="absolute top-16 right-16 h-12 w-24 flex items-center justify-end">
                <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain opacity-50" />
              </div>
            )}
            <div className="absolute top-8 right-8 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded">Free Sample</div>
            <div className="mb-12 border-b-4 border-slate-100 pb-8 pr-32">
              <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">{docs[activeDoc].title}</h1>
              <div className="flex items-center space-x-4 text-sm font-medium text-slate-400">
                <span>Effective Date: Oct 24, 2023</span>
                <span>Version: 1.0</span>
              </div>
            </div>
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-lg">
                {docs[activeDoc].content}
              </pre>
              <div className="mt-8 space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">2. Definitions</h2>
                <p className="text-slate-600"><strong>[Business Name]</strong> refers to the corporate entity responsible for the oversight of these procedures.</p>
                <h2 className="text-2xl font-bold text-slate-900">3. Responsibilities</h2>
                <p className="text-slate-600">The Finance Manager is responsible for verifying all incoming claims within 48 hours of submission through the <strong>[Selected Tool]</strong> portal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplesView;
