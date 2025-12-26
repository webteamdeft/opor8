
import { Role, StepStatus, SOPDocument, HelpArticle, User } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_demo_123',
  name: 'Alex Rivera',
  email: 'alex@opor8.ai',
  role: Role.ADMIN,
  isPaid: true,
  emailVerified: true,
  createdAt: new Date().toISOString()
};

export const INITIAL_HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'art_1',
    title: 'Getting Started with AI SOP Synthesis',
    category: 'Guides',
    content: 'Learn how to architect your first business process pack. We cover department mapping, logic check-ins, and final Word/PDF export protocols.',
    lastUpdated: '2024-05-12'
  },
  {
    id: 'art_2',
    title: 'Customizing Your Brand Identity',
    category: 'Branding',
    content: 'Our engine allows you to inject your corporate DNA into every document. Upload high-res logos and set the compliance tone (Professional vs. Strict).',
    lastUpdated: '2024-05-14'
  },
  {
    id: 'art_3',
    title: 'Compliance & Data Governance',
    category: 'Security',
    content: 'Every SOP generated is cross-referenced with modern ISO standards and GDPR requirements. Your data is encrypted at rest and in transit.',
    lastUpdated: '2024-05-15'
  }
];

export const INITIAL_DOCUMENTS: SOPDocument[] = [
  {
    id: 'doc_1',
    packId: 'pack_demo_1',
    title: 'Information Security & Data Encryption Policy',
    department: 'Operations',
    content: '# Information Security SOP\n\n## 1. Purpose\nTo establish standard protocols for data protection across all business nodes...\n\n## 2. Scope\nApplies to all cloud-based assets and local hardware...\n\n## 3. Procedure\n- All passwords must be stored in encrypted vaults.\n- Multi-factor authentication is mandatory for all SaaS access.',
    lastUpdated: '2024-05-10',
    isSample: true,
    version: '1.2'
  },
  {
    id: 'doc_2',
    packId: 'pack_demo_1',
    title: 'Employee Travel & Reimbursement Workflow',
    department: 'Finance',
    content: '# Travel Reimbursement SOP\n\n## 1. Submission\nEmployees must submit receipts within 48 hours of travel completion...\n\n## 2. Approval\nManagerial approval is required for any expense exceeding $500.\n\n## 3. Payout\nReimbursements are processed in the following pay cycle.',
    lastUpdated: '2024-05-11',
    isSample: true,
    version: '1.0'
  }
];
