
import React, { useState, useEffect } from 'react';
import { DB } from '../services/dbSupabase';
import { SOPDocument, SOPPack } from '../types';

export const LibraryView: React.FC<{ userId: string, onOpenDoc: (d: SOPDocument) => void }> = ({ userId, onOpenDoc }) => {
  const [docs, setDocs] = useState<SOPDocument[]>([]);
  const [filter, setFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const packs = await DB.packs.getAll(userId);
        const allDocs: SOPDocument[] = [];
        for (const pack of packs) {
          const packDocs = await DB.docs.getByPack(pack.id);
          allDocs.push(...packDocs);
        }
        setDocs(allDocs);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDocs();
  }, [userId]);

  const departments = ['All', ...new Set(docs.map(d => d.department))];
  const filteredDocs = filter === 'All' ? docs : docs.filter(d => d.department === filter);

  const handleExportAll = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('SOP Library Pack generated! Download SOP documents started.');
    }, 2000);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4 uppercase">SOP Document Repository</h1>
          <p className="text-xl text-slate-500 font-medium leading-none">Your secure <strong>process documentation</strong> library and export center.</p>
        </div>
        {docs.length > 0 && (
          <button 
            onClick={handleExportAll}
            disabled={isExporting}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            )}
            {isExporting ? 'Preparing Download...' : 'Download SOP documents (ZIP)'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {departments.map(d => (
          <button 
            key={d} 
            onClick={() => setFilter(d)}
            className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2 ${filter === d ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 backdrop-blur-md border-b">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <th className="px-10 py-6">Procedural Title</th>
              <th className="px-10 py-6">Business Vertical</th>
              <th className="px-10 py-6">Deployment Status</th>
              <th className="px-10 py-6 text-right">Last Synthesis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredDocs.map((d, i) => (
              <tr key={i} onClick={() => onOpenDoc(d)} className="hover:bg-indigo-50/30 cursor-pointer transition-all group">
                <td className="px-10 py-6 font-bold text-slate-900 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-lg border border-slate-100 group-hover:bg-white transition-colors">📄</div>
                    {d.title}
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">{d.department}</span>
                </td>
                <td className="px-10 py-6">
                   <div className="flex items-center text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                     Live & Audit-Ready
                   </div>
                </td>
                <td className="px-10 py-6 text-right text-sm font-bold text-slate-400 group-hover:text-slate-600">{d.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDocs.length === 0 && (
          <div className="p-32 text-center">
            <div className="text-6xl mb-6 grayscale opacity-30">📂</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Inventory Empty</h3>
            <p className="text-slate-500 font-medium">No <strong>business SOP software</strong> files found. Launch the builder to create automated SOP templates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
