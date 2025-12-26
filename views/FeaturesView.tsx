import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Gauge, Users, FileText, Brain, Lock, Cloud, Search, Download, MessageSquare, BarChart3 } from 'lucide-react';
import { Button } from '../components/UI';

export const FeaturesView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Features - OPOR8 | AI-Powered SOP Generation Platform';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover OPOR8 features: AI-powered SOP generation, multi-department support, enterprise security, document management, and more. Transform your business processes today.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover OPOR8 features: AI-powered SOP generation, multi-department support, enterprise security, document management, and more. Transform your business processes today.';
      document.head.appendChild(meta);
    }
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Generation',
      description: 'Leverage Google Gemini AI to create comprehensive, context-aware SOPs in seconds. Our advanced AI understands your industry, company size, and operational tone to deliver perfectly tailored documentation.',
      benefits: ['Context-aware content', 'Industry-specific standards', 'Automated formatting']
    },
    {
      icon: Zap,
      title: 'Lightning Fast Creation',
      description: 'What used to take days now takes minutes. Generate complete SOP packs with multiple documents in one streamlined workflow, dramatically reducing time-to-deployment.',
      benefits: ['Sub-minute generation', 'Batch processing', 'Instant updates']
    },
    {
      icon: FileText,
      title: 'Multi-Department Coverage',
      description: 'Cover every aspect of your business with 44+ pre-built modules spanning Finance, HR, Operations, IT, Sales, Marketing, Legal, and more.',
      benefits: ['44+ department modules', 'Cross-functional workflows', 'Customizable templates']
    },
    {
      icon: Users,
      title: 'Brand Sovereignty',
      description: 'Every document reflects your unique brand identity. Automatically inject your company logo, colors, and tone throughout all generated SOPs for boardroom-ready outputs.',
      benefits: ['Auto logo insertion', 'Custom tone settings', 'Brand consistency']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with Row Level Security, encrypted data storage, and compliance with GDPR, ISO, and SOC 2 standards. Your data is protected at every layer.',
      benefits: ['End-to-end encryption', 'Role-based access', 'Audit trails']
    },
    {
      icon: Search,
      title: 'Intelligent Library',
      description: 'Organize, search, and manage all your SOPs in one centralized, searchable vault. Filter by department, date, status, or custom tags for instant access.',
      benefits: ['Full-text search', 'Smart categorization', 'Version control']
    },
    {
      icon: Download,
      title: 'Professional Export',
      description: 'Export publication-ready documents in Word (.docx) and PDF formats with professional formatting, table of contents, and company branding intact.',
      benefits: ['Multiple formats', 'Print-ready quality', 'Batch export']
    },
    {
      icon: MessageSquare,
      title: 'Live Support System',
      description: 'Get help when you need it with real-time chat support, comprehensive help center, and dedicated account management for enterprise customers.',
      benefits: ['24/7 live chat', 'Knowledge base', 'Priority support']
    },
    {
      icon: Gauge,
      title: 'Performance Optimized',
      description: 'Built with a performance-first architecture using React 19 and clustered Node.js backend to handle high-concurrency workloads with sub-second response times.',
      benefits: ['High availability', 'Auto-scaling', '99.9% uptime']
    },
    {
      icon: Lock,
      title: 'Advanced RBAC',
      description: 'Granular role-based access control with User, Support, and Admin tiers. Control who can create, edit, view, or delete documents at every level.',
      benefits: ['3-tier access', 'Custom permissions', 'Team management']
    },
    {
      icon: Cloud,
      title: 'Cloud-Native Architecture',
      description: 'Built on modern cloud infrastructure with Supabase PostgreSQL, automatic backups, and real-time synchronization across all devices.',
      benefits: ['Auto backups', 'Real-time sync', 'Zero maintenance']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track document usage, generation success rates, team productivity, and compliance status with comprehensive analytics dashboards.',
      benefits: ['Usage metrics', 'Team insights', 'ROI tracking']
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Modern Operations
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to standardize, scale, and optimize your business operations.
              From AI-powered generation to enterprise-grade security, OPOR8 delivers the complete solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies using OPOR8 to standardize their processes and scale efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  View Pricing
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
