import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileCheck, Database, UserCheck } from 'lucide-react';
import { Button } from '../components/UI';

export const PrivacyView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Privacy Policy - OPOR8 | How We Protect Your Data';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'OPOR8 Privacy Policy: Learn how we collect, use, and protect your data. GDPR compliant, transparent data practices, and your privacy rights.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'OPOR8 Privacy Policy: Learn how we collect, use, and protect your data. GDPR compliant, transparent data practices, and your privacy rights.';
      document.head.appendChild(meta);
    }
  }, []);

  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Account information (name, email, company details)',
        'SOP documents and content you create',
        'Usage data and analytics',
        'Technical data (IP address, browser type, device information)',
        'Communication preferences and support interactions'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'Provide and improve our AI-powered SOP generation service',
        'Process payments and manage subscriptions',
        'Send important updates and notifications',
        'Provide customer support and respond to inquiries',
        'Analyze usage patterns to enhance user experience',
        'Ensure platform security and prevent fraud'
      ]
    },
    {
      icon: Shield,
      title: 'Data Protection & Security',
      content: [
        'End-to-end encryption for data in transit (TLS 1.3)',
        'AES-256 encryption for data at rest',
        'Row Level Security (RLS) at cloud database level',
        'Regular security audits and penetration testing',
        'Secure data centers with SOC 2 Type II certification',
        'Employee background checks and security training'
      ]
    },
    {
      icon: UserCheck,
      title: 'Your Privacy Rights',
      content: [
        'Access your personal data at any time',
        'Request corrections to inaccurate information',
        'Delete your account and associated data',
        'Export all your data in standard formats',
        'Opt out of marketing communications',
        'Object to automated decision-making'
      ]
    },
    {
      icon: Lock,
      title: 'Data Sharing & Third Parties',
      content: [
        'We do NOT sell your personal data to anyone',
        'AI processing: Google Gemini (no data retention)',
        'Payment processing: Stripe (PCI-DSS compliant)',
        'Infrastructure: Enterprise Cloud (encrypted storage)',
        'Analytics: Anonymized usage data only',
        'Legal obligations: Only when required by law'
      ]
    },
    {
      icon: FileCheck,
      title: 'Data Retention',
      content: [
        'Active accounts: Data retained while account is active',
        'Deleted accounts: Data removed within 30 days',
        'Backups: Encrypted backups retained for 90 days',
        'Legal requirements: Retained only as required by law',
        'AI processing: No data retained by AI providers',
        'Anonymized analytics: Retained indefinitely'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O8</span>
              </div>
              <span className="text-xl font-bold text-white">OPOR8</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-slate-300 hover:text-white transition">
                Sign In
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-400">
              Last Updated: December 23, 2024
            </p>
            <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
              At OPOR8, your privacy is paramount. This policy explains how we collect, use,
              protect, and respect your personal information.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Summary</h2>
            <div className="space-y-3 text-slate-300">
              <p className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>We only collect data necessary to provide our service</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>We never sell your personal information to third parties</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Your SOP content is encrypted and never used to train AI models</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>You can export or delete your data at any time</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>We are GDPR compliant and SOC 2 Type II certified</span>
              </p>
            </div>
          </div>

          <div className="space-y-8 mb-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-300">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">International Data Transfers</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              OPOR8 operates globally. Your data may be transferred to and processed in countries
              other than your country of residence. We ensure all transfers comply with applicable
              data protection laws, including:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Standard Contractual Clauses (SCCs) for EU data transfers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Adequate data protection measures in all jurisdictions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Regional data storage options available for Enterprise customers</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Cookies & Tracking</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Essential Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Required for authentication and core functionality. Cannot be disabled.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Analytics Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Help us understand usage patterns. Can be disabled in settings.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              OPOR8 is not intended for users under 18 years of age. We do not knowingly collect
              personal information from children. If you believe we have inadvertently collected
              information from a child, please contact us immediately at privacy@opor8.com.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any
              material changes by email or through a prominent notice on our platform. Continued
              use of OPOR8 after changes indicates acceptance of the updated policy.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-blue-100 mb-6">
              If you have any questions about this privacy policy or our data practices,
              please don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Contact Us
                </Button>
              </Link>
              <a href="mailto:privacy@opor8.com">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Email: privacy@opor8.com
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2024 OPOR8. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
