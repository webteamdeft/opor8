import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileCheck, Server, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/UI';

export const SecurityPageView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Security & Compliance - OPOR8 | Enterprise-Grade Protection';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'OPOR8 security: SOC 2 Type II, GDPR compliant, end-to-end encryption, role-based access control. Your data is protected with bank-grade security measures.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'OPOR8 security: SOC 2 Type II, GDPR compliant, end-to-end encryption, role-based access control. Your data is protected with bank-grade security measures.';
      document.head.appendChild(meta);
    }
  }, []);

  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256) to ensure maximum security and privacy.'
    },
    {
      icon: Key,
      title: 'Role-Based Access Control',
      description: 'Granular permissions with User, Support, and Admin roles. Control who can view, edit, or delete documents.'
    },
    {
      icon: Eye,
      title: 'Row Level Security',
      description: 'Database-level security policies ensure users can only access their own data, enforced at the query level.'
    },
    {
      icon: Server,
      title: 'Secure Infrastructure',
      description: 'Hosted on Supabase cloud infrastructure with automatic backups, 99.9% uptime SLA, and DDoS protection.'
    },
    {
      icon: FileCheck,
      title: 'Audit Trails',
      description: 'Complete logging of all document access, modifications, and user actions for compliance and investigation.'
    },
    {
      icon: AlertCircle,
      title: 'Incident Response',
      description: '24/7 security monitoring with automated threat detection and rapid incident response protocols.'
    }
  ];

  const compliance = [
    {
      name: 'SOC 2 Type II',
      description: 'Independently audited security controls for data protection and availability.',
      status: 'Certified'
    },
    {
      name: 'GDPR Compliance',
      description: 'Full compliance with EU data protection regulations including data portability and right to deletion.',
      status: 'Compliant'
    },
    {
      name: 'ISO 27001',
      description: 'International standard for information security management systems.',
      status: 'Aligned'
    },
    {
      name: 'HIPAA Ready',
      description: 'Healthcare-grade security controls suitable for protected health information.',
      status: 'Available'
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Enterprise-Grade
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Security & Compliance
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Your data security is our top priority. OPOR8 implements bank-grade encryption,
              comprehensive compliance standards, and industry-leading security practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Compliance & Certifications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {compliance.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Data Protection Principles
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Zero-Knowledge Architecture',
                      desc: 'We cannot access your unencrypted data. Only you hold the keys.'
                    },
                    {
                      title: 'Data Sovereignty',
                      desc: 'Choose where your data is stored. EU, US, or Asia-Pacific regions available.'
                    },
                    {
                      title: 'Regular Security Audits',
                      desc: 'Quarterly penetration testing and annual third-party security audits.'
                    },
                    {
                      title: 'Automated Backups',
                      desc: 'Daily encrypted backups with 30-day retention and point-in-time recovery.'
                    },
                    {
                      title: 'Secure API Access',
                      desc: 'API authentication with rate limiting, token expiration, and IP whitelisting.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Security by Design</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-slate-300 mb-4">
                      Security isn't an afterthought at OPOR8. Every feature is built with
                      security-first principles:
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Secure development lifecycle (SDLC)',
                        'Code review and static analysis',
                        'Dependency vulnerability scanning',
                        'Container security hardening',
                        'Network segmentation and firewalls',
                        'Intrusion detection systems (IDS)'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Frequently Asked Security Questions
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              {[
                {
                  q: 'Where is my data stored?',
                  a: 'Your data is stored in Supabase-managed PostgreSQL databases hosted on AWS infrastructure. You can choose your preferred region during signup.'
                },
                {
                  q: 'Who can access my documents?',
                  a: 'Only users in your organization with proper permissions can access your documents. We implement Row Level Security (RLS) at the database level to enforce data isolation.'
                },
                {
                  q: 'How do you handle data breaches?',
                  a: 'We have a comprehensive incident response plan with 24/7 monitoring. In the unlikely event of a breach, we notify affected customers within 72 hours and provide detailed incident reports.'
                },
                {
                  q: 'Can I export my data?',
                  a: 'Yes, you have full data portability. Export all your documents in Word, PDF, or JSON format at any time. No lock-in.'
                },
                {
                  q: 'Do you use my data to train AI models?',
                  a: 'No. Your data is never used to train AI models. All AI processing is done in real-time and data is not retained by our AI provider.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Your Data. Your Control. Our Protection.
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start using OPOR8 with confidence. Enterprise-grade security is included with every plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Security Team
                </Button>
              </Link>
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
