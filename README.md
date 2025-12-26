# OPOR8 - Enterprise AI SOP Generator

![Version](https://img.shields.io/badge/version-2.5.0--STABLE-indigo)
![License](https://img.shields.io/badge/license-MIT-blue)
![AI-Engine](https://img.shields.io/badge/AI-Gemini_3_Pro-violet)
![React](https://img.shields.io/badge/React-19-blue)
![Supabase](https://img.shields.io/badge/Database-Supabase-green)

A modern SaaS platform that generates professional Standard Operating Procedures (SOPs) using AI. Built for enterprise teams who need standardized documentation across departments.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Developer Action Plan](#developer-action-plan)
- [Missing Items & Integration Keys](#missing-items--integration-keys)
- [Database Schema](#database-schema)
- [How to Modify](#how-to-modify)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Google Gemini API key (optional for AI features)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# The .env file is already configured with Supabase credentials
# Add your Gemini API key:
echo "GEMINI_API_KEY=your_api_key_here" >> .env

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

### First Time Setup

1. **Create Your Account**
   - Navigate to `http://localhost:5173`
   - Click "Join OPOR8" and sign up
   - Complete the onboarding flow

2. **Grant Admin Access (Optional)**
   ```sql
   -- Run this in Supabase SQL Editor
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

3. **Add Gemini API Key**
   - Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add to `.env` file: `GEMINI_API_KEY=your_key_here`

---

## Tech Stack

### Frontend
- **React 19** - Latest with Concurrent Mode
- **TypeScript** - Type safety throughout
- **Tailwind CSS 3.4** - Utility-first styling
- **React Router v6** - Client-side routing
- **Lucide React** - Modern icon library
- **Vite** - Lightning-fast build tool

### Backend & Services
- **Supabase** - PostgreSQL database with realtime
- **Supabase Auth** - Email/password authentication
- **Google Gemini AI** - Document generation
- **Row Level Security (RLS)** - Database-level authorization

### Development Tools
- **TypeScript 5.3** - Full type coverage
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing

---

## Project Structure

```
opor8-app/
├── index.html                    # Root HTML file
├── index.tsx                     # React app entry point
├── App.tsx                       # Main app component with routing
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies & scripts
├── .env                         # Environment variables
│
├── components/                  # Reusable UI components
│   ├── Icons.tsx               # Custom icon components
│   ├── Layout.tsx              # App shell with navigation
│   ├── RoleGuard.tsx           # Authorization wrapper
│   ├── Tooltip.tsx             # Tooltip component
│   └── UI.tsx                  # Core UI primitives (Button, Input, Card, etc.)
│
├── routes/
│   └── AppRoutes.tsx           # Route definitions
│
├── services/                    # Business logic & API clients
│   ├── ai.ts                   # Gemini AI integration
│   ├── auth.ts                 # Authentication helpers
│   ├── db.ts                   # Legacy LocalStorage DB (to be removed)
│   ├── dbSupabase.ts           # Supabase database operations
│   ├── supabase.ts             # Supabase client initialization
│   ├── database.types.ts       # Auto-generated Supabase types
│   └── initialData.ts          # Sample/seed data
│
├── views/                       # Page components
│   ├── LandingView.tsx         # Marketing landing page
│   ├── AuthView.tsx            # Login/signup page
│   ├── OnboardingView.tsx      # Business profile setup
│   ├── DashboardView.tsx       # User dashboard
│   ├── SOPBuilderView.tsx      # Department selection
│   ├── QuestionnaireView.tsx   # SOP customization
│   ├── GenerationView.tsx      # AI generation status
│   ├── LibraryView.tsx         # Document management
│   ├── DocumentViewerView.tsx  # Single document view
│   ├── BillingView.tsx         # Payment management
│   ├── SettingsView.tsx        # User settings
│   ├── SupportView.tsx         # Help center & chat
│   ├── SamplesView.tsx         # Sample documents
│   └── admin/                  # Admin-only pages
│       ├── AdminDashboardView.tsx
│       ├── AdminUsersView.tsx
│       ├── AdminPaymentsView.tsx
│       ├── AdminHelpCenterView.tsx
│       ├── AdminSupportView.tsx
│       └── AdminSamplesView.tsx
│
├── supabase/
│   └── migrations/             # Database migrations
│       ├── 20251223154658_create_core_schema.sql
│       └── 20251223155116_seed_help_articles.sql
│
└── types.ts                     # Shared TypeScript types
```

---

## Architecture Overview

### Authentication Flow

```
User → AuthView → Supabase Auth → Session Created
                                  ↓
                            User Record in DB
                                  ↓
                            Redirect to Dashboard
```

**Key Files:**
- `services/auth.ts` - Auth helper functions
- `services/supabase.ts` - Supabase client
- `views/AuthView.tsx` - Login/signup UI
- `components/RoleGuard.tsx` - Route protection

### SOP Generation Flow

```
1. Onboarding (OnboardingView)
   → Create business_profile

2. SOP Builder (SOPBuilderView)
   → Select departments
   → Create sop_pack

3. Questionnaire (QuestionnaireView)
   → Answer questions
   → Save answers

4. Generation (GenerationView)
   → Call Gemini API
   → Create sop_documents
   → Parse and format

5. Library (LibraryView)
   → View all documents
   → Export PDF/Word
```

### Database Architecture

The app uses **Supabase (PostgreSQL)** with Row Level Security (RLS):

**Core Tables:**
- `users` - User accounts with roles (user/support/admin)
- `business_profiles` - Company information
- `sop_packs` - Collections of related SOPs
- `sop_documents` - Individual generated documents
- `questionnaire_answers` - User customization data
- `support_tickets` - Support requests
- `chat_sessions` - Live chat conversations
- `chat_messages` - Individual chat messages
- `help_articles` - Knowledge base articles
- `global_config` - System-wide settings

**Security Model:**
- Users can only access their own data
- Admins can access all data
- Help articles are public to authenticated users
- Sample documents visible to everyone

### State Management

The app uses **React local state** and **Supabase realtime subscriptions**:

- Component-level state with `useState`
- Data fetching with `useEffect`
- No global state library (Redux/Zustand) - keeping it simple
- Realtime updates via Supabase subscriptions (chat, notifications)

---

## Developer Action Plan

### Immediate Tasks (Week 1)

#### 1. Complete AI Integration
**Priority: HIGH**

The Gemini AI integration is partially implemented. Complete these:

**File:** `services/ai.ts`

- [ ] Add error handling for rate limits
- [ ] Implement retry logic with exponential backoff
- [ ] Add streaming response support
- [ ] Cache common questionnaire responses
- [ ] Add usage tracking/analytics

```typescript
// Example improvement needed in ai.ts
export async function generateSOPWithRetry(
  title: string,
  context: string,
  maxRetries = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateSOP(title, context);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

#### 2. Remove Legacy Code
**Priority: MEDIUM**

**Files to clean up:**
- `services/db.ts` - Remove LocalStorage implementation (replaced by Supabase)
- `server.ts` - Remove or integrate Express backend (currently unused)

```bash
# These files are legacy and should be removed:
rm services/db.ts
rm server.ts
```

#### 3. Add Document Export
**Priority: HIGH**

**Files:** `views/LibraryView.tsx`, `views/DocumentViewerView.tsx`

Currently, PDF/Word export buttons are placeholders. Implement:

- [ ] Install export libraries: `npm install docx pdfmake`
- [ ] Create `services/export.ts`
- [ ] Implement Word (.docx) export with formatting
- [ ] Implement PDF export with company branding
- [ ] Add download progress indicators

```typescript
// New file: services/export.ts
import { Document, Packer, Paragraph } from 'docx';

export async function exportToWord(doc: SOPDocument): Promise<Blob> {
  const docx = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: doc.title }),
        // ... format content
      ]
    }]
  });

  return await Packer.toBlob(docx);
}
```

### Short-term Tasks (Week 2-4)

#### 4. Payment Integration
**Priority: HIGH**

**File:** `views/BillingView.tsx`

Currently uses placeholder Stripe integration. Complete:

- [ ] Create Stripe account
- [ ] Add Stripe Edge Functions (Supabase)
- [ ] Implement webhook handlers for payment events
- [ ] Add subscription management UI
- [ ] Test payment flow end-to-end

**Steps:**
1. Create Stripe account at [stripe.com](https://stripe.com)
2. Deploy Stripe webhook Edge Function:
```bash
# Will need to create: supabase/functions/stripe-webhook/index.ts
```
3. Update `STRIPE_SECRET_KEY` in Supabase Edge Function secrets
4. Update frontend `BillingView.tsx` to use Stripe Checkout

#### 5. Email Notifications
**Priority: MEDIUM**

Add automated emails for:
- [ ] Welcome email on signup
- [ ] Document generation complete
- [ ] Payment confirmation
- [ ] Support ticket updates

**Implementation:**
- Use Supabase Auth email templates
- Create Edge Functions for custom emails
- Add email templates in `supabase/functions/send-email/`

#### 6. Advanced Search & Filters
**Priority: MEDIUM**

**File:** `views/LibraryView.tsx`

Improve document discovery:
- [ ] Full-text search across documents
- [ ] Advanced filters (date range, department, status)
- [ ] Sort options (date, title, department)
- [ ] Bulk operations (delete, export multiple)

### Long-term Enhancements (Month 2-3)

#### 7. Document Versioning
- Track document revisions
- Show version history
- Allow rollback to previous versions
- Highlight changes between versions

#### 8. Collaboration Features
- Share documents with team members
- Add comments and annotations
- Real-time collaborative editing
- Approval workflows

#### 9. Analytics Dashboard
- Track document usage
- Monitor AI generation success rates
- User engagement metrics
- Revenue analytics for admins

#### 10. Mobile Responsiveness
- Optimize layouts for mobile
- Add mobile-specific navigation
- Touch-friendly interactions
- Progressive Web App (PWA) features

---

## Missing Items & Integration Keys

### Environment Variables Required

#### Current Status
```bash
# .env file currently has:
VITE_SUPABASE_URL=https://kpivazcxtosorxuguwzg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Missing Keys (Add These)

```bash
# 1. GEMINI API KEY (Required for AI generation)
GEMINI_API_KEY=your_gemini_api_key_here
# Get from: https://makersuite.google.com/app/apikey

# 2. STRIPE KEYS (Required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
# Get from: https://dashboard.stripe.com/apikeys

# 3. STRIPE WEBHOOK SECRET (For webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_...
# Get from: https://dashboard.stripe.com/webhooks

# 4. EMAIL SERVICE (Optional - for notifications)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
# Or use Supabase Auth emails

# 5. SENTRY (Optional - for error tracking)
VITE_SENTRY_DSN=https://...@sentry.io/...
# Get from: https://sentry.io

# 6. ANALYTICS (Optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
# Get from: https://analytics.google.com
```

### Third-Party Integrations Needed

#### 1. Google Gemini AI
**Status:** Partially integrated
**Action Required:**
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Add to `.env` as `GEMINI_API_KEY`
- Test generation flow in `GenerationView`

#### 2. Stripe Payment Processing
**Status:** UI ready, backend missing
**Action Required:**
- Create Stripe account
- Add publishable key to frontend
- Create Edge Function for checkout: `supabase/functions/create-checkout/index.ts`
- Create Edge Function for webhooks: `supabase/functions/stripe-webhook/index.ts`

Example Edge Function structure:
```typescript
// supabase/functions/create-checkout/index.ts
import Stripe from 'npm:stripe@14.1.0';

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Enterprise SOP Pack' },
        unit_amount: 4900, // $49.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.headers.get('origin')}/billing?success=true`,
    cancel_url: `${req.headers.get('origin')}/billing?canceled=true`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

#### 3. Document Export Libraries
**Status:** Not integrated
**Action Required:**
```bash
npm install docx pdfmake
```

Then create export service:
```typescript
// services/export.ts - create this file
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';

export async function exportToWord(document: SOPDocument): Promise<void> {
  // Implementation here
}

export async function exportToPDF(document: SOPDocument): Promise<void> {
  // Implementation here
}
```

#### 4. Email Service (Optional)
**Options:**
- **Supabase Auth Emails** (Free, already included)
  - Configure templates in Supabase Dashboard
- **SendGrid** (Recommended for transactional emails)
  - Sign up at sendgrid.com
  - Add API key to Edge Function secrets
- **AWS SES** (Cost-effective for high volume)

### Database Migrations Needed

#### Create these migrations in `supabase/migrations/`:

1. **Document Version History**
```sql
-- supabase/migrations/YYYYMMDD_add_document_versions.sql
CREATE TABLE document_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES sop_documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own document versions"
  ON document_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sop_documents
      WHERE id = document_versions.document_id
      AND user_id = auth.uid()
    )
  );
```

2. **Payment Records**
```sql
-- supabase/migrations/YYYYMMDD_add_payment_records.sql
CREATE TABLE payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  stripe_payment_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
```

---

## Database Schema

### Core Schema Diagram

```
users (auth + profile)
  ↓
  ├─ business_profiles (1:1)
  ├─ sop_packs (1:many)
  │    ↓
  │    ├─ questionnaire_answers (1:many)
  │    └─ sop_documents (1:many)
  ├─ support_tickets (1:many)
  │    └─ chat_messages (1:many)
  └─ chat_sessions (1:many)
       └─ chat_messages (1:many)

help_articles (public)
global_config (singleton)
```

### Detailed Table Definitions

#### `users`
```sql
- id: UUID (PK, from Supabase Auth)
- email: TEXT (unique)
- name: TEXT
- role: TEXT ('user', 'support', 'admin')
- has_paid: BOOLEAN (default false)
- created_at: TIMESTAMPTZ
```

#### `business_profiles`
```sql
- id: UUID (PK)
- user_id: UUID (FK → users.id)
- company_name: TEXT
- industry: TEXT
- company_size: TEXT
- document_tone: TEXT
- logo_url: TEXT (nullable)
- created_at: TIMESTAMPTZ
```

#### `sop_packs`
```sql
- id: UUID (PK)
- user_id: UUID (FK → users.id)
- name: TEXT
- departments: TEXT[] (array)
- status: TEXT ('building', 'generating', 'completed')
- created_at: TIMESTAMPTZ
```

#### `sop_documents`
```sql
- id: UUID (PK)
- pack_id: UUID (FK → sop_packs.id)
- user_id: UUID (FK → users.id)
- title: TEXT
- department: TEXT
- content: TEXT (markdown format)
- status: TEXT ('draft', 'final')
- is_sample: BOOLEAN (default false)
- created_at: TIMESTAMPTZ
```

### RLS Policies Summary

Every table has RLS enabled. Key policies:

```sql
-- Users can only see their own data
CREATE POLICY "Users read own data" ON table_name
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can see all data
CREATE POLICY "Admins read all" ON table_name
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## How to Modify

### Adding a New Page/View

1. **Create the view component**
```typescript
// views/MyNewView.tsx
import React from 'react';
import { Layout } from '../components/Layout';

export const MyNewView: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1>My New Page</h1>
        {/* Your content */}
      </div>
    </Layout>
  );
};
```

2. **Add route in AppRoutes.tsx**
```typescript
// routes/AppRoutes.tsx
import { MyNewView } from '../views/MyNewView';

// Inside <Routes>:
<Route path="/my-new-page" element={<MyNewView />} />
```

3. **Add navigation link in Layout.tsx**
```typescript
// components/Layout.tsx
// Add to userNavItems or adminNavItems:
{ name: 'My Page', path: '/my-new-page', icon: Star }
```

### Adding a New Database Table

1. **Create migration file**
```bash
# Name format: YYYYMMDD_descriptive_name.sql
touch supabase/migrations/20251224_add_my_table.sql
```

2. **Write migration SQL**
```sql
-- supabase/migrations/20251224_add_my_table.sql
CREATE TABLE my_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users read own data"
  ON my_table FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

3. **Apply migration**
```bash
# In Supabase dashboard:
# SQL Editor → New query → Paste SQL → Run
```

4. **Create TypeScript types**
```typescript
// types.ts
export interface MyTable {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}
```

5. **Add service functions**
```typescript
// services/dbSupabase.ts
export async function getMyTableData(): Promise<MyTable[]> {
  const { data, error } = await supabase
    .from('my_table')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

### Customizing the UI Theme

**Colors** - Edit Tailwind config:
```typescript
// tailwind.config.js (if you create one)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',    // Change this
        secondary: '#9333EA',  // And this
      }
    }
  }
}
```

**Component Styles** - Modify `components/UI.tsx`:
```typescript
// components/UI.tsx
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ... }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold ...';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    // Add your custom variants here
  };

  // ...
};
```

### Adding AI Features

**Example: Add new AI generation type**

1. **Add function in services/ai.ts**
```typescript
// services/ai.ts
export async function generateCustomContent(
  prompt: string,
  context: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent(`
    ${prompt}

    Context: ${context}
  `);

  return result.response.text();
}
```

2. **Use in your view**
```typescript
// In your component
const handleGenerate = async () => {
  try {
    const content = await generateCustomContent(userPrompt, businessContext);
    setGeneratedContent(content);
  } catch (error) {
    console.error('Generation failed:', error);
  }
};
```

---

## API Integration

### Supabase Client Usage

The app uses the Supabase JavaScript client for all database operations.

**Basic Queries:**
```typescript
// Read data
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value');

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert({ column: 'value' });

// Update data
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', itemId);

// Delete data
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', itemId);
```

**Realtime Subscriptions:**
```typescript
// Subscribe to changes
const channel = supabase
  .channel('table_changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'my_table' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

### Gemini AI Integration

**Located in:** `services/ai.ts`

```typescript
import { GoogleGenerativeAI } from '@google/genai';

const apiKey = import.meta.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Generate content
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const result = await model.generateContent(prompt);
const text = result.response.text();
```

**Best Practices:**
- Always handle rate limits
- Implement retry logic
- Validate API responses
- Cache common responses
- Monitor token usage

---

## Testing

### Manual Testing Checklist

**User Flow:**
- [ ] Sign up with new account
- [ ] Complete onboarding
- [ ] Select departments in SOP Builder
- [ ] Answer questionnaire
- [ ] Generate documents
- [ ] View documents in Library
- [ ] Open support chat
- [ ] Test document search/filter

**Admin Flow:**
- [ ] Upgrade account to admin
- [ ] Access admin dashboard
- [ ] View user list
- [ ] Edit help articles
- [ ] Respond to support tickets
- [ ] View payment records

**Edge Cases:**
- [ ] Test with invalid inputs
- [ ] Test network failures
- [ ] Test with large documents
- [ ] Test concurrent users
- [ ] Test RLS policies

### Unit Testing (Future)

**Recommended setup:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Example test:**
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../components/UI';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## Deployment

### Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy URL and anon key

2. **Run Migrations**
   - Open SQL Editor in Supabase Dashboard
   - Copy content from `supabase/migrations/*.sql`
   - Execute in order

3. **Configure Auth**
   - Enable email provider
   - Customize email templates
   - Set redirect URLs

### Frontend Deployment (Vercel)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `GEMINI_API_KEY`
   - Deploy

3. **Update Supabase Redirect URLs**
   - In Supabase Dashboard → Authentication → URL Configuration
   - Add: `https://your-app.vercel.app/**`

### Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

```bash
# In Vercel/Netlify dashboard, add:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Troubleshooting

### Common Issues

#### "User not found" after signup

**Cause:** User record not created in database
**Fix:**
1. Check Supabase logs in dashboard
2. Verify RLS policies allow insert
3. Check auth triggers are enabled

```sql
-- Verify user exists
SELECT * FROM users WHERE email = 'your@email.com';
```

#### AI Generation Fails

**Cause:** Missing or invalid Gemini API key
**Fix:**
1. Verify key in `.env`: `GEMINI_API_KEY=...`
2. Check key is valid at [Google AI Studio](https://makersuite.google.com)
3. Check browser console for errors
4. Test API key directly:

```typescript
// Test in browser console
import { GoogleGenerativeAI } from '@google/genai';
const genAI = new GoogleGenerativeAI('your_key');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const result = await model.generateContent('Hello');
console.log(result.response.text());
```

#### "Permisison denied" in Database

**Cause:** RLS policy blocking access
**Fix:**
1. Check RLS policies in Supabase dashboard
2. Verify user role is correct
3. Test policy:

```sql
-- Test as user
SET ROLE authenticated;
SELECT * FROM sop_documents;
```

#### Chat Not Updating

**Cause:** Realtime subscription not working
**Fix:**
1. Check Supabase realtime is enabled
2. Verify subscription code:

```typescript
// Check if channel is connected
const channel = supabase.channel('my-channel');
console.log('Status:', channel.state); // should be 'joined'
```

#### Build Fails

**Cause:** TypeScript errors or missing dependencies
**Fix:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Build with verbose output
npm run build -- --debug
```

### Debug Mode

Enable debug logging:
```typescript
// At top of index.tsx
if (import.meta.env.DEV) {
  console.log('Running in development mode');
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
}
```

### Getting Help

1. **Check browser console** - Most errors appear here
2. **Check Supabase logs** - Dashboard → Logs
3. **Check Network tab** - See failed API requests
4. **Review RLS policies** - Common source of "permission denied"
5. **Test in incognito** - Rules out cache issues

---

## Contributing

### Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Use Tailwind for styling (no inline styles)
- Keep components small and focused
- Add comments for complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Make changes and commit
git add .
git commit -m "Add: description of changes"

# Push and create PR
git push origin feature/my-new-feature
```

### Commit Message Format

```
Add: New feature
Fix: Bug description
Update: Changed something
Remove: Deleted something
Docs: Documentation update
```

---

## License

MIT License - see LICENSE file

---

## Support

- **Documentation:** See SETUP_GUIDE.md
- **Database Schema:** Check migration files in `supabase/migrations/`
- **API Reference:** [Supabase Docs](https://supabase.com/docs)
- **AI Integration:** [Gemini API Docs](https://ai.google.dev/docs)

---

**Built with precision. Powered by AI. Ready for enterprise.**
