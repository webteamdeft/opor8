
import React, { useState, useRef, useEffect } from 'react';
import { BusinessProfile } from '../types';
import { Button, Input } from '../components/UI';
import { api } from '../services/api';

interface OnboardingViewProps {
  userId: string;
  profile: BusinessProfile;
  setProfile: (p: BusinessProfile) => void;
  onComplete: (p: BusinessProfile) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ userId, profile, setProfile, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setFetchingProfile(true);
        const response = await api.get('/user/profile');
        const data = response.data || response;
        const profileData = data.profile || data.businessProfile || data;

        // Update profile with existing data if available
        if (profileData) {
          const updatedProfile: BusinessProfile = {
            userId: userId,
            name: profileData.businessName || profileData.name || profile.name || '',
            industry: profileData.industryType || profileData.industry || profile.industry || '',
            size: profileData.size || profile.size || '',
            country: profileData.country || profile.country || '',
            tone: profileData.complianceTone || profileData.tone || profile.tone || 'Professional',
            logoUrl: profileData.brandingLogo || profileData.logoUrl || profileData.logo_url || profile.logoUrl || '',
            fullName: profileData.fullName || profile.fullName || '',
            dob: profileData.dob || profile.dob || '',
            gender: profileData.gender || profile.gender || '',
            businessName: profileData.businessName || profileData.name || profile.businessName || profile.name || '',
            industryType: profileData.industryType || profileData.industry || profile.industryType || profile.industry || '',
            complianceTone: profileData.complianceTone || profileData.tone || profile.complianceTone || profile.tone || 'Professional',
            primaryExportFormat: profileData.primaryExportFormat || profile.primaryExportFormat || 'PDF',
            brandingLogo: profileData.brandingLogo || profileData.logoUrl || profileData.logo_url || profile.brandingLogo || profile.logoUrl || ''
          };
          setProfile(updatedProfile);
        }
      } catch (err) {
        console.warn('[OnboardingView] Failed to fetch profile data:', err);
        // Don't show error to user, just continue with empty form
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfileData();
  }, [userId]); // Only run once on mount

  const updateProfile = (field: keyof BusinessProfile, value: string) => {
    setProfile({ ...profile, [field]: value, userId });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfile('logoUrl', base64String);
        updateProfile('brandingLogo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the payload for the API
      const payload = {
        fullName: profile.fullName || profile.name,
        dob: profile.dob || '',
        gender: profile.gender || '',
        businessName: profile.businessName || profile.name,
        industryType: profile.industryType || profile.industry,
        complianceTone: profile.complianceTone || profile.tone || 'Professional',
        primaryExportFormat: profile.primaryExportFormat || 'PDF',
        brandingLogo: profile.brandingLogo || profile.logoUrl || ''
      };

      // Call the profile update API
      await api.put('/user/profile', payload);

      // Update local profile state
      const updatedProfile = {
        ...profile,
        ...payload,
        name: payload.businessName,
        industry: payload.industryType,
        tone: payload.complianceTone
      };

      setProfile(updatedProfile);
      onComplete(updatedProfile);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-10 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-300 border-2 border-slate-100'
                  }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div
                  className={`h-1 flex-1 mx-4 rounded-full transition-all duration-500 ${step > i ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-200/50 relative overflow-hidden">
          {fetchingProfile ? (
            <div className="relative z-10 space-y-8 text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
              <p className="text-slate-500 font-medium">Loading your profile...</p>
            </div>
          ) : (
            <div className="relative z-10 space-y-8">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="animate-fadeIn space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Personal Info</h2>
                    <p className="text-slate-500 font-medium">Tell us about yourself.</p>
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="Full Name"
                      value={profile.fullName || ''}
                      onChange={(e) => updateProfile('fullName', e.target.value)}
                      placeholder="e.g. John Doe"
                    />

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Date of Birth</label>
                      <input
                        type="date"
                        value={profile.dob || ''}
                        onChange={(e) => updateProfile('dob', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Gender</label>
                      <select
                        value={profile.gender || ''}
                        onChange={(e) => updateProfile('gender', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold"
                      >
                        <option value="">Select Gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setStep(2)}
                    disabled={!profile.fullName}
                  >
                    Next Step
                  </Button>
                </div>
              )}

              {/* Step 2: Business Identity */}
              {step === 2 && (
                <div className="animate-fadeIn space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Business Identity</h2>
                    <p className="text-slate-500 font-medium">Tell us about your organization.</p>
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="Business Name"
                      value={profile.businessName || profile.name || ''}
                      onChange={(e) => {
                        updateProfile('businessName', e.target.value);
                        updateProfile('name', e.target.value);
                      }}
                      placeholder="e.g. Acme Corporation"
                    />

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Industry Type</label>
                      <select
                        value={profile.industryType || profile.industry || ''}
                        onChange={(e) => {
                          updateProfile('industryType', e.target.value);
                          updateProfile('industry', e.target.value);
                        }}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold"
                      >
                        <option value="">Select Industry...</option>
                        <option value="Software">Software & Technology</option>
                        <option value="Retail">Retail & E-commerce</option>
                        <option value="Healthcare">Healthcare & Biotech</option>
                        <option value="Finance">Finance & Fintech</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Education">Education</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Compliance Tone</label>
                      <select
                        value={profile.complianceTone || profile.tone || ''}
                        onChange={(e) => {
                          updateProfile('complianceTone', e.target.value);
                          updateProfile('tone', e.target.value);
                        }}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold"
                      >
                        <option value="">Select Tone...</option>
                        <option value="Professional">Professional</option>
                        <option value="Formal">Formal</option>
                        <option value="Casual">Casual</option>
                        <option value="Technical">Technical</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Primary Export Format</label>
                      <select
                        value={profile.primaryExportFormat || 'PDF'}
                        onChange={(e) => updateProfile('primaryExportFormat', e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold"
                      >
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="HTML">HTML</option>
                        <option value="Markdown">Markdown</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => setStep(3)}
                      disabled={!profile.businessName && !profile.name}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Branding */}
              {step === 3 && (
                <div className="animate-fadeIn space-y-8 text-center">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Branding</h2>
                    <p className="text-slate-500 font-medium">Upload your logo to personalize your SOPs.</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-600 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-48 h-48 border-4 border-dashed mx-auto flex items-center justify-center cursor-pointer rounded-[2.5rem] transition-all duration-300 hover:border-indigo-400 hover:bg-slate-50 relative group overflow-hidden ${profile.logoUrl || profile.brandingLogo ? 'border-transparent' : 'border-slate-100 bg-slate-50/30'
                      }`}
                  >
                    {(profile.logoUrl || profile.brandingLogo) ? (
                      <>
                        <img src={profile.logoUrl || profile.brandingLogo} className="max-h-full max-w-full object-contain p-4" />
                        <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white font-black text-xs uppercase tracking-widest">Change Logo</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="text-4xl">📸</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Logo</span>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(2)}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleComplete}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Complete'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
