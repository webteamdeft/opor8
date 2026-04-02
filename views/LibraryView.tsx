
import React, { useState, useEffect } from 'react';
import { DB } from '../services/db';
import { SOPDocument, SOPPack, User } from '../types';

export const LibraryView: React.FC<{ user: User, onOpenDoc: (d: SOPDocument) => void }> = ({ user, onOpenDoc }) => {
  const [docs, setDocs] = useState<SOPDocument[]>([]);
  const [filter, setFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const allDocs = await DB.docs.getUserDocuments();
        setDocs(allDocs);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDocs();
  }, [user.id]);

  const departments = ['All', ...new Set(docs.map(d => d.department))];
  const filteredDocs = filter === 'All' ? docs : docs.filter(d => d.department === filter);
  const displayDocs = (user.isPaid || user.isPro) ? filteredDocs : filteredDocs.slice(0, 3);

  const handleExportAll = async () => {
    if (!(user.isPaid || user.isPro)) {
      alert("Bulk export is a Professional feature. Please upgrade to unlock.");
      return;
    }
    setIsExporting(true);
    try {
      const { url } = await DB.docs.downloadAllDocumentsZip();
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SOP_Library.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Error downloading ZIP:', error);
      const errorMessage = error.message || 'Unknown error';
      if (errorMessage.toLowerCase().includes('already') || errorMessage.toLowerCase().includes('progress')) {
        alert('Bulk export is already being prepared in the background. Please wait a moment and try again.');
      } else {
        alert(`Failed to generate SOP Library Pack: ${errorMessage}`);
      }
    } finally {
      setIsExporting(false);
    }
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
            className={`px-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 ${!(user.isPaid || user.isPro) ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
          >
            {isExporting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            )}
            {isExporting ? 'Preparing Download...' : 'Download SOP documents (ZIP)'}
            {!(user.isPaid || user.isPro) && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded ml-2">PRO</span>}
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
              <th className="px-10 py-6">Last Synthesis</th>
              <th className="px-10 py-6 text-right">Downloads</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displayDocs.map((d, i) => (
              <tr key={i} className="hover:bg-indigo-50/30 transition-all group">
                <td
                  onClick={() => onOpenDoc(d)}
                  className="px-10 py-6 font-bold text-slate-900 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all cursor-pointer"
                >
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
                    {d.deploymentStatus || 'Live & Audit-Ready'}
                  </div>
                </td>
                <td className="px-10 py-6 text-sm font-bold text-slate-400">
                  {d.lastUpdated}
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {d.pdfUrl && d.pdfUrl !== 'undefined' ? (
                      <a
                        href={d.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors title='Download PDF'"
                      >
                        <span className="text-[10px] font-black uppercase">PDF</span>
                      </a>
                    ) : (
                      <div className="p-2 bg-slate-50 text-slate-300 rounded-lg cursor-not-allowed opacity-50" title="Not Available">
                        <span className="text-[10px] font-black uppercase">PDF</span>
                      </div>
                    )}
                    {d.docxUrl && d.docxUrl !== 'undefined' ? (
                      <a
                        href={d.docxUrl}
                        download
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors title='Download DOCX'"
                      >
                        <span className="text-[10px] font-black uppercase">DOCX</span>
                      </a>
                    ) : (
                      <div className="p-2 bg-slate-50 text-slate-300 rounded-lg cursor-not-allowed opacity-50" title="Not Available">
                        <span className="text-[10px] font-black uppercase">DOCX</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!(user.isPaid || user.isPro) && filteredDocs.length > 3 && (
          <div className="p-8 bg-indigo-50 border-t border-indigo-100 text-center">
            <p className="text-sm font-bold text-indigo-900">
              Displaying 3 of {filteredDocs.length} documents.
              <button onClick={() => window.location.href = '/billing'} className="ml-2 text-indigo-600 underline">Upgrade to Professional</button> to unlock your full library.
            </p>
          </div>
        )}
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
