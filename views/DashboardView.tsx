
import React from 'react';

export const DashboardView: React.FC<{ onStartSOP: () => void, onViewAll: () => void }> = ({ onStartSOP, onViewAll }) => {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 font-sans">
      {/* Welcome Widget - Optimized Heading */}
      <div className="bg-white p-12 rounded-[3rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="relative z-10 mb-8 md:mb-0">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">AI SOP Command Center</h1>
          <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">Your <strong>standard operating procedure software</strong> is ready. Start a new automated SOP documentation pack below.</p>
        </div>
        <button 
          onClick={onStartSOP}
          className="relative z-10 px-10 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.25)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center group"
        >
          <svg className="w-7 h-7 mr-3 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Build New AI SOP Pack
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Pack Status Card */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-10">
             <h2 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px]">Active SOP Packs</h2>
             <span className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">01</span>
           </div>
           <div className="space-y-6 flex-1">
             <div 
               onClick={onViewAll}
               className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:border-indigo-300 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md"
             >
               <div className="flex justify-between items-start mb-6">
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
           <button onClick={onViewAll} className="mt-10 text-indigo-600 text-xs font-black uppercase tracking-[0.3em] hover:tracking-[0.35em] transition-all text-center">Manage SOP Inventory</button>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
           <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] mb-10">Process Documentation Feed</h3>
           <div className="space-y-8">
             {[
               { icon: '📄', title: 'AI SOP Template Created', desc: 'Expense Reimbursement v1', time: '2 hours ago' },
               { icon: '⚙️', title: 'Documentation Sync', desc: 'Tone changed to "Professional"', time: 'Yesterday' },
               { icon: '🏢', title: 'Enterprise Profile Built', desc: 'Acme Digital Solutions', time: '2 days ago' },
               { icon: '📩', title: 'System Security Audit', desc: 'Verified identity node', time: '3 days ago' },
             ].map((act, i) => (
               <div key={i} className="flex items-start space-x-5">
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 shrink-0">{act.icon}</div>
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
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col">
           <div className="relative z-10">
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/10">
               <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <h3 className="font-black text-2xl mb-4 tracking-tight uppercase">AI Compliance Insight</h3>
             <p className="text-slate-400 text-sm mb-12 leading-relaxed font-medium">Standardize your <strong>HR policy documentation</strong>. Our <strong>AI document generation</strong> shows a 40% efficiency boost in <strong>employee onboarding SOPs</strong>.</p>
             <button onClick={onStartSOP} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all mt-auto active:scale-95">Automate HR Process</button>
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
