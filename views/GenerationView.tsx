
import React, { useState, useEffect } from 'react';
import { BusinessProfile, StepStatus, SOPDocument } from '../types';
import { getSOPListForPack, generateSOPContent } from '../services/ai';
import { DB } from '../services/db';

interface GenerationViewProps {
  packId: string;
  profile: BusinessProfile;
  onComplete: () => void;
}

export const GenerationView: React.FC<GenerationViewProps> = ({ packId, profile, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState("Preparing generation job...");

  useEffect(() => {
    const runGeneration = async () => {
      try {
        const packs = await DB.packs.getAll(profile.userId);
        const pack = packs.find(p => p.id === packId);
        if (!pack) return;

        await DB.packs.update(packId, { status: StepStatus.IN_PROGRESS });

        setStatus("Fetching optimized SOP structure...");
        const titles = await getSOPListForPack(pack.departments);

        const answers = await DB.answers.get(packId);
        if (!answers) return;

        const generatedDocs: SOPDocument[] = [];

        for (let i = 0; i < titles.length; i++) {
          const item = titles[i];
          setStatus(`Generating: ${item.title}...`);
          setActiveStep(Math.round(((i + 1) / titles.length) * 100));

          const content = await generateSOPContent(profile, answers, item.title, item.department);

          generatedDocs.push({
            id: crypto.randomUUID(),
            packId,
            title: item.title,
            department: item.department,
            content,
            lastUpdated: new Date().toLocaleDateString(),
            isSample: false,
            version: '1.0'
          });
        }

        await DB.docs.createBatch(generatedDocs);
        await DB.packs.update(packId, { status: StepStatus.COMPLETED, progress: 100 });
        onComplete();
      } catch (error) {
        console.error('Generation error:', error);
        setStatus('Generation failed. Please try again.');
      }
    };

    runGeneration();
  }, [packId, profile, onComplete]);

  return (
    <div className="min-h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto border">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-3xl font-bold">{status}</h1>
        <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${activeStep}%` }}></div>
        </div>
        <p className="text-slate-500">Document {Math.ceil(activeStep / 20)} of 5 being synthesized...</p>
      </div>
    </div>
  );
};

export default GenerationView;
