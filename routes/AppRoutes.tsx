
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, Role, BusinessProfile, SOPDocument } from '../types';
import Layout from '../components/Layout';
import LandingView from '../views/LandingView';
import OnboardingView from '../views/OnboardingView';
import DashboardView from '../views/DashboardView';
import SOPBuilderView from '../views/SOPBuilderView';
import QuestionnaireView from '../views/QuestionnaireView';
import SamplesView from '../views/SamplesView';
import LibraryView from '../views/LibraryView';
import DocumentViewerView from '../views/DocumentViewerView';
import SettingsView from '../views/SettingsView';
import BillingView from '../views/BillingView';
import AuthView from '../views/AuthView';
import SupportView from '../views/SupportView';
import AdminDashboardView from '../views/admin/AdminDashboardView';
import AdminUsersView from '../views/admin/AdminUsersView';
import AdminPaymentsView from '../views/admin/AdminPaymentsView';
import AdminHelpCenterView from '../views/admin/AdminHelpCenterView';
import AdminSupportView from '../views/admin/AdminSupportView';
import { FeaturesView } from '../views/FeaturesView';
import { DepartmentsView } from '../views/DepartmentsView';
import { TemplatesView } from '../views/TemplatesView';
import { SecurityPageView } from '../views/SecurityPageView';
import { PricingView } from '../views/PricingView';
import { AboutView } from '../views/AboutView';
import { ContactView } from '../views/ContactView';
import { GuidesView } from '../views/GuidesView';
import { BlogView } from '../views/BlogView';
import { PrivacyView } from '../views/PrivacyView';
import { TermsView } from '../views/TermsView';
import { RoleGuard } from '../components/RoleGuard';
import { DB } from '../services/dbSupabase';

interface AppRoutesProps {
  user: User | null;
  businessProfile: BusinessProfile;
  setBusinessProfile: (p: BusinessProfile) => void;
  activePackId: string | null;
  setActivePackId: (id: string | null) => void;
  activeDoc: SOPDocument | null;
  setActiveDoc: (doc: SOPDocument | null) => void;
  onLogin: (u: User) => void;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  user,
  businessProfile,
  setBusinessProfile,
  activePackId,
  setActivePackId,
  activeDoc,
  setActiveDoc,
  onLogin,
  onLogout
}) => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingView onStart={() => navigate('/auth')} />} />
      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <AuthView onLogin={onLogin} onBack={() => navigate('/')} />}
      />
      <Route path="/features" element={<FeaturesView />} />
      <Route path="/departments" element={<DepartmentsView />} />
      <Route path="/templates" element={<TemplatesView />} />
      <Route path="/security" element={<SecurityPageView />} />
      <Route path="/pricing" element={<PricingView />} />
      <Route path="/about" element={<AboutView />} />
      <Route path="/contact" element={<ContactView />} />
      <Route path="/guides" element={<GuidesView />} />
      <Route path="/blog" element={<BlogView />} />
      <Route path="/privacy" element={<PrivacyView />} />
      <Route path="/terms" element={<TermsView />} />

      {/* Protected User Routes */}
      <Route element={<RoleGuard user={user}><Layout user={user!} /></RoleGuard>}>
        <Route 
          path="/onboarding" 
          element={
            <OnboardingView 
              profile={businessProfile} 
              setProfile={setBusinessProfile} 
              userId={user?.id || ''} 
              onComplete={async (p) => {
                await DB.profiles.upsert(p);
                setBusinessProfile(p);
                navigate('/dashboard');
              }} 
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={<DashboardView onStartSOP={() => navigate('/builder')} onViewAll={() => navigate('/library')} />} 
        />
        <Route 
          path="/builder" 
          element={<SOPBuilderView userId={user?.id || ''} onNext={(id) => { setActivePackId(id); navigate('/questionnaire'); }} />} 
        />
        <Route 
          path="/questionnaire" 
          element={<QuestionnaireView packId={activePackId!} onComplete={() => navigate('/samples')} />} 
        />
        <Route 
          path="/samples" 
          element={<SamplesView packId={activePackId!} logoUrl={businessProfile.logoUrl} onUpgrade={() => navigate('/billing')} />} 
        />
        <Route 
          path="/library" 
          element={<LibraryView userId={user?.id || ''} onOpenDoc={(d) => { setActiveDoc(d); navigate('/viewer'); }} />} 
        />
        <Route 
          path="/viewer" 
          element={<DocumentViewerView doc={activeDoc!} onBack={() => navigate('/library')} logoUrl={businessProfile.logoUrl} />} 
        />
        <Route 
          path="/settings" 
          element={
            <SettingsView
              profile={businessProfile}
              setProfile={async (p) => { setBusinessProfile(p); await DB.profiles.upsert(p); }}
              onLogout={onLogout}
            />
          } 
        />
        <Route path="/billing" element={<BillingView user={user!} onUpgrade={() => navigate('/billing')} />} />
        <Route path="/support" element={<SupportView user={user!} />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<RoleGuard user={user} allowedRoles={[Role.ADMIN]}><Layout user={user!} /></RoleGuard>}>
        <Route path="/admin/dashboard" element={<AdminDashboardView />} />
        <Route path="/admin/users" element={<AdminUsersView />} />
        <Route path="/admin/payments" element={<AdminPaymentsView />} />
        <Route path="/admin/help-center" element={<AdminHelpCenterView />} />
        <Route path="/admin/support" element={<AdminSupportView />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
