
import React, { useEffect, useState } from 'react';
import { DB } from '../../services/db';
import { StepStatus, SOPPack } from '../../types';

interface KPICardProps {
  label: string;
  value: string | number;
  trend: string;
  isSteady?: boolean;
  icon: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, trend, isSteady, icon }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-8">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
        {icon}
      </div>
      <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${isSteady ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600'}`}>
        {trend}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>
  </div>
);

export const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    rev: 0,
    docCount: 0,
    activePacks: [] as SOPPack[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await DB.users.getAll();
        const packs = await DB.packs.getAll();
        const docs = await DB.docs.getAll();

        // Ensure arrays are valid before filtering
        const validUsers = Array.isArray(users) ? users : [];
        const validPacks = Array.isArray(packs) ? packs : [];
        const validDocs = Array.isArray(docs) ? docs : [];

        const paidUsers = validUsers.filter(u => u.isPaid).length;

        setStats({
          userCount: validUsers.length,
          rev: paidUsers * 49,
          docCount: validDocs.length,
          activePacks: validPacks.filter(p => p.status === StepStatus.IN_PROGRESS)
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 font-sans animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Platform Users"
          value={stats.userCount}
          trend="+12%"
          icon={<svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>}
        />
        <KPICard
          label="Gross Revenue"
          value={`$${stats.rev.toLocaleString()}`}
          trend="+8%"
          icon={<span className="text-2xl">💰</span>}
        />
        <KPICard
          label="AI Documents"
          value={stats.docCount}
          trend="+44%"
          icon={<svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <KPICard
          label="Success Rate"
          value="99.4%"
          trend="Steady"
          isSteady
          icon={<svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200/50 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Generation Pipeline</h3>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black rounded-full uppercase border border-amber-100">{stats.activePacks.length} In Progress</span>
            </div>
          </div>

          <div className="space-y-5 flex-1">
            {stats.activePacks.length > 0 ? stats.activePacks.map((p, i) => (
              <div key={i} className="group flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">🤖</div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Job {p.id.split('_')[1]}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{p.departments.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-40 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-black text-slate-900 w-8">{p.progress}%</span>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-6xl mb-4 grayscale">🏗️</div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pipeline Empty</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black tracking-tight">System Status</h3>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <p className="text-slate-400 text-xs font-medium mb-10 leading-relaxed">Cluster health optimal across all nodes.</p>

            <div className="space-y-7">
              {[
                { label: 'Gemini API', value: 'Active', status: '420ms', icon: '🧠' },
                { label: 'DB Sync', value: 'Healthy', status: 'Live', icon: '🛡️' },
                { label: 'Traffic', value: stats.userCount > 5 ? 'Elevated' : 'Normal', status: 'Stable', icon: '📊' },
                { label: 'Payments', value: 'Bridge OK', status: 'Stripe', icon: '💳' },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-5">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{h.icon}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{h.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{h.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white/10 transition-all active:scale-95">
            Reset Metrics Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
