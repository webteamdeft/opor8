
import React, { useState, useRef } from 'react';
import { BusinessProfile } from '../types';
import { IconCheck } from '../components/Icons';

interface OnboardingViewProps {
  userId: string;
  profile: BusinessProfile;
  setProfile: (p: BusinessProfile) => void;
  onComplete: (p: BusinessProfile) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ userId, profile, setProfile, onComplete }) => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = (field: keyof BusinessProfile, value: string) => {
    setProfile({ ...profile, [field]: value, userId });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateProfile('logoUrl', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-200/50 relative overflow-hidden">
           <div className="relative z-10 space-y-6">
            {step === 1 && (
              <div className="animate-fadeIn space-y-6">
                <h2 className="text-3xl font-black text-slate-900">Let's get started</h2>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border outline-none bg-slate-50/50" 
                    placeholder="Business Name" 
                  />
                  <select 
                    value={profile.industry}
                    onChange={(e) => updateProfile('industry', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border outline-none bg-slate-50/50"
                  >
                    <option value="">Select Industry...</option>
                    <option value="Software">Software</option>
                    <option value="Retail">Retail</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">Next</button>
              </div>
            )}
            {step === 2 && (
              <div className="animate-fadeIn space-y-6 text-center">
                 <h2 className="text-2xl font-bold">Brand Identity</h2>
                 <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 border-2 border-dashed mx-auto flex items-center justify-center cursor-pointer rounded-2xl">
                    {profile.logoUrl ? <img src={profile.logoUrl} className="max-h-full" /> : <span>Upload Logo</span>}
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleLogoUpload} />
                 </div>
                 <button onClick={() => onComplete(profile)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">Complete Setup</button>
              </div>
            )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
