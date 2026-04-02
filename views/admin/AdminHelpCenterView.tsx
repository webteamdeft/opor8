
import React, { useState, useEffect } from 'react';
import { DB } from '../../services/db';
import { HelpArticle } from '../../types';

const AdminHelpCenterView: React.FC = () => {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [editing, setEditing] = useState<HelpArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await DB.articles.getAll();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await DB.articles.upsert({
        ...editing,
        lastUpdated: new Date().toLocaleDateString()
      });
      setEditing(null);
      await loadArticles();
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleCreate = () => {
    setEditing({
      id: crypto.randomUUID(),
      title: 'New Knowledge Module',
      category: 'General',
      content: 'Enter the procedural content using standard markdown formatting here...',
      lastUpdated: new Date().toLocaleDateString()
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently decommission this knowledge node? This cannot be undone.')) {
      DB.articles.delete(id);
      loadArticles();
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 font-sans animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">Help Center CMS</h1>
          <p className="text-lg text-slate-500 font-medium leading-none">Global repository management for user documentation.</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95 flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Synthesize New Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(a => (
          <div key={a.id} className="p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col justify-between h-[340px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">{a.category}</span>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{a.id}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{a.title}</h3>
              <p className="text-sm text-slate-400 font-medium mt-6 line-clamp-3 leading-relaxed">{a.content}</p>
            </div>
            <div className="flex gap-3 pt-8 border-t border-slate-50">
              <button
                onClick={() => setEditing(a)}
                className="flex-1 py-4 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                Configure Node
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="py-4 px-5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="col-span-full py-48 bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[5rem] flex flex-col items-center justify-center text-center">
            <div className="text-8xl mb-10 grayscale opacity-10">📚</div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">Central Repository Empty</h4>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No active knowledge nodes found in the cluster.</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-xl animate-fadeIn">
          <form onSubmit={handleSave} className="bg-white max-w-5xl w-full p-16 rounded-[4.5rem] shadow-2xl relative flex flex-col max-h-[95vh] border border-white/20">
            <button onClick={() => setEditing(null)} type="button" className="absolute top-12 right-12 p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="mb-12">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">Configure Knowledge Node</h2>
              <p className="text-slate-500 font-medium text-lg leading-none">Module state: <span className="text-indigo-600 font-black">ACTIVE DEPLOYMENT</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.25em] ml-4">Node Designation (Title)</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-black text-lg outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                  placeholder="e.g. Platform Authentication Guide"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.25em] ml-4">Core Classification (Category)</label>
                <input
                  type="text"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-black text-lg outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                  placeholder="e.g. Security"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 space-y-3 mb-12">
              <div className="flex justify-between items-end ml-4 mr-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.25em]">Synthesized Content (Markdown)</label>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Compiler Ready</span>
              </div>
              <textarea
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                className="w-full flex-1 p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] outline-none focus:border-indigo-600 focus:bg-white font-medium leading-relaxed custom-scrollbar text-lg shadow-inner"
                placeholder="# Purpose\nThis module details..."
              ></textarea>
            </div>

            <div className="flex gap-6">
              <button type="submit" className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 group">
                Commit To Knowledge Base
                <span className="ml-3 group-hover:translate-x-2 transition-transform inline-block">→</span>
              </button>
              <button onClick={() => setEditing(null)} type="button" className="px-12 py-6 bg-white border-2 border-slate-100 text-slate-400 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all">
                Discard
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminHelpCenterView;
