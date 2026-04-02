
import React, { useState } from 'react';
import { DB } from '../services/db';
import { User } from '../types';

export const DashboardView: React.FC<{ user: User, onStartSOP: () => void, onViewAll: () => void }> = ({ user, onStartSOP, onViewAll }) => {
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<{ title: string, businessVertical: string, pdfUrl: string, docxUrl: string } | null>(null);

  const handleGenerate = async () => {
    if (!question.trim()) return;
    setIsGenerating(true);
    try {
      const result = await DB.docs.generateDocument(question);
      setGeneratedDoc(result);
    } catch (error) {
      console.error('Failed to generate document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-auto mx-auto space-y-6 sm:space-y-8 lg:space-y-10 font-sans">
      <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col xl:flex-row sm:gap-4 gap-1  justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="relative z-10 mb-8 md:mb-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-2 sm:mb-3 lg:mb-4 tracking-tight">AI SOP Command Center</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-500 max-w-xl leading-relaxed font-medium">Your <strong>standard operating procedure software</strong> is ready. Start a new automated SOP documentation pack below.</p>
        </div>
        <button
          onClick={onStartSOP}
          className="relative z-10 px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-4 bg-indigo-600 text-white rounded-2xl sm:rounded-[1.5rem] lg:rounded-[2rem] font-black text-sm sm:text-base xl:text-xl hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.25)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center group w-full md:w-auto"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Build New AI SOP Pack
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3  gap-6 sm:gap-8 lg:gap-10">
        <div className="bg-white p-6  rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
            <h2 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px]">Active SOP Packs</h2>
            <span className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">01</span>
          </div>
          <div className="space-y-4 flex-1">
            <div
              onClick={onViewAll}
              className="p-5  rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:border-indigo-300 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between gap-1 items-start mb-4 sm:mb-6">
                <div>
                  <span className="text-lg font-black text-slate-900 block mb-2 tracking-tight">Acme Operations Pack</span>
                  <span className="text-[10px] px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-black uppercase tracking-widest">Business Tier</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full mb-4 overflow-hidden">
                <div className="w-[35%] h-full bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-1000"></div>
              </div>
              <p className="text-xs font-bold text-slate-400">Step 2 of 4: Logic Mapping (35%)</p>
            </div>
          </div>
          <button onClick={onViewAll} className="mt-6 sm:mt-8 lg:mt-10 text-indigo-600 text-xs font-black uppercase tracking-[0.3em] hover:tracking-[0.35em] transition-all text-center">Manage SOP Inventory</button>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] mb-6 sm:mb-8 lg:mb-10">Process Documentation Feed</h3>
          <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            {[
              { icon: '📄', title: 'AI SOP Template Created', desc: 'Expense Reimbursement v1', time: '2 hours ago' },
              { icon: '⚙️', title: 'Documentation Sync', desc: 'Tone changed to "Professional"', time: 'Yesterday' },
              { icon: '🏢', title: 'Enterprise Profile Built', desc: 'Acme Digital Solutions', time: '2 days ago' },
              { icon: '📩', title: 'System Security Audit', desc: 'Verified identity node', time: '3 days ago' },
            ].map((act, i) => (
              <div key={i} className="flex items-start space-x-3 sm:space-x-4 lg:space-x-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm border border-slate-100 shrink-0">{act.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{act.title}</p>
                  <p className="text-xs text-slate-500 mb-1.5 truncate">{act.desc}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tip / Recommendation */}
        <div className="bg-slate-900 p-6  rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col">
          <div className="relative z-10 w-full">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 lg:mb-8 backdrop-blur-md border border-white/10">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-black text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 tracking-tight uppercase">AI Compliance Insight</h3>

            {!generatedDoc ? (
              <>
                <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed font-medium">Standardize your <strong>business processes</strong>. Generate comprehensive SOPs instantly.</p>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. HR Management SOP..."
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm font-medium"
                  />
                  <button
                    onClick={() => (user.isPaid || user.isPro) ? handleGenerate() : window.location.href = '/billing'}
                    disabled={isGenerating || ((user.isPaid || user.isPro) && !question.trim())}
                    className="w-full py-3.5 sm:py-4 lg:py-5 bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        {!(user.isPaid || user.isPro) && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                        {!(user.isPaid || user.isPro) ? 'Upgrade to Generate' : 'Generate Documents'}
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 animate-fade-in">
                <h4 className="font-black text-lg mb-2 text-white">{generatedDoc.title}</h4>
                <p className="text-xs text-slate-400 mb-6 uppercase tracking-wider">{generatedDoc.businessVertical}</p>
                <div className="space-y-3">
                  <a href={generatedDoc.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    Download PDF
                  </a>
                  <a href={generatedDoc.docxUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-all">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download DOCX
                  </a>
                  <button onClick={() => setGeneratedDoc(null)} className="w-full mt-2 text-xs text-slate-500 hover:text-white transition-colors">Generate Another</button>
                </div>
              </div>
            )}
          </div>
          {/* Decor */}
          <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -left-16 -top-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
