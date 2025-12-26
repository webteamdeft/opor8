/*
  # Seed Help Articles
  
  ## Overview
  This migration seeds the database with initial help articles to provide
  users with documentation and guides.
  
  ## Data Seeded
  
  ### Help Articles (3 articles)
  - Getting Started with AI SOP Synthesis
  - Customizing Your Brand Identity
  - Compliance & Data Governance
  
  These articles are visible to all authenticated users.
*/

-- Seed Help Articles
INSERT INTO help_articles (title, category, content, last_updated) VALUES
(
  'Getting Started with AI SOP Synthesis',
  'Guides',
  E'# Getting Started with OPOR8\n\n## Introduction\nLearn how to architect your first business process pack using OPOR8''s AI-powered SOP generator.\n\n## Step 1: Complete Your Profile\nSet up your business profile with industry information, company size, and preferred tone for your documents.\n\n## Step 2: Create an SOP Pack\nSelect the departments you want to create SOPs for. You can choose from HR, Finance, IT, Operations, and many more.\n\n## Step 3: Answer the Questionnaire\nProvide context about your business processes, tools, and compliance requirements.\n\n## Step 4: AI Generation\nOur Gemini-powered engine will synthesize professional SOPs tailored to your business.\n\n## Step 5: Review & Export\nReview your generated documents and export them in Word or PDF format with your company branding.',
  '2024-05-12'
),
(
  'Customizing Your Brand Identity',
  'Branding',
  E'# Brand Customization in OPOR8\n\n## Logo Upload\nOur engine allows you to inject your corporate DNA into every document. Upload high-res logos (PNG, JPG, or SVG) in your settings.\n\n## Tone Selection\nChoose from various document tones:\n- **Professional**: Standard business documentation\n- **Formal**: Strict compliance and legal language\n- **Friendly**: Approachable and easy-to-understand\n- **Technical**: For engineering and IT departments\n\n## Document Styling\nAll generated SOPs automatically include:\n- Your company logo in headers\n- Custom color schemes matching your brand\n- Consistent typography and formatting\n\n## Export Options\nDocuments can be exported with full branding in:\n- Microsoft Word (.docx)\n- PDF format\n- Markdown (.md)',
  '2024-05-14'
),
(
  'Compliance & Data Governance',
  'Security',
  E'# Security and Compliance\n\n## Data Protection\nEvery SOP generated is cross-referenced with modern ISO standards and GDPR requirements. Your data is encrypted at rest and in transit.\n\n## Industry Standards\nOPOR8 incorporates compliance requirements for:\n- ISO 9001 (Quality Management)\n- ISO 27001 (Information Security)\n- GDPR (Data Protection)\n- SOC 2 (Security & Availability)\n- HIPAA (Healthcare)\n\n## Data Privacy\n- All user data is stored in secure, encrypted databases\n- We never share your business information\n- You maintain full ownership of all generated documents\n- Data can be exported or deleted at any time\n\n## Audit Trail\nEvery document includes:\n- Version history\n- Last updated timestamp\n- Review cycle recommendations\n- Approval workflow suggestions',
  '2024-05-15'
);
