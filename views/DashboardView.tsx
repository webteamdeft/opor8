
import React, { useState, useEffect } from 'react';
import { DB } from '../services/db';
import { User, SOPPack, SOPDocument } from '../types';

export const DashboardView: React.FC<{ user: User, onStartSOP: () => void, onViewAll: () => void }> = ({ user, onStartSOP, onViewAll }) => {
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<{ title: string, businessVertical: string, pdfUrl: string, docxUrl: string } | null>(null);

  const [packs, setPacks] = useState<SOPPack[]>([]);
  const [recentDocs, setRecentDocs] = useState<SOPDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userPacks, allDocs] = await Promise.all([
          DB.packs.getAll(user.id),
          DB.docs.getUserDocuments()
        ]);

        // Sort by date descending
        const sortedPacks = [...userPacks].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPacks(sortedPacks);
        setRecentDocs(allDocs.slice(0, 5)); // Last 5 docs
      } catch (error) {
        console.warn('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

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
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col xl:flex-row sm:gap-4 gap-1 justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="relative z-10 mb-8 md:mb-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-2 sm:mb-3 lg:mb-4 tracking-tight">AI SOP Command Center</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
            Welcome back, <strong>{user.fullName || user.email}</strong>. Your automated documentation dashboard is ready.
          </p>
        </div>
        <button
          onClick={onStartSOP}
          className="relative z-10 px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-4 bg-indigo-600 text-white rounded-2xl sm:rounded-[1.5rem] lg:rounded-[2rem] font-black text-sm sm:text-base xl:text-xl hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.25)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center group w-full md:w-auto"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Build New AI SOP Pack
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {/* Active Packs Column */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
            <h2 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px]">Active SOP Packs</h2>
            <span className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">
              {loading ? "..." : String(packs.length).padStart(2, '0')}
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => <div key={i} className="h-32 bg-slate-50 rounded-[2rem]"></div>)}
              </div>
            ) : packs.length > 0 ? (
              packs.slice(0, 2).map((pack) => (
                <div
                  key={pack.id}
                  onClick={onViewAll}
                  className="p-5 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:border-indigo-300 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between gap-1 items-start mb-4 sm:mb-6">
                    <div>
                      <span className="text-lg font-black text-slate-900 block mb-2 tracking-tight truncate max-w-[180px]">{pack.name}</span>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${pack.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {pack.status}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full mb-4 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.3)] transition-all duration-1000"
                      style={{ width: `${pack.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs font-bold text-slate-400">Progress: {pack.progress || 0}%</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-40">
                <p className="text-sm font-bold">No active packs found.</p>
              </div>
            )}
          </div>

          <button onClick={onViewAll} className="mt-6 sm:mt-8 lg:mt-10 text-indigo-600 text-xs font-black uppercase tracking-[0.3em] hover:tracking-[0.35em] transition-all text-center">
            Manage SOP Inventory
          </button>
        </div>

        {/* Activity Feed Column */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] mb-6 sm:mb-8 lg:mb-10">Process Documentation Feed</h3>
          <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            {loading ? (
              <div className="animate-pulse space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-50 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-50 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentDocs.length > 0 ? (
              recentDocs.map((doc, i) => (
                <div key={doc.id} className="flex items-start space-x-3 sm:space-x-4 lg:space-x-5 group cursor-pointer" onClick={() => window.location.href = '/library'}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors shrink-0">
                    {doc.title.toLowerCase().includes('hr') ? '👥' : doc.title.toLowerCase().includes('finance') ? '💰' : '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{doc.title}</p>
                    <p className="text-xs text-slate-500 mb-1.5 truncate">{doc.department || 'General Process'}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Updated {doc.lastUpdated}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-40">
                <p className="text-sm font-bold">No recent activity.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Column */}
        {/* <div className="bg-slate-900 p-6 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col">
          <div className="relative z-10 w-full">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 lg:mb-8 backdrop-blur-md border border-white/10">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-black text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 tracking-tight uppercase">Quick Document Synth</h3>

            {!generatedDoc ? (
              <div className="space-y-4">
                <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed font-medium">Need a specific SOP fast? Describe the process and our AI will generate a draft for you.</p>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. Employee Onboarding Guide..."
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-slate-800 border border-slate-700 rounded-xl sm:rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm font-medium"
                  />
                  <button
                    onClick={() => (user.isPaid || user.isPro) ? handleGenerate() : window.location.href = '/billing'}
                    disabled={isGenerating || ((user.isPaid || user.isPro) && !question.trim())}
                    className="w-full py-3.5 sm:py-4 lg:py-5 bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating...
                      </div>
                    ) : (
                      <>
                        {!(user.isPaid || user.isPro) && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                        {!(user.isPaid || user.isPro) ? 'Upgrade to Unlock' : 'Synthesize Now'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 animate-fadeIn">
                <h4 className="font-black text-lg mb-1 text-white truncate">{generatedDoc.title}</h4>
                <p className="text-[10px] text-indigo-400 mb-6 uppercase font-black tracking-widest">{generatedDoc.businessVertical}</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href={generatedDoc.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase transition-all">
                    PDF
                  </a>
                  <a href={generatedDoc.docxUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase transition-all">
                    Word
                  </a>
                </div>
                <button onClick={() => setGeneratedDoc(null)} className="w-full mt-4 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Generate Another</button>
              </div>
            )}
          </div>
          <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -left-16 -top-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]"></div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardView;
