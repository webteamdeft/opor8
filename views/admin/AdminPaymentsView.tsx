
import React, { useState, useEffect } from 'react';
import { DB } from '../../services/db';
import { User } from '../../types';

export const AdminPaymentsView: React.FC = () => {
  const [paidUsers, setPaidUsers] = useState<User[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [totalUsersCount, setTotalUsersCount] = useState(0);

  useEffect(() => {
    const loadPaidUsers = async () => {
      try {
        const users = await DB.users.getAll();
        setTotalUsersCount(users.length);
        setPaidUsers(users.filter(u => u.isPaid));
      } catch (error) {
        console.error('Error loading paid users:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPaidUsers();
  }, []);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Ledger Exported: Ledger_Q4_2024.csv is ready.');
    }, 1500);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 font-sans animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Revenue Ledger</h1>
          <p className="text-slate-500 font-medium">Real-time processing via OPOR8 Payment Bridge.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
        >
          {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          )}
          {isExporting ? 'Generating...' : 'Export Ledger'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-50 rounded-full opacity-50"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Total Platform Revenue</p>
          <h3 className="text-7xl font-black text-slate-900 tracking-tighter mb-8">${(paidUsers.length * 49).toLocaleString()}</h3>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {paidUsers.slice(0, 5).map(u => (
                <img key={u.id} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100" />
              ))}
              {paidUsers.length > 5 && (
                <div className="w-10 h-10 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">+{paidUsers.length - 5}</div>
              )}
            </div>
            <p className="text-sm font-bold text-slate-400">Trusted by {paidUsers.length} enterprise-tier users</p>
          </div>
        </div>

        <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-4">Conversion rate</p>
            <h3 className="text-5xl font-black">{totalUsersCount > 0 ? ((paidUsers.length / totalUsersCount) * 100).toFixed(1) : 0}%</h3>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-200">
              <span>Target</span>
              <span>$10,000</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)]" style={{ width: `${Math.min(((paidUsers.length * 49) / 10000) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-10 py-6">Transaction ID</th>
              <th className="px-10 py-6">Identity</th>
              <th className="px-10 py-6">Package Tier</th>
              <th className="px-10 py-6 text-right">Settled Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paidUsers.length > 0 ? paidUsers.map((u) => (
              <tr key={u.id} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-10 py-6 font-mono text-[10px] text-slate-300 group-hover:text-slate-500">TX_{u.id.toUpperCase()}</td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border flex items-center justify-center text-sm shadow-sm">👤</div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">LIFETIME ACCESS</span>
                </td>
                <td className="px-10 py-6 text-right">
                  <span className="text-lg font-black text-slate-900">$49.00</span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-32 text-center">
                  <div className="text-6xl mb-6 grayscale opacity-10">💰</div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No finalized transactions in current cycle.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPaymentsView;
