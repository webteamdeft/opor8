import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, Star } from 'lucide-react';
import { Button } from '../components/UI';

export const TemplatesView: React.FC = () => {
  React.useEffect(() => {
    document.title = 'SOP Templates - OPOR8 | 200+ Ready-to-Use Templates';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Browse 200+ professional SOP templates for every department. Download ready-to-use templates or customize them with AI. Finance, HR, Operations, IT, Sales, and more.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Browse 200+ professional SOP templates for every department. Download ready-to-use templates or customize them with AI. Finance, HR, Operations, IT, Sales, and more.';
      document.head.appendChild(meta);
    }
  }, []);

  const templates = [
    {
      title: 'Employee Onboarding Process',
      department: 'Human Resources',
      description: 'Comprehensive guide for new employee orientation, documentation, training, and first-week activities.',
      sections: 7,
      downloads: 1243,
      rating: 4.9
    },
    {
      title: 'Accounts Payable Management',
      department: 'Finance',
      description: 'Complete workflow for invoice processing, approval chains, payment scheduling, and vendor management.',
      sections: 9,
      downloads: 987,
      rating: 4.8
    },
    {
      title: 'Incident Response Protocol',
      department: 'IT Security',
      description: 'Step-by-step cybersecurity incident handling, escalation procedures, and post-incident analysis.',
      sections: 8,
      downloads: 856,
      rating: 5.0
    },
    {
      title: 'Quality Control Inspection',
      department: 'Operations',
      description: 'Standardized inspection procedures, defect classification, corrective actions, and reporting.',
      sections: 6,
      downloads: 742,
      rating: 4.7
    },
    {
      title: 'Sales Lead Qualification',
      department: 'Sales',
      description: 'Framework for evaluating prospects, scoring methodology, and pipeline progression criteria.',
      sections: 5,
      downloads: 1104,
      rating: 4.9
    },
    {
      title: 'Content Publishing Workflow',
      department: 'Marketing',
      description: 'End-to-end content creation, review, approval, and publishing process with quality gates.',
      sections: 7,
      downloads: 678,
      rating: 4.6
    },
    {
      title: 'Contract Review Process',
      department: 'Legal',
      description: 'Legal document review procedures, risk assessment, negotiation protocols, and approval workflows.',
      sections: 10,
      downloads: 534,
      rating: 4.8
    },
    {
      title: 'Inventory Management System',
      department: 'Supply Chain',
      description: 'Stock tracking, reorder points, cycle counting, and inventory reconciliation procedures.',
      sections: 8,
      downloads: 891,
      rating: 4.7
    },
    {
      title: 'Customer Support Escalation',
      department: 'Customer Service',
      description: 'Tiered support system, escalation criteria, SLA management, and resolution tracking.',
      sections: 6,
      downloads: 1021,
      rating: 4.9
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
              Professional SOP
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Templates Library
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Access 200+ professionally crafted SOP templates. Use them as-is or customize
              with our AI to match your exact business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {templates.map((template, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">{template.rating}</span>
                  </div>
                </div>

                <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full mb-3">
                  {template.department}
                </span>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                  {template.title}
                </h3>

                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {template.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{template.sections} sections</span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloads.toLocaleString()} downloads
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link to="/samples" className="flex-1">
                    <Button variant="secondary" className="w-full text-sm py-2">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </Link>
                  <Link to="/auth" className="flex-1">
                    <Button className="w-full text-sm py-2">
                      Use Template
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Not Just Templates.<br />
                  <span className="text-blue-400">Intelligent Customization.</span>
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Every template is powered by AI. Answer a few questions about your business,
                  and OPOR8 automatically customizes the template with your company details,
                  industry-specific requirements, and operational context.
                </p>
                <ul className="space-y-3">
                  {[
                    'Auto-populate with your company info',
                    'Industry-specific compliance requirements',
                    'Custom workflows for your team size',
                    'Brand-aligned formatting and tone',
                    'Export in Word, PDF, or Markdown'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl p-8 border border-blue-500/20">
                <div className="space-y-6">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-2">Template Coverage</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white">Finance & Accounting</span>
                        <span className="text-blue-400 font-semibold">24 SOPs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Human Resources</span>
                        <span className="text-blue-400 font-semibold">31 SOPs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Operations</span>
                        <span className="text-blue-400 font-semibold">28 SOPs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">IT & Security</span>
                        <span className="text-blue-400 font-semibold">22 SOPs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Sales & Marketing</span>
                        <span className="text-blue-400 font-semibold">19 SOPs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Other Departments</span>
                        <span className="text-blue-400 font-semibold">76+ SOPs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Start with Templates, Finish with Perfection
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Browse our template library, select what you need, and let AI handle the customization.
              Get professional SOPs in minutes, not days.
            </p>
            <Link to="/auth">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Explore All Templates
              </Button>
            </Link>
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
