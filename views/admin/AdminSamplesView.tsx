
import React, { useState, useEffect } from 'react';
import { DB } from '../../services/dbSupabase';
import { SOPDocument } from '../../types';

export const AdminSamplesView: React.FC = () => {
  const [docs, setDocs] = useState<SOPDocument[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await DB.docs.getAll();
      setDocs(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSample = async (docId: string) => {
    try {
      const doc = docs.find(d => d.id === docId);
      if (!doc) return;

      const updated = { ...doc, isSample: !doc.isSample };
      await DB.docs.createBatch([updated]);
      await loadDocs();
    } catch (error) {
      console.error('Error toggling sample:', error);
    }
  };

  const departments = ['All', ...new Set(docs.map(d => d.department))];
  const filtered = filter === 'All' ? docs : docs.filter(d => d.department === filter);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 font-sans animate-fadeIn">
       <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sample Exposure</h1>
            <p className="text-slate-500 font-medium">Exposing {docs.filter(d => d.isSample).length} documents to non-paying users.</p>
          </div>
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto max-w-md">
             {departments.map(d => (
               <button 
                 key={d} 
                 onClick={() => setFilter(d)}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === d ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 {d}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filtered.map((doc) => (
             <div key={doc.id} className={`p-8 rounded-[3rem] border-2 transition-all ${doc.isSample ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-50' : 'border-slate-100 bg-white shadow-sm hover:border-slate-200'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">📄</div>
                   <button 
                    onClick={() => toggleSample(doc.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${doc.isSample ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                   >
                     {doc.isSample ? 'Remove' : 'Set Sample'}
                   </button>
                </div>
                <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-1">{doc.department}</p>
                <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight line-clamp-2">{doc.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Version {doc.version} • ID: {doc.id.split('_')[1]}</p>
             </div>
           ))}
           {docs.length === 0 && (
             <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No generated documents found to expose.</p>
             </div>
           )}
        </div>
    </div>
  );
};

export default AdminSamplesView;
