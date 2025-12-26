
import React from 'react';
import { User } from '../types';

export const BillingView: React.FC<{ user: User, onUpgrade: () => void }> = ({ user, onUpgrade }) => {
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 font-sans">
      <div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">Billing</h1>
        <p className="text-lg text-slate-500 font-medium">Manage your subscription, invoices, and pack entitlements.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Active Plan</p>
            <h3 className="text-4xl font-black text-slate-900 mb-6 flex items-center gap-3">
              {user.isPaid ? 'Professional Pack' : 'Free Preview'}
              {user.isPaid && <span className="text-[10px] px-3 py-1 bg-indigo-600 text-white rounded-full uppercase tracking-widest font-black">Active</span>}
            </h3>
            <p className="text-slate-500 text-lg font-medium mb-12 max-w-md leading-relaxed">
              {user.isPaid 
                ? "You have lifetime access to the 44-document Acme Main Pack. Future compliance updates are included free for 12 months." 
                : "You are currently previewing 2 documents. Unlock the full professional library to enable Word/PDF exports and brand customization."}
            </p>
          </div>
          {!user.isPaid && (
             <button 
              onClick={onUpgrade}
              className="relative z-10 w-full md:w-max px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0"
             >
               Upgrade Pack ($49.00)
             </button>
          )}
          {user.isPaid && (
             <button className="relative z-10 w-full md:w-max px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all">Download All Invoices</button>
          )}
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10">Pack Entitlements</h3>
           <div className="space-y-6 flex-1">
             {[
               { label: 'Full SOP Library', unlocked: user.isPaid },
               { label: 'Word Exports', unlocked: user.isPaid },
               { label: 'PDF Exports', unlocked: user.isPaid },
               { label: 'Custom Branding', unlocked: user.isPaid },
               { label: 'AI Compliance Check', unlocked: user.isPaid },
               { label: '24/7 Priority Support', unlocked: user.isPaid },
             ].map((e, i) => (
               <div key={i} className={`flex items-center justify-between font-bold text-sm ${e.unlocked ? 'text-slate-900' : 'text-slate-300'}`}>
                 <span>{e.label}</span>
                 {e.unlocked ? (
                   <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 ) : (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 )}
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10">Transaction History</h3>
         {user.isPaid ? (
           <div className="space-y-4">
             <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl border border-slate-200 shadow-sm">💳</div>
                 <div>
                   <p className="text-lg font-black text-slate-900 tracking-tight">Professional Pack - Lifetime Access</p>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Oct 24, 2024 • Visa ending 4242</p>
                 </div>
               </div>
               <div className="flex items-center gap-6">
                 <span className="text-xl font-black text-slate-900">$49.00</span>
                 <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:border-indigo-600 transition-all shadow-sm">Receipt</button>
               </div>
             </div>
           </div>
         ) : (
           <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-6 grayscale opacity-20">💸</div>
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">No transaction history found</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default BillingView;
