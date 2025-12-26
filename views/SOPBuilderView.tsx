
import React, { useState } from 'react';
import { DB } from '../services/dbSupabase';
import { SOPPack, StepStatus } from '../types';

export const SOPBuilderView: React.FC<{ userId: string, onNext: (packId: string) => void }> = ({ userId, onNext }) => {
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['Finance', 'HR & People']);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const pack: SOPPack = {
        id: crypto.randomUUID(),
        userId,
        name: 'Custom SOP Documentation Pack',
        departments: selectedDepts,
        status: StepStatus.QUEUED,
        progress: 0,
        createdAt: new Date().toISOString()
      };
      await DB.packs.create(pack);
      onNext(pack.id);
    } catch (error) {
      console.error('Error creating pack:', error);
      alert('Failed to create SOP pack. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">AI-Powered SOP Creation Tool</h1>
        <p className="text-slate-500 font-medium mt-2">Select the <strong>business process documentation</strong> modules to generate.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Finance', icon: '💰', sub: 'Audit-ready finance SOPs' },
          { name: 'Marketing', icon: '📣', sub: 'Campaign & marketing workflows' },
          { name: 'HR & People', icon: '👥', sub: 'HR policy & onboarding SOPs' },
          { name: 'Operations', icon: '⚙️', sub: 'Internal operations documentation' },
          { name: 'Sales', icon: '📈', sub: 'CRM & sales process SOPs' },
          { name: 'Support', icon: '🎧', sub: 'Customer success procedures' }
        ].map(dept => (
          <div 
            key={dept.name} 
            onClick={() => setSelectedDepts(prev => prev.includes(dept.name) ? prev.filter(d => d !== dept.name) : [...prev, dept.name])}
            className={`p-8 border-2 rounded-[2.5rem] cursor-pointer transition-all flex flex-col items-center text-center group ${selectedDepts.includes(dept.name) ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{dept.icon}</div>
            <h3 className="font-black text-xl text-slate-900 mb-2">{dept.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dept.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-12">
        <button
          onClick={handleContinue}
          disabled={selectedDepts.length === 0 || loading}
          className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Initialize AI SOP Generator'}
        </button>
      </div>
    </div>
  );
};

export default SOPBuilderView;
