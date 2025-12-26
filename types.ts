
export enum View {
  LANDING = 'landing',
  AUTH = 'auth',
  ONBOARDING = 'onboarding',
  BUILDER = 'builder',
  QUESTIONNAIRE = 'questionnaire',
  SAMPLES = 'samples',
  UPGRADE = 'upgrade',
  GENERATION = 'generation',
  DASHBOARD = 'dashboard',
  LIBRARY = 'library',
  VIEWER = 'viewer',
  BILLING = 'billing',
  SETTINGS = 'settings',
  SUPPORT = 'support',
  // Admin Views
  ADMIN_DASHBOARD = 'admin-dashboard',
  ADMIN_USERS = 'admin-users',
  ADMIN_PAYMENTS = 'admin-payments',
  ADMIN_SAMPLES = 'admin-samples',
  ADMIN_SUPPORT = 'admin-support',
  ADMIN_HELP_CENTER = 'admin-help-center'
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPPORT = 'support'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isPaid: boolean;
  emailVerified: boolean;
  createdAt?: string;
}

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  messages: ChatMessage[];
  status: 'active' | 'archived';
  lastActivity: string;
}

export interface GlobalConfig {
  supportEmail: string;
  welcomeMessage: string;
  systemAlert?: string;
}

export interface BusinessProfile {
  userId: string;
  name: string;
  industry: string;
  size: string;
  country: string;
  tone: string;
  logoUrl?: string;
}

export interface SOPDocument {
  id: string;
  packId: string;
  title: string;
  department: string;
  content: string;
  lastUpdated: string;
  isSample: boolean;
  version: string;
}

export interface SOPPack {
  id: string;
  userId: string;
  name: string;
  departments: string[];
  status: StepStatus;
  progress: number;
  createdAt: string;
}

export enum StepStatus {
  QUEUED = 'Queued',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

export interface QuestionnaireAnswers {
  packId: string;
  hasEmployees: boolean;
  cycle: string;
  approver: string;
  tools: string[];
  compliance: string[];
  specifics: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  category: string;
  description: string;
  status: 'Open' | 'Closed';
  createdAt: string;
}
