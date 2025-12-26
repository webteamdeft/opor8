
import React, { useState, useEffect } from 'react';
import { User, BusinessProfile, SOPDocument } from './types';
import AppRoutes from './routes/AppRoutes';
import { DB } from './services/dbSupabase';
import { authService } from './services/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<SOPDocument | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    userId: '',
    name: '',
    industry: '',
    size: '',
    country: '',
    tone: 'Professional',
    logoUrl: ''
  });

  useEffect(() => {
    authService.getCurrentUser().then(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = await DB.profiles.getByUser(currentUser.id);
        if (profile) setBusinessProfile(profile);
      }
      setLoading(false);
    });

    const { data: authListener } = authService.onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await DB.profiles.getByUser(currentUser.id);
        if (profile) setBusinessProfile(profile);
      } else {
        setBusinessProfile({
          userId: '',
          name: '',
          industry: '',
          size: '',
          country: '',
          tone: 'Professional',
          logoUrl: ''
        });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (u: User) => {
    setUser(u);
    const profile = await DB.profiles.getByUser(u.id);
    if (profile) setBusinessProfile(profile);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    setBusinessProfile({
      userId: '',
      name: '',
      industry: '',
      size: '',
      country: '',
      tone: 'Professional',
      logoUrl: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading OPOR8...</p>
        </div>
      </div>
    );
  }

  return (
    <AppRoutes
      user={user}
      businessProfile={businessProfile}
      setBusinessProfile={setBusinessProfile}
      activePackId={activePackId}
      setActivePackId={setActivePackId}
      activeDoc={activeDoc}
      setActiveDoc={setActiveDoc}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
};

export default App;
