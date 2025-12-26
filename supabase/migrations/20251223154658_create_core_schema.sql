/*
  # OPOR8 Core Database Schema
  
  ## Overview
  This migration creates the complete database schema for the OPOR8 SaaS platform,
  including user management, business profiles, SOP packs, documents, and support systems.
  
  ## Tables Created
  
  ### 1. users
  Extended user profile table linked to auth.users
  - id (references auth.users)
  - name
  - email
  - role (user, admin, support)
  - is_paid (payment status)
  - email_verified
  - created_at
  
  ### 2. business_profiles
  Company information and branding
  - id (uuid, primary key)
  - user_id (references users)
  - name (company name)
  - industry
  - size
  - country
  - tone (document tone preference)
  - logo_url
  - created_at, updated_at
  
  ### 3. sop_packs
  Collections of SOPs for departments
  - id (uuid, primary key)
  - user_id (references users)
  - name (pack name)
  - departments (array of selected departments)
  - status (queued, in_progress, completed, failed)
  - progress (0-100)
  - created_at
  
  ### 4. sop_documents
  Individual SOP documents
  - id (uuid, primary key)
  - pack_id (references sop_packs)
  - title
  - department
  - content (markdown)
  - is_sample (boolean)
  - version
  - created_at, updated_at
  
  ### 5. questionnaire_answers
  User responses for SOP customization
  - id (uuid, primary key)
  - pack_id (references sop_packs)
  - has_employees
  - cycle (review cycle)
  - approver
  - tools (array)
  - compliance (array)
  - specifics (text)
  - created_at
  
  ### 6. support_tickets
  User support requests
  - id (uuid, primary key)
  - user_id (references users)
  - user_name
  - category
  - description
  - status (Open, Closed)
  - created_at
  
  ### 7. help_articles
  Knowledge base articles
  - id (uuid, primary key)
  - title
  - category
  - content (markdown)
  - last_updated
  
  ### 8. chat_sessions
  Live chat sessions
  - id (uuid, primary key)
  - user_id (references users)
  - user_name
  - status (active, archived)
  - last_activity
  - created_at
  
  ### 9. chat_messages
  Individual chat messages
  - id (uuid, primary key)
  - session_id (references chat_sessions)
  - sender_id (references users)
  - sender_name
  - text
  - is_admin
  - created_at
  
  ### 10. global_config
  System-wide configuration
  - id (always 1, single row)
  - support_email
  - welcome_message
  - system_alert
  - updated_at
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies ensure users can only access their own data
  - Admin role can access all data
  - Public read access for help_articles only
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (Extended Profile)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'support')),
  is_paid boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update any user"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- BUSINESS PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  industry text NOT NULL,
  size text NOT NULL,
  country text NOT NULL,
  tone text NOT NULL DEFAULT 'Professional',
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business profile"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business profile"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profile"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- SOP PACKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sop_packs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  departments text[] NOT NULL,
  status text NOT NULL DEFAULT 'Queued' CHECK (status IN ('Queued', 'In Progress', 'Completed', 'Failed')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sop_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sop packs"
  ON sop_packs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sop packs"
  ON sop_packs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sop packs"
  ON sop_packs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all sop packs"
  ON sop_packs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- SOP DOCUMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sop_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id uuid NOT NULL REFERENCES sop_packs(id) ON DELETE CASCADE,
  title text NOT NULL,
  department text NOT NULL,
  content text NOT NULL,
  is_sample boolean DEFAULT false,
  version text DEFAULT '1.0',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sop_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON sop_documents FOR SELECT
  TO authenticated
  USING (
    pack_id IN (
      SELECT id FROM sop_packs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sample documents"
  ON sop_documents FOR SELECT
  TO authenticated
  USING (is_sample = true);

CREATE POLICY "Users can insert own documents"
  ON sop_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    pack_id IN (
      SELECT id FROM sop_packs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all documents"
  ON sop_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- QUESTIONNAIRE ANSWERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS questionnaire_answers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id uuid NOT NULL REFERENCES sop_packs(id) ON DELETE CASCADE,
  has_employees boolean DEFAULT false,
  cycle text NOT NULL,
  approver text NOT NULL,
  tools text[] DEFAULT '{}',
  compliance text[] DEFAULT '{}',
  specifics text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(pack_id)
);

ALTER TABLE questionnaire_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own questionnaire answers"
  ON questionnaire_answers FOR SELECT
  TO authenticated
  USING (
    pack_id IN (
      SELECT id FROM sop_packs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own questionnaire answers"
  ON questionnaire_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    pack_id IN (
      SELECT id FROM sop_packs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own questionnaire answers"
  ON questionnaire_answers FOR UPDATE
  TO authenticated
  USING (
    pack_id IN (
      SELECT id FROM sop_packs WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    pack_id IN (
      SELECT id FROM sop_packs WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- SUPPORT TICKETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and support can view all tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')
    )
  );

CREATE POLICY "Admins and support can update tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')
    )
  );

-- =====================================================
-- HELP ARTICLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS help_articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view help articles"
  ON help_articles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage help articles"
  ON help_articles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- CHAT SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat sessions"
  ON chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and support can view all chat sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')
    )
  );

CREATE POLICY "Admins and support can update chat sessions"
  ON chat_sessions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')
    )
  );

-- =====================================================
-- CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  text text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own sessions"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own sessions"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and support can view all messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')
    )
  );

CREATE POLICY "Admins and support can insert messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')
    )
  );

-- =====================================================
-- GLOBAL CONFIG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS global_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  support_email text NOT NULL DEFAULT 'support@opor8.ai',
  welcome_message text NOT NULL DEFAULT 'Welcome to the elite procedural engine.',
  system_alert text,
  updated_at timestamptz DEFAULT now()
);

-- Insert default config
INSERT INTO global_config (id, support_email, welcome_message)
VALUES (1, 'support@opor8.ai', 'Welcome to the elite procedural engine. How can we optimize your operations today?')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE global_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view global config"
  ON global_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update global config"
  ON global_config FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sop_packs_user_id ON sop_packs(user_id);
CREATE INDEX IF NOT EXISTS idx_sop_documents_pack_id ON sop_documents(pack_id);
CREATE INDEX IF NOT EXISTS idx_sop_documents_is_sample ON sop_documents(is_sample);
CREATE INDEX IF NOT EXISTS idx_questionnaire_answers_pack_id ON questionnaire_answers(pack_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
