
import React, { useRef, useState } from 'react';
import { BusinessProfile } from '../types';

interface SettingsViewProps {
  onLogout: () => void;
  profile: BusinessProfile;
  setProfile: (p: BusinessProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onLogout, profile, setProfile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localProfile, setLocalProfile] = useState<BusinessProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = (field: keyof BusinessProfile, value: string) => {
    setLocalProfile({ ...localProfile, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setProfile(localProfile);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">Settings</h1>
          <p className="text-lg text-slate-500 font-medium">Manage your account preferences and brand security.</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-4 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-black hover:bg-red-50 transition-all text-sm flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout Session
        </button>
      </div>
      
      <div className="space-y-10">
        <section className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-2xl font-black text-slate-900 relative">Profile Information</h3>
          
          {/* Logo Management Section */}
          <div className="flex items-center space-x-8 relative">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-28 h-28 rounded-[1.75rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all overflow-hidden group shadow-inner"
             >
                {localProfile.logoUrl ? (
                  <img src={localProfile.logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-center">
                    <svg className="w-10 h-10 text-slate-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Brand Logo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-black uppercase tracking-widest">Change</span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
             </div>
             <div>
               <h4 className="text-xl font-bold text-slate-900 mb-1">Brand Identity</h4>
               <p className="text-sm text-slate-500 font-medium">This logo appears on the cover page and header of every SOP.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Business Name</label>
              <input 
                type="text" 
                value={localProfile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Industry Focus</label>
              <input 
                type="text" 
                value={localProfile.industry}
                onChange={(e) => updateProfile('industry', e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold" 
              />
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 shadow-xl transition-all flex items-center gap-3 active:scale-95"
          >
            {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            {isSaving ? 'Saving Changes...' : 'Update Business Profile'}
          </button>
        </section>

        <section className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
          <h3 className="text-2xl font-black text-slate-900">Generation Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 ml-2">SOP Compliance Tone</label>
              <div className="flex gap-4">
                {['Professional', 'Friendly', 'Strict'].map(tone => (
                  <button 
                    key={tone} 
                    onClick={() => updateProfile('tone', tone)} 
                    className={`flex-1 py-4 rounded-2xl border-2 text-sm font-black transition-all ${localProfile.tone === tone ? 'border-indigo-600 text-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-slate-50/50'}`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 ml-2">Primary Export Format</label>
              <div className="flex gap-4">
                {['Word (.docx)', 'PDF (.pdf)'].map(fmt => (
                  <button key={fmt} className={`flex-1 py-4 rounded-2xl border-2 text-sm font-black transition-all ${fmt.includes('Word') ? 'border-indigo-600 text-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-slate-50/50'}`}>
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-12 rounded-[3.5rem] border-4 border-red-50 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-red-100 text-red-600 flex items-center justify-center text-2xl">⚠️</div>
            <h3 className="text-2xl font-black text-slate-900">Danger Zone</h3>
          </div>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl font-medium">Permanently delete your account and all 44 generated SOPs. <b>This action is irreversible.</b> All data will be purged from our AI compliance database immediately.</p>
          <button onClick={() => confirm('Are you absolutely sure? This will delete all your SOPs.')} className="px-10 py-5 bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl font-black text-lg hover:bg-red-600 hover:text-white transition-all active:scale-95">Permanently Purge Data</button>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
