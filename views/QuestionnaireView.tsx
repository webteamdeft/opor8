
import React, { useState } from 'react';
import { DB } from '../services/db';

interface QuestionnaireViewProps {
  packId: string;
  onComplete: () => void;
}

export const QuestionnaireView: React.FC<QuestionnaireViewProps> = ({ packId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    packId,
    hasEmployees: true,
    cycle: 'Digital platform / SaaS',
    approver: 'CEO',
    tools: ['Google Workspace'],
    compliance: ['GDPR'],
    specifics: ''
  });

  const handleFinish = async () => {
    setLoading(true);
    try {
      await DB.answers.upsert(answers);
      onComplete();
    } catch (error) {
      console.error('Error saving answers:', error);
      alert('Failed to save answers. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <h2 className="text-3xl font-black text-slate-900">Customization Details</h2>
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border space-y-8">
        <div>
          <label className="block font-bold mb-4">Final Approval Hierarchy</label>
          <div className="grid grid-cols-2 gap-4">
            {['Founders/CEO', 'Department Heads', 'Board', 'Vote'].map(a => (
              <button 
                key={a}
                onClick={() => setAnswers({...answers, approver: a})}
                className={`p-4 rounded-xl border-2 font-bold ${answers.approver === a ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-bold mb-4">Specific Notes</label>
          <textarea 
            value={answers.specifics}
            onChange={(e) => setAnswers({...answers, specifics: e.target.value})}
            className="w-full p-4 border rounded-xl h-32" 
            placeholder="Any unique processes?" 
          />
        </div>
        <button onClick={handleFinish} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl">Finalize</button>
      </div>
    </div>
  );
};

export default QuestionnaireView;
