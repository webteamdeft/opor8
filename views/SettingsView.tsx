
import React, { useRef, useState, useEffect } from 'react';
import { BusinessProfile, User } from '../types';
import { api } from '../services/api';
import { authService } from '../services/auth';

interface SettingsViewProps {
  user: User;
  onLogout: () => void;
  profile: BusinessProfile;
  setProfile: (p: BusinessProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onLogout, profile, setProfile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localProfile, setLocalProfile] = useState<BusinessProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync localProfile with incoming profile prop
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const updateProfile = (field: keyof BusinessProfile, value: string) => {
    console.log(`[Settings] Updating ${field} to:`, value);
    setLocalProfile(prev => {
      const updated = { ...prev, [field]: value };
      console.log('[Settings] Updated localProfile:', updated);
      return updated;
    });
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(profile.brandingLogo || profile.logoUrl || null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Use FormData for profile update
      const formData = new FormData();
      formData.append('fullName', localProfile.fullName || localProfile.name || '');
      formData.append('dob', localProfile.dob || '');
      formData.append('gender', localProfile.gender || '');
      formData.append('businessName', localProfile.businessName || localProfile.name || '');
      formData.append('industryType', localProfile.industryType || localProfile.industry || '');
      formData.append('complianceTone', localProfile.complianceTone || localProfile.tone || 'Professional');
      formData.append('primaryExportFormat', localProfile.primaryExportFormat || 'PDF');

      if (selectedFile) {
        formData.append('brandingLogo', selectedFile);
      } else if (localProfile.brandingLogo || localProfile.logoUrl) {
        // If no new file selected, but we have a URL/path, we might not need to send it 
        // or we send the existing path if the backend expects it.
        // Usually, if it's multipart, we only send the file if it changed.
      }

      // Call the profile update API via DB service
      const { DB } = await import('../services/db');
      await DB.profiles.upsert(formData);

      // Refresh profile data from props/state
      const updatedProfile = {
        ...localProfile,
        name: localProfile.businessName || localProfile.name,
        industry: localProfile.industryType || localProfile.industry,
        tone: localProfile.complianceTone || localProfile.tone
      };

      setProfile(updatedProfile);
      setLocalProfile(updatedProfile);
      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const validatePassword = (password: string) => {
    // Basic strong password check: min 8 chars, at least 1 number, 1 special char
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) return "Password must be at least 8 characters long.";
    if (!hasNumber.test(password)) return "Password must contain at least one number.";
    if (!hasSpecial.test(password)) return "Password must contain at least one special character.";

    return null;
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    // Client-side validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const strengthError = validatePassword(newPassword);
    if (strengthError) {
      setPasswordError(strengthError);
      return;
    }

    setIsChangingPassword(true);

    try {
      await authService.changePassword(oldPassword, newPassword);
      setPasswordSuccess("Password changed successfully.");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Clear success message
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err: any) {
      console.error('Change password error:', err);
      setPasswordError(err.message || 'Failed to change password. content-type/json');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-auto mx-auto space-y-8 sm:space-y-10 lg:space-y-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2 sm:mb-3">Settings</h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 font-medium">Manage your account preferences and brand security.</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full md:w-auto px-5 py-3.5 sm:px-6 sm:py-4 bg-white border-2 border-red-50 text-red-500 rounded-xl sm:rounded-2xl font-black hover:bg-red-50 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout Session
        </button>
      </div>

      <div className="space-y-10">
        {/* Personal Information Section */}
        <section className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 sm:space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 relative">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 sm:mb-3 ml-2">Full Name</label>
              <input
                type="text"
                value={localProfile.fullName || ''}
                onChange={(e) => updateProfile('fullName', e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 sm:mb-3 ml-2">Date of Birth</label>
              <input
                type="date"
                value={localProfile.dob || ''}
                onChange={(e) => updateProfile('dob', e.target.value)}
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 sm:mb-3 ml-2">Gender</label>
              <select
                value={localProfile.gender || ''}
                onChange={(e) => updateProfile('gender', e.target.value)}
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold text-sm sm:text-base"
              >
                <option value="">Select Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 sm:space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-emerald-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 relative">Security</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 sm:mb-3 ml-2">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 sm:mb-3 ml-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 sm:mb-3 ml-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              {passwordError && (
                <p className="text-red-500 font-bold text-sm bg-red-50 p-3 rounded-xl border border-red-100 inline-block">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-emerald-500 font-bold text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-100 inline-block">{passwordSuccess}</p>
              )}
            </div>
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </section>

        {/* Business Profile Section */}
        <section className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 sm:space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 relative">Business Profile</h3>

          {/* Logo Management Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative">
            <div
              onClick={() => (user.isPaid || user.isPro) && fileInputRef.current?.click()}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[1.75rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center transition-all overflow-hidden group shadow-inner flex-shrink-0 ${(user.isPaid || user.isPro) ? 'cursor-pointer hover:border-indigo-500 hover:bg-indigo-50' : 'cursor-not-allowed opacity-50'
                }`}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-3 sm:p-4" />
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Brand Logo</span>
                </div>
              )}
              {(user.isPaid || user.isPro) && (
                <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest">Change</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={!(user.isPaid || user.isPro)} />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-1.5 sm:mb-1">
                <h4 className="text-lg sm:text-xl font-bold text-slate-900">Brand Identity</h4>
                {!(user.isPaid || user.isPro) && <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase tracking-widest">PRO FEATURE</span>}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">This logo appears on the cover page and header of every SOP.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Business Name</label>
              <input
                type="text"
                value={localProfile.businessName || localProfile.name || ''}
                onChange={(e) => {
                  updateProfile('businessName', e.target.value);
                  updateProfile('name', e.target.value);
                }}
                placeholder="e.g. Acme Corporation"
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Industry Type</label>
              <select
                value={localProfile.industryType || localProfile.industry || ''}
                onChange={(e) => {
                  updateProfile('industryType', e.target.value);
                  updateProfile('industry', e.target.value);
                }}
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 bg-slate-50/50 font-bold text-sm sm:text-base"
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
          </div>
        </section>

        {/* Generation Preferences Section */}
        <section className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 sm:space-y-10">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">Generation Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 sm:mb-6 ml-2">SOP Compliance Tone</label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {['Professional', 'Formal', 'Casual', 'Technical'].map(tone => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => {
                      updateProfile('complianceTone', tone);
                      updateProfile('tone', tone);
                    }}
                    className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 text-xs sm:text-sm font-black transition-all ${(localProfile.complianceTone || localProfile.tone) === tone ? 'border-indigo-600 text-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-slate-50/50'}`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 sm:mb-6 ml-2">Primary Export Format</label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {['PDF', 'DOCX', 'HTML', 'Markdown'].map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateProfile('primaryExportFormat', fmt)}
                    className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 text-xs sm:text-sm font-black transition-all ${(localProfile.primaryExportFormat || 'PDF') === fmt ? 'border-indigo-600 text-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-slate-50/50'}`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Save Button with Status Messages */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-green-600 text-sm font-medium">
              {successMessage}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-6 py-4 sm:px-10 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-slate-800 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            {isSaving ? 'Saving Changes...' : 'Update Profile'}
          </button>
        </div>

        {/* Danger Zone Section */}
        <section className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] border-4 border-red-50 space-y-6 sm:space-y-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-[1.25rem] bg-red-100 text-red-600 flex items-center justify-center text-xl sm:text-2xl">⚠️</div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">Danger Zone</h3>
          </div>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">Permanently delete your account and all generated SOPs. <b>This action is irreversible.</b> All data will be purged from our AI compliance database immediately.</p>
          <button onClick={() => confirm('Are you absolutely sure? This will delete all your SOPs.')} className="w-full md:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-red-600 hover:text-white transition-all active:scale-95">Permanently Purge Data</button>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
